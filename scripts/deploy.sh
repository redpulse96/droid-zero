#!/bin/bash

echo "Deploying built binary to server"
# Insert deploy script logic here
# pm2 delete all
npm run prebuild
nest build
pm2 restart all && pm2 logs
# pm2 start ./dist/src/main.js -i 1 --name 'droid-zero:8080'
echo "Complete"
