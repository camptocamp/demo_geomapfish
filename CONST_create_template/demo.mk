ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_demo.yaml
else
VARS_FILE = vars_demo.yaml
VARS_FILES += ${VARS_FILE}
endif

APACHE_VHOST ?= demo_geomapfish
INSTANCE_ID ?= demo_geomapfish
TILECLOUD_CHAIN ?= FALSE

include CONST_Makefile
