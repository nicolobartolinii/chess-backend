#!/bin/sh
set -e

npm install

# Wait for the database to be ready
until npx sequelize db:migrate:status; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 1
done

npm run migrate-undo
npm run migrate

if [ "$NODE_ENV" = "production" ]; then
  npm run start
else
  npm run seed
  npm run dev
fi