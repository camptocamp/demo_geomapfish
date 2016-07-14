BEGIN;

CREATE TABLE main.alembic_version (
    version_num VARCHAR(32) NOT NULL
);

-- Running upgrade  -> 166ff2dcc48d

CREATE TABLE main.functionality (
    id SERIAL NOT NULL,
    name VARCHAR NOT NULL,
    value VARCHAR NOT NULL,
    description VARCHAR,
    PRIMARY KEY (id)
);

CREATE TABLE main.treeitem (
    type VARCHAR(10) NOT NULL,
    id SERIAL NOT NULL,
    name VARCHAR,
    "order" INTEGER NOT NULL,
    "metadataURL" VARCHAR,
    PRIMARY KEY (id)
);

CREATE TABLE main.restrictionarea (
    id SERIAL NOT NULL,
    name VARCHAR,
    description VARCHAR,
    readwrite BOOLEAN,
    PRIMARY KEY (id)
);

SELECT AddGeometryColumn('main', 'restrictionarea', 'area', 21781, 'POLYGON', 2);

CREATE TABLE main_static.shorturl (
    id SERIAL NOT NULL,
    url VARCHAR(1000),
    ref VARCHAR(20) NOT NULL,
    creator_email VARCHAR(200),
    creation TIMESTAMP WITHOUT TIME ZONE,
    last_hit TIMESTAMP WITHOUT TIME ZONE,
    nb_hits INTEGER,
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_main_static_shorturl_ref ON main_static.shorturl (ref);

CREATE TABLE main.role (
    id SERIAL NOT NULL,
    name VARCHAR NOT NULL,
    description VARCHAR,
    PRIMARY KEY (id),
    UNIQUE (name)
);

SELECT AddGeometryColumn('main', 'role', 'extent', 21781, 'POLYGON', 2);

INSERT INTO main.role (name) VALUES ('role_admin');

CREATE TABLE main.layer (
    id INTEGER NOT NULL,
    public BOOLEAN,
    "inMobileViewer" BOOLEAN,
    "inDesktopViewer" BOOLEAN,
    "isChecked" BOOLEAN,
    icon VARCHAR,
    "layerType" VARCHAR(12),
    url VARCHAR,
    "imageType" VARCHAR(10),
    style VARCHAR,
    dimensions VARCHAR,
    "matrixSet" VARCHAR,
    "wmsUrl" VARCHAR,
    "wmsLayers" VARCHAR,
    "queryLayers" VARCHAR,
    kml VARCHAR,
    "isSingleTile" BOOLEAN,
    legend BOOLEAN,
    "legendImage" VARCHAR,
    "legendRule" VARCHAR,
    "isLegendExpanded" BOOLEAN,
    "minResolution" FLOAT,
    "maxResolution" FLOAT,
    disclaimer VARCHAR,
    "identifierAttributeField" VARCHAR,
    "geoTable" VARCHAR,
    "excludeProperties" VARCHAR,
    "timeMode" VARCHAR(8),
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES main.treeitem (id)
);

CREATE TABLE main.role_restrictionarea (
    role_id INTEGER NOT NULL,
    restrictionarea_id INTEGER NOT NULL,
    PRIMARY KEY (role_id, restrictionarea_id),
    FOREIGN KEY(role_id) REFERENCES main.role (id),
    FOREIGN KEY(restrictionarea_id) REFERENCES main.restrictionarea (id)
);

CREATE TABLE main.tsearch (
    id SERIAL NOT NULL,
    label VARCHAR,
    layer_name VARCHAR,
    role_id INTEGER,
    public BOOLEAN DEFAULT 'true',
    ts TSVECTOR,
    params VARCHAR,
    PRIMARY KEY (id),
    FOREIGN KEY(role_id) REFERENCES main.role (id)
);

SELECT AddGeometryColumn('main', 'tsearch', 'the_geom', 21781, 'GEOMETRY', 2);

CREATE INDEX tsearch_ts_idx ON main.tsearch USING gin (ts);

CREATE TABLE main.treegroup (
    id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES main.treeitem (id)
);

CREATE TABLE main."user" (
    type VARCHAR(10) NOT NULL,
    id SERIAL NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    is_password_changed BOOLEAN,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (username),
    FOREIGN KEY(role_id) REFERENCES main.role (id)
);

INSERT INTO main.user (type, username, email, password, role_id) (SELECT 'user', 'admin', 'info@example.com', 'd033e22ae348aeb5660fc2140aec35850c4da997', r.id FROM main.role AS r WHERE r.name = 'role_admin');

CREATE TABLE main.role_functionality (
    role_id INTEGER NOT NULL,
    functionality_id INTEGER NOT NULL,
    PRIMARY KEY (role_id, functionality_id),
    FOREIGN KEY(role_id) REFERENCES main.role (id),
    FOREIGN KEY(functionality_id) REFERENCES main.functionality (id)
);

CREATE TABLE main.user_functionality (
    user_id INTEGER NOT NULL,
    functionality_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, functionality_id),
    FOREIGN KEY(user_id) REFERENCES main."user" (id),
    FOREIGN KEY(functionality_id) REFERENCES main.functionality (id)
);

