#!/usr/bin/env bash
echo "Waiting for Grafana & Migrations to be done"

sleep 10


waitress-serve --port ${REDATA_ADMIN_PORT} --call "redata.ui_admin.app:create_app"