#!/usr/bin/env bash
set -euo pipefail

# wait-for-postgres.sh style simple wait
host="${DATABASE_HOST:-db}"
port="${DATABASE_PORT:-5432}"
tries=30
count=0
until PGPASSWORD="${DATABASE_PASSWORD:-randompassword}" psql -h "$host" -p "$port" -U "${DATABASE_USER:-johndoe}" -c '\q' 2>/dev/null; do
  count=$((count+1))
  if [ "$count" -ge "$tries" ]; then
    echo "Postgres at $host:$port still not available after $tries tries"
    exit 1
  fi
  echo "Waiting for Postgres at $host:$port... ($count/$tries)"
  sleep 1
done

echo "Postgres is up - running Prisma migrate and starting app"

# run prisma migrate deploy (safe for production) and generate client
yarn prisma generate
yarn prisma migrate deploy || true

exec "$@"
