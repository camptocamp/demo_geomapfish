#!/bin/bash

set -e

if [[ -z "$DB_CONNECTION" ]]
then
  echo "Using default DB connection"
else
  echo "Replacing DB connection from env"
  sed -i -e 's/user=www-data password=www-data dbname=demo_geomapfish_2_0 host=localhost\([\" ]\)/'"$DB_CONNECTION"'\1/' `find /etc/mapserver -name *.map`
fi
