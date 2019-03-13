#!/bin/bash
set -e

echo "-----------------------------"
echo "Check Jekyll Health"
bundle exec jekyll doctor

echo "-----------------------------"
echo "Check for vulnerabilities"
bundle exec bundle-audit

# echo "-----------------------------"
# echo "Start server to make tests"
# JEKYLL_ENV=production bundle exec jekyll serve --config _config.yml,_config-ci.yml &
# SERVER_PID=$!

# echo "-----------------------------"
# echo "Wait for server to be ready"
# sleep 10

# echo "-----------------------------"
# echo "Run tests"
# bundle exec rake ci

# echo "-----------------------------"
# echo "Tests OK, kill server"
# kill -9 $SERVER_PID

echo "-----------------------------"
echo "Cleanup"
make cleanup

echo "-----------------------------"
echo "Build Production site"
JEKYLL_ENV=production bundle exec jekyll build --config _config.yml
