ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars.yaml
else
VARS_FILE = vars.yaml
VARS_FILES += ${VARS_FILE}
endif

# Deploy branch
DEPLOY_BRANCH_DIR ?= /var/www/vhosts/$(APACHE_VHOST)/private/deploybranch
GIT_REMOTE_URL ?= git@github.com:camptocamp/demo.git
DEPLOY_BRANCH_BASE_URL ?= $(VISIBLE_PROTOCOL)://$(VISIBLE_HOST)
DEPLOY_BRANCH_MAKEFILE ?= demo.mk

CONFIG_VARS += dbsessions

UPGRADE_ARGS += --nondocker --new-makefile=sbrunner.mk

include CONST_Makefile
