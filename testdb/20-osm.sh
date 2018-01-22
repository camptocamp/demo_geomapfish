#!/bin/bash
set -e

createdb --username=$POSTGRES_USER osm
psql --dbname=osm --username=$POSTGRES_USER --command="CREATE EXTENSION IF NOT EXISTS postgis;"
if [ -e osm.sql_ ]; then
    psql --dbname=osm --username=$POSTGRES_USER  --variable=ON_ERROR_STOP=true --file=/docker-entrypoint-initdb.d/osm.sql_ > /dev/null
fi
#pg_restore --file=/docker-entrypoint-initdb.d/osm.dump --format=c --username=$POSTGRES_USER
