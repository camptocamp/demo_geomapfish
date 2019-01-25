COMPOSE_PROJECT_NAME=demo_${instance}
PORT=${port}
PROJECT_DIRECTORY=${project_directory}
DOCKER_BASE=${docker_base}
DOCKER_TAG=${docker_tag}
BUILD_VOLUME_NAME=${build_volume_name}
GEOMAPFISH_VERSION=${geomapfish_version}
VISIBLE_WEB_HOST=${docker_host}
VISIBLE_WEB_PROTOCOL=${docker_web_protocol}
VISIBLE_ENTRY_POINT=${docker_entry_point}
PGHOST=172.17.0.1
PGHOST_SLAVE=172.17.0.1
PGPORT=5432
PGUSER=www-data
PGDATABASE=demo_geomapfish
PGSCHEMA=main
PGSCHEMA_STATIC=main_static
GEOPORTAL_INTERNAL_URL=http://geoportal:8080
TILECLOUDCHAIN_INTERNAL_URL=http://tilecloudchain:8080
MAPCACHE_URL=http://mapcache:8080/mapcache/
MAPSERVER_URL=http://mapserver:8080/
TINYOWS_URL=http://tinyows:8080/
PRINT_URL=https://mutualized-print.paas-ch-3.camptocamp.com/print/demo_geomapfish_24/
MEMCACHED_HOST=memcached
MEMCACHED_PORT=11211
REDIS_HOST=redis
REDIS_PORT=6379
TILEGENERATION_SQS_QUEUE=geomapfish-demo-stretch
GUNICORN_PARAMS=--bind=:8080 --worker-class=gthread --threads=10 --workers=1 --timeout=60 --max-requests=1000 --max-requests-jitter=100
DEVSERVER_HOST=webpack-dev-server:8080
C2C_REDIS_URL=redis://redis:6379
PGOPTIONS=-c statement_timeout=30000
CATALINA_OPTS=-Xmx1024m
C2C_BROADCAST_PREFIX=broadcast_geoportal_

SENTRY_CLIENT_ENVIRONMENT=${instance}
SENTRY_CLIENT_RELEASE=${sentry_release}
C2C_LOG_VIEW_ENABLED=TRUE
C2C_SQL_PROFILER_ENABLED=TRUE
C2C_DEBUG_VIEW_ENABLED=TRUE
C2C_REQUESTS_DEFAULT_TIMEOUT=120

OSM_PGDATABASE=osm
TILEGENERATION_S3_BUCKET=camptocamp-gmf-demo-tiles
RASTER_BASE_PATH=/var/sig
#AWS_DEFAULT_REGION=unused
#AWS_S3_ENDPOINT=unused

<%include file=".env.secrets" />
