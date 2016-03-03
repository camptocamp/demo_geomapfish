LAYER
    NAME "hospitals"
    GROUP "private"
    EXTENT 420000 40500 839000 306400
    TYPE POINT
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "${mapserver_connection}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name, * FROM geodata.osm_hospitals WHERE %role_id% IN (${mapfile_data_noarea_subselect} 'hospitals')) AS foo USING UNIQUE osm_id USING srid=21781"
    VALIDATION
        ${mapserver_layer_validation}
    END
    LABELITEM "name"
    PROJECTION
      "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASS
        NAME "Hopitaux"
        STYLE
            SYMBOL "circle"
            SIZE 6
            WIDTH 1
            OUTLINECOLOR 30 0 0
            COLOR 230 0 0
        END
        LABEL
            SIZE 10
            OFFSET 0 -13
            PARTIALS FALSE
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
    EXTENT 420000 40500 839000 306400
    TYPE POLYGON
    STATUS ON
    TEMPLATE fooOnlyForWMSGetFeatureInfo # For GetFeatureInfo
    CONNECTIONTYPE postgis
    PROCESSING "CLOSE_CONNECTION=DEFER" # For performance
    CONNECTION "${mapserver_connection}"
    DATA "geom FROM (SELECT regexp_replace(format(\'%s\', name), \'^$\', osm_id::text) AS display_name, * FROM geodata.osm_firestations WHERE ST_Contains((${mapfile_data_subselect} 'firestations'), geom)) AS foo USING UNIQUE osm_id USING srid=21781"
    VALIDATION
        ${mapserver_layer_validation}
    END
    LABELITEM "name"
    PROJECTION
      "init=epsg:21781"
    END
    TOLERANCE 10
    TOLERANCEUNITS pixels
    CLASS
        NAME "Casernes de pompiers"
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
            SIZE 10
            PARTIALS FALSE
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
