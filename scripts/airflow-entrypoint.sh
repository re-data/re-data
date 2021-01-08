#!/usr/bin/env bash
airflow db upgrade
airflow users create -r Admin -u admin -e admin@example.com -f Admin -l User -p admin
airflow webserver