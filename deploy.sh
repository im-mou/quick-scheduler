#!/bin/bash
echo "Deploying quick-scheduler"

cd /var/www/quick-scheduler \
&& git checkout production \
&& git pull \
&& npm i \
&& echo "Packages installed" \
&& npm run build \
&& echo 'Installing:  done.' \
&& echo "quick-scheduler deployed successfully"