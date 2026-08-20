# Copyright (c) 2019-2026, Camptocamp SA

import logging
from datetime import datetime, timezone
from typing import Any

from geojson import Feature, FeatureCollection, Point  # type: ignore[import-untyped]
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session  # type: ignore[import-untyped]
from starlette.responses import PlainTextResponse, Response
from custom.config import settings

from custom.views.swisscom_heatmap.tile_id_to_coordinates import tile_id_to_ll

_LOG = logging.getLogger(__name__)

_CLIENT_ID = settings.swisscom_heatmap.client_id
_CLIENT_SECRET = settings.swisscom_heatmap.client_secret
_MIN_DATE = settings.swisscom_heatmap.min_date.strftime("%d.%m.%Y")
_MAX_DATE = settings.swisscom_heatmap.max_date.strftime("%d.%m.%Y")
_MAX_NB_TILES_REQUEST = settings.swisscom_heatmap.max_nb_tiles_request

_BASE_URL = "https://api.swisscom.com/layer/heatmaps/demo"
_TKN_URL = "https://consent.swisscom.com/o/oauth2/token"
_HEADERS = {"scs-version": "2"}  # API version


class ExternalAPIError(Exception):
    pass


class APIUsageExceededError(Exception):
    pass


class SwisscomHeatmapApi:
    error: Response | None = None
    request_date = datetime.now(timezone.utc)
    nb_requests = 0

    @staticmethod
    def parse_date_time(date_time: str) -> datetime:
        return datetime.strptime(date_time, "%d.%m.%YT%H:%M").replace(tzinfo=timezone.utc)

    def get_config(self) -> dict[str, str]:
        return {"minDate": f"{_MIN_DATE}", "maxDate": f"{_MAX_DATE}"}

    def auth(self) -> OAuth2Session:
        # Fetch an access token
        _LOG.warning(_CLIENT_ID)
        client = BackendApplicationClient(client_id=_CLIENT_ID)
        oauth = OAuth2Session(client=client)
        oauth.fetch_token(token_url=_TKN_URL, client_id=_CLIENT_ID, client_secret=_CLIENT_SECRET)
        return oauth

    def get_tiles_ids(self, oauth: OAuth2Session, postal_code: int) -> list[int]:
        # For muni/district id, see https://www.atlas.bfs.admin.ch/maps/13/fr/17804_229_228_227/27579.html
        # Municipalities and Districts doesn't work well probably because of the free plan
        # Get all the first MAX_NB_TILES_REQUEST tile ids associated with the postal code of interest
        muni_tiles_json = oauth.get(_BASE_URL + f"/grids/postal-code-areas/{postal_code}", headers=_HEADERS)
        self.check_api_error(muni_tiles_json)
        tiles = muni_tiles_json.json()["tiles"]
        _LOG.info("Nb tiles received: %s", len(tiles))
        return [t["tileId"] for t in muni_tiles_json.json()["tiles"]][:_MAX_NB_TILES_REQUEST]

    def query_api_generic(
        self,
        oauth: OAuth2Session,
        path: str,
        postal_code: int,
        date_time: datetime,
    ) -> str:
        _LOG.info("Querying with %s, %s, %s", path, postal_code, date_time)
        tile_ids = self.get_tiles_ids(oauth, postal_code)
        return (
            _BASE_URL
            + f"/heatmaps/{path}/{date_time.isoformat()}"
            + "?tiles="
            + "&tiles=".join(map(str, tile_ids))
        )

    def response_to_geojson_result(self, data: dict[str, Any]) -> FeatureCollection:
        features = []
        for element in data["tiles"]:
            coordinate = tile_id_to_ll(element["tileId"])
            features.append(Feature(geometry=Point(coordinate), properties=element))
        return FeatureCollection(features)

    def get_dwell_density(self, postal_code: int, date_time: datetime) -> FeatureCollection | Response:
        self.error = None
        try:
            self.limit_query()
            oauth = self.auth()
            api_request = self.query_api_generic(oauth, "/dwell-density/hourly", postal_code, date_time)
            response = oauth.get(api_request, headers=_HEADERS)
            self.check_api_error(response)
        except (ExternalAPIError, APIUsageExceededError):
            return self.error
        return self.response_to_geojson_result(response.json())

    def get_dwell_demographics(self, postal_code: int, date_time: datetime) -> FeatureCollection | Response:
        self.error = None
        try:
            self.limit_query()
            oauth = self.auth()
            api_request = self.query_api_generic(oauth, "/dwell-demographics/hourly", postal_code, date_time)
            response = oauth.get(api_request, headers=_HEADERS)
            self.check_api_error(response)
        except (ExternalAPIError, APIUsageExceededError):
            return self.error
        return self.response_to_geojson_result(response.json())

    def check_api_error(self, response: Any) -> None:
        if response.status_code != 200:
            err_code = response.status_code
            err_txt = response.text
            _LOG.warning("External API error (code %s): %s", err_code, err_txt)
            self.error = PlainTextResponse(err_txt, status_code=err_code)
            message = "External API error occurred"
            raise ExternalAPIError(message)

    def limit_query(self) -> None:
        """
        Limit amount of allowed queries per day.

        [bgerber] It's rude, but we are using my own key !
        """
        delta = datetime.now(timezone.utc) - self.request_date
        if delta.total_seconds() > 86400:
            self.request_date = datetime.now(timezone.utc)
            self.nb_requests = 0
        self.nb_requests += 1
        _LOG.info("Request today %s", self.nb_requests)
        if self.nb_requests > 500:
            error = "Too many queries today, try again tomorrow"
            self.error = PlainTextResponse(error, status_code=403)
            raise APIUsageExceededError(error)
