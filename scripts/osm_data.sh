#!/bin/bash    

wget http://download.geofabrik.de/europe/switzerland-latest.osm.pbf

sudo -u postgres osm2pgsql --slim --proj 21781 ---database osm ./switzerland-latest.osm.pbf

sudo -u postgres psql -c "CREATE INDEX ON planet_osm_point (amenity);" osm
sudo -u postgres psql -c "CREATE INDEX ON planet_osm_point (tourism);" osm
sudo -u postgres psql -c "CREATE INDEX ON planet_osm_point (highway);" osm
