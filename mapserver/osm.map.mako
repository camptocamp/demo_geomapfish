# -*- coding: utf-8 -*-

<%!
columns = 'regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\\"natural\\",operator,population,power,place,railway,ref,religion,shop,sport,surface,tourism,waterway,wood,way'
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
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=osm"
    DATA "way FROM (SELECT ${columns} FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    FILTER ('[${layer['column']}]' ${layer.get('operator', '=')} '${layer['value']}')
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASS
        NAME "${layer['name']}"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 30 0 0
            COLOR 230 0 0
        END
        LABEL
            SIZE 7
            OFFSET 0 -10
            PARTIALS FALSE
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
    NAME "place_of_worship"
    GROUP "osm"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=osm"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    FILTER ('[amenity]' = 'place_of_worship')
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASSITEM "religion"
    CLASS
      NAME "Christian"
      EXPRESSION "christian"
      KEYIMAGE symbols/church.png
      STYLE
            SYMBOL "church"
            SIZE 30
      END
      LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 43 34 94
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
      END
    END
    CLASS
      NAME "Muslim"
      KEYIMAGE symbols/mosquee.png
      EXPRESSION "muslim"
      STYLE
            SYMBOL "mosquee"
            SIZE 30
      END
      LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 43 34 94
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
      END
    END
    CLASS
        NAME "Autre lieux de culte"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 43 34 94
            COLOR 91 72 196
        END
        LABEL
            SIZE 7
            OFFSET 0 -10
            PARTIALS FALSE
        END
    END

    METADATA
        "wms_title" "Lieux de culte"

        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END


LAYER
    NAME "osm_time"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=osm"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,type,\"timestamp\",geom FROM swiss_points) AS foo USING UNIQUE osm_id USING srid=21781"
    LABELITEM "name"
    EXTENT 473743 74095 839000 306400
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASS
        NAME "Dans les temps"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 0 0 30
            COLOR 0 0 230
        END
        LABEL
            SIZE 7
            OFFSET 0 -10
            PARTIALS FALSE
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

        "wms_timeextent" "2006-01-01/2013-12-31/P1M"
        "wms_timeitem" "timestamp"
    END
END

LAYER
    NAME "osm_scale"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=osm"
    DATA "way FROM (SELECT ${columns} FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    LABELITEM "name"
    EXTENT 473743 74095 839000 306400
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    MINSCALEDENOM 1500
    MAXSCALEDENOM 4000

    CLASS
        NAME "OSM"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 0 30 0
            COLOR 0 230 0
        END
        LABEL
            SIZE 7
            OFFSET 0 -10
            PARTIALS FALSE
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

LAYER
    NAME "osm_open"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=osm"
    DATA "geom FROM (SELECT '<a href=\"javascript:cgxp.tools.openInfoWindow(''/sbrunner20/wsgi/resourceproxy?target=point&values='||osm_id||''',''OSM'',800,500)\">Open</a>' AS open,name,osm_id,type,\"timestamp\",geom FROM swiss_points) AS foo USING UNIQUE osm_id USING srid=21781"
    LABELITEM "name"
    EXTENT 473743 74095 839000 306400
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASS
        NAME "OSM"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 30 0 0
            COLOR 230 0 0
        END
        LABEL
            SIZE 7
            OFFSET 0 -10
            PARTIALS FALSE
        END
    END

    METADATA
        "wms_title" "OSM Open"

        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_POINT_type" "point"
        "gml_geometries" "POINT"
        "wfs_enable_request" "*"
    END
END
