FROM osgeo/gdal:ubuntu-small-3.5.0 AS base
LABEL maintainer Camptocamp "info@camptocamp.com"

# Fail on error on pipe, see: https://github.com/hadolint/hadolint/wiki/DL4006.
# Treat unset variables as an error when substituting.
# Print commands and their arguments as they are executed.
SHELL ["/bin/bash", "-o", "pipefail", "-cux"]

# SETUPTOOLS_USE_DISTUTILS: Workaround for setuptools >= 60.0.0
ENV DEBIAN_FRONTEND=noninteractive \
    SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
    SETUPTOOLS_USE_DISTUTILS=stdlib

# hadolint ignore=SC1091
RUN apt-get update && \
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
    rm --recursive --force /usr/local/lib/python3.*/dist-packages/tests/ /root/.cache/* && \
    strip /usr/local/lib/python3.*/dist-packages/*/*.so && \
    python3 -m compileall -q /usr/local/lib/python3.* -x '/(ptvsd|pipenv|.*pydev.*|networkx)/'

# hadolint ignore=DL3059
RUN apt-get remove --autoremove --assume-yes gcc

FROM base AS lint

RUN cd /tmp && pipenv sync --system --clear --dev && \
    rm --recursive --force /usr/local/lib/python3.*/dist-packages/tests/ /root/.cache/*

WORKDIR /app
COPY . ./
RUN python3 -m pip install --disable-pip-version-check --no-cache-dir --editable=. && \
    python3 -m compileall -q /app/custom && \
    prospector --output=pylint -X . && \
    touch /tmp/lint.ok


FROM base AS runtime

# Force to urn the lint with BUILD KIT
COPY --from=lint /tmp/lint.ok /tmp/

WORKDIR /app
COPY . ./
RUN python3 -m pip install --disable-pip-version-check --no-cache-dir --editable=. && \
    python3 -m compileall -q /app/custom

CMD [ "/usr/local/bin/gunicorn", "--paste=production.ini" ]

ARG GIT_HASH
ENV GIT_HASH=${GIT_HASH}

RUN c2cwsgiutils-genversion ${GIT_HASH}

# Default values for the environment variables
ENV \
    DEVELOPMENT=0 \
    SQLALCHEMY_POOL_RECYCLE=30 \
    SQLALCHEMY_POOL_SIZE=5 \
    SQLALCHEMY_MAX_OVERFLOW=25 \
    SQLALCHEMY_SLAVE_POOL_RECYCLE=30 \
    SQLALCHEMY_SLAVE_POOL_SIZE=5 \
    SQLALCHEMY_SLAVE_MAX_OVERFLOW=25 \
    LOG_TYPE=console \
    OTHER_LOG_LEVEL=WARNING \
    GUNICORN_LOG_LEVEL=WARNING \
    GUNICORN_ACCESS_LOG_LEVEL=INFO \
    SQL_LOG_LEVEL=WARNING \
    C2CWSGIUTILS_LOG_LEVEL=WARNING \
    LOG_LEVEL=INFO
