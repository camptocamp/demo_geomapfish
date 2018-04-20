LAYER
    NAME "point"
    GROUP "edit"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "${mapserver_connection}"
    DATA "geom FROM (SELECT g.id AS id, g.name AS name, k.name AS kind, g.geom AS geom FROM edit.point AS g LEFT OUTER JOIN edit.choise AS k ON g.kind_id = k.id) AS foo USING UNIQUE id USING srid=21781"
    LABELITEM "name"
    PROJECTION
      "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASS
        NAME "Point"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 30 0 0
            COLOR 230 0 0
        END
        LABEL
            COLOR 0 0 0
            OUTLINECOLOR 255 255 255
            FONT arial_bold
            TYPE truetype
            SIZE 10
            OFFSET 0 -13
        END
    END

    METADATA
        "wms_title" "Point"

        "gml_include_items" "all"
        "gml_exclude_items" "id"
        "gml_types" "auto"
        "gml_featureid" "id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END
LAYER
    NAME "line"
    GROUP "edit"
    EXTENT 420000 40500 839000 306400
    TYPE LINE
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "${mapserver_connection}"
    DATA "geom FROM (SELECT g.id AS id, g.name AS name, k.name AS kind, g.geom AS geom FROM edit.line AS g LEFT OUTER JOIN edit.choise AS k ON g.kind_id = k.id) AS foo USING UNIQUE id USING srid=21781"
    LABELITEM "name"
    PROJECTION
      "init=epsg:21781"
    END
    CLASS
        NAME "Line"
        STYLE
            WIDTH 2
            COLOR 0 230 0
        END
        LABEL
            COLOR 0 0 0
            OUTLINECOLOR 255 255 255
            FONT arial_bold
            TYPE truetype
            SIZE 10
        END
    END

    METADATA
        "wms_title" "Line"

        "gml_include_items" "all"
        "gml_exclude_items" "id"
        "gml_types" "auto"
        "gml_featureid" "id"
        "gml_geom_type" "line"
        "gml_geometries" "geom"
    END
END
LAYER
    NAME "polygon"
    GROUP "edit"
    EXTENT 420000 40500 839000 306400
    TYPE POLYGON
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "${mapserver_connection}"
    DATA "geom FROM (SELECT g.id AS id, g.name AS name, k.name AS kind, g.geom AS geom FROM edit.polygon AS g LEFT OUTER JOIN edit.choise AS k ON g.kind_id = k.id) AS foo USING UNIQUE id USING srid=21781"
    LABELITEM "name"
    PROJECTION
      "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASS
        NAME "Polygon"
        STYLE
            WIDTH 1
            OUTLINECOLOR 30 0 0
        END
        STYLE
            WIDTH 1
            COLOR 0 0 230
            OPACITY 60
        END
        LABEL
            COLOR 0 0 0
            OUTLINECOLOR 255 255 255
            FONT arial_bold
            TYPE truetype
            SIZE 10
        END
    END

    METADATA
        "wms_title" "Polygon"

        "gml_include_items" "all"
        "gml_exclude_items" "id"
        "gml_types" "auto"
        "gml_featureid" "id"
        "gml_geom_type" "multipolygon"
        "gml_geometries" "geom"
    END
END

LAYER
    NAME "buildings"
    GROUP "edit"
    EXTENT 420000 40500 839000 306400
    TYPE POLYGON
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "${mapserver_connection}"
    DATA "geom FROM (SELECT g.id AS id, g.name AS name, number, k.name AS building, geom FROM edit.building AS g LEFT OUTER JOIN edit.type AS k ON g.building_id = k.id) AS foo USING UNIQUE id USING srid=21781"
    LABELITEM "name"
    MAXSCALEDENOM 40000
    LABELMAXSCALEDENOM 5000

    PROJECTION
      "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASS
        NAME "Building"
        STYLE
            WIDTH 1
            OUTLINECOLOR 30 0 0
        END
        STYLE
            COLOR 0 0 230
            OPACITY 30
        END
        LABEL
            COLOR 0 0 0
            OUTLINECOLOR 255 255 255
            FONT arial_bold
            TYPE truetype
            SIZE 10
        END
    END

    METADATA
        "wms_title" "Polygon"

        "gml_include_items" "all"
        "gml_exclude_items" "id"
        "gml_types" "auto"
        "gml_featureid" "id"
        "gml_geom_type" "polygon"
        "gml_geometries" "geom"
    END
END
