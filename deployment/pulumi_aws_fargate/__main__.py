import json

import pulumi
import pulumi_aws as aws
from pulumi import export, Output, ResourceOptions

import pulumi_redata as redata
from autotag import register_auto_tags

aws_config = pulumi.Config("aws")

aws_account_id = aws.get_caller_identity().account_id
aws_region = aws_config.require("region")

config = pulumi.Config()


# --- REQUIRED CONFIG ---

# Basic config - what VPC and subnets to deploy in?
private_subnet_ids = config.require_object("aws-private-subnet-ids")
public_subnet_ids = config.require_object("aws-public-subnet-ids")
redata_vpc = aws.ec2.get_vpc(id=config.require("aws-vpc-id"))

# External domain name + cert ARN for load balancer
target_domain = config.require("target-domain")
target_domain_cert = config.require("target-domain-cert")

# Service configuration

airflow_admin_email = config.require("airflow-admin-email")
airflow_admin_password = config.require_secret("airflow-admin-password")
airflow_db_password = config.require_secret("airflow-db-password")
grafana_admin_password = config.require_secret("grafana-admin-password")
redata_db_password = config.require_secret("redata-db-password")
redata_image = config.require("redata-image")
redata_sources = config.require_secret_object("sources")

# --- OPTIONAL CONFIG ---

# Allowed CIDR blocks for accessing the HTTPS load balancer (by default public access)
allowed_cidr_blocks = config.get_object("allowed-cidr-blocks") or ["0.0.0.0/0"]

# Private zones for DB aliases + Service Discovery
private_zone_db = config.get("private-zone-db") or "db.redata"
private_zone_sd = config.get("private-zone-sd") or "sd.redata"

# Protection flag; set config to 'true' to protect EFS and DBs from accidental deletion
protect_persistent_storage = config.get_bool("protect-persistent-storage") or False

# Redata customization
redata_airflow_schedule_interval = (
    config.get("redata-airflow-schedule-interval") or "0 * * * *"
)
redata_time_col_blacklist_regex = config.get("redata-time-col-blacklist-regex") or ""

# Extra tags to apply to all taggable resources
tags = config.get_object("tags") or {}

# --- DERIVED / INTERNAL DEFINITIONS ---

airflow_base_log_folder = "/opt/airflow/logs"
base_url = f"https://{target_domain}"
grafana_db_folder = "/var/lib/grafana"


# Automatically inject tags.
register_auto_tags(
    {
        "pulumi:project": pulumi.get_project(),
        "pulumi:stack": pulumi.get_stack(),
        **tags,
    }
)


#
# CLUSTER INFRASTRUCTURE
#

# Create a cluster
cluster = aws.ecs.Cluster("redata-cluster")

# Create a log group with 7 days retention
lg = aws.cloudwatch.LogGroup(
    "redata-log-group",
    retention_in_days=7,
)

# Create the Task Execution IAM role for ECS / Fargate
role = aws.iam.Role(
    "redata-task-exec-role",
    assume_role_policy=json.dumps(
        {
            "Version": "2008-10-17",
            "Statement": [
                {
                    "Sid": "",
                    "Effect": "Allow",
                    "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                }
            ],
        }
    ),
)

rpa = aws.iam.RolePolicyAttachment(
    "redata-task-exec-policy",
    role=role.name,
    policy_arn="arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
)

# Create an IAM role that can be used by our service tasks
app_role = aws.iam.Role(
    "redata-app-role",
    assume_role_policy=json.dumps(
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "",
                    "Effect": "Allow",
                    "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                }
            ],
        }
    ),
)

# Create a SecurityGroup for our load balancer that permits HTTPS ingress.
alb_secgrp = aws.ec2.SecurityGroup(
    "redata-lb-secgrp",
    vpc_id=redata_vpc.id,
    description="Enable HTTPS access",
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=443,
            to_port=443,
            cidr_blocks=allowed_cidr_blocks,
        )
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
        )
    ],
)

