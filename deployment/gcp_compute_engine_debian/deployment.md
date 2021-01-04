
# Deployment on GCP (using compute engine)

## Create a new instance
 - Go to `Compute Engine > VM instances > create instance`
 - use default `e2-medium` and debian linux type (It has 4GB mem, recommendations for running docker)
 - Create

## SSH to instance and start setup scripts

```
brew cask install google-cloud-sdk
gcloud init # Follow instructions
gcloud compute ssh INSTANCE_NAME # This assumes you default project/region contains just created instance
```

Once logged in do redata do setup with:

```
curl https://raw.githubusercontent.com/redata-team/redata/master/deployment/gcp_compute_engine_debian/install.sh > install.sh
bash install.sh
```

## Configuration & start of docker-compose

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
gcloud compute ssh redata -- -L 3000:localhost:3000 -L 8080:localhost:8080 -N -f 
```

You should be able to go to `localhost:3000` and login to Grafana (with admin/admin password if didn't changed)
And for Airflow it's running under `localhost:8080`, go there to enable periodic runs by turning on `validation_dag`

That's all, you have your data under observation by now! :)

## Troubleshooting

If you have any problems with running above please join our [Slack](https://join.slack.com/t/redatahq/shared_invite/zt-kmor0h0k-LdABQKDwSfQwC8sglkdpVw)
We will be happy to help! :)
