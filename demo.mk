ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_demo.yaml
else
VARS_FILE = vars_demo.yaml
VARS_FILES += ${VARS_FILE}
endif

INSTANCE_ID ?= 2.0
APACHE_VHOST ?= geomapfish-demo
NGEO ?= TRUE

include CONST_Makefile