# Create a SecurityGroup for our services that permits load balancer ingress and unlimited egress.
svc_secgrp = aws.ec2.SecurityGroup(
    "redata-svc-secgrp",
    vpc_id=redata_vpc.id,
    description="Enable HTTP access",
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=0,
            to_port=65535,
            security_groups=[alb_secgrp.id],
            self=True,
        ),
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
        )
    ],
)

# Create a SecurityGroup for databases that allows access from services.
db_secgrp = aws.ec2.SecurityGroup(
    "redata-db-secgrp",
    vpc_id=redata_vpc.id,
    description="Enable database access",
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=5432,
            to_port=5435,
            security_groups=[svc_secgrp.id],
        )
    ],
)

# Elastic File System for persistent storage
efs = redata.fs.FileSystem(
    "redata-efs",
    security_groups=[svc_secgrp.id],
    subnets=private_subnet_ids,
    vpc_id=redata_vpc.id,
    opts=ResourceOptions(protect=protect_persistent_storage),
)

# Service Discovery for intra-cluster communication
sd_namespace = aws.servicediscovery.PrivateDnsNamespace(
    "redata-sd-local-namespace",
    name=private_zone_sd,
    description="Private namespace for Redata services",
    vpc=redata_vpc.id,
)

# Create a load balancer to listen for HTTP traffic on port 80.
alb = aws.lb.LoadBalancer(
    "redata-lb",
    security_groups=[alb_secgrp.id],
    subnets=public_subnet_ids,
)

listener = aws.lb.Listener(
    "redata-listener",
    load_balancer_arn=alb.arn,
    port=443,
    protocol="HTTPS",
    ssl_policy="ELBSecurityPolicy-2016-08",
    certificate_arn=target_domain_cert,
    default_actions=[
        aws.lb.ListenerDefaultActionArgs(
            type="fixed-response",
            fixed_response=aws.lb.ListenerDefaultActionFixedResponseArgs(
                content_type="text/plain",
                message_body="No such page. Try /airflow or /grafana instead.",
                status_code="404",
            ),
        )
    ],
)

# Create a Route 53 Alias A record from the target domain name to the load balancer.
subdomain, parent_domain = redata.util.get_domain_and_subdomain(target_domain)
hzid = aws.route53.get_zone(name=parent_domain).id

record = aws.route53.Record(
    target_domain,
    name=subdomain,
    zone_id=hzid,
    type="A",
    aliases=[
        aws.route53.RecordAliasArgs(
            name=alb.dns_name,
            zone_id=alb.zone_id,
            evaluate_target_health=True,
        ),
    ],
)


#
# DATABASES
#

# Route53 private hosted zone for database aliases
db_zone = aws.route53.Zone(
    "redata-db-zone",
    name=private_zone_db,
    vpcs=[
        aws.route53.ZoneVpcArgs(
            vpc_id=redata_vpc.id,
            vpc_region=aws_region,
        )
    ],
)

rds_subnetgroup = aws.rds.SubnetGroup(
    "redata-rds-subnetgroup", subnet_ids=private_subnet_ids
)

airflow_db = aws.rds.Instance(
    "airflow-postgres",
    allocated_storage=20,
    db_subnet_group_name=rds_subnetgroup.name,
    engine="postgres",
    engine_version="12.5",
    instance_class="db.t2.micro",
    name="airflow",
    password=airflow_db_password,
    port=5432,
    skip_final_snapshot=True,
    storage_type="gp2",
    username="airflow",
    vpc_security_group_ids=[db_secgrp.id],
    opts=ResourceOptions(protect=protect_persistent_storage),
)
airflow_db_cname = aws.route53.Record(
    "airflow-postgres-cname",
    name="airflow-postgres",
    zone_id=db_zone.zone_id,
    type="CNAME",
    ttl=60,
    records=[airflow_db.address],
)
export(f"airflow-db-endpoint", airflow_db.endpoint)
export(
    f"airflow-db-alias",
    Output.concat(
        f"airflow-postgres.", db_zone.name, ":", airflow_db.port.apply(lambda x: str(x))
    ),
)

