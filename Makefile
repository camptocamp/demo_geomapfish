ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars.yaml
else
VARS_FILE = vars.yaml
VARS_FILES += ${VARS_FILE}
endif

NGEO_INTERFACES ?= desktop mobile iframe_api desktop_alt mobile_alt oeview oeedit

export DOCKER_WEB_HOST ?= localhost:8010
export DOCKER_WEB_PROTOCOL ?= http

export DOCKER_PGHOST ?= pg-cluster-master.exo.camptocamp.com
export DOCKER_PGHOST_SLAVE ?= pg-cluster-master.exo.camptocamp.com
export DOCKER_PGDATABASE ?= gmf_demo
export DOCKER_PGSCHEMA ?= main
export DOCKER_PGSCHEMA_STATIC ?= main_static

include CONST_Makefile

.env: .env.secrets
.env.secrets:
	@echo "Use `make secrets` outside of Docker to get the secrets."
secrets.tar.bz2.gpg: .env.secrets openshift/secrets.yaml openshift/ch-3/ secrets.md
