#!/usr/bin/env bash
cd redata

alembic upgrade head

redata --metrics
redata --grafana

airflow scheduler