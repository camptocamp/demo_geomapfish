import logging

from pyramid.i18n import TranslationStringFactory

from c2cgeoportal_commons.models.main import *  # noqa: ignore=F401, pylint: disable=unused-wildcard-import

_ = TranslationStringFactory("geomapfish_geoportal-server")
_LOG = logging.getLogger(__name__)
