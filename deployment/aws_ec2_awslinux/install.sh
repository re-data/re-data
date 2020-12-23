#!/usr/bin/env bash

sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker $USER

sudo wget https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m) -O /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

mkdir redata && cd redata
wget https://raw.githubusercontent.com/airbytehq/airbyte/master/{env_template,docker-compose.yaml}
cp env_template .env
