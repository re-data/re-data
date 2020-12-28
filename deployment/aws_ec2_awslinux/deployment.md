
# Deployment on AWS (using ec2 & awslinux)

## Create a new EC2 instance
 - Go to `EC2 -> Instances -> Select Amazon Linux 2 AMI`
 - Select `t2.medium` type (It has 4GB mem, recommendations for running docker)
 - Go to Review and Launch
 - Edit security groups (depending on setup you org uses this most likely will be different)
    - For redata to work, you only need to be able to SSH into machine (adding just SSH port with access from your IP * if stable * will be enough)
 - Click Launch and either:
    - Generate new SSH keys to use it only for this machine
    - Link some existing SSH keys you are already using for AWS
 - Confirm and launch instance

## SSH to instance and start setup scripts

```
ssh -i PATH_TO_SSH_KEY ec2-user@PUBLIC_DNS_OF_MACHINE
wget https://raw.githubusercontent.com/redata-team/redata/master/deployment/aws_ec2_awslinux/install.sh
bash install.sh
```

## Configuration & start of docker-comose

Docker and docker-compose should be installed by now you should have redata directory with docker-compose file there.

Edit created `.env` file to point to at least one source you would like to monitor.

Start docker-compose, (you may need to exit and join by ssh again for machine to get proper docker env variables setup)

```
docker-compose up -d
# -d for deamon mode, so that it runs in background
```

## Connect to metrics and observe your data

Go back to you local computer and ssh with tunneling to redata

```
ssh -i PATH_TO_SSH_KEY -L 3000:localhost:3000 -L 8080:localhost:8080 -N -f ec2-user@PUBLIC_DNS_OF_MACHINE
```

You should be able to go to `localhost:3000` and login to Grafana (with admin/admin password if didn't changed)
And for Airflow it's running under `localhost:8080`, go there to enable periodic runs by turning on `validation_dag`

That's all, you have your data under observation by now! :)

## Troubleshooting

If you have any problems with running above please join our [Slack](https://join.slack.com/t/redatahq/shared_invite/zt-jk8imy5f-OPjSHv7fCpfYUGyktw_qvw)
We will be happy to help! :)

