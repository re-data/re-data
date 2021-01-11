#!/usr/bin/env bash
airflow db upgrade
airflow users create -r Admin -u ${AIRFLOW_SECURITY_ADMIN_USER} -e ${AIRFLOW_SECURITY_ADMIN_EMAIL} -f Admin -l User -p ${AIRFLOW_SECURITY_ADMIN_PASSWORD}
airflow webserver
