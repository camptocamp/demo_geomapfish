#!/bin/bash

cd /var/sig/demo/c2cgeoportal

rm switzerland-latest.osm.pbf
wget http://download.geofabrik.de/europe/switzerland-latest.osm.pbf

sudo -u postgres osm2pgsql --slim --proj 2056 ---database osm ./switzerland-latest.osm.pbf

sudo -u postgres psql -c "CREATE INDEX ON planet_osm_point (amenity);" osm
sudo -u postgres psql -c "CREATE INDEX ON planet_osm_point (tourism);" osm
sudo -u postgres psql -c "CREATE INDEX ON planet_osm_point (highway);" osm

rm switzerland-latest.shp.zip
wget http://download.geofabrik.de/europe/switzerland-latest.shp.zip
unzip switzerland-latest.shp.zip
shp2pgsql -c -s 4326:2056 -g geom -I osm_switzerland/points swiss_points | psql -h localhost -U www-data -W osm

sudo -u postgres psql -c "ALTER TABLE swiss_points RENAME COLUMN "timestamp" TO timestamp_;" osm
sudo -u postgres psql -c "ALTER TABLE swiss_points ADD COLUMN "timestamp" timestamp;" osm
sudo -u postgres psql -c "UPDATE ONLY swiss_points SET "timestamp" = timestamp_::timestamp;" osm
sudo -u postgres psql -c "CREATE INDEX ON swiss_points("timestamp");" osm
sudo -u postgres psql -c "ALTER TABLE swiss_points DROP COLUMN timestamp_;" osm
