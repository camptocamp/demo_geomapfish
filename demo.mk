ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_demo.yaml
else
VARS_FILE = vars_demo.yaml
VARS_FILES += ${VARS_FILE}
endif

APACHE_VHOST ?= gmfusrgrp_version2-geomapfishtest

include CONST_Makefile
