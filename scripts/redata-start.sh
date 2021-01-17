#!/usr/bin/env bash
cd redata

alembic upgrade head

cd ..

redata --metrics
redata --grafana

airflow scheduler