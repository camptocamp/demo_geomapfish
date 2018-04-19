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
  - vars_nondocker\.yaml
  - deploy/deploy\.cfg\.mako
  - apache/application\.wsgi\.mako
unmanaged_files:
  - geoportal/demo_geoportal/static-ngeo/js/demomodule\.js
  - geoportal/demo_geoportal/static-ngeo/js/desktop\.js
  - geoportal/demo_geoportal/static-ngeo/js/mobile\.js
  - geoportal/demo_geoportal/static-ngeo/less/desktop\.less
  - geoportal/demo_geoportal/static-ngeo/less/mobile\.less
  - geoportal/demo_geoportal/static-ngeo/components/contextualdata/contextualdata\.html
  - geoportal/demo_geoportal/templates/desktop\.html
  - geoportal/demo_geoportal/templates/mobile\.html
  - geoportal/demo_geoportal/templates/api/api\.js
  - geoportal/demo_geoportal/templates/api/apihelp\.html
  - geoportal/demo_geoportal/templates/api/mapconfig\.js
  - geoportal/demo_geoportal/templates/api/xapi\.js
  - geoportal/demo_geoportal/templates/api/xapihelp\.html
  - geoportal/demo_geoportal/static-ngeo/components/README\.md
  - print/print-apps/demo/.*
