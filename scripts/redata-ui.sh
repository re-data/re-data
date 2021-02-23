#!/usr/bin/env bash

waitress-serve --port ${REDATA_ADMIN_PORT} --call "redata.ui_admin.app:create_app"