CREATE TABLE main.layergroup (
    id INTEGER NOT NULL,
    "isExpanded" BOOLEAN,
    "isInternalWMS" BOOLEAN,
    "isBaseLayer" BOOLEAN,
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES main.treegroup (id)
);

CREATE TABLE main.layer_restrictionarea (
    layer_id INTEGER NOT NULL,
    restrictionarea_id INTEGER NOT NULL,
    PRIMARY KEY (layer_id, restrictionarea_id),
    FOREIGN KEY(layer_id) REFERENCES main.layer (id),
    FOREIGN KEY(restrictionarea_id) REFERENCES main.restrictionarea (id)
);

CREATE TABLE main.layergroup_treeitem (
    treegroup_id INTEGER NOT NULL,
    treeitem_id INTEGER NOT NULL,
    PRIMARY KEY (treegroup_id, treeitem_id),
    FOREIGN KEY(treegroup_id) REFERENCES main.treegroup (id),
    FOREIGN KEY(treeitem_id) REFERENCES main.treeitem (id)
);

CREATE TABLE main.theme (
    id INTEGER NOT NULL,
    icon VARCHAR,
    "inMobileViewer" BOOLEAN,
    "inDesktopViewer" BOOLEAN,
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES main.treegroup (id)
);

CREATE TABLE main.theme_functionality (
    theme_id INTEGER NOT NULL,
    functionality_id INTEGER NOT NULL,
    PRIMARY KEY (theme_id, functionality_id),
    FOREIGN KEY(theme_id) REFERENCES main.theme (id),
    FOREIGN KEY(functionality_id) REFERENCES main.functionality (id)
);

INSERT INTO main.alembic_version (version_num) VALUES ('166ff2dcc48d');

-- Running upgrade 166ff2dcc48d -> 415746eb9f6

DROP TABLE main.user_functionality;

CREATE TABLE main.interface (
    id SERIAL NOT NULL,
    name VARCHAR,
    description VARCHAR,
    PRIMARY KEY (id)
);

CREATE TABLE main.interface_layer (
    interface_id INTEGER NOT NULL,
    layer_id INTEGER NOT NULL,
    PRIMARY KEY (interface_id, layer_id),
    FOREIGN KEY(interface_id) REFERENCES main.interface (id),
    FOREIGN KEY(layer_id) REFERENCES main.layer (id)
);

CREATE TABLE main.interface_theme (
    interface_id INTEGER NOT NULL,
    theme_id INTEGER NOT NULL,
    PRIMARY KEY (interface_id, theme_id),
    FOREIGN KEY(interface_id) REFERENCES main.interface (id),
    FOREIGN KEY(theme_id) REFERENCES main.theme (id)
);

CREATE TABLE main.layerv1 (
    id INTEGER NOT NULL,
    is_checked BOOLEAN,
    icon VARCHAR,
    layer_type VARCHAR(12),
    url VARCHAR,
    image_type VARCHAR(10),
    style VARCHAR,
    dimensions VARCHAR,
    matrix_set VARCHAR,
    wms_url VARCHAR,
    wms_layers VARCHAR,
    query_layers VARCHAR,
    kml VARCHAR,
    is_single_tile BOOLEAN,
    legend BOOLEAN,
    legend_image VARCHAR,
    legend_rule VARCHAR,
    is_legend_expanded BOOLEAN,
    min_resolution FLOAT,
    max_resolution FLOAT,
    disclaimer VARCHAR,
    identifier_attribute_field VARCHAR,
    exclude_properties VARCHAR,
    time_mode VARCHAR(8),
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES main.layer (id)
);