redata_db = aws.rds.Instance(
    "redata-postgres",
    allocated_storage=20,
    db_subnet_group_name=rds_subnetgroup.name,
    engine="postgres",
    engine_version="12.5",
    instance_class="db.t2.micro",
    name="redata",
    password=redata_db_password,
    port=5432,
    skip_final_snapshot=True,
    storage_type="gp2",
    username="redata",
    vpc_security_group_ids=[db_secgrp.id],
    opts=ResourceOptions(protect=protect_persistent_storage),
)
redata_db_cname = aws.route53.Record(
    "redata-postgres-cname",
    name="redata-postgres",
    zone_id=db_zone.zone_id,
    type="CNAME",
    ttl=60,
    records=[redata_db.address],
)
export(f"redata-db-endpoint", redata_db.endpoint)
export(
    f"redata-db-alias",
    Output.concat(
        f"redata-postgres.", db_zone.name, ":", redata_db.port.apply(lambda x: str(x))
    ),
)


#
# TASKS
#

environment = Output.all(
    airflow_db.address,  # 0
    airflow_db.password,  # 1
    sd_namespace.name,  # 2
    redata_db.address,  # 3
    redata_db.password,  # 4
    redata_sources,  # 5
    airflow_admin_password,  # 6
    grafana_admin_password,  # 7
).apply(
    lambda args: [
        # Airflow DB
        {
            "name": "AIRFLOW_CONN_METADATA_DB",
            "value": f"postgres+psycopg2://airflow:{args[1]}@{args[0]}:5432/airflow",
        },
        {"name": "AIRFLOW_VAR__METADATA_DB_SCHEMA", "value": "airflow"},
        # Airflow Config
        {"name": "AIRFLOW__CORE__LOAD_DEFAULT_CONNECTIONS", "value": "False"},
        {
            "name": "AIRFLOW__CORE__SQL_ALCHEMY_CONN",
            "value": f"postgres+psycopg2://airflow:{args[1]}@{args[0]}:5432/airflow",
        },
        {
            "name": "AIRFLOW__CORE__DAGS_FOLDER",
            "value": "/usr/local/redata/redata/dags",
        },
        {"name": "AIRFLOW__CORE__EXECUTOR", "value": "LocalExecutor"},
        {"name": "AIRFLOW__LOGGING__BASE_LOG_FOLDER", "value": airflow_base_log_folder},
        # - Front-end IPs that are allowed to set secure headers; only our ALB can talk to us, so set it to *
        #   (see https://docs.gunicorn.org/en/stable/settings.html#forwarded-allow-ips)
        {"name": "FORWARDED_ALLOW_IPS", "value": "*"},
        # - Set proper base URL for redirects etc
        {"name": "AIRFLOW__WEBSERVER__BASE_URL", "value": f"{base_url}/airflow"},
        # - Admin user setup (via entrypoint script):
        {"name": "AIRFLOW_SECURITY_ADMIN_USER", "value": "admin"},
        {"name": "AIRFLOW_SECURITY_ADMIN_PASSWORD", "value": args[6]},
        {"name": "AIRFLOW_SECURITY_ADMIN_EMAIL", "value": airflow_admin_email},
        # Grafana Config
        {
            "name": "GF_INSTALL_PLUGINS",
            "value": "grafana-polystat-panel,grafana-clock-panel,grafana-simple-json-datasource",
        },
        {"name": "GF_SECURITY_ADMIN_USER", "value": "admin"},
        {"name": "GF_SECURITY_ADMIN_PASSWORD", "value": args[7]},
        {"name": "GF_SERVER_ROOT_URL", "value": f"{base_url}/grafana"},
        {"name": "GF_SERVER_SERVE_FROM_SUB_PATH", "value": "true"},
        # Redata DB
        {"name": "REDATA_METRICS_DATABASE_HOST", "value": args[3]},
        {"name": "REDATA_METRICS_DATABASE_USER", "value": "redata"},
        {"name": "REDATA_METRICS_DATABASE_PASSWORD", "value": args[4]},
        {"name": "REDATA_METRICS_DATABASE_NAME", "value": "redata"},
        {
            "name": "REDATA_METRICS_DB_URL",
            "value": f"postgres://redata:{args[4]}@{args[3]}:5432/redata",
        },
        # Redata Config
        {"name": "GRAFANA_WEB_HOST", "value": f"grafana-web.{args[2]}"},
        {"name": "GRAFANA_WEB_PORT", "value": "3000"},
        {
            "name": "REDATA_AIRFLOW_SCHEDULE_INTERVAL",
            "value": redata_airflow_schedule_interval,
        },
        {
            "name": "REDATA_TIME_COL_BLACKLIST_REGEX",
            "value": redata_time_col_blacklist_regex,
        },
    ]
    + [
        {"name": f"REDATA_SOURCE_DB_URL_{name}", "value": url}
        for name, url in args[5].items()
    ]
)


