ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_nondocker.yaml vars.yaml
else
VARS_FILE = vars.yaml
VARS_FILES += ${VARS_FILE} vars_nondocker.yaml
endif

# The hostname use in the browser to open the application
APACHE_VHOST ?= demo_geomapfish
VISIBLE_WEB_HOST ?= demo.com
INSTANCE_ID ?= demo
TILECLOUD_CHAIN ?= TRUE

# Deploy branch
DEPLOY_BRANCH_DIR ?= /var/www/vhosts/$(APACHE_VHOST)/private/deploybranch
GIT_REMOTE_URL ?= git@github.com:camptocamp/demo.git
DEPLOY_BRANCH_BASE_URL ?= $(VISIBLE_PROTOCOL)://$(VISIBLE_HOST)
DEPLOY_BRANCH_MAKEFILE ?= demo.mk


ifeq ($(FINALISE), TRUE)
include nondocker-finalise.mk
else
include nondocker-override.mk
endif