UPDATE ONLY main.treeitem SET type = 'layerv1' WHERE type='layer';

INSERT INTO main.layerv1 (id, is_checked, icon, layer_type, url, image_type, style, dimensions, matrix_set, wms_url, wms_layers, query_layers, kml, is_single_tile, legend, legend_image, legend_rule, is_legend_expanded, min_resolution, max_resolution, disclaimer, identifier_attribute_field, exclude_properties, time_mode) (SELECT id, "isChecked" AS is_checked, icon, "layerType" AS layer_type, url, "imageType" AS image_type, style, dimensions, "matrixSet" AS matrix_set, "wmsUrl" AS wms_url, "wmsLayers" AS wms_layers, "queryLayers" AS query_layers, kml, "isSingleTile" AS is_single_tile, legend, "legendImage" AS legend_image, "legendRule" AS legend_rule, "isLegendExpanded" AS is_legend_expanded, "minResolution" AS min_resolution, "maxResolution" AS max_resolution, disclaimer, "identifierAttributeField" AS identifier_attribute_field, "excludeProperties" AS exclude_properties, "timeMode" AS time_mode FROM main.layer);

ALTER TABLE main.layer DROP COLUMN "isChecked";

ALTER TABLE main.layer DROP COLUMN icon;

ALTER TABLE main.layer DROP COLUMN "layerType";

ALTER TABLE main.layer DROP COLUMN url;

ALTER TABLE main.layer DROP COLUMN "imageType";

ALTER TABLE main.layer DROP COLUMN style;

ALTER TABLE main.layer DROP COLUMN dimensions;

ALTER TABLE main.layer DROP COLUMN "matrixSet";

ALTER TABLE main.layer DROP COLUMN "wmsUrl";

ALTER TABLE main.layer DROP COLUMN "wmsLayers";

ALTER TABLE main.layer DROP COLUMN "queryLayers";

ALTER TABLE main.layer DROP COLUMN kml;

ALTER TABLE main.layer DROP COLUMN "isSingleTile";

ALTER TABLE main.layer DROP COLUMN legend;

ALTER TABLE main.layer DROP COLUMN "legendImage";

ALTER TABLE main.layer DROP COLUMN "legendRule";

ALTER TABLE main.layer DROP COLUMN "isLegendExpanded";

ALTER TABLE main.layer DROP COLUMN "minResolution";

ALTER TABLE main.layer DROP COLUMN "maxResolution";

ALTER TABLE main.layer DROP COLUMN disclaimer;

ALTER TABLE main.layer DROP COLUMN "identifierAttributeField";

ALTER TABLE main.layer DROP COLUMN "excludeProperties";

ALTER TABLE main.layer DROP COLUMN "timeMode";

INSERT INTO main.interface (name) VALUES ('main');

INSERT INTO main.interface (name) VALUES ('mobile');

INSERT INTO main.interface (name) VALUES ('edit');

INSERT INTO main.interface (name) VALUES ('routing');

INSERT INTO main.interface_layer (layer_id, interface_id) (SELECT l.id AS layer_id, i.id AS interface_id FROM main.layer AS l, main.interface AS i WHERE i.name in ('main', 'edit', 'routing') AND l."inDesktopViewer");

INSERT INTO main.interface_layer (layer_id, interface_id) (SELECT l.id AS layer_id, i.id AS interface_id FROM main.layer AS l, main.interface AS i WHERE i.name = 'mobile' AND l."inMobileViewer");

INSERT INTO main.interface_theme (theme_id, interface_id) (SELECT l.id AS theme_id, i.id AS interface_id FROM main.theme AS l, main.interface AS i WHERE i.name in ('main', 'edit', 'routing') AND l."inDesktopViewer");

INSERT INTO main.interface_theme (theme_id, interface_id) (SELECT l.id AS theme_id, i.id AS interface_id FROM main.theme AS l, main.interface AS i WHERE i.name = 'mobile' AND l."inMobileViewer");

ALTER TABLE main.layer DROP COLUMN "inMobileViewer";

ALTER TABLE main.layer DROP COLUMN "inDesktopViewer";

ALTER TABLE main.layer RENAME "geoTable" TO geo_table;

