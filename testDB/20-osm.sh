#!/bin/bash
set -e

createdb --username=$POSTGRES_USER osm
psql --dbname=osm --username=$POSTGRES_USER --command="CREATE EXTENSION postgis;"
psql --dbname=osm --username=$POSTGRES_USER  --variable=ON_ERROR_STOP=true --file=/docker-entrypoint-initdb.d/osm.sql_ > /dev/null
#pg_restore --file=/docker-entrypoint-initdb.d/osm.dump --format=c --username=$POSTGRES_USER
