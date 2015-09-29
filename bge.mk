ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_geoportailv3.yaml
else
VARS_FILE = vars_demo.yaml
VARS_FILES += ${VARS_FILE}
endif

INSTANCE_ID ?= bge
PRINT_VERSION ?= 3
APACHE_VHOST ?= geomapfish-demo

PRINT_INPUT += WEB-INF
PRINT_REQUIREMENT += print/WEB-INF/classes/mapfish-spring-application-context-override.xml

include CONST_Makefile
