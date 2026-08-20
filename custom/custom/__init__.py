"""FastAPI application entry point."""

import logging
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import c2casgiutils
import c2casgiutils.config
import c2casgiutils.headers
import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from prometheus_client import start_http_server
from prometheus_fastapi_instrumentator import Instrumentator

from custom.views import cog
from custom.views.swisscom_heatmap import entry as swisscom_heatmap

_LOG = logging.getLogger(__name__)

if c2casgiutils.config.settings.sentry.dsn or "SENTRY_DSN" in os.environ:
    _LOG.info(
        "Sentry is enabled with URL: %s",
        c2casgiutils.config.settings.sentry.dsn or os.environ.get("SENTRY_DSN"),
    )
    sentry_sdk.init(
        **{
            k: v
            for k, v in c2casgiutils.config.settings.sentry.model_dump().items()
            if v is not None and k != "tags"
        },
    )

    for tag, value in c2casgiutils.config.settings.sentry.tags.items():
        sentry_sdk.set_tag(tag, value)


@asynccontextmanager
async def _lifespan(main_app: FastAPI) -> AsyncIterator[None]:
    _LOG.info("Starting the application")
    await c2casgiutils.startup(main_app)

    if c2casgiutils.config.settings.prometheus.port > 0:
        start_http_server(c2casgiutils.config.settings.prometheus.port)

    yield
    _LOG.info("Application stopped")


app = FastAPI(title="Custom", lifespan=_lifespan)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    c2casgiutils.headers.ArmorHeaderMiddleware,
    headers_config={
        "http": {"headers": {"Strict-Transport-Security": None} if c2casgiutils.config.settings.http else {}},
    },
)

if c2casgiutils.config.settings.proxy_headers.type != "none":
    app.add_middleware(
        c2casgiutils.headers.ForwardedHeadersMiddleware,
        trusted_hosts=c2casgiutils.config.settings.proxy_headers.trusted_hosts,
        headers_type=c2casgiutils.config.settings.proxy_headers.type,
    )

app.mount(f"{c2casgiutils.config.settings.route_prefix}c2c", c2casgiutils.app)

instrumentator = Instrumentator(should_instrument_requests_inprogress=True)
instrumentator.instrument(app)

app.mount(f"{c2casgiutils.config.settings.route_prefix}cog", cog.app)
app.mount(f"{c2casgiutils.config.settings.route_prefix}swisscom-heatmap", swisscom_heatmap.app)
