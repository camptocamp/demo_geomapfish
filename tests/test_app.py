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
        ("https://front/dynamic.json", {"interface": "desktop", "query": "", "path": "/"}, 10),
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
        #     "http://qgisserver:8080/mapserv_proxy/qgisserver/ogcapi/collections/points/items",
        #     {"map": "/etc/qgisserver/project.qgs", "bbox": "6.0,46.0,7.0,47.0", "limit": "100"},
        #     60,
        # ),
        # (
        #     "https://front/mapserv_proxy/qgisserver/ogcapi/collections/points/items",
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


@pytest.mark.parametrize(
    "interface",
    [
        "desktop_geogirafe",
        "mobile_geogirafe",
        "iframe_api_geogirafe",
    ],
)
def test_geogirafe_application(interface: str) -> None:
    """
    Tests that the GeoGirafe application pages are served and that the main component is present.

    Since the version 1.1.0 of @geogirafe/lib-geoportal, the application content must be wrapped in a
    <girafe-app> component, otherwise the application does not start at all (an empty splash screen is
    displayed), and that is not detectable with a simple HTTP status code.
    """
    response = requests.get(f"https://front/{interface}", verify=False, timeout=30)  # nosec
    assert response.status_code == 200, response.text
    assert "<girafe-app>" in response.text, response.text


@pytest.mark.parametrize(
    "asset",
    [
        # Copied from @geogirafe/lib-geoportal by vite-plugin-static-copy, which changed the way it
        # calculates the destination path in its version 4.
        "styles/common.css",
        "icons/info.svg",
        "i18n/en.json",
        "service-worker.js",
        "silentlogincallback.html",
        # Coming from the build, needed by the 3D map.
        "lib/cesium/Widgets/widgets.css",
        # Coming from the public folder of the GeoGirafe application.
        "images/logo/horizontal_black.svg",
    ],
)
def test_geogirafe_static_asset(asset: str) -> None:
    """
    Tests that a static asset of the GeoGirafe application is served.

    A missing file is answered with a 404 by the application, which is how the wrong destination paths of
    the version 4 of vite-plugin-static-copy were detected.
    """
    response = requests.get(
        f"https://front/static-frontend/geogirafe/{asset}",
        verify=False,
        timeout=30,
    )  # nosec
    assert response.status_code == 200, response.text


def test_geogirafe_service_worker_header() -> None:
    """
    Tests that the GeoGirafe service worker script is served with the Service-Worker-Allowed header.

    The interfaces are served at the root of the site but the service worker is served below
    /static-frontend/geogirafe/, so it is registered with the '/' scope, which the browser only
    allows if the script response has this header.
    """
    response = requests.get(
        "https://front/static-frontend/geogirafe/service-worker.js",
        verify=False,
        timeout=30,
    )  # nosec
    assert response.status_code == 200, response.text
    assert response.headers.get("Service-Worker-Allowed") == "/"


def test_geogirafe_content_security_policy() -> None:
    """
    Tests that the Content-Security-Policy of the GeoGirafe interfaces allows the GeoGirafe news feed.

    The news component fetches https://geogirafe.org/feed/atom/ (news.urls of the GeoGirafe
    configuration), a blocked fetch makes the application report an error with an unreadable stack trace.
    The connect-src directive is parsed into its source tokens and checked with exact equality, instead
    of an arbitrary substring match of the whole header.
    """
    response = requests.get("https://front/desktop_geogirafe", verify=False, timeout=30)  # nosec
    assert response.status_code == 200, response.text
    csp = response.headers.get("Content-Security-Policy", "")
    connect_src = [
        source
        for directive in csp.split(";")
        for tokens in [directive.split()]
        for source in tokens[1:]
        if tokens[:1] == ["connect-src"]
    ]
    assert any(source == "https://geogirafe.org/" for source in connect_src), csp
