import logging

from pyramid.view import view_config

from c2cgeoportal_commons.models import DBSession
from c2cgeoportal_commons.models.main import OGCServer
from c2cgeoportal_geoportal.views.ogcproxy import OGCProxy
from c2cgeoportal_geoportal.views.mapserverproxy import MapservProxy

LOG = logging.getLogger(__name__)

class CustomMapservProxy(MapservProxy):

    def __init__(self, request): # pylint: disable=super-init-not-called
        OGCProxy.__init__(self, request, has_default_ogc_server=True)
        self.user = self.request.user

        # Set default OGC-Server if is is not set yet
        if not hasattr(self, 'ogc_server') or self.ogc_server is None:
            default_ogc_server = self.request.registry.settings.get('main_ogc_server')
            LOG.info('Default OGC Server : %s', default_ogc_server)
            self.ogc_server = DBSession.query(OGCServer).filter(OGCServer.name == default_ogc_server).one()

    @view_config(route_name="custom_mapserv_proxy")
    @view_config(route_name="custom_mapserv_proxy_post")
    def custom_mapserv_proxy(self):
        return CustomMapservProxy.proxy(self)