ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_demo.yaml
else
VARS_FILE = vars_demo.yaml
VARS_FILES += ${VARS_FILE}
endif

INSTANCE_ID ?= 2.1
APACHE_VHOST ?= geomapfish-demo

include CONST_Makefile