ALTER TABLE main.theme DROP COLUMN "inMobileViewer";

ALTER TABLE main.theme DROP COLUMN "inDesktopViewer";

ALTER TABLE main.treeitem RENAME "metadataURL" TO metadata_url;

ALTER TABLE main.layergroup RENAME "isExpanded" TO is_expanded;

ALTER TABLE main.layergroup RENAME "isInternalWMS" TO is_internal_wms;

ALTER TABLE main.layergroup RENAME "isBaseLayer" TO is_base_layer;

CREATE TABLE main.layer_internal_wms (
    id INTEGER NOT NULL,
    layer VARCHAR,
    image_type VARCHAR(10),
    style VARCHAR,
    time_mode VARCHAR(8),
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES main.layer (id)
);

CREATE TABLE main.layer_external_wms (
    id INTEGER NOT NULL,
    url VARCHAR,
    layer VARCHAR,
    image_type VARCHAR(10),
    style VARCHAR,
    is_single_tile BOOLEAN,
    time_mode VARCHAR(8),
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES main.layer (id)
);

CREATE TABLE main.layer_wmts (
    id INTEGER NOT NULL,
    url VARCHAR,
    layer VARCHAR,
    style VARCHAR,
    matrix_set VARCHAR,
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES main.layer (id)
);

CREATE TABLE main.ui_metadata (
    id SERIAL NOT NULL,
    name VARCHAR,
    value VARCHAR,
    description VARCHAR,
    item_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(item_id) REFERENCES main.treeitem (id)
);

CREATE TABLE main.wmts_dimension (
    id SERIAL NOT NULL,
    name VARCHAR,
    value VARCHAR,
    description VARCHAR,
    layer_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(layer_id) REFERENCES main.layer_wmts (id)
);

UPDATE main.alembic_version SET version_num='415746eb9f6' WHERE main.alembic_version.version_num = '166ff2dcc48d';

-- Running upgrade 415746eb9f6 -> 54645a535ad6

ALTER TABLE main.layergroup_treeitem DROP CONSTRAINT layergroup_treeitem_pkey;

ALTER TABLE main.layergroup_treeitem ADD COLUMN id SERIAL NOT NULL;

ALTER TABLE main.layergroup_treeitem ADD COLUMN ordering INTEGER;

UPDATE ONLY main.layergroup_treeitem AS lt SET ordering = ti."order" FROM main.treeitem AS ti WHERE ti.id = lt.treeitem_id;

ALTER TABLE main.theme ADD COLUMN ordering INTEGER;

UPDATE ONLY main.theme AS t SET ordering = ti."order" FROM main.treeitem AS ti WHERE ti.id = t.id;

ALTER TABLE main.treeitem DROP COLUMN "order";

UPDATE main.alembic_version SET version_num='54645a535ad6' WHERE main.alembic_version.version_num = '415746eb9f6';

-- Running upgrade 54645a535ad6 -> 1d5d4abfebd1

ALTER TABLE main.theme ADD COLUMN public BOOLEAN DEFAULT 't' NOT NULL;

CREATE TABLE main.restricted_role_theme (
    role_id INTEGER NOT NULL,
    theme_id INTEGER NOT NULL,
    PRIMARY KEY (role_id, theme_id),
    FOREIGN KEY(role_id) REFERENCES main.role (id),
    FOREIGN KEY(theme_id) REFERENCES main.theme (id)
);

UPDATE main.alembic_version SET version_num='1d5d4abfebd1' WHERE main.alembic_version.version_num = '54645a535ad6';

-- Running upgrade 1d5d4abfebd1 -> 20137477bd02

UPDATE main.theme SET icon = 'static:///' || icon WHERE (icon IS NOT NULL) AND (NOT icon = '') AND NOT (icon LIKE 'http%%') AND NOT (icon LIKE '/%%');

UPDATE main.layerv1 SET icon = 'static:///' || icon WHERE (icon IS NOT NULL) AND (NOT icon = '') AND NOT (icon LIKE 'http%%') AND NOT (icon LIKE '/%%');

UPDATE main.layerv1 SET kml = 'static:///' || kml WHERE (kml IS NOT NULL) AND (NOT kml = '') AND NOT (kml LIKE 'http%%') AND NOT (kml LIKE '/%%');

