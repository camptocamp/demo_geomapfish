from hashlib import md5
from typing import TypeVar

from PyQt5.QtCore import QUrl
from qgis.core import QgsMessageLog, QgsProject
from qgis.PyQt.QtCore import QByteArray
from qgis.PyQt.QtXml import QDomDocument
from qgis.server import QgsServerCacheFilter, QgsServerFilter, QgsServerRequest

Hash = TypeVar("Hash")


def serverClassFactory(serverIface):  # noqa
    return HelloServerServer(serverIface)


class HelloFilter(QgsServerFilter):
    def __init__(self, server_iface):
        super().__init__(server_iface)

    def requestReady(self):
        request = self.serverInterface().requestHandler()
        QgsMessageLog.logMessage("HelloFilter.requestReady")
        # request.setRequestHeader("X-Service-Url", "hoh555oho")
        # request.setRequestHeader("TEST", "toto")

        for e in (
            "AUTH_TYPE",
            "CONTENT_LENGTH",
            "CONTENT_TYPE",
            "GATEWAY_INTERFACE",
            "PATH_INFO",
            "PATH_TRANSLATED",
            "QUERY_STRING",
            "REMOTE_ADDR",
            "REMOTE_HOST",
            "REMOTE_IDENT",
            "REMOTE_USER",
            "REQUEST_METHOD",
            "SCRIPT_NAME",
            "SERVER_NAME",
            "SERVER_PORT",
            "SERVER_PROTOCOL",
            "SERVER_SOFTWARE",
            "SCRIPT_FILENAME",
            "REQUEST_URI",
        ):
            QgsMessageLog.logMessage("{}: {}".format(e, self.serverInterface().getEnv(e)))

        uri = self.serverInterface().getEnv("REQUEST_URI")

        qs = self.serverInterface().getEnv("QUERY_STRING")
        questionMark = "" if not qs else "?"
        extraPath = self.serverInterface().getEnv("PATH_INFO") + questionMark + qs

        QgsMessageLog.logMessage("uri: {}".format(uri))
        QgsMessageLog.logMessage("qs: {}".format(qs))
        QgsMessageLog.logMessage("questionMark: {}".format(questionMark))
        QgsMessageLog.logMessage("extraPath: {}".format(extraPath))
        baseUrl = QUrl()
        if uri.endswith(extraPath):
            QgsMessageLog.logMessage("len: {}".format(len(extraPath)))
            baseUrl.setUrl(uri[: -len(extraPath)])
        else:
            baseUrl.setUrl(uri)
        QgsMessageLog.logMessage("baseUrl: {}".format(baseUrl.url()))

    def sendResponse(self):
        QgsMessageLog.logMessage("HelloFilter.sendResponse")

    def responseComplete(self):
        QgsMessageLog.logMessage("HelloFilter.responseComplete")
        request = self.serverInterface().requestHandler()
        QgsMessageLog.logMessage(request.requestHeader("TEST"))
        QgsMessageLog.logMessage(self.serverInterface().getEnv("HTTP_TEST"))


class HelloCache(QgsServerCacheFilter):
    def getCachedDocument(self, project: QgsProject, request: QgsServerRequest, key: str) -> QByteArray:
        # QByteArray(file.read())
        # QByteArray(b"toto")
        return QByteArray()

    def setCachedDocument(
        self, doc: QDomDocument, project: QgsProject, request: QgsServerRequest, key: str
    ) -> bool:

        QgsMessageLog.logMessage("setCachedDocument")
        QgsMessageLog.logMessage(key)
        h = self.get_project_hash(project)
        QgsMessageLog.logMessage(h.hexdigest())
        qs = "&".join("%s=%s" % (k, request.parameters()[k]) for k in sorted(request.parameters().keys()))
        QgsMessageLog.logMessage(qs)
        h.update(qs.encode())
        QgsMessageLog.logMessage(h.hexdigest())
        # doc.toString()
        return False

    def get_project_hash(self, ident: str) -> Hash:
        """Attempt to create a hash from project infos"""
        if not ident:
            raise ValueError("Missing ident value")

        m = md5()
        #        m.update(ident.encode())
        return m


class HelloServerServer:
    def __init__(self, server_iface):
        server_iface.registerFilter(HelloFilter(server_iface), 100)
        server_iface.registerServerCache(HelloCache(server_iface), 100)
