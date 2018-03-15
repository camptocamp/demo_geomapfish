ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars.yaml vars_nondocker.yaml
else
VARS_FILE = vars_nondocker.yaml
VARS_FILES += ${VARS_FILE}
endif

export PGDATABASE=demo_geomapfish_2_3

include nondocker-override.mk
