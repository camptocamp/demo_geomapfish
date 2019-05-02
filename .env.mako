COMPOSE_PROJECT_NAME=demo_${instance}
PROJECT_DIRECTORY=${project_directory}
DOCKER_PORT=${docker_port}
DOCKER_BASE=${docker_base}
DOCKER_TAG=${docker_tag}
BUILD_VOLUME_NAME=${build_volume_name}
GEOMAPFISH_VERSION=${geomapfish_version}
VISIBLE_WEB_HOST=${docker_host}
VISIBLE_WEB_PROTOCOL=${docker_web_protocol}
VISIBLE_ENTRY_POINT=${docker_entry_point}
PGHOST=${docker_dbhost}
PGHOST_SLAVE=${docker_dbhost_slave}
PGPORT=${docker_dbport}
PGUSER=${docker_dbuser}
PGPASSWORD=${docker_dbpassword}
PGDATABASE=${docker_db}
PGSCHEMA=${docker_schema}
PGSCHEMA_STATIC=${docker_schema_static}
GEOPORTAL_INTERNAL_URL=http://geoportal:8080
TILECLOUDCHAIN_INTERNAL_URL=http://tilecloudchain:8080
MAPCACHE_URL=http://mapcache:8080/mapcache/
MAPSERVER_URL=http://mapserver:8080/
QGISSERVER_URL=http://qgisserver:8080/
TINYOWS_URL=http://tinyows:8080/
PRINT_URL=https://mutualized-print.paas-ch-3.camptocamp.com/print/${mutualized_print_app}/
MEMCACHED_HOST=memcached
MEMCACHED_PORT=11211
REDIS_HOST=redis
REDIS_PORT=6379
TILEGENERATION_SQS_QUEUE=geomapfish-demo-stretch
GUNICORN_PARAMS=--bind=:8080 --worker-class=gthread --threads=10 --workers=1 --timeout=60 --max-requests=1000 --max-requests-jitter=100
DEVSERVER_HOST=webpack_dev_server:8080
C2C_REDIS_URL=redis://redis:6379
PGOPTIONS=-c statement_timeout=30000
CATALINA_OPTS=-Xmx1024m
C2C_BROADCAST_PREFIX=broadcast_geoportal_

C2C_LOG_VIEW_ENABLED=TRUE
C2C_SQL_PROFILER_ENABLED=TRUE
C2C_DEBUG_VIEW_ENABLED=TRUE
C2C_REQUESTS_DEFAULT_TIMEOUT=120

OSM_PGDATABASE=gmf_demo_osm
TILEGENERATION_S3_BUCKET=tiles-gmf-demo
RASTER_BASE_PATH=/vsis3/data-gmf-demo
AWS_DEFAULT_REGION=ch-dk-2
AWS_S3_ENDPOINT=sos-ch-dk-2.exo.io

SENTRY_CLIENT_RELEASE=${geomapfish_version}
SENTRY_CLIENT_ENVIRONMENT=dev

<%include file=".env.secrets" />
