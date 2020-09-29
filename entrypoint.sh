#!/bin/sh
set -e

# chdir into the action root
cd /

# install action depenencies
echo "running ci"
echo $NODE_AUTH_TOKEN
npm ci

# run action passing it the arguments
sh -c "node src/index.js $*"
