# -*- coding: utf-8 -*-

import logging

from pyramid.i18n import TranslationStringFactory
from formalchemy import FieldSet, Grid  # noqa

from demo import models  # noqa
from c2cgeoportal.forms import *  # noqa

_ = TranslationStringFactory("demo-server")
log = logging.getLogger(__name__)
