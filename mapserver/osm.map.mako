## -*- coding: utf-8 -*-

<%!
layers = [{
    "column": "amenity",
    "value": "fuel",
    "type": "fuel",
    "name": u"Stations service"
}, {
    "column": "tourism",
    "value": "hotel",
    "type": "hotel",
    "name": u"Hôtels"
}, {
    "column": "tourism",
    "value": "information",
    "type": "information",
    "name": u"Informations"
}, {
    "column": "amenity",
    "value": "cinema",
    "type": "cinema",
    "name": u"Cinémas"
}, {
    "column": "tourism",
    "value": "alpine_hut",
    "type": "alpine_hut",
    "name": u"Cabanes alpines"
}, {
    "column": "amenity",
    "value": "bank",
    "type": "bank",
    "name": u"Banques"
}, {
    "column": "highway",
    "value": "bus_stop",
    "type": "bus_stop",
    "name": u"Arrêts de bus"
}, {
    "column": "amenity",
    "value": "cafe",
    "type": "cafe",
    "name": u"Cafés"
}, {
    "column": "amenity",
    "value": "parking",
    "type": "parking",
    "name": u"Parkings"
}, {
    "column": "amenity",
    "value": "place_of_worship",
    "type": "place_of_worship",
    "name": u"Lieux de culte"
}, {
    "column": "amenity",
    "value": "police",
    "type": "police",
    "name": u"Postes de police"
}, {
    "column": "amenity",
    "value": "post_office",
    "type": "post_office",
    "name": u"Offices de poste"
}, {
    "column": "amenity",
    "value": "restaurant",
    "type": "restaurant",
    "name": u"Restaurants"
}, {
    "column": "tourism",
    "value": "zoo",
    "type": "zoo",
    "name": u"Zoos"
}]
%>
% for layer in layers:
LAYER
    NAME "${layer['type']}"
    GROUP "osm"
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=osm"
    DATA "way FROM (SELECT * FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=2056"
    FILTER ('[${layer['column']}]' ${layer.get('operator', '=')} '${layer['value']}')
    LABELITEM "name"
    PROJECTION
        "init=epsg:2056"
    END
    CLASS
        NAME "${layer['name']}"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 30 0 0
            COLOR 230 0 0
        END
    END

    METADATA
        "wms_title" "${layer['name']}"

        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_THE_GEOM_type" "point"
        "gml_geometries" "THE_GEOM"
    END
END
% endfor

LAYER
    NAME "osm_time"
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=osm"
    DATA "way FROM (SELECT * FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=2056"
    LABELITEM "name"
    PROJECTION
        "init=epsg:2056"
    END
    CLASS
        NAME "osm_time"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 30 0 0
            COLOR 230 0 0
        END
    END

    METADATA
        "wms_title" "OSM Time"

        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_POINT_type" "point"
        "gml_geometries" "POINT"
        "wfs_enable_request" "*"

        "wms_timeextent" "2006/2014/P1M"
        "wms_timeitem" "timestamp"
    END
END

LAYER
    NAME "osm_scale"
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=osm"
    DATA "way FROM (SELECT * FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=2056"
    LABELITEM "name"
    PROJECTION
        "init=epsg:2056"
    END

    MINSCALEDENOM 1500
    MAXSCALEDENOM 4000

    CLASS
        NAME "osm_scale"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 30 0 0
            COLOR 230 0 0
        END
    END

    METADATA
        "wms_title" "OSM Scale"

        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_POINT_type" "point"
        "gml_geometries" "POINT"
        "wfs_enable_request" "*"
    END
END
