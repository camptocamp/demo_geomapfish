INSTANCE_ID = windows
DEVELOPMENT = FALSE

TILECLOUD_CHAIN ?= FALSE
TEST_PACKAGES = FALSE

FIND ?= c:/path/to/cygwin/find.exe

VENV_BIN ?= .build/venv/Scripts
CONST_REQUIREMENT ?= CONST_requirements_windows.txt
CGXP ?= FALSE

APACHE_VHOST ?= your_apache_vhost_folder
APACHE_CONF_DIR ?= C:/path/to/your/$(APACHE_VHOST)/conf
PRINT_OUTPUT ?= C:/path/to/your/Tomcat7/webapps
TOMCAT_SERVICE_COMMAND ?= c:/path/to/your/Tomcat7/bin/Tomcat7.exe
APACHE_GRACEFUL ?= c:/path/to/your/Apache/bin/httpd.exe -k restart -n ApacheMS4WWebServer

include demo.mk
