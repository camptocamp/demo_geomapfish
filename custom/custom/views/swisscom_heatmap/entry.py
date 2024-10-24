import logging
import os
from datetime import datetime

import pyramid.httpexceptions  # type: ignore[import-untyped]
import pyramid.request  # type: ignore[import-untyped]
import pyramid.response  # type: ignore[import-untyped]
from cornice import Service  # type: ignore[import-untyped]
from geojson import FeatureCollection  # type: ignore[import-untyped]

from .query_swisscom_heatmap_api import SwisscomHeatmapApi

LOG = logging.getLogger(__name__)

api = SwisscomHeatmapApi()


swisscom_heatmap_get_config = Service(
    name="swisscom-heatmap-get-config",
    description="The swisscom-heatmap get config service",
    path="/swisscom-heatmap/get-config.json",
    cors_origins=(
        (f'https://{os.environ["VISIBLE_WEB_HOST"]}' if "VISIBLE_WEB_HOST" in os.environ else "*"),
    ),
)


swisscom_heatmap_dwell_density = Service(
    name="swisscom-heatmap-dwell-density",
    description="The swisscom-heatmap dwell density service",
    path="/swisscom-heatmap/dwell-density.json",
    cors_origins=(
        (f'https://{os.environ["VISIBLE_WEB_HOST"]}' if "VISIBLE_WEB_HOST" in os.environ else "*"),
    ),
)


swisscom_heatmap_dwell_demographics = Service(
    name="swisscom-heatmap-dwell-demographics",
    description="The swisscom-heatmap dwell demographics service",
    path="/swisscom-heatmap/dwell-demographics.json",
    cors_origins=(
        (f'https://{os.environ["VISIBLE_WEB_HOST"]}' if "VISIBLE_WEB_HOST" in os.environ else "*"),
    ),
)  # type: ignore[import-untyped]


def entry_get_config(_request: pyramid.request.Request) -> pyramid.response.Response:
    return api.get_config()


def get_params(request: pyramid.request.Request) -> tuple[int, datetime]:
    try:
        postal_code = int(request.params["postal_code"])
        date_time = api.parse_date_time(request.params["date_time"])
    except ValueError as exc:
        raise pyramid.httpexceptions.HTTPBadRequest() from exc
    return postal_code, date_time


@swisscom_heatmap_dwell_density.get(renderer="geojson")
def entry_get_dwell_density(
    request: pyramid.request.Request,
) -> FeatureCollection | pyramid.response.Response:
    postal_code, date_time = get_params(request)
    return api.get_dwell_density(postal_code, date_time)


@swisscom_heatmap_dwell_demographics.get(renderer="geojson")
def entry_get_dwell_demographics(
    request: pyramid.request.Request,
) -> FeatureCollection | pyramid.response.Response:
    postal_code, date_time = get_params(request)
    return api.get_dwell_demographics(postal_code, date_time)
