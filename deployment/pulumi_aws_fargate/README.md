# Redata deployment to AWS Fargate using Pulumi

This is an example of how you could deploy Redata into a new Fargate cluster, along with RDS databases, a load balancer, and other dependencies.

Assumptions:
  - You have an AWS account already
  - In the account there is a VPC with one or more private subnets and one or more public subnets where Redata can be deployed
  - There is a public hosted zone where we can register a `redata` alias for the load balancer
  - There is an ACM certificate that can be used by the load balancer for HTTPS traffic

You'll get to specify the requirements above in the Pulumi stack config.

_**NOTE:** If you deploy using this template, you'll be charged for AWS usage accordingly, so make sure you know what to expect, and monitor the cost._

## Pulumi Setup

Install Pulumi:

  - https://www.pulumi.com/docs/get-started/install/


Clone this repo and change directory:

    git clone https://github.com/redata-team/redata.git
    cd redata/deployment/pulumi_aws_fargate

Set up a Python virtualenv with the Pulumi dependencies:

```
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

Initialize a Pulumi stack in this directory:

    pulumi stack init dev

## Configuration

Create `Pulumi.dev.yaml` with the _required_ configuration:

```
config:
  aws:profile: <your-profile-name> # from ~/.aws/credentials
  aws:region: <your-aws-region>
  redata:airflow-admin-email: admin@example.com
  redata:aws-private-subnet-ids: # need 1 or more
    - <private-subnet-id-for-AZ-1>
    - <private-subnet-id-for-AZ-2>
    - <private-subnet-id-for-AZ->
  redata:aws-public-subnet-ids: # need 1 or more
    - <public-subnet-id-for-AZ-1>
    - <public-subnet-id-for-AZ-2>
    - <public-subnet-id-for-AZ-3>
  redata:aws-vpc-id: <vpc-id-to-deploy-in>
  redata:redata-image: redatateam/redata:0.0.4-alfa
  redata:target-domain: <your-public-domain>
  redata:target-domain-cert: <your-acm-cert-arn>

```

Then add the secrets (you'll get prompted for the contents):

    pulumi config set --secret airflow-admin-password
    pulumi config set --secret airflow-db-password
    pulumi config set --secret grafana-admin-password
    pulumi config set --secret redata-db-password

Finally, add a source.. let's use the Redata db itself as an example:

    pulumi config set --secret --path 'sources.redata'
    # Enter the connection URL for Redata DB as the secret:
    #   postgres://redata:<THE_REDATA_DB_PASSWORD>@redata-postgres.db.redata:5432/redata
    # (may need to URL-encode passwords with special characters, eg. using `urllib.parse.quote_plus()` in Python 3 for example)

Adjust the configuration as needed, of course; especially passwords, Redata image version. The example above sets up just a single database source, the Redata db itself, which probably isn't too interesting in the long run.

- ECS services and RDS databases will run in the private subnets
- An application load balancer will be set up and configured for the public subnets

_**NOTE:** For other things you can configure, see below + review the beginning of `__main__.py`.._


### Access Control

If you want to restrict access to your Redata installation to particular CIDR blocks, configure the `allowed-cidr-blocks` parameter:

    pulumi config set --path 'allowed-cidr-blocks[0]' 10.1.0.0/16
    pulumi config set --path 'allowed-cidr-blocks[1]' 10.2.100.0/24
    pulumi config set --path 'allowed-cidr-blocks[2]' 10.2.101.45/32

..but of course with real, public IP CIDRs above, that match what you want to allow.

### AWS Tagging

By default, all taggable resources (according to `taggable.py`) will get two tags:

  - `pulumi:project` (with the name of the project, eg. `redata` unless you rename it in `Pulumi.yaml`)
  - `pulumi:stack` (with the name of the stack, eg. `dev` in the above example)

Custom tags can be added by setting the `tags` config item using the CLI:

    pulumi config set --path tags.my-tag-name my-tag-value

If you have tag names containing `:`, it's easiest to edit `Pulumi.dev.yaml` (or whatever matches your stack) and add it:

```
config:
  # ...
  redata:tags:
    my:tag: my-value
  # ...
```


## Deployment

Deploy the stack using the Pulumi CLI:

    pulumi up

You should get output like:

```
Previewing update (dev)

View Live: https://app.pulumi.com/.../redata/dev/previews/...

     Type                                         Name                                     Plan       
 +   pulumi:pulumi:Stack                          redata-dev                               create     
 +   ├─ redata:cluster:FileSystem                 redata-efs                               create     
 +   ├─ aws:cloudwatch:LogGroup                   redata-log-group                         create     
 ...
 +   ├─ aws:route53:Record                        redata-postgres-cname                    create     
 +   ├─ aws:route53:Record                        airflow-postgres-cname                   create     
 +   ├─ aws:ecs:TaskDefinition                    grafana-web-task                         create     
 +   ├─ aws:ecs:TaskDefinition                    airflow-scheduler-task                   create     
 +   └─ aws:ecs:TaskDefinition                    airflow-web-task                         create     
 
Resources:
    + 47 to create

Do you want to perform this update? yes
Updating (dev)

View Live: https://app.pulumi.com/.../redata/dev/updates/1

     Type                                         Name                                     Status
 +   pulumi:pulumi:Stack                          redata-dev                               created
 +   ├─ redata:cluster:FileSystem                 redata-efs                               created
 +   ├─ aws:cloudwatch:LogGroup                   redata-log-group                         created
 +   ├─ aws:ecs:Cluster                           redata-cluster                           created
 +   ├─ aws:iam:Role                              redata-task-exec-role                    created
 +   ├─ aws:iam:Role                              redata-app-role                          created
 +   ├─ aws:ec2:SecurityGroup                     redata-lb-secgrp                         created
 +   ├─ aws:efs:FileSystem                        redata-efs                               created
 +   ├─ aws:servicediscovery:PrivateDnsNamespace  redata-sd-local-namespace                created
 +   ├─ aws:route53:Zone                          redata-db-zone                           created
 +   ├─ redata:service:BackendService             airflow-scheduler                        created
 +   │  └─ aws:servicediscovery:Service           airflow-scheduler-sd-svc                 created
 +   ├─ aws:rds:SubnetGroup                       redata-rds-subnetgroup                   created
...
Outputs:
    airflow-db-alias   : "airflow-postgres.db.redata:5432"
    airflow-db-endpoint: "airflow-postgres...rds.amazonaws.com:5432"
    airflow-web-url    : "https://redata.<your-public-domain>/airflow"
    grafana-web-url    : "https://redata.<your-public-domain>/grafana"
    redata-db-alias    : "redata-postgres.db.redata:5432"
    redata-db-endpoint : "redata-postgres...rds.amazonaws.com:5432"

Resources:
    + 47 created

Duration: 5m14s
```