import c2cwsgiutils.db
import c2cwsgiutils.health_check
from pyramid.config import Configurator


def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    del global_config  # Unused.
    with Configurator(settings=settings) as config:
        config.include("pyramid_mako")
        config.include("cornice")
        config.include(".routes")
        config.include("c2cwsgiutils.pyramid")
        dbsession = c2cwsgiutils.db.init(config, "sqlalchemy", "sqlalchemy_slave")
        config.scan()
        # Initialize the health checks
        health_check = c2cwsgiutils.health_check.HealthCheck(config)
        health_check.add_db_session_check(dbsession)
    return config.make_wsgi_app()
