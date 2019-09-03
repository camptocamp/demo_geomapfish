FROM camptocamp/geomapfish-build:2.5 as builder
LABEL maintainer Camptocamp "info@camptocamp.com"

ENV NODE_PATH=/usr/lib/node_modules

WORKDIR /app
COPY . /app

RUN make checks
RUN make build
RUN mv webpack.apps.js webpack.apps.js.tmpl && \
    ln --symbolic /usr/lib/node_modules/ .

ENTRYPOINT [ "/usr/bin/eval-templates" ]
CMD [ "webpack-dev-server", "--mode=development", "--debug", "--watch", "--progress", "--no-inline" ]

###############################################################################

FROM camptocamp/geomapfish:2.5 as runner

WORKDIR /app
COPY . /app
COPY --from=builder /usr/lib/node_modules/ngeo/dist/* \
    /etc/static-ngeo/
COPY --from=builder /etc/static-ngeo/* /etc/static-ngeo/
COPY --from=builder /app/alembic.ini /app/alembic.yaml ./
RUN chmod go+w /etc/static-ngeo/ \
    /app/demo_geoportal/locale/ \
    /app/demo_geoportal/locale/*/LC_MESSAGES/demo_geoportal-client.po

RUN pip install --disable-pip-version-check --no-cache-dir --no-deps --editable=/app/ && \
    python -m compileall -q /app/demo_geoportal -x /app/demo_geoportal/static.*

ARG GIT_HASH
RUN c2cwsgiutils_genversion.py $GIT_HASH

ARG PGSCHEMA
ENV PGSCHEMA=$PGSCHEMA

ENTRYPOINT [ "/usr/bin/eval-templates" ]
CMD ["c2cwsgiutils_run"]
