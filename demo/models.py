# -*- coding: utf-8 -*-

import logging

from pyramid.security import DENY_ALL
from pyramid.i18n import TranslationStringFactory

from c2cgeoportal.models import *  # noqa
# from c2cgeoportal.models import _schema

_ = TranslationStringFactory('demo')
log = logging.getLogger(__name__)

LayerInternalWMS.__acl__ = [DENY_ALL]
LayerExternalWMS.__acl__ = [DENY_ALL]
LayerWMTS.__acl__ = [DENY_ALL]
WMTSDimension.__acl__ = [DENY_ALL]
