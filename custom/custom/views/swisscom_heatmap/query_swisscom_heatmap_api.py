import logging
import os
from datetime import datetime
from typing import Any, List

from oauthlib.oauth2 import BackendApplicationClient
from pyramid.response import Response
from requests_oauthlib import OAuth2Session

from .tile_id_to_coordinates import tile_id_to_ll

LOG = logging.getLogger(__name__)

CLIENT_ID = os.getenv("SWISSCOM_CLIENT_ID", "")  # customer key in the Swisscom digital marketplace
CLIENT_SECRET = os.getenv("SWISSCOM_CLIENT_SECRET", "")  # customer secret in the Swisscom digital marketplace
MIN_DATE = os.getenv("MIN_DATE", "03.10.2022")
MAX_DATE = os.getenv("MAX_DATE", "16.10.2022")
MAX_NB_TILES_REQUEST = int(os.getenv("MAX_NB_TILES_REQUEST", "100"))

BASE_URL = "https://api.swisscom.com/layer/heatmaps/demo"
TKN_URL = "https://consent.swisscom.com/o/oauth2/token"
HEADERS = {"scs-version": "2"}  # API version


class ExternalAPIError(Exception):
    pass


class APIUsageExceededError(Exception):
    pass


class SwisscomHeatmapApi:
    error: Response = None
    request_date = datetime.now()
    nb_requests = 0

    @staticmethod
    def parse_date_time(date_time: str) -> datetime:
        return datetime.strptime(date_time, "%d.%m.%YT%H:%M")

    def get_config(self) -> dict[str, str]:
        return {"minDate": f"{MIN_DATE}", "maxDate": f"{MAX_DATE}"}

    def auth(self) -> OAuth2Session:
        # Fetch an access token
        client = BackendApplicationClient(client_id=CLIENT_ID)
        oauth = OAuth2Session(client=client)
        oauth.fetch_token(token_url=TKN_URL, client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
        return oauth

    def get_tiles_ids(self, oauth: OAuth2Session, postal_code: int) -> list[int]:
        # For muni/district id, see https://www.atlas.bfs.admin.ch/maps/13/fr/17804_229_228_227/27579.html
        # Municipalities and Districts doesn't work well probably because of the free plan
        # Get all the first MAX_NB_TILES_REQUEST tile ids associated with the postal code of interest
        muni_tiles_json = oauth.get(BASE_URL + f"/grids/postal-code-areas/{postal_code}", headers=HEADERS)
        self.check_api_error(muni_tiles_json)
        tiles = muni_tiles_json.json()["tiles"]
        LOG.info("Nb tiles received: %s", len(tiles))
        return [t["tileId"] for t in muni_tiles_json.json()["tiles"]][:MAX_NB_TILES_REQUEST]

    def query_api_generic(
        self, oauth: OAuth2Session, path: str, postal_code: int, date_time: datetime
    ) -> str:
        LOG.info("Querying  with %s, %s, %s", path, postal_code, date_time)
        tile_ids = self.get_tiles_ids(oauth, postal_code)
        return (
            BASE_URL
            + f"/heatmaps/{path}/{date_time.isoformat()}"
            + "?tiles="
            + "&tiles=".join(map(str, tile_ids))
        )

    def response_to_geojson_result(self, data: dict[str, Any]) -> dict[str, str | list]:
        geo_content = {"type": "FeatureCollection", "features": []}
        for element in data["tiles"]:
            coordinate = tile_id_to_ll(element["tileId"])
            geo_content["features"].append(
                {
                    "type": "Feature",
                    "properties": element,
                    "geometry": {"type": "Point", "coordinates": list(coordinate)},
                }
            )
        return geo_content

    def get_dwell_density(self, postal_code: int, date_time: datetime) -> dict[str, Any] | Response:
        self.error = None
        try:
            self.limit_query()
            oauth = self.auth()
            api_request = self.query_api_generic(oauth, "/dwell-density/hourly", postal_code, date_time)
            response = oauth.get(api_request, headers=HEADERS)
            self.check_api_error(response)
        except (ExternalAPIError, APIUsageExceededError):
            return self.error
        return self.response_to_geojson_result(response.json())

    def get_dwell_demographics(self, postal_code: int, date_time: datetime) -> dict[str, Any] | Response:
        self.error = None
        try:
            self.limit_query()
            oauth = self.auth()
            api_request = self.query_api_generic(oauth, "/dwell-demographics/hourly", postal_code, date_time)
            response = oauth.get(api_request, headers=HEADERS)
            self.check_api_error(response)
        except (ExternalAPIError, APIUsageExceededError):
            return self.error
        return self.response_to_geojson_result(response.json())

    def check_api_error(self, response: Response):
        if response.status_code != 200:
            err_code = response.status_code
            err_txt = response.text
            LOG.warning("External API error (code %s): %s", err_code, err_txt)
            self.error = Response(err_txt, status=err_code)
            raise ExternalAPIError("External api error")

    def limit_query(self):
        now = datetime.now()
        if now.day > self.request_date.day:
            self.nb_requests = 0
        self.nb_requests += 1
        LOG.info("Request today %s", self.nb_requests)
        if self.nb_requests > 500:
            # [bgerber] It's rude, but we are using my own key !
            error = "Too much query today, try again tomorrow"
            self.error = Response(error, status=403)
            raise APIUsageExceededError(error)
