from typing import List

import pulumi_aws as aws
from pulumi import ComponentResource, Output, Resource, ResourceOptions


class BackendService(ComponentResource):

    def __init__(self,
                 name,
                 cluster,
                 subnets,
                 task_definition,
                 load_balancers: List[aws.ecs.ServiceLoadBalancerArgs] = None,
                 namespace_id = None,
                 security_groups = None,
                 opts: ResourceOptions = None):

        super().__init__("redata:service:BackendService", name, {}, opts)

        svc_registries_args = None
        if namespace_id is not None:
            sd_svc = aws.servicediscovery.Service(f"{name}-sd-svc",
                name=name,
                dns_config=aws.servicediscovery.ServiceDnsConfigArgs(
                    namespace_id=namespace_id,
                    dns_records=[aws.servicediscovery.ServiceDnsConfigDnsRecordArgs(ttl=10, type="A")],
                    routing_policy="MULTIVALUE",
                ),
                health_check_custom_config=aws.servicediscovery.ServiceHealthCheckCustomConfigArgs(
                    failure_threshold=1,
                ),
                opts=ResourceOptions(parent=self, delete_before_replace=True)
            )
            svc_registries_args = aws.ecs.ServiceServiceRegistriesArgs(registry_arn=sd_svc.arn)

        self.service = aws.ecs.Service(f"{name}-svc",
            cluster=cluster,
            desired_count=1,
            launch_type='FARGATE',
            platform_version='1.4.0',
            service_registries=svc_registries_args,
            task_definition=task_definition,
            network_configuration=aws.ecs.ServiceNetworkConfigurationArgs(
                subnets=subnets,
                security_groups=security_groups,
            ),
            load_balancers=load_balancers,
            opts=ResourceOptions(parent=self)
        )

        self.register_outputs({})


class WebService(ComponentResource):

    def __init__(self,
                 name,
                 cluster,
                 health_check_path,
                 listener_arn,
                 security_groups,
                 service_path,
                 service_port,
                 subnets,
                 task_definition,
                 vpc_id,
                 namespace_id = None,
                 opts: ResourceOptions = None):

        super().__init__("redata:service:WebService", name, {}, opts)

        tg = aws.lb.TargetGroup(f"{name}-tg",
            health_check=aws.lb.TargetGroupHealthCheckArgs(
                path=health_check_path
            ),
            port=service_port,
            protocol='HTTP',
            target_type='ip',
            vpc_id=vpc_id,
            opts=ResourceOptions(parent=self)
        )

        lr = aws.lb.ListenerRule(f"{name}-listener-rule",
            listener_arn=listener_arn,
            actions=[aws.lb.ListenerRuleActionArgs(
                type="forward",
                target_group_arn=tg.arn,
            )],
            conditions=[
                aws.lb.ListenerRuleConditionArgs(
                    path_pattern=aws.lb.ListenerRuleConditionPathPatternArgs(
                        values=[f"{service_path}*"],
                    ),
                ),
            ],
            opts=ResourceOptions(parent=self)
        )

        self.service = BackendService(name,
            cluster=cluster,
            subnets=subnets,
            task_definition=task_definition,
            namespace_id=namespace_id,
            security_groups=security_groups,
            load_balancers=[aws.ecs.ServiceLoadBalancerArgs(
                target_group_arn=tg.arn,
                container_name=f"redata-{name}",
                container_port=service_port,
            )],
            opts=ResourceOptions(parent=self),
        )

        self.register_outputs({})
