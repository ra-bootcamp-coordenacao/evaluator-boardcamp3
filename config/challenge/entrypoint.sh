#!/bin/sh

# Abort on any error (including if wait-for-it fails).
set -e

export POSTGRES_HOST="db"
export POSTGRES_PORT="5432"

# Wait for the backend to be up, if we know where it is.
if [ -n "$POSTGRES_HOST" ]; then
  ./wait-for-it.sh "$POSTGRES_HOST:${POSTGRES_PORT:-5432}" -t 60
fi

# Run the main container command.
exec "$@"