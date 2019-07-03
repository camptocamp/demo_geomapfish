
from qgis.core import QgsMessageLog, Qgis
from qgis.server import QgsServerFilter
from qgis.PyQt.QtCore import (
    QBuffer,
    QByteArray,
    QIODevice,
    Qt,
    QRect, QPointF
)
from qgis.PyQt.QtGui import (
    QColor,
    QFont,
    QImage,
    QPainter, QPainterPath, QBrush, QPen
)


class WatermarkPlugin():

    def __init__(self, server_iface):
        server_iface.registerFilter(WatermarkFilter(server_iface))


class WatermarkFilter(QgsServerFilter):

    def requestReady(self):
        request = self.serverInterface().requestHandler()
        params = request.parameterMap()

        import pprint
        QgsMessageLog.logMessage(pprint.pformat(params))

    def responseComplete(self):
        request = self.serverInterface().requestHandler()
        params = request.parameterMap()

        # Do some checks
        if (
            params.get('SERVICE', '').upper() == 'WMS' \
            and params.get('REQUEST', '').upper() == 'GETMAP' \
            and not request.exceptionRaised()
        ):
            QgsMessageLog.logMessage("WatermarkFilter.responseComplete: image ready %s" % request.format())

            text = "Arnaud Morvan"

            # Get the image
            img = QImage()
            img.loadFromData(request.body())

            # Adds the watermark
            painter = QPainter(img)
            painter.save()
            painter.setRenderHint(QPainter.Antialiasing)

            font = QFont("Helvetica")
            font.setPointSize(6)

            stroke = QPen(QColor(255, 255, 255, 255))
            stroke.setWidth(3)
            stroke.setCapStyle(Qt.RoundCap)
            stroke.setJoinStyle(Qt.RoundJoin)

            pen = QPen(QColor(0, 0, 0, 255))
            pen.setWidth(1)
            pen.setCapStyle(Qt.RoundCap)
            pen.setJoinStyle(Qt.RoundJoin)
            painter.setPen(pen)

            brush = QBrush(QColor(0, 0, 0, 255))

            for x in range(0, img.width(), 256):
                for y in range(256, img.height() + 256, 256):
                    topleft = QPointF(x + 10, y - 10)
                    path = QPainterPath()
                    path.addText(topleft, font, text)
                    painter.strokePath(path, stroke)
                    painter.fillPath(path, brush)
                    painter.drawPath(path)

            painter.end()

            ba = QByteArray()
            buffer = QBuffer(ba)
            buffer.open(QIODevice.WriteOnly)
            img.save(buffer, "PNG")

            # Set the body
            request.clearBody()
            request.appendBody(ba)

    def log(self, msg, level=Qgis.Info):
        QgsMessageLog.logMessage(msg, 'WatermarkFilter', level=level)
