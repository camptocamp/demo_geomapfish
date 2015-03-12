#!/bin/bash    

wget http://download.geofabrik.de/europe/switzerland-latest.osm.pbf

sudo -u postgres osm2pgsql -s --proj 21781 -d osm ./switzerland-latest.osm.pbf
