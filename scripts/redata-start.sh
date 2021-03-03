#!/usr/bin/env bash
sleep 5

cd redata

alembic upgrade head

cd ..

redata --create-admin-user

airflow scheduler