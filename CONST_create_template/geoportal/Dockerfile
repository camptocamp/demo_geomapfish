FROM camptocamp/geomapfish-tools:2.5 as builder
LABEL maintainer Camptocamp "info@camptocamp.com"

WORKDIR /app
COPY webpack.*.js Makefile CONST_Makefile /app/
COPY demo_geoportal/static-ngeo /app/demo_geoportal/static-ngeo
RUN make apps

COPY . /app

RUN make checks
RUN make build
RUN mv webpack.apps.js webpack.apps.js.tmpl && \
    ln --symbolic /usr/lib/node_modules/ .

ENTRYPOINT [ "/usr/bin/eval-templates" ]
CMD [ "webpack-dev-server", "--mode=development", "--debug", "--watch", "--progress", "--no-inline" ]

###############################################################################

FROM camptocamp/geomapfish:2.5 as runner

COPY requirements.txt /tmp/requirements.txt
RUN \
  python3 -m pip install --disable-pip-version-check --no-cache-dir --requirement=/tmp/requirements.txt && \
  rm --recursive --force /tmp/* /var/tmp/* /root/.cache/*

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
    python3 -m compileall -q /usr/local/lib/python3.7 -x /usr/local/lib/python3.7/dist-packages/dateutils/ && \
    python3 -m compileall -q /app/demo_geoportal -x /app/demo_geoportal/static.*

ARG GIT_HASH
RUN c2cwsgiutils_genversion.py $GIT_HASH

ARG PGSCHEMA
ENV PGSCHEMA=$PGSCHEMA

ENTRYPOINT [ "/usr/bin/eval-templates" ]
CMD ["c2cwsgiutils_run"]
