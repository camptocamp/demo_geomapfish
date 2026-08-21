# Copyright (c) 2019-2026, Camptocamp SA

import logging
from datetime import datetime
from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from geojson import FeatureCollection  # type: ignore[import-untyped]
from starlette.responses import JSONResponse, Response

from custom.views.swisscom_heatmap.query_swisscom_heatmap_api import SwisscomHeatmapApi

LOG = logging.getLogger(__name__)

api = SwisscomHeatmapApi()
app = FastAPI()


def get_params(postal_code: int, date_time: str) -> tuple[int, datetime]:
    """Parse and validate query parameters."""
    try:
        dt = api.parse_date_time(date_time)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return postal_code, dt


@app.get("/get-config.json")
async def entry_get_config() -> dict[str, str]:
    """Get Swisscom heatmap configuration."""
    return api.get_config()


@app.get("/dwell-density.json", response_model=None)
async def entry_get_dwell_density(
    postal_code: Annotated[int, Query()],
    date_time: Annotated[str, Query()],
) -> FeatureCollection | Response:
    """Get dwell density data."""
    pc, dt = get_params(postal_code, date_time)
    result = api.get_dwell_density(pc, dt)
    if isinstance(result, Response):
        return result
    return JSONResponse(content=result)


@app.get("/dwell-demographics.json", response_model=None)
async def entry_get_dwell_demographics(
    postal_code: Annotated[int, Query()],
    date_time: Annotated[str, Query()],
) -> FeatureCollection | Response:
    """Get dwell demographics data."""
    pc, dt = get_params(postal_code, date_time)
    result = api.get_dwell_demographics(pc, dt)
    if isinstance(result, Response):
        return result
    return JSONResponse(content=result)
