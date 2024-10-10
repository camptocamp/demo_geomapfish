FROM ghcr.io/osgeo/gdal:ubuntu-small-3.9.2 AS base-all

# Fail on error on pipe, see: https://github.com/hadolint/hadolint/wiki/DL4006.
# Treat unset variables as an error when substituting.
# Print commands and their arguments as they are executed.
SHELL ["/bin/bash", "-o", "pipefail", "-cux"]

ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

RUN --mount=type=cache,target=/var/lib/apt/lists \
    apt-get update

RUN --mount=type=cache,target=/var/lib/apt/lists \
    --mount=type=cache,target=/var/cache,sharing=locked \
    apt-get install --assume-yes --no-install-recommends python3-pip python3-dev python3-venv \
    && python3 -m venv /venv

ENV PATH=/venv/bin:$PATH

FROM base-all AS poetry

WORKDIR /tmp
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache \
    python3 -m pip install --disable-pip-version-check --requirement=requirements.txt \
    && rm requirements.txt

COPY poetry.lock pyproject.toml ./
RUN poetry export --output=requirements.txt \
    && poetry export --with=dev --output=requirements-dev.txt

FROM base-all AS base
LABEL maintainer Camptocamp "info@camptocamp.com"

# hadolint ignore=SC1091
RUN --mount=type=cache,target=/var/cache,sharing=locked \
    --mount=type=cache,target=/root/.cache \
    apt-get update \
    && apt-get install --assume-yes --no-install-recommends \
        libpq-dev binutils gcc

RUN --mount=type=cache,target=/root/.cache \
    --mount=type=bind,from=poetry,source=/tmp,target=/tmp \
    python3 -m pip install --disable-pip-version-check --no-deps --requirement=/tmp/requirements.txt \
    && strip /usr/lib/python3/dist-packages/*/*.so \
    && python3 -m compileall -q /usr/local/lib/python3.* -x '/(ptvsd|.*pydev.*|networkx)/'

# hadolint ignore=DL3059
RUN apt-get remove --autoremove --assume-yes gcc

FROM base AS checks

RUN --mount=type=cache,target=/root/.cache \
    --mount=type=bind,from=poetry,source=/tmp,target=/tmp \
    python3 -m pip install --disable-pip-version-check --no-deps --requirement=/tmp/requirements-dev.txt

WORKDIR /app
COPY . ./
RUN --mount=type=cache,target=/root/.cache \
    python3 -m pip install --disable-pip-version-check --no-deps --editable=. \
    && python3 -m compileall -q /app/custom

FROM base AS runtime

WORKDIR /app
COPY . ./
RUN --mount=type=cache,target=/root/.cache \
    python3 -m pip install --disable-pip-version-check --no-deps --editable=. \
    && python3 -m compileall -q /app/custom

CMD [ "/venv/bin/gunicorn", "--paste=production.ini" ]

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
