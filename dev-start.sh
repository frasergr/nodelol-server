#!/bin/sh
cp -r /home/node/cache/server/node_modules/. /home/node/app/node_modules/
cp -r /home/node/cache/client/node_modules/. /home/node/app/client/node_modules/
cp /home/node/cache/client/.env /home/node/app/client/.env
exec npm run dev
