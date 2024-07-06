#!/bin/sh
set -e

npm install

npm run migrate

if [ "$NODE_ENV" = "production" ]; then
  npm run start
else
  npm run seed
  npm run dev
fi