#
# Airflow
#

airflow_logs = redata.fs.AccessPoint(
    "redata-efs-airflow-logs",
    file_system=efs,
    path="/airflow/logs",
)

airflow_logs_policy = aws.iam.RolePolicy(
    "airflow-logs-policy", role=app_role.id, policy=airflow_logs.policy_document
)

airflow_logs_volume = aws.ecs.TaskDefinitionVolumeArgs(
    name="redata-airflow-logs-ap",
    efs_volume_configuration=aws.ecs.TaskDefinitionVolumeEfsVolumeConfigurationArgs(
        authorization_config=aws.ecs.TaskDefinitionVolumeEfsVolumeConfigurationAuthorizationConfigArgs(
            access_point_id=airflow_logs.ap.id,
            iam="ENABLED",
        ),
        file_system_id=efs.efs.id,
        transit_encryption="ENABLED",
    ),
)

airflow_scheduler_task = aws.ecs.TaskDefinition(
    "airflow-scheduler-task",
    family="airflow-scheduler-task",
    cpu="1024",
    memory="2048",
    network_mode="awsvpc",
    requires_compatibilities=["FARGATE"],
    execution_role_arn=role.arn,
    container_definitions=Output.all(environment, lg.name).apply(
        lambda args: json.dumps(
            [
                {
                    "name": "redata-airflow-scheduler",
                    "image": config.require("redata-image"),
                    "portMappings": [
                        {"containerPort": 8793, "hostPort": 8793, "protocol": "tcp"}
                    ],
                    "environment": args[0],
                    "entryPoint": ["/usr/local/redata/scripts/redata-start.sh"],
                    "logConfiguration": {
                        "logDriver": "awslogs",
                        "options": {
                            "awslogs-group": args[1],
                            "awslogs-region": aws_region,
                            "awslogs-stream-prefix": "airflow-scheduler",
                        },
                    },
                    "mountPoints": [
                        {
                            "sourceVolume": "redata-airflow-logs-ap",
                            "containerPath": airflow_base_log_folder,
                        }
                    ],
                }
            ]
        )
    ),
    task_role_arn=app_role.arn,
    volumes=[airflow_logs_volume],
)

airflow_web_task = aws.ecs.TaskDefinition(
    "airflow-web-task",
    family="airflow-web-task",
    cpu="1024",
    memory="2048",
    network_mode="awsvpc",
    requires_compatibilities=["FARGATE"],
    execution_role_arn=role.arn,
    container_definitions=Output.all(environment, lg.name).apply(
        lambda args: json.dumps(
            [
                {
                    "name": "redata-airflow-web",
                    "image": config.require("redata-image"),
                    "portMappings": [
                        {"containerPort": 8080, "hostPort": 8080, "protocol": "tcp"}
                    ],
                    "environment": args[0],
                    "entryPoint": ["/usr/local/redata/scripts/airflow-entrypoint.sh"],
                    "logConfiguration": {
                        "logDriver": "awslogs",
                        "options": {
                            "awslogs-group": args[1],
                            "awslogs-region": aws_region,
                            "awslogs-stream-prefix": "airflow-web",
                        },
                    },
                    "mountPoints": [
                        {
                            "sourceVolume": "redata-airflow-logs-ap",
                            "containerPath": airflow_base_log_folder,
                        }
                    ],
                }
            ]
        )
    ),
    task_role_arn=app_role.arn,
    volumes=[airflow_logs_volume],
)


