ARG GEOMAPFISH_VERSION
ARG GEOMAPFISH_MAIN_VERSION

FROM camptocamp/geomapfish-tools:${GEOMAPFISH_VERSION} as builder

ENV VARS_FILE=vars.yaml
ENV CONFIG_VARS sqlalchemy.url sqlalchemy.pool_recycle sqlalchemy.pool_size sqlalchemy.max_overflow \
    sqlalchemy.executemany_mode sqlalchemy_slave.url sqlalchemy_slave.pool_recycle sqlalchemy_slave.pool_size \
    sqlalchemy_slave.max_overflow sqlalchemy_slave.executemany_mode schema schema_static enable_admin_interface \
    default_locale_name servers layers cache admin_interface getitfixed functionalities \
    raster shortener hide_capabilities tinyowsproxy resourceproxy print_url print_get_redirect \
    checker check_collector default_max_age package srid \
    reset_password fulltextsearch global_headers headers authorized_referers hooks stats db_chooser \
    dbsessions urllogin host_forward_host headers_whitelist headers_blacklist \
    smtp c2c.base_path welcome_email \
    lingua_extractor interfaces_config interfaces devserver_url api authentication intranet metrics pdfreport \
    vector_tiles i18next

COPY . /tmp/config/

ARG SIMPLE
ENV SIMPLE=$SIMPLE

RUN build-l10n "geomapfish"

ARG PGSCHEMA
ENV PGSCHEMA=$PGSCHEMA

RUN \
    cd /tmp/config/geoportal/ && \
    c2c-template --vars ${VARS_FILE} \
        --get-config geomapfish_geoportal/config.yaml \
        ${CONFIG_VARS} && \
    pykwalify --data-file geomapfish_geoportal/config.yaml \
        --schema-file CONST_config-schema.yaml && \
    rm CONST_* vars.yaml && \
    qgisserver-plugin-config geomapfish_geoportal/config.yaml ../qgisserver/geomapfish.yaml.tmpl

###############################################################################

FROM camptocamp/geomapfish-config:${GEOMAPFISH_MAIN_VERSION} AS gmf_config

ARG PGSCHEMA
ENV PGSCHEMA=$PGSCHEMA

COPY --from=builder /tmp/config/ /tmp/config/

RUN \
    if [ -e /tmp/config/mapserver ]; then mv /tmp/config/mapserver /etc/; fi && \
    if [ -e /tmp/config/tilegeneration ]; then mv /tmp/config/tilegeneration /etc/; fi && \
    if [ -e /tmp/config/qgisserver ]; then mv /tmp/config/qgisserver /etc/qgisserver; fi && \
    if [ -e /tmp/config/haproxy ]; then mv /tmp/config/haproxy/* /etc/haproxy/; fi && \
    mkdir --parent /usr/local/tomcat/webapps/ROOT/ && \
    if [ -e /tmp/config/print ]; then mv /tmp/config/print/print-apps /usr/local/tomcat/webapps/ROOT/; fi && \
    mv /tmp/config/geoportal/geomapfish_geoportal/ /etc/geomapfish/ && \
    mv /tmp/config/geoportal/* /etc/geomapfish/ | true && \
    chmod g+w -R \
        /etc/geomapfish \
        /etc/mapserver \
        /etc/qgisserver \
        /etc/tilegeneration \
        /usr/local/tomcat/webapps/ROOT/print-apps \
        /etc/haproxy_dev \
        /etc/haproxy && \
    adduser www-data root && \
    sed 's#bind :80#bind *:443 ssl crt /etc/haproxy_dev/localhost.pem#g' /etc/haproxy/haproxy.cfg.tmpl \
        > /etc/haproxy_dev/haproxy.cfg.tmpl && \
    echo '    http-request set-header X-Forwarded-Proto https' >> /etc/haproxy_dev/haproxy.cfg.tmpl

VOLUME /etc/geomapfish \
    /etc/mapserver \
    /etc/qgisserver \
    /etc/tilegeneration \
    /usr/local/tomcat/webapps/ROOT/print-apps \
    /etc/haproxy_dev \
    /etc/haproxy

###############################################################################

FROM node:16-slim AS custom-build

WORKDIR /app
COPY package.json ./

RUN npm install

COPY tsconfig.json vite.config.ts ./
COPY webcomponents/ ./webcomponents/
RUN npm run build

###############################################################################

FROM gmf_config AS config
COPY --from=custom-build /app/dist/ /etc/geomapfish/static/custom/
