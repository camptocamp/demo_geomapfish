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
dest = /var/www/c2cgeoportal_mapfish/conf/c2cgeoportal.conf
content = Include /var/www/c2cgeoportal_mapfish/private/c2cgeoportal/apache/*.conf

[remote_hosts]
demo_server = geomapfish-demo-tmp.infra.internal

