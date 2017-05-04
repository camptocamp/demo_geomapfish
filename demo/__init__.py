# -*- coding: utf-8 -*-

from sqlalchemy import create_engine
from sqlalchemy.orm.session import sessionmaker
import sqlahelper
from pyramid.config import Configurator
from c2cgeoportal.pyramid_ import locale_negotiator, add_interface, INTERFACE_TYPE_NGEO
from c2cgeoportal.lib.authentication import create_authentication
from demo.resources import Root


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(
        root_factory=Root, settings=settings,
        locale_negotiator=locale_negotiator,
        authentication_policy=create_authentication(settings)
    )

    config.include("c2cgeoportal")

    config.add_translation_dirs("demo:locale/")

    osm_engine = create_engine(config.get_settings().get("dbsessions").get("osm").get("url"))
    sqlahelper.add_engine(osm_engine, "osm")
    osm_session = sessionmaker()
    from c2cgeoportal.models import DBSessions
    DBSessions["osm"] = osm_session(bind=osm_engine)

    # scan view decorator for adding routes
    config.scan()

    # add the interfaces
    add_interface(config, "desktop", INTERFACE_TYPE_NGEO)
    add_interface(config, "mobile", INTERFACE_TYPE_NGEO)
    add_interface(config, "edit")
    add_interface(config, "routing")

    return config.make_wsgi_app()
