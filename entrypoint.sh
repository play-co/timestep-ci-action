#!/bin/sh
set -e

# chdir into the action root
cd /

# install action depenencies
npm ci

# run action passing it the arguments
sh -c "node src/index.js $*"
