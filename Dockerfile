FROM tianon/true

COPY nginx /etc/nginx/cond.d
VOLUME /etc/nginx/cond.d

COPY mapserver /etc/mapserver
VOLUME /etc/mapserver

COPY mapcache /mapcache
VOLUME /mapcache

COPY tilegeneration /tilecloudchain
VOLUME /tilecloudchain

COPY print/print-app /usr/local/tomcat/webapps/ROOT/print-app
VOLUME /usr/local/tomcat/webapps/ROOT/print-app
