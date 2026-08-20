FROM ghcr.io/osgeo/gdal:ubuntu-small-3.11.4 AS base-all

# Fail on error on pipe, see: https://github.com/hadolint/hadolint/wiki/DL4006.
# Treat unset variables as an error when substituting.
# Print commands and their arguments as they are executed.
SHELL ["/bin/bash", "-o", "pipefail", "-cux"]

ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

RUN --mount=type=cache,target=/var/lib/apt/lists \
    --mount=type=cache,target=/var/cache,sharing=locked \
    apt-get update \
    && apt-get --assume-yes upgrade

RUN --mount=type=cache,target=/var/lib/apt/lists \
    --mount=type=cache,target=/var/cache,sharing=locked \
    apt-get update \
    && apt-get install --assume-yes --no-install-recommends python3-pip python3-dev python3-venv \
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
LABEL org.opencontainers.image.authors="Camptocamp <info@camptocamp.com>"

# hadolint ignore=SC1091
RUN --mount=type=cache,target=/var/lib/apt/lists \
    --mount=type=cache,target=/var/cache,sharing=locked \
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
COPY pyproject.toml poetry.lock logging.yaml ./
COPY custom/ ./custom/
COPY tests/ ./tests/
COPY pytest.ini ./

RUN --mount=type=cache,target=/root/.cache \
    python3 -m pip install --disable-pip-version-check --no-deps --editable=. \
    && python3 -m compileall -q /app/custom

CMD [ "/venv/bin/uvicorn", "custom:app", "--host=0.0.0.0", "--port=8080", "--log-config=/app/logging.yaml" ]

ARG GIT_HASH
ENV GIT_HASH=${GIT_HASH} \
    C2C__TOOLS__LOGGING__APPLICATION_MODULE=custom
