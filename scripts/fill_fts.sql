CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TEXT SEARCH CONFIGURATION fr (COPY = french);
ALTER TEXT SEARCH CONFIGURATION fr
    ALTER MAPPING FOR hword, hword_part, word
    WITH unaccent, french_stem;

CREATE EXTENSION IF NOT EXISTS dblink;

INSERT INTO main.tsearch
(the_geom, layer_name, label, public, role_id, ts)
SELECT
ST_Transform(way, 2056), '', name, TRUE, NULL, to_tsvector('french', name)
FROM
dblink('dbname=osm', 'SELECT name, way FROM planet_osm_polygon WHERE admin_level IS NOT NULL')
AS p(name text, way Geometry);
