# -*- coding: utf-8 -*-

import logging

import sqlahelper
from pyramid.security import DENY_ALL
from pyramid.i18n import TranslationStringFactory

from c2cgeoportal.models import *  # noqa
from c2cgeoportal.models import DBSessions

_ = TranslationStringFactory("demo-server")
log = logging.getLogger(__name__)

try:
    sqlahelper.get_engine("osm")
    OsmSession = sessionmaker(bind=osm_engine)
    DBSessions["osm"] = OsmSession
except RuntimeError:
    pass  # for i18n string collection

LayerV1.__acl__ = [DENY_ALL]
