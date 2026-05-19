#!/bin/sh
set -e

echo "Running database migrations..."
node_modules/.bin/tsx ./drizzle/migrate.ts

echo "Starting application..."
exec "$@"
