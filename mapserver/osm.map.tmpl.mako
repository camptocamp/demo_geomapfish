# -*- coding: utf-8 -*-

<%!
columns = 'regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\\"natural\\",operator,population,power,place,railway,ref,religion,shop,sport,surface,tourism,waterway,wood,way'
layers = [{
    "column": "tourism",
    "value": "hotel",
    "type": "hotel",
    "name": u"Hôtels"
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
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
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
    NAME "police"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=amenity = 'police'"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASS
        NAME "Poste de police"
        KEYIMAGE symbols/police.png
        STYLE
            SYMBOL "police"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 56 117 215
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    METADATA
        "wms_title" "police"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "post_office"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=amenity = 'post_office'"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASS
        NAME "Office de poste"
        KEYIMAGE symbols/postal.png
        STYLE
            SYMBOL "postal"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 128 128 0
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    METADATA
        "wms_title" "post_office"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "fuel"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=amenity = 'fuel'"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASS
        NAME "Station service"
        KEYIMAGE symbols/fillingstation.png
        STYLE
            SYMBOL "fillingstation"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 157 112 80
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    METADATA
        "wms_title" "fuel"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "parking"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=amenity = 'parking'"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASS
        NAME "Parking"
        KEYIMAGE symbols/parking.png
        STYLE
            SYMBOL "parking"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 157 112 80
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    METADATA
        "wms_title" "parking"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "many_attributes"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,name AS name2,name AS name3,name AS name4,name AS name5,name AS name6,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point WHERE name is not NULL) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=highway = 'bus_stop'"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASS
        NAME "Arrêt de bus"
        KEYIMAGE symbols/busstop.png
        STYLE
            SYMBOL "busstop"
            SIZE 30
        END
    END
    METADATA
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "bus_stop"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=highway = 'bus_stop'"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASS
        NAME "Arrêt de bus"
        MAXSCALEDENOM 20000
        KEYIMAGE symbols/busstop.png
        STYLE
            SYMBOL "busstop"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 157 112 80
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 15000
        END
    END
    METADATA
        "wms_title" "bus_stop"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "accommodation"
    GROUP "alpine_hut"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=tourism in ('alpine_hut','hostel', 'guest_house', 'chalet', 'hotel', 'camp_site')"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASSITEM "tourism"
    CLASS
        NAME "Refuge alpin, chalet ou campement"
        EXPRESSION {alpine_hut,chalet,camp_site}
        KEYIMAGE symbols/hostel_0star.png
        STYLE
            SYMBOL "hostel_0star"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 100 38 144
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Auberge de jeunesse"
        EXPRESSION 'hostel'
        KEYIMAGE symbols/youthhostel.png
        STYLE
            SYMBOL "youthhostel"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 100 38 144
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Bed and Breakfast"
        EXPRESSION 'guest_house'
        KEYIMAGE symbols/bed_breakfast1-2.png
        STYLE
            SYMBOL "bed_breakfast1-2"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 100 38 144
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Hôtel"
        EXPRESSION 'hotel'
        KEYIMAGE symbols/hotel_0star.png
        STYLE
            SYMBOL "hotel_0star"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 100 38 144
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END

    END

    METADATA
        "wms_title" "accommodation"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "information"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=tourism = 'information'"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASSITEM "tourism"
    CLASS
        NAME "Information"
        KEYIMAGE symbols/information.png
        STYLE
            SYMBOL "information"
            SIZE 30
        END
    END

    METADATA
        "wms_title" "tourism_information"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "tourism_activity"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=tourism in ('zoo','casino', 'bicycle_rental', 'boat_rental', 'winery', 'brewery', 'museum', 'viewpoint')"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels

    CLASSITEM "tourism"
    CLASS
        NAME "Casino"
        EXPRESSION 'casino'
        KEYIMAGE symbols/casino-2.png
        STYLE
            SYMBOL "casino"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 192 112 180
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Location de vélo"
        EXPRESSION 'bicycle_rental'
        KEYIMAGE symbols/cycling.png
        STYLE
            SYMBOL "bicycle_rental"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 192 112 180
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Location de bateau"
        EXPRESSION 'boat_rental'
        KEYIMAGE symbols/sailing.png
        STYLE
            SYMBOL "boat_rental"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 192 112 180
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Cave à vin"
        EXPRESSION 'winery'
        KEYIMAGE symbols/winebar.png
        STYLE
            SYMBOL "winery"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 192 112 180
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Brasserie"
        EXPRESSION 'brewery'
        KEYIMAGE symbols/brewery.png
        STYLE
            SYMBOL "brewery"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 192 112 180
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END

    CLASS
        NAME "Musée"
        EXPRESSION 'museum'
        KEYIMAGE symbols/museum.png
        STYLE
            SYMBOL "museum"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 192 112 180
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Point de vue"
        EXPRESSION 'viewpoint'
        KEYIMAGE symbols/viewpoint.png
        STYLE
            SYMBOL "viewpoint"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 210 128 0
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Zoo"
        EXPRESSION 'zoo'
        KEYIMAGE symbols/zoo.png
        STYLE
            SYMBOL "zoo"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 2 92 5
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END

    METADATA
        "wms_title" "tourism_activity"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "bank"
    GROUP "osm"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=amenity in ('bank','atm')"
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASSITEM "amenity"
    CLASS
        NAME "Banques"
        EXPRESSION "bank"
        KEYIMAGE symbols/bank.png
        STYLE
            SYMBOL "bank"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 2 92 5
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
        END
    END
    CLASS
        NAME "Distributeurs"
        EXPRESSION "atm"
        KEYIMAGE symbols/atm-2.png
        STYLE
            SYMBOL "atm"
            SIZE 30
        END
    END

    METADATA
        "wms_title" "bank"

        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "place_of_worship"
    GROUP "osm"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
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
    NAME "sustenance"
    GROUP "restaurant"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=amenity in ('cafe','restaurant', 'fast_food', 'bar')"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    LABELITEM "name"
    CLASSITEM "amenity"
    CLASS
        NAME "Cafés"
        EXPRESSION {cafe,bar}
        KEYIMAGE symbols/coffee.png
        STYLE
            SYMBOL "coffee"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 100 38 144
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
   CLASS
        NAME "Fast-food"
        EXPRESSION "fast_food"
        KEYIMAGE symbols/fastfood.png
        STYLE
            SYMBOL "fastfood"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 100 38 144
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Restaurant"
        EXPRESSION "restaurant"
        KEYIMAGE symbols/restaurant.png
        STYLE
           SYMBOL "restaurant"
           SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 100 38 144
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END

    METADATA
        "wms_title" "Location of restaurant"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "entertainment"
    GROUP "cafe"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\", operator, population, power, place, railway, ref, religion, shop, sport, surface, tourism, waterway, wood, way AS geom FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    PROCESSING "NATIVE_FILTER=amenity in ('cafe','bar','nightclub', 'cinema')"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    LABELITEM "name"
    CLASSITEM "amenity"
    CLASS
        NAME "Cafés"
        EXPRESSION "cafe"
        KEYIMAGE symbols/coffee_marron.png
        STYLE
            SYMBOL "coffee_marron"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 139 114 59
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Bar"
        EXPRESSION "bar"
        KEYIMAGE symbols/bar.png
        STYLE
            SYMBOL "bar"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 139 114 59
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Cinéma"
        EXPRESSION "cinema"
        KEYIMAGE symbols/cinema.png
        STYLE
            SYMBOL "cinema"
            SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 139 114 59
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END
    CLASS
        NAME "Boîte de nuit"
        EXPRESSION "nightclub"
        KEYIMAGE symbols/dancinghall.png
        STYLE
           SYMBOL "dancinghall"
           SIZE 30
        END
        LABEL
            SIZE 12
            OFFSET 0 10
            COLOR 139 114 59
            OUTLINECOLOR 255 255 255
            OUTLINEWIDTH 2
            PARTIALS FALSE
            MAXSCALEDENOM 150000
        END
    END

    METADATA
        "wms_title" "nightclub"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END

<%!
time_layers = [
    ("osm_time", "2006-01/2013-12/P1M"),
    ("osm_time2", "2006-01/2013-12/P1M"),
    ("osm_time_year_mounth", "2006/2013/P1M"),
    ("osm_time_mount_year", "2006-01/2013-12/P1Y"),
]
%>
% for name, extent in time_layers:
LAYER
    NAME "${name}"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name,name,osm_id,type,\"timestamp\",datetime,date,geom FROM swiss_points) AS foo USING UNIQUE osm_id USING srid=21781"
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
        "gml_geom_type" "point"
        "gml_geometries" "geom"
        "wfs_enable_request" "*"

        "wms_timeextent" "${extent}"
        "wms_timeitem" "datetime"
    END
END
% endfor

LAYER
    NAME "osm_scale"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
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
        "gml_way_type" "point"
        "gml_geometries" "way"
        "wfs_enable_request" "*"
    END
END

<%
colors = [
    [100, 160, 235, 140],
    [500, 242, 243, 159],
    [2000, 247, 171, 96],
    [5000, 148, 103, 50],
]
nb = 20
%>
% for layer in ["aster", "srtm"]:
LAYER
    NAME "${layer}"
% if layer == "aster":
    GROUP "half_query"
    DATA ${raster_base_path}/Aster21781.vrt
% else:
    DATA ${raster_base_path}/SRTM21781.vrt
% endif
    TYPE RASTER
    STATUS ON
% for i in range(len(colors) - 1):
<%
c1 = colors[i]
c2 = colors[i+1]
%>
% for j in range(nb):
<%
l1 = c1[0] + (c2[0] - c1[0]) / nb * j
l2 = c1[0] + (c2[0] - c1[0]) / nb * (j+1)
r = c1[1] + (c2[1] - c1[1]) / nb * j
g = c1[2] + (c2[2] - c1[2]) / nb * j
b = c1[3] + (c2[3] - c1[3]) / nb * j
%>
    CLASS
        EXPRESSION ([pixel] > ${l1} and [pixel] <= ${l2})
        STYLE
            COLOR ${r} ${g} ${b}
        END
    END
% endfor
% endfor
END
% endfor
LAYER
    NAME "osm_open"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geom FROM (SELECT '<a href=\"javascript:cgxp.tools.openInfoWindow(''https://example.com'',''OSM'',800,500)\">Open</a>' AS open'https://geomapfish-demo-dc.camptocamp.com/2.4/resourceproxy?target=point&values='||osm_id AS autolink_url,type||'@camptocamp.com' AS autolink_email,name,osm_id,type,\"timestamp\",geom FROM swiss_points) AS foo USING UNIQUE osm_id USING srid=21781"
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
        "gml_geom_type" "point"
        "gml_geometries" "geom"
        "wfs_enable_request" "*"
    END
END


LAYER
    NAME "cinema"
    GROUP "half_query"
    EXTENT 473743 74095 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "way FROM (SELECT regexp_replace(format('%s', name), '^$', osm_id::text) AS display_name,name,osm_id,access,aerialway,amenity,barrier,bicycle,brand,building,covered,denomination,ele,foot,highway,layer,leisure,man_made,motorcar,\"natural\",operator,population,power,place,railway,ref,religion,shop,sport,surface,tourism,waterway,wood,way FROM planet_osm_point) AS foo USING UNIQUE osm_id USING srid=21781"
    FILTER ('[amenity]' = 'cinema')
    LABELITEM "name"
    PROJECTION
        "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASS
        NAME "Cinémas"
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
        "wms_title" "Cinémas"

        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_way_type" "point"
        "gml_geometries" "way"
    END
END
LAYER
    NAME "buildings_query"
    TYPE POLYGON
    EXTENT 420000 40500 839000 306400
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "user=${dbuser} password=${dbpassword} host=${dbhost} dbname=${osm_db}"
    DATA "geometry FROM (SELECT way AS geometry, osm_id, name FROM planet_osm_polygon WHERE building IS NOT NULL) as foo using unique osm_id using srid=21781"
    PROJECTION
        "init=epsg:21781"
    END
    METADATA
        "wms_title" "Buildings"
        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geometry_type" "polygon"
        "gml_geometries" "geometry"
    END
END
