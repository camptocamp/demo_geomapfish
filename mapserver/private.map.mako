LAYER
    NAME "hospitals"
    GROUP "private"
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "${mapserver_connection}"
    DATA "geom FROM (SELECT geo.* FROM geodata.osm_hospitals AS geo WHERE %role_id% IN (${mapfile_data_noarea_subselect} 'hospitals')) AS foo USING UNIQUE osm_id USING srid=21781"
    VALIDATION
        ${mapserver_layer_validation}
    END
    LABELITEM "name"
    PROJECTION
      "init=epsg:21781"
    END
    CLASS
        NAME "Hospitals"
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
        "wms_title" "Hospitals"

        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "point"
        "gml_geometries" "geom"
    END
END
LAYER
    NAME "firestations"
    GROUP "private"
    TYPE POLYGON
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "${mapserver_connection}"
    DATA "geom FROM (SELECT geo.* FROM geodata.osm_firestations AS geo WHERE ST_Contains((${mapfile_data_subselect} 'firestations'), ST_SetSRID(geo.geom, 21781))) AS foo USING UNIQUE osm_id USING srid=21781"
    VALIDATION
        ${mapserver_layer_validation}
    END
    LABELITEM "name"
    PROJECTION
      "init=epsg:21781"
    END
    CLASS
        NAME "Firestations"
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
        "wms_title" "Firestations"

        "gml_include_items" "all"
        "gml_types" "auto"
        "gml_featureid" "osm_id"
        "gml_geom_type" "polygon"
        "gml_geometries" "geom"
    END
END
