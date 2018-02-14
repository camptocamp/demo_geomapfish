---
# A compose file for development.
version: '2'
services:
  config:
    image: ${docker_base}-config:${docker_tag}

% if development == "TRUE":
  db:
    image: ${docker_base}-testdb:${docker_tag}
    environment:
      POSTGRES_DB: geomapfish
      POSTGRES_USER: www-data
      POSTGRES_PASSWORD: www-data
    ports:
      - 15432:5432
% endif

  print:
    image: camptocamp/mapfish_print:3.12
    volumes_from:
      - config:ro
% if development == "TRUE":
    ports:
      - 8280:8080
% endif

  mapserver:
    image: camptocamp/mapserver:7.0
    volumes_from:
      - config:ro
% if development == "TRUE":
    ports:
      - 8380:80
% endif

  mapcache:
    image: camptocamp/mapcache:1.6
    volumes_from:
      - config:ro
% if development == "TRUE":
    ports:
      - 8480:80
% endif

  memcached:
    image: memcached:1.5

  redis:
    image redis:3.2

  geoportal:
    image: ${docker_base}-geoportal:${docker_tag}
    ports:
      - 8180:80
    environment:
      PGHOST: 172.17.0.1
      PGHOST_SLAVE: 172.17.0.1
      PGPORT: 5432
      PGUSER: www-data
      PGPASSWORD: www-data
      PGDATABASE: demo_geomapfish_2_3
      PGSCHEMA: main
      PGSCHEMA_STATIC: main_static
      REDIS_HOST: redis
      REDIS_PORT: 6379
      VISIBLE_WEB_HOST: localhost:8080
      VISIBLE_WEB_PROTOCOL: http
      VISIBLE_ENTRY_POINT: /sbrunner
      TINYOWS_URL: http://tinyows/
      MAPSERVER_URL: http://mapserver/
      PRINT_URL: http://print:8080/print/
% if development == "TRUE":
      GUNICORN_PARAMS: -b :80 --worker-class=gthread --threads=10 --workers=5 --access-logfile=-
% endif
