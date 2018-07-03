ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars.yaml
else
VARS_FILE = vars.yaml
VARS_FILES += ${VARS_FILE}
endif

NGEO_INTERFACES ?= desktop mobile desktop_alt mobile_alt oeview oeedit

# Deploy branch
DEPLOY_BRANCH_DIR ?= /var/www/vhosts/$(APACHE_VHOST)/private/deploybranch
GIT_REMOTE_URL ?= git@github.com:camptocamp/demo.git
DEPLOY_BRANCH_BASE_URL ?= $(VISIBLE_PROTOCOL)://$(VISIBLE_HOST)
DEPLOY_BRANCH_MAKEFILE ?= demo.mk
DOCKER_WEB_HOST ?= geomapfish-demo.camptocamp.com
DOCKER_ENTRY_POINT ?= /docker/

WMTSCAPABILITIES_PATH ?= 1.0.0/WMTSCapabilities-docker.xml
export WMTSCAPABILITIES_PATH

CONFIG_VARS += dbsessions

VISIBLE_WEB_HOST ?= geomapfish-demo.camptocamp.com

include CONST_Makefile

secrets.tar.bz2.gpg: amazonses_smtp.txt amazonses_s3.txt
