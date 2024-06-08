#!/bin/bash

yarn build:tsc
ROOT_DIR=$PWD
PROJECT_DIR="$PWD/dist/tsc/core"
cp package.json $PROJECT_DIR
cd $PROJECT_DIR

yarn publish --registry https://nexus.sheida.co/repository/npmsheida/
echo "Published on registry!"

cd ../../../
rm -rf dist/tsc