#!/bin/bash

ROOT_DIR=$PWD
BUILD_DIR="$PWD/dist/tsc"
PROJECT_DIR="$BUILD_DIR/core"

rm -rf $BUILD_DIR
yarn build:tsc

cp package.json $PROJECT_DIR
cd $PROJECT_DIR

yarn publish --registry https://nexus.sheida.co/repository/npmsheida/
echo "Published on registry!"

cd ../../../
rm -rf dist/tsc