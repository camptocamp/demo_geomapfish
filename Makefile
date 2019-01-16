ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars.yaml
else
VARS_FILE = vars.yaml
VARS_FILES += ${VARS_FILE}
endif

PGSCHEMA ?= main
PGSCHEMA_STATIC ?= main_static

NGEO_INTERFACES ?= desktop mobile desktop_alt mobile_alt oeview oeedit

DOCKER_WEB_HOST ?= geomapfish-demo-dc.camptocamp.com
DOCKER_DATABASE ?= demo_geomapfish
OSM_PGDATABASE ?= osm
TILEGENERATION_S3_BUCKET ?= camptocamp-gmf-demo-tiles
export DOCKER_DATABASE
export DOCKER_PORT
export OSM_PGDATABASE
export TILEGENERATION_S3_BUCKET

WMTSCAPABILITIES_PATH ?= 1.0.0/WMTSCapabilities-docker.xml
export WMTSCAPABILITIES_PATH

include CONST_Makefile

.env: .env.secrets
.env.secrets:
	@echo "Use `make secrets` outside of Docker to get the secrets."
secrets.tar.bz2.gpg: .env.secrets openshift secrets.md
