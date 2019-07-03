# -*- coding: utf-8 -*-

from qgis.core import QgsMessageLog, Qgis
from qgis.core import QgsLogger

def serverClassFactory(serverIface):  # noqa
    from watermark.plugin import WatermarkPlugin
    return WatermarkPlugin(serverIface)
