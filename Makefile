DOCKER = TRUE
DOCKER_BASE ?= demo
DOCKER_BASE = camptocamp/demo-geomapfish
DEVELOPMENT = TRUE
VARS_FILE = vars_docker.yaml

include demo.mk
