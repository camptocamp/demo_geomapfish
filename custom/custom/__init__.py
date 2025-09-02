import c2cwsgiutils.db
import c2cwsgiutils.health_check
from papyrus.renderers import GeoJSON  # type: ignore[import-untyped]
from pyramid.config import Configurator  # type: ignore[import-untyped]
from typing import Any


def main(global_config: dict[str, Any], **settings: Any) -> Any:
    """Get the Pyramid WSGI application."""
    del global_config  # Unused.
    with Configurator(settings=settings) as config:
        config.include("pyramid_mako")
        config.include("cornice")
        config.include(".routes")
        config.include("c2cwsgiutils.pyramid")
        dbsession = c2cwsgiutils.db.init(config, "sqlalchemy", "sqlalchemy_slave")
        config.add_renderer("geojson", GeoJSON())
        config.scan()
        # Initialize the health checks
        health_check = c2cwsgiutils.health_check.HealthCheck(config)
        del dbsession, health_check
        # health_check.add_db_session_check(dbsession)
    return config.make_wsgi_app()
