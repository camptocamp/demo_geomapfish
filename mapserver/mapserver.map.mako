#
# MapServer Mapfile
#
# Test requests:
#
# WMS GetCapabilities:
# /mapserv?service=wms&version=1.1.1&request=getcapabilities
#
# WMS GetMap:
# /mapserv?service=wms&version=1.1.1&request=getmap&bbox=-180,-90,180,90&layers=countries&width=600&height=400&srs=EPSG:4326&format=image/png
#
# WMS GetFeatureInfo:
# /mapserv?service=wms&version=1.1.1&request=getfeatureinfo&bbox=-180,-90,180,90&layers=countries&query_layers=countries&width=600&height=400&srs=EPSG:4326&format=image/png&x=180&y=90&info_format=application/vnd.ogc.gml
#

MAP
    NAME "demo"

    EXTENT 420000 40500 839000 306400
    UNITS METERS

    # RESOLUTION and DEFRESOLUTION default to 72. If you
    # change RESOLUTION to some other value, also change
    # DEFRESOLUTION. See
    # http://mapserver.org/development/rfc/ms-rfc-55.html
    RESOLUTION 72 ## Also set in Openlayers for especially legends
    DEFRESOLUTION 72

    # MAXSIZE shouldn't be less than 5000 for MF print on A3
    MAXSIZE 5000

    IMAGECOLOR 255 255 255
    STATUS ON

    FONTSET "fonts.conf"
    SYMBOLSET "symbols.sym"

    OUTPUTFORMAT
        NAME jpeg
        DRIVER "AGG/JPEG"
        MIMETYPE "image/jpeg"
        IMAGEMODE RGB
        EXTENSION "jpeg"
        FORMATOPTION "QUALITY=75,PROGRESSIVE=TRUE"
    END

    OUTPUTFORMAT
        NAME png
        DRIVER AGG/PNG
        MIMETYPE "image/png"
        IMAGEMODE RGBA
        EXTENSION "png"
        FORMATOPTION "INTERLACE=OFF"
        FORMATOPTION "QUANTIZE_DITHER=OFF"
        FORMATOPTION "QUANTIZE_FORCE=ON"
        FORMATOPTION "QUANTIZE_COLORS=256"
    END

    PROJECTION
        "init=epsg:21781"
    END

    WEB
        METADATA
            "wms_title" "Démo du c2cgeoportal"
            "wms_abstract" "Des exemples de couches à partir de données OpenData de différentes villes françaises et suisse."
            "wms_onlineresource" "http://${host}/${instanceid}/mapserv_proxy"
            "ows_srs" "EPSG:21781"
            "wms_encoding" "UTF-8"
            "wms_enable_request" "*"
            "wfs_enable_request" "*"
            "wfs_encoding" "UTF-8"
        END
    END

    LEGEND
        KEYSIZE 20 25
        LABEL
            ENCODING "UTF-8"
            TYPE TRUETYPE
            FONT "Arial"
            SIZE 9
        END
    END

    # OSM
    INCLUDE "osm.map"
    INCLUDE "edit.map"
    INCLUDE "private.map"
    INCLUDE "osm-basemap.map"
END
