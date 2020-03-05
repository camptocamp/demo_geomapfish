ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars.yaml
else
VARS_FILE = vars.yaml
VARS_FILES += ${VARS_FILE}
endif

NGEO_INTERFACES ?= desktop mobile iframe_api desktop_alt mobile_alt oeview oeedit
CGXP_XAPI ?= TRUE

export DOCKER_WEB_PROTOCOL ?= http
MUTUALIZED_PRINT_APP ?= demo_geomapfish_24

export DOCKER_PGHOST ?= pg-cluster-master.exo.camptocamp.com
export DOCKER_PGHOST_SLAVE ?= pg-cluster-master.exo.camptocamp.com
export DOCKER_PGDATABASE ?= gmf_demo
export DOCKER_PGSCHEMA ?= main_2_4
export DOCKER_PGSCHEMA_STATIC ?= static_2_4

include CONST_Makefile

.env: .env.secrets
.env.secrets:
	@echo "Use `make secrets` outside of Docker to get the secrets."
secrets.tar.bz2.gpg: .env.secrets secrets.md
