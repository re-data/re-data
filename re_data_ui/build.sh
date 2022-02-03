#!/bin/bash
set -e

npm run build
rm ../re_data/include/index.html
cp build/index.html ../re_data/include/