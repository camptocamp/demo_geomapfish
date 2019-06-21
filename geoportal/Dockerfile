FROM camptocamp/geomapfish-build:2.5 as builder
LABEL maintainer Camptocamp "info@camptocamp.com"

ENV NODE_PATH=/usr/lib/node_modules

WORKDIR /app
COPY . /app

RUN make checks
RUN make build
RUN mv webpack.apps.js webpack.apps.js.tmpl && \
    ln --symbolic /usr/lib/node_modules/ .

COPY --from=camptocamp/geomapfish:2.5 /usr/bin/eval-templates /usr/bin/eval-templates
ENTRYPOINT [ "/usr/bin/eval-templates" ]
CMD [ "webpack-dev-server", "--mode=development", "--debug", "--watch", "--progress", "--no-inline" ]

###############################################################################

FROM camptocamp/geomapfish:2.5 as runner

WORKDIR /app
COPY . /app
COPY --from=builder /usr/lib/node_modules/ngeo/dist/* \
    /app/demo_geoportal/static-ngeo/build/
COPY --from=builder /app/demo_geoportal/static-ngeo/build/* \
    /app/demo_geoportal/static-ngeo/build/
COPY --from=builder /app/alembic.ini /app/alembic.yaml ./
RUN chmod go+w /app/demo_geoportal/static-ngeo/build/ \
    /app/demo_geoportal/static-ngeo/api/apihelp/ \
    /app/demo_geoportal/locale/ \
    /app/demo_geoportal/locale/*/LC_MESSAGES/demo_geoportal-client.po

RUN pip install --disable-pip-version-check --no-cache-dir --no-deps --editable=/app/ && \
    python -m compileall -q /app/demo_geoportal -x /app/demo_geoportal/static.*

ARG GIT_HASH
RUN c2cwsgiutils_genversion.py $GIT_HASH

ENV LOG_LEVEL=INFO \
    C2CGEOPORTAL_LOG_LEVEL=WARN

ENTRYPOINT [ "/usr/bin/eval-templates" ]
CMD ["c2cwsgiutils_run"]
