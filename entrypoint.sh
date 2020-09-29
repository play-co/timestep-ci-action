#!/bin/sh
set -e

# chdir into the action root
cd /

# install action depenencies
echo "@play-co:registry=https://npm.pkg.github.com/" > ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" >> ~/.npmrc

npm ci

# run action passing it the arguments
sh -c "node src/index.js $*"
