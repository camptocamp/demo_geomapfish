ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars_geoportailv3.yaml
else
VARS_FILE = vars_demo.yaml
VARS_FILES += ${VARS_FILE}
endif

PRINT2 = TRUE
PRINT3 = FALSE
CONFIG_VARS += banner_image \
	banner_height \
	ortho_opacity

include CONST_Makefile
