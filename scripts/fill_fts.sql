CREATE EXTENSION dblink;

INSERT INTO main.tsearch
(the_geom, layer_name, label, public, role_id, ts)
SELECT
ST_Transform(way, 21781), '', name, TRUE, NULL, to_tsvector('french', name)
FROM
dblink('dbname=osm', 'SELECT name, way FROM planet_osm_polygon WHERE admin_level IS NOT NULL')
AS p(name text, way Geometry);