UPDATE main.layerv1 SET legend_image = 'static:///' || legend_image WHERE (legend_image IS NOT NULL) AND (NOT legend_image = '') AND NOT (legend_image LIKE 'http%%') AND NOT (legend_image LIKE '/%%');

UPDATE main.theme SET icon = 'static://' || icon WHERE (icon IS NOT NULL) AND (NOT icon = '') AND NOT (icon LIKE 'http%%') AND NOT (icon LIKE 'static://%%');

UPDATE main.layerv1 SET icon = 'static://' || icon WHERE (icon IS NOT NULL) AND (NOT icon = '') AND NOT (icon LIKE 'http%%') AND NOT (icon LIKE 'static://%%');

UPDATE main.layerv1 SET kml = 'static://' || kml WHERE (kml IS NOT NULL) AND (NOT kml = '') AND NOT (kml LIKE 'http%%') AND NOT (kml LIKE 'static://%%');

UPDATE main.layerv1 SET legend_image = 'static://' || legend_image WHERE (legend_image IS NOT NULL) AND (NOT legend_image = '') AND NOT (legend_image LIKE 'http%%') AND NOT (legend_image LIKE 'static://%%');

UPDATE main.alembic_version SET version_num='20137477bd02' WHERE main.alembic_version.version_num = '1d5d4abfebd1';

-- Running upgrade 20137477bd02 -> 164ac0819a61

ALTER TABLE main.layer_wmts ADD COLUMN image_type VARCHAR(10);

UPDATE main.alembic_version SET version_num='164ac0819a61' WHERE main.alembic_version.version_num = '20137477bd02';

-- Running upgrade 164ac0819a61 -> 5109242131ce

ALTER TABLE main.layerv1 ADD COLUMN time_widget VARCHAR(10);

UPDATE main.layerv1 SET time_widget = 'slider';

ALTER TABLE main.layer_internal_wms ADD COLUMN time_widget VARCHAR(10);

UPDATE main.layer_internal_wms SET time_widget = 'slider';

ALTER TABLE main.layer_external_wms ADD COLUMN time_widget VARCHAR(10);

UPDATE main.layer_external_wms SET time_widget = 'slider';

UPDATE main.alembic_version SET version_num='5109242131ce' WHERE main.alembic_version.version_num = '164ac0819a61';

-- Running upgrade 5109242131ce -> 32527659d57b

ALTER TABLE main.layer ADD COLUMN exclude_properties VARCHAR;

UPDATE main.layer as l1 SET exclude_properties = l2.exclude_properties FROM main.layerv1 as l2 WHERE l1.id = l2.id;

ALTER TABLE main.layerv1 DROP COLUMN exclude_properties;

UPDATE main.alembic_version SET version_num='32527659d57b' WHERE main.alembic_version.version_num = '5109242131ce';

-- Running upgrade 32527659d57b -> 2b8ed8c1df94

ALTER TABLE main.layergroup_treeitem ADD CONSTRAINT layergroup_treeitem_pkey PRIMARY KEY (id);

UPDATE main.alembic_version SET version_num='2b8ed8c1df94' WHERE main.alembic_version.version_num = '32527659d57b';

-- Running upgrade 5109242131ce -> 53ba1a68d5fe

ALTER TABLE main.tsearch ADD COLUMN interface_id INTEGER;

ALTER TABLE main.tsearch ADD FOREIGN KEY(interface_id) REFERENCES main.interface (id);

ALTER TABLE main.tsearch ADD COLUMN lang VARCHAR(2);

ALTER TABLE main.tsearch ADD COLUMN actions VARCHAR;

ALTER TABLE main.tsearch ADD COLUMN from_theme BOOLEAN DEFAULT 'false';

CREATE INDEX tsearch_search_index ON main.tsearch (ts, public, role_id, interface_id, lang);

INSERT INTO main.alembic_version (version_num) VALUES ('53ba1a68d5fe');

-- Running upgrade 32527659d57b, 53ba1a68d5fe -> 1418cb05921b

UPDATE main.alembic_version SET version_num='1418cb05921b' WHERE main.alembic_version.version_num = '53ba1a68d5fe';

-- Running upgrade 2b8ed8c1df94, 1418cb05921b -> a4f1aac9bda

DELETE FROM main.alembic_version WHERE main.alembic_version.version_num = '2b8ed8c1df94';

