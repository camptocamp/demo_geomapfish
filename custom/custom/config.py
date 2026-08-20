# Copyright (c) 2026, Camptocamp SA
"""The configuration environment variables."""

import logging
from datetime import date

from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

_LOGGER = logging.getLogger(__name__)


class SwisscomHeatmap(BaseModel):
    client_id: str
    client_secret: str
    min_date: date = date.fromisoformat("2022-10-03")
    max_date: date = date.fromisoformat("2022-10-16")
    max_nb_tiles_request: int = 100


class Settings(BaseSettings, extra="ignore"):
    """The configuration settings."""

    swisscom_heatmap: SwisscomHeatmap

    model_config = SettingsConfigDict(env_prefix="CUSTOM__", env_nested_delimiter="__")


settings = Settings()
