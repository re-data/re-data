#!/usr/bin/env bash
sleep 5

cd redata

alembic upgrade head

cd ..

redata --generate-admin-user

redata --metrics
redata --grafana

airflow scheduler