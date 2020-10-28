# -*- coding: utf-8 -*-

import distutils.core
import codecs
import yaml
import logging
from pyramid.config import Configurator
from c2cgeoportal_geoportal import locale_negotiator, add_interface, INTERFACE_TYPE_NGEO
from c2cgeoportal_geoportal.lib.authentication import create_authentication
from geomapfish_geoportal.resources import Root

LOG = logging.getLogger(__name__)


def main(global_config, **settings):
    """
    This function returns a Pyramid WSGI application.
    """
    del global_config  # Unused

    config = Configurator(
        root_factory=Root, settings=settings,
        locale_negotiator=locale_negotiator,
        authentication_policy=create_authentication(settings)
    )

    # Workaround to not have the error: distutils.errors.DistutilsArgError: no commands supplied
    distutils.core._setup_stop_after = 'config'
    config.include('c2cgeoportal_geoportal')
    distutils.core._setup_stop_after = None

    config.add_translation_dirs('geomapfish_geoportal:locale/')

    # Oereb client integration
    with open(settings.get('oereb_client.cfg')) as f:
        oereb_conf = yaml.load(f.read(), Loader=yaml.BaseLoader)
        settings.update(oereb_conf)

    config.include('oereb_client')

    # Scan view decorator for adding routes
    config.scan()

    # Add the interfaces
    for interface in config.get_settings().get("interfaces", []):
        add_interface(
            config,
            interface['name'],
            interface.get('type', INTERFACE_TYPE_NGEO),
            default=interface.get('default', False)
        )

    try:
        import ptvsd
        ptvsd.enable_attach(address=('172.17.0.1', 5678))
        # ptvsd.wait_for_attach()
    except ModuleNotFoundError as e:
        pass

    return config.make_wsgi_app()
