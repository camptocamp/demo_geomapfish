---
project_folder: demo_geomapfish
project_package: ${package}
checker_url: https://${host}/${instanceid}/wsgi/c2c/health_check?max_level=9
template_vars:
  package: ${package}
  srid: ${srid}
  extent: 489246, 78873, 837119, 296543
  apache_vhost: demo_geomapfish
managed_files:
  - deploy/deploy\.cfg\.mako
  - apache/application\.wsgi\.mako
unmanaged_files:
  - geoportal/demo_geoportal/static-ngeo/less/desktop\.less
  - geoportal/demo_geoportal/static-ngeo/less/mobile\.less
  - geoportal/demo_geoportal/static-ngeo/components/contextualdata/contextualdata\.html
  - geoportal/demo_geoportal/static-ngeo/components/README\.md
  - geoportal/demo_geoportal/static-ngeo/js/apps/Controller*\.js
  - geoportal/demo_geoportal/static-ngeo/js/apps/desktop\.html\.ejs
  - geoportal/demo_geoportal/static-ngeo/js/apps/mobile\.html\.ejs
  - geoportal/demo_geoportal/static-ngeo/js/apps/image/.*
  - geoportal/demo_geoportal/templates/api/api\.js
  - geoportal/demo_geoportal/templates/api/apihelp\.html
  - geoportal/demo_geoportal/templates/api/mapconfig\.js
  - geoportal/demo_geoportal/templates/api/xapi\.js
  - geoportal/demo_geoportal/templates/api/xapihelp\.html
  - print/print-apps/demo/.*
