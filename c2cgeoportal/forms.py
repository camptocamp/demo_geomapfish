# -*- coding: utf-8 -*-
import logging
import os

from pyramid.i18n import TranslationStringFactory
from formalchemy import fields
from formalchemy import FieldSet, Grid

from c2cgeoportal import models
from c2cgeoportal.forms import *

_ = TranslationStringFactory('c2cgeoportal')
log = logging.getLogger(__name__)
