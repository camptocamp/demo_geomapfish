ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_prospection.yaml vars_demo.yaml
else
VARS_FILE = vars_prospection.yaml
VARS_FILES += ${VARS_FILE} vars_demo.yaml
endif

INSTANCE_ID = viewer
#APACHE_ENTRY_POINT ?= /
APACHE_VHOST = geomapfish
PRINT_VERSION = 3

PRINT_INPUT += WEB-INF
PRINT_REQUIREMENT += print/WEB-INF/classes/mapfish-spring-application-context-override.xml

include CONST_Makefile
