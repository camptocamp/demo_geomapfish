FROM osgeo/gdal:ubuntu-small-3.2.1 AS base
LABEL maintainer Camptocamp "info@camptocamp.com"

# Fail on error on pipe, see: https://github.com/hadolint/hadolint/wiki/DL4006.
# Treat unset variables as an error when substituting.
# Print commands and their arguments as they are executed.
SHELL ["/bin/bash", "-o", "pipefail", "-cux"]

ENV DEBIAN_FRONTEND=noninteractive \
    SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

# hadolint ignore=SC1091
RUN . /etc/os-release && \
    apt-get update && \
    apt-get install --assume-yes --no-install-recommends \
      python3-pip python3-dev python3-wheel python3-pkgconfig \
      libpq-dev binutils gcc && \
    apt-get clean && \
    rm --recursive --force /var/lib/apt/lists/*

COPY requirements.txt /tmp/
RUN python3 -m pip install --disable-pip-version-check --no-cache-dir --requirement=/tmp/requirements.txt && \
    rm --recursive --force /tmp/*

COPY Pipfile Pipfile.lock /tmp/

RUN cd /tmp && PIP_NO_BINARY=fiona,rasterio,shapely PROJ_DIR=/usr/local/ pipenv sync --system --clear && \
    rm --recursive --force /usr/local/lib/python3.*/dist-packages/tests/ /tmp/* /root/.cache/* && \
    strip /usr/local/lib/python3.*/dist-packages/*/*.so && \
    python3 -m compileall -q /usr/local/lib/python3.* -x '/(ptvsd|pipenv|.*pydev.*|networkx)/'

# hadolint ignore=DL3059
RUN apt-get remove --autoremove --assume-yes gcc

WORKDIR /app
COPY . ./
RUN python3 -m pip install --disable-pip-version-check --no-cache-dir --editable=. && \
    python3 -m compileall -q /app/custom
# hadolint ignore=DL3059
RUN mkdir -p /etc/gunicorn/ && \
  mv gunicorn_config.py /etc/gunicorn/config.py

CMD [ "/usr/local/bin/gunicorn", "--paste", "production.ini" ]

ARG GIT_HASH
ENV GIT_HASH=${GIT_HASH}
