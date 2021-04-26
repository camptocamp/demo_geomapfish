# -*- coding: utf-8 -*-

import distutils.core

from pyramid.config import Configurator

from c2cgeoportal_geoportal import INTERFACE_TYPE_NGEO, add_interface, locale_negotiator
from c2cgeoportal_geoportal.lib import C2CPregenerator
from c2cgeoportal_geoportal.lib.authentication import create_authentication
from demo_geoportal.resources import Root


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

    # Custom routes (overwrite mapserv_proy before loading standard GMF routes)
    config.add_route("custom_mapserv_proxy", "/mapserv_proxy", mapserverproxy=True, pregenerator=C2CPregenerator(role=True), request_method="GET")
    config.add_route("custom_mapserv_proxy_post", "/mapserv_proxy", mapserverproxy=True, pregenerator=C2CPregenerator(role=True), request_method="POST")

    # Workaround to not have the error: distutils.errors.DistutilsArgError: no commands supplied
    distutils.core._setup_stop_after = 'config'
    config.include('c2cgeoportal_geoportal')
    distutils.core._setup_stop_after = None

    config.add_translation_dirs('demo_geoportal:locale/')
    config.add_route('metrics', '/metrics')

    # scan view decorator for adding routes
    config.scan()

    # add the interfaces
    add_interface(config, 'desktop', INTERFACE_TYPE_NGEO, default=True)
    add_interface(config, 'mobile', INTERFACE_TYPE_NGEO)
    add_interface(config, 'iframe_api', INTERFACE_TYPE_NGEO)
    add_interface(config, 'desktop_alt', INTERFACE_TYPE_NGEO)
    add_interface(config, 'mobile_alt', INTERFACE_TYPE_NGEO)
    add_interface(config, 'oeview', INTERFACE_TYPE_NGEO)
    add_interface(config, 'oeedit', INTERFACE_TYPE_NGEO)

    return config.make_wsgi_app()
