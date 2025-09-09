import time

import pytest
import requests


@pytest.mark.parametrize(
    "url,params,timeout",
    [
        ("https://front", {}, 10),
        # ("https://front/themes", {}, 120),
        ("https://front/static-geomapfish/0/locales/fr.json", {}, 2),
        ("https://front/dynamic.json", {"interface": "desktop"}, 10),
        (
            "https://front/dynamic.json",
            {"interface": "desktop", "query": "", "path": "/"},
            10,
        ),
        ("https://front/c2c/health_check", {}, 2),
        ("https://front/c2c/health_check", {"max_level": "1"}, 2),
        ("https://front/c2c/health_check", {"checker": "check_collector"}, 2),
        # ("https://front/admin/layertree", {}, 10),
        # ("https://front/admin/layertree/children", {}, 10),
        (
            "http://mapserver:8080/mapserv_proxy/MapServer",
            {"SERVICE": "WMS", "REQUEST": "GetCapabilities"},
            60,
        ),
        (
            "http://mapserver:8080/mapserv_proxy/",
            {"MAP": "MapServer", "SERVICE": "WMS", "REQUEST": "GetCapabilities"},
            60,
        ),
        # (
        #     "https://front/mapserv_proxy",
        #     {"ogcserver": "MapServer", "SERVICE": "WMS", "REQUEST": "GetCapabilities"},
        #     60,
        # ),
        # (
        #     "https://front/mapserv_proxy/MapServer",
        #     {"SERVICE": "WMS", "REQUEST": "GetCapabilities"},
        #     60,
        # ),
        # QGIS Server
        (
            "https://front/mapserv_proxy",
            {
                "ogcserver": "QGIS server",
                "SERVICE": "WMS",
                "REQUEST": "GetCapabilities",
            },
            60,
        ),
        # (
        #     "https://front/mapserv_proxy/QGIS_Server",
        #     {"SERVICE": "WMS", "REQUEST": "GetCapabilities"},
        #     60,
        # ),
        # (
        #     "http://qgisserver:8080/mapserv_proxy/",
        #     {"SERVICE": "WMS", "REQUEST": "GetCapabilities", "MAP": "/etc/qgisserver/project.qgs"},
        #     60,
        # ),
        # (
        #     "https://front/mapserv_proxy",
        #     {"ogcserver": "QGIS_Server", "SERVICE": "WMS", "REQUEST": "GetCapabilities"},
        #     60,
        # ),
        # OGC API - Features
        # (
        #     "http://mapserver:8080/mapserv_proxy/MapServer/ogcapi/collections/osm_protected/items",
        #     {"bbox": "6.0,46.0,7.0,47.0", "limit": "100"},
        #     60,
        # ),
        # (
        #     "https://front/mapserv_proxy/MapServer/ogcapi/collections/osm_open/items",
        #     {"bbox": "6.0,46.0,7.0,47.0", "limit": "100"},
        #     60,
        # ),
        # (
        #     "http://qgisserver:8080/mapserv_proxy/QGIS_Server/wfs3/collections/points/items",
        #     {"map": "/etc/qgisserver/project.qgs", "bbox": "6.0,46.0,7.0,47.0", "limit": "100"},
        #     60,
        # ),
        # (
        #     "https://front/mapserv_proxy/QGIS_Server/wfs3/collections/points/items",
        #     {"bbox": "6.0,46.0,7.0,47.0", "limit": "100"},
        #     60,
        # ),
    ],
)
def test_url(url: str, params: dict[str, str], timeout: int) -> None:
    """Tests that some URL didn't return an error."""
    response = None
    for _ in range(6):
        response = requests.get(url, params=params, verify=False, timeout=timeout)  # nosec
        if response.status_code == 503:
            time.sleep(1)
            continue
        break
    assert response.status_code == 200, response.text
