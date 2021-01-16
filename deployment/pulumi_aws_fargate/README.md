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

Create `Pulumi.dev.yaml` with the required configuration:

```
config:
  aws:profile: <your-profile-name> # from ~/.aws/credentials
  aws:region: <your-aws-region>
  redata:airflow-admin-email: admin@example.com
  redata:vpc_id: <vpc-id-to-deploy-in>
  redata:aws-private-subnet-ids: # need 1 or more
    - <private-subnet-id-for-AZ-1>
    - <private-subnet-id-for-AZ-2>
    - <private-subnet-id-for-AZ->
  redata:aws-public-subnet-ids: # need 1 or more
    - <public-subnet-id-for-AZ-1>
    - <public-subnet-id-for-AZ-2>
    - <public-subnet-id-for-AZ-3>
  redata:aws-vpc-id: <vpc-id-to-deploy-in>
  #redata:private-zone-db: db.redata
  #redata:private-zone-sd: sd.redata
  #redata:protect-persistent-storage: false
  redata:redata-image: redatateam/redata:0.0.4-alfa
  redata:target-domain: <your-public-domain>
  redata:target-domain-cert: <your-acm-cert-arn>

```

Then add the secrets (you'll get prompted for the contents):

    pulumi config set --secret airflow-admin-password
    pulumi config set --secret airflow-db-password
    pulumi config set --secret grafana-admin-password
    pulumi config set --secret grafana-db-password
    pulumi config set --secret redata-db-password

Finally, add a source.. let's use the Redata db itself as an example:

    pulumi config set --secret --path 'sources.redata'
    # Enter the connection URL for Redata DB as the secret:
    #   postgres://redata:<THE_REDATA_DB_PASSWORD>@redata-postgres.redata.db.local:5432/redata

Adjust the configuration as needed, of course; especially passwords, Redata image version. The example above sets up just a single database source, the Redata db itself, which probably isn't too interesting in the long run.

- ECS services and RDS databases will run in the private subnets
- An application load balancer will be set up and configured for the public subnets

## Deployment

Deploy the stack using the Pulumi CLI:

    pulumi up

You should get output like:

```
Previewing update (dev)

View Live: https://app.pulumi.com/.../redata-aws-fargate/dev/previews/...

     Type                             Name                    Plan       
 +   pulumi:pulumi:Stack              redata-aws-fargate-dev  create     
 +   ├─ aws:ecs:Cluster               redata-cluster          create     
 +   ├─ aws:ec2:SecurityGroup         redata-lb-secgrp        create     
 +   ├─ aws:cloudwatch:LogGroup       redata-log-group        create     
 +   ├─ aws:iam:Role                  task-exec-role          create     
 +   ├─ aws:lb:TargetGroup            grafana-web-tg          create     
 +   ├─ aws:iam:RolePolicyAttachment  task-exec-policy        create     
 +   ├─ aws:lb:LoadBalancer           redata-lb               create     
 +   ├─ aws:ec2:SecurityGroup         redata-svc-secgrp       create     
 +   ├─ aws:ec2:SecurityGroup         redata-db-secgrp        create     
 +   ├─ aws:lb:Listener               redata-listener         create     
 +   ├─ aws:rds:Instance              grafana-postgres        create     
 +   ├─ aws:lb:ListenerRule           grafana-listener-rule   create     
 +   ├─ aws:ecs:TaskDefinition        grafana-web-task        create     
 +   └─ aws:ecs:Service               grafana-web-svc         create     
 
Resources:
    + 15 to create

Do you want to perform this update? yes
Updating (dev)

View Live: https://app.pulumi.com/.../redata-aws-fargate/dev/updates/...

... 
 
Outputs:
  + grafana-url: "http://redata-lb-cea9555-1717597926.eu-west-1.elb.amazonaws.com/grafana"

Resources:
    + 15 created

Duration: 5m34s
```