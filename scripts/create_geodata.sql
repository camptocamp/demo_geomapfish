CREATE SCHEMA geodata;
CREATE TABLE geodata.osm_firestations (
osm_id BIGSERIAL,
name text,
geom public.geometry(Polygon,2056)
);
CREATE TABLE geodata.osm_hospitals (
osm_id BIGSERIAL,
name text,
geom public.geometry(Point,2056)
);
GRANT USAGE ON SCHEMA geodata TO "www-data";
GRANT SELECT ON ALL TABLES IN SCHEMA geodata TO "www-data";

INSERT INTO geodata.osm_firestations
(osm_id, name, geom)
SELECT
osm_id, name, ST_Transform(way, 2056)
FROM
dblink('dbname=osm', 'SELECT osm_id, name, way FROM planet_osm_polygon WHERE amenity = ''fire_station''')
AS (osm_id bigint, name text, way Geometry);
INSERT INTO geodata.osm_hospitals
(osm_id, name, geom)
SELECT
osm_id, name, ST_Transform(way, 2056)
FROM
dblink('dbname=osm', 'SELECT osm_id, name, way FROM planet_osm_point WHERE amenity = ''hospital''')
AS (osm_id bigint, name text, way Geometry);
