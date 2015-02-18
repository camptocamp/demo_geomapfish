ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_geoportailv3.yaml
else
VARS_FILE = vars_demo.yaml
VARS_FILES += ${VARS_FILE}
endif

INSTANCE_ID ?= 1.6
PRINT2 = TRUE
PRINT3 = FALSE

include CONST_Makefile
