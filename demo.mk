ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars.yaml vars_nondocker.yaml
else
VARS_FILE = vars_nondocker.yaml
VARS_FILES += ${VARS_FILE}
endif
APACHE_VHOST = geomapfish-demo
export VISIBLE_WEB_HOST=geomapfish-demo.camptocamp.com

export PGDATABASE=demo_geomapfish_2_3

ifeq ($(FINALISE), TRUE)
include nondocker-finalise.mk
else
include nondocker-override.mk
endif
