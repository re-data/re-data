import json

import pulumi_aws as aws
from pulumi import ComponentResource, Output, ResourceOptions


class FileSystem(ComponentResource):
    def __init__(
        self, name, security_groups, subnets, vpc_id, opts: ResourceOptions = None
    ):

        super().__init__("redata:cluster:FileSystem", name, {}, opts)

        self.efs = aws.efs.FileSystem(name, encrypted=True)

        self.efs_policy = aws.efs.FileSystemPolicy(
            "redata-efs-policy",
            file_system_id=self.efs.id,
            policy=Output.all(self.efs.arn).apply(
                lambda args: json.dumps(
                    {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Effect": "Deny",
                                "Principal": {"AWS": "*"},
                                "Action": "*",
                                # Included to avoid always seeing a diff on the policy in 'pulumi up':
                                "Resource": args[0],
                                "Condition": {"Bool": {"aws:SecureTransport": "false"}},
                            }
                        ],
                    }
                )
            ),
        )

        efs_secgrp = aws.ec2.SecurityGroup(
            f"{name}-secgrp",
            vpc_id=vpc_id,
            description="Enable EFS mount target access",
            ingress=[
                aws.ec2.SecurityGroupIngressArgs(
                    protocol="tcp",
                    from_port=2049,
                    to_port=2049,
                    security_groups=security_groups,
                )
            ],
        )

        efs_mount_targets = []
        for i, subnet_id in enumerate(subnets):
            target = aws.efs.MountTarget(
                f"{name}-mount-{i}",
                file_system_id=self.efs.id,
                security_groups=[efs_secgrp.id],
                subnet_id=subnet_id,
            )
            efs_mount_targets.append(target)

        self.register_outputs({})


class AccessPoint(ComponentResource):
    def __init__(
        self, name, file_system: FileSystem, path, opts: ResourceOptions = None
    ):

        super().__init__("redata:cluster:FileSystem", name, {}, opts)

        self.ap = aws.efs.AccessPoint(
            name,
            file_system_id=file_system.efs.id,
            posix_user=aws.efs.AccessPointPosixUserArgs(uid=1000, gid=1000),
            root_directory=aws.efs.AccessPointRootDirectoryArgs(
                path=path,
                creation_info=aws.efs.AccessPointRootDirectoryCreationInfoArgs(
                    owner_uid=1000, owner_gid=1000, permissions="755"
                ),
            ),
            opts=ResourceOptions(parent=self),
        )

        self.policy_document = Output.all(file_system.efs.arn, self.ap.arn).apply(
            lambda args: json.dumps(
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Action": [
                                "elasticfilesystem:ClientMount",
                                "elasticfilesystem:ClientWrite",
                            ],
                            "Resource": args[0],
                            "Condition": {
                                "StringEquals": {
                                    "elasticfilesystem:AccessPointArn": args[1]
                                }
                            },
                        }
                    ],
                }
            )
        )

        self.register_outputs({})
