[DEFAULT]
project = demo 

[main]
# to update the static schema, we need to deploy the code first
restore_order = code,database,files
hookdir = %(here)s/hooks/

[files]
active = false

[databases]
names = ${db}
psql = sudo -u postgres psql
dump = sudo -u postgres pg_dump -Fc
createdb = sudo -u postgres createdb
restore_tmp = sudo -u postgres pg_restore -Fc -d

[code]
src = /var/www/vhosts/gmfusrgrp_version2-geomapfishtest/private/2.2/demo_geomapfish
dest = /var/www/vhosts/geomapfish-demo/private/2.2

[apache]
active = false

[remote_hosts]
demo_server = geomapfish-demo-tmp.infra.internal