#
# Grafana
#

grafana_db = redata.fs.AccessPoint(
    "redata-efs-grafana-db",
    file_system=efs,
    path="/grafana/db",
)

grafana_db_policy = aws.iam.RolePolicy(
    "grafana-db-policy", role=app_role.id, policy=grafana_db.policy_document
)

grafana_db_volume = aws.ecs.TaskDefinitionVolumeArgs(
    name="redata-grafana-db-ap",
    efs_volume_configuration=aws.ecs.TaskDefinitionVolumeEfsVolumeConfigurationArgs(
        authorization_config=aws.ecs.TaskDefinitionVolumeEfsVolumeConfigurationAuthorizationConfigArgs(
            access_point_id=grafana_db.ap.id,
            iam="ENABLED",
        ),
        file_system_id=efs.efs.id,
        transit_encryption="ENABLED",
    ),
)

grafana_web_task = aws.ecs.TaskDefinition(
    "grafana-web-task",
    family="grafana-web-task",
    cpu="1024",
    memory="2048",
    network_mode="awsvpc",
    requires_compatibilities=["FARGATE"],
    execution_role_arn=role.arn,
    container_definitions=Output.all(environment, lg.name).apply(
        lambda args: json.dumps(
            [
                {
                    "name": "redata-grafana-web",
                    "image": "grafana/grafana:7.3.0",
                    "portMappings": [
                        {"containerPort": 3000, "hostPort": 3000, "protocol": "tcp"}
                    ],
                    "environment": args[0],
                    "logConfiguration": {
                        "logDriver": "awslogs",
                        "options": {
                            "awslogs-group": args[1],
                            "awslogs-region": aws_region,
                            "awslogs-stream-prefix": "grafana",
                        },
                    },
                    "mountPoints": [
                        {
                            "sourceVolume": "redata-grafana-db-ap",
                            "containerPath": grafana_db_folder,
                        }
                    ],
                }
            ]
        )
    ),
    task_role_arn=app_role.arn,
    volumes=[grafana_db_volume],
)


#
# SERVICES
#

airflow_scheduler_svc = redata.service.BackendService(
    "airflow-scheduler",
    cluster=cluster.arn,
    subnets=private_subnet_ids,
    task_definition=airflow_scheduler_task.arn,
    namespace_id=sd_namespace.id,
    security_groups=[svc_secgrp.id],
)

web_services = [
    {
        "name": "airflow-web",
        "health_check_path": "/airflow/health",
        "service_path": "/airflow",
        "service_port": 8080,
        "task_definition": airflow_web_task.arn,
    },
    {
        "name": "grafana-web",
        "health_check_path": "/healthz",
        "service_path": "/grafana",
        "service_port": 3000,
        "task_definition": grafana_web_task.arn,
    },
]

for service in web_services:
    websvc = redata.service.WebService(
        service["name"],
        cluster=cluster.arn,
        health_check_path=service["health_check_path"],
        listener_arn=listener.arn,
        namespace_id=sd_namespace.id,
        security_groups=[svc_secgrp.id],
        service_path=service["service_path"],
        service_port=service["service_port"],
        subnets=private_subnet_ids,
        task_definition=service["task_definition"],
        vpc_id=redata_vpc.id,
        opts=ResourceOptions(depends_on=[listener]),
    )
    export(f"{service['name']}-url", Output.concat(base_url, service["service_path"]))