UPDATE main.alembic_version SET version_num='a4f1aac9bda' WHERE main.alembic_version.version_num = '1418cb05921b';

-- Running upgrade a4f1aac9bda -> 116b9b79fc4d

CREATE TABLE main.server_ogc (
    id SERIAL NOT NULL,
    name VARCHAR NOT NULL,
    description VARCHAR,
    url VARCHAR,
    url_wfs VARCHAR,
    type VARCHAR,
    image_type VARCHAR,
    auth VARCHAR,
    wfs_support BOOLEAN DEFAULT 'false',
    is_single_tile BOOLEAN DEFAULT 'false',
    PRIMARY KEY (id)
);

CREATE TABLE main.layer_wms (
    id INTEGER NOT NULL,
    server_ogc_id INTEGER,
    layer VARCHAR,
    style VARCHAR,
    time_mode VARCHAR DEFAULT 'disabled' NOT NULL,
    time_widget VARCHAR DEFAULT 'slider' NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES main.layer (id),
    FOREIGN KEY(server_ogc_id) REFERENCES main.server_ogc (id)
);

INSERT INTO main.server_ogc (name, description, type, image_type, auth, wfs_support) SELECT 'source for ' || image_type AS name, 'default source for internal ' || image_type AS description, 'mapserver' AS type, image_type, 'main' AS auth, 'true' AS wfs_support FROM (SELECT UNNEST(ARRAY['image/jpeg', 'image/png']) AS image_type) AS foo;

INSERT INTO main.server_ogc (name, description, type, image_type, auth, wfs_support) SELECT 'source for ' || image_type AS name, 'default source for internal ' || image_type AS description, 'mapserver' AS type, image_type, 'main' AS auth, 'true' AS wfs_support from (SELECT DISTINCT(image_type) FROM main.layer_internal_wms WHERE image_type NOT IN ('image/jpeg', 'image/png')) as foo;

INSERT INTO main.layer_wms (id, server_ogc_id, layer, style, time_mode, time_widget) SELECT lew.id, so.id, layer, style, time_mode, time_widget FROM main.layer_internal_wms AS lew, main.server_ogc AS so WHERE lew.image_type=so.image_type AND so.type IS NOT NULL;

INSERT INTO main.layer_wms (id, server_ogc_id, layer, style, time_mode, time_widget) SELECT lew.id, so.id, layer, style, time_mode, time_widget FROM main.layer_internal_wms AS lew, main.server_ogc AS so WHERE lew.image_type IS NULL AND so.image_type='image/png';

INSERT INTO main.server_ogc (name, url, type, image_type, auth, is_single_tile) SELECT 'source for ' || url, url, 'mapserver' AS type, image_type, 'none', CASE WHEN is_single_tile IS TRUE THEN TRUE ELSE FALSE END as is_single_tile FROM main.layer_external_wms GROUP BY url, image_type, is_single_tile;

INSERT INTO main.layer_wms (id, server_ogc_id, layer, style, time_mode, time_widget) SELECT lew.id, so.id, layer, style, time_mode, time_widget FROM main.layer_external_wms as lew, main.server_ogc as so WHERE lew.url=so.url AND lew.is_single_tile=so.is_single_tile AND lew.image_type=so.image_type;

DROP TABLE main.layer_external_wms;

DROP TABLE main.layer_internal_wms;

UPDATE main.treeitem SET type='l_wms' WHERE type='l_int_wms' OR type='l_ext_wms';

UPDATE main.alembic_version SET version_num='116b9b79fc4d' WHERE main.alembic_version.version_num = 'a4f1aac9bda';

-- Running upgrade 2b8ed8c1df94 -> 22e6dfb556de

ALTER TABLE main.layergroup_treeitem ADD COLUMN description VARCHAR;

ALTER TABLE main.treeitem ADD COLUMN description VARCHAR;

INSERT INTO main.alembic_version (version_num) VALUES ('22e6dfb556de');

-- Running upgrade 22e6dfb556de, 116b9b79fc4d -> 29f2a32859ec

DELETE FROM main.alembic_version WHERE main.alembic_version.version_num = '22e6dfb556de';

UPDATE main.alembic_version SET version_num='29f2a32859ec' WHERE main.alembic_version.version_num = '116b9b79fc4d';

COMMIT;
