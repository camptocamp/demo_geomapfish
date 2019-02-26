---
project_folder: demo_geomapfish
project_package: ${package}
checker_url: ${docker_web_protocol}://${docker_host}${docker_entry_point}c2c/health_check?max_level=9
template_vars:
  package: ${package}
  srid: ${srid}
  extent: 489246, 78873, 837119, 296543
  apache_vhost: demo_geomapfish
managed_files:
  - geoportal/demo_geoportal/__init__\.py
  - \.gitignore
  - spell-ignore-words\.txt
  - \.travis\.yml
unmanaged_files:
  - geoportal/demo_geoportal/static-ngeo/components/contextualdata/contextualdata\.html
  - geoportal/demo_geoportal/static-ngeo/components/README\.md
  - geoportal/demo_geoportal/static-ngeo/js/apps/Controller.*\.js
  - geoportal/demo_geoportal/static-ngeo/js/apps/desktop\.html\.ejs
  - geoportal/demo_geoportal/static-ngeo/js/apps/mobile\.html\.ejs
  - geoportal/demo_geoportal/static-ngeo/js/apps/desktop_alt\.html\.ejs
  - geoportal/demo_geoportal/static-ngeo/js/apps/mobile_alt\.html\.ejs
  - geoportal/demo_geoportal/static-ngeo/js/apps/oeview\.html\.ejs
  - geoportal/demo_geoportal/static-ngeo/js/apps/oeedit\.html\.ejs
  - geoportal/demo_geoportal/static-ngeo/js/apps/scss/.*
  - geoportal/demo_geoportal/static-ngeo/js/apps/image/.*
  - geoportal/demo_geoportal/templates/api/apihelp\.html
  - geoportal/demo_geoportal/templates/api/mapconfig\.js
  - geoportal/demo_geoportal/templates/api/xapihelp\.html
  - print/print-apps/demo/.*\.jrxml
