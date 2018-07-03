ifdef VARS_FILE
VARS_FILES += ${VARS_FILE} vars.yaml vars_nondocker.yaml
else
VARS_FILE = vars.yaml
VARS_FILES += ${VARS_FILE} vars_nondocker.yaml
endif
APACHE_VHOST = geomapfish-demo
INSTANCE_ID ?= demo
VISIBLE_WEB_HOST ?= geomapfish-demo.camptocamp.com

DEV_SERVER_PORT ?= 808
export DEV_SERVER_PORT

PGDATABASE ?= demo_geomapfish_2_3
export PGDATABASE

NGEO_INTERFACES ?= desktop mobile desktop_alt mobile_alt oeview oeedit

ifeq ($(FINALISE), TRUE)
include nondocker-finalise.mk
else
include nondocker-override.mk
endif

GPG_KEYS += D1D6A94C # Stéphane Brunner
GPG_KEYS += B42AF223 # Patrick Valsecchi
GPG_KEYS += C27D570B # Roman Zoller
GPG_KEYS += CF8E9976 # Guillaume Beraudo
GPG_KEYS += 3EA11D26 # Elisabeth Leu
GPG_KEYS += 0875810F # Frederic Junod
GPG_KEYS += 1DAFEE6A # Oliver Christen

secrets.bz2.gpg: amazonses_smtp.txt
	tar -jcf secrets.bz2 $^
	gpg --keyserver pgp.mit.edu --keyserver-options timeout=20 --recv-keys $(GPG_KEYS)
	rm -f $@
	gpg --always-trust --output $@ --encrypt $(addprefix --recipient ,$(GPG_KEYS)) secrets.bz2

secrets:
	gpg --output secrets.bz2 --decrypt secrets.bz2.gpg
	tar -jxf secrets.bz2
	touch $@
