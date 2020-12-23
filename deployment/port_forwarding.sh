#!/usr/bin/env bash

ssh -L 3001:localhost:3000 -L 8081:localhost:8080 -N -f $@