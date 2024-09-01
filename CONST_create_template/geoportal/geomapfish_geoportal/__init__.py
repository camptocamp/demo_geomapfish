from pyramid.config import Configurator

import geomapfish_geoportal.authentication
import geomapfish_geoportal.dev
import geomapfish_geoportal.multi_organization
from c2cgeoportal_geoportal import add_interface_config, locale_negotiator
from c2cgeoportal_geoportal.lib.i18n import LOCALE_PATH
from geomapfish_geoportal.resources import Root


def main(global_config, **settings):
    """
    This function returns a Pyramid WSGI application.
    """
    del global_config  # Unused

    config = Configurator(
        root_factory=Root,
        settings=settings,
        locale_negotiator=locale_negotiator,
    )

    config.include("c2cgeoportal_commons")

    config.include(geomapfish_geoportal.authentication.includeme)

    config.add_translation_dirs(LOCALE_PATH)

    config.include("c2cgeoportal_geoportal")

    config.include(geomapfish_geoportal.multi_organization.includeme)

    # Scan view decorator for adding routes
    config.scan()

    # Add the interfaces
    for interface in config.get_settings().get("interfaces", []):
        add_interface_config(config, interface)

    config.include(geomapfish_geoportal.dev.includeme)

    return config.make_wsgi_app()
