# A compose file for development.
% if dbhost == "db":
db:
  build: testDB
  environment:
    POSTGRES_USER: ${dbuser}
    POSTGRES_DB: ${db}
    POSTGRES_PASSWORD: ${dbpassword}
% if development == "TRUE":
  ports:
  - 15432:5432
%endif
%endif

print:
  image: ${docker_base}_print:latest
  links:
  - mapserver
% if development == "TRUE":
  ports:
  - 8280:8080
%endif

mapserver:
  image: ${docker_base}_mapserver:latest
% if dbhost == "db":
  links:
  - db
% endif
% if development == "TRUE":
  ports:
  - 8380:80
%endif

wsgi:
  image: ${docker_base}_wsgi:latest
  links:
  - mapserver
  - print
% if dbhost == "db":
  - db
% endif
  ports:
  - 8480:80
