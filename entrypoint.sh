#!/bin/sh
set -e

apt-get update && apt-get install -y fontconfig libfontconfig1 libfreetype6 # Dependencies to display chess pieces in PDFs

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