CREATE EXTENSION dblink;

INSERT INTO main.tsearch 
(the_geom, layer_name, label, public, role_id, ts)
SELECT
ST_Transform(way, 21781), '', name, TRUE, NULL, to_tsvector('french', name)
FROM
dblink('dbname=osm', 'select name, way from planet_osm_polygon where admin_level IS NOT NULL') AS p(name name, way Geometry);
