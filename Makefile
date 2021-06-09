ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars.yaml
else
VARS_FILE = vars.yaml
VARS_FILES += ${VARS_FILE}
endif

NGEO_INTERFACES ?= desktop mobile iframe_api desktop_alt mobile_alt oeview oeedit
CGXP_XAPI ?= FALSE
CGXP_API ?= FALSE

export DOCKER_WEB_PROTOCOL ?= http
MUTUALIZED_PRINT_APP ?= demo_geomapfish_24

export DOCKER_PGHOST ?= pg-gs.camptocamp.com
export DOCKER_PGHOST_SLAVE ?= pg-gs.camptocamp.com
export DOCKER_PGPORT ?= 30100
export DOCKER_PGPORT_SLAVE ?= 30101
export DOCKER_PGDATABASE ?= gmf_demo
export PGSCHEMA ?= main_2_4
export DOCKER_PGSCHEMA ?= main_2_4
export DOCKER_PGSCHEMA_STATIC ?= static_2_4

GPG_KEYS += EBD91808C5BF727FC1E764FE9542AD34ABE74D6E # Yves Jacolin

include CONST_Makefile

.env: .env.secrets
.env.secrets:
	@echo "Use `make secrets` outside of Docker to get the secrets."
secrets.tar.bz2.gpg: .env.secrets secrets.md
