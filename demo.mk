ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_geoportailv3.yaml
else
VARS_FILE = vars_demo.yaml
VARS_FILES += ${VARS_FILE}
endif

INSTANCE_ID ?= 1.6
PRINT_VERSION ?= 3
APACHE_VHOST ?= geomapfish-demo

include CONST_Makefile
