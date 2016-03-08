# -*- coding: utf-8 -*-

import logging

from pyramid.security import DENY_ALL
from pyramid.i18n import TranslationStringFactory

from c2cgeoportal.models import *  # noqa
# from c2cgeoportal.models import _schema

_ = TranslationStringFactory('demo-server')
log = logging.getLogger(__name__)

#LayerV1.__acl__ = [DENY_ALL]
