---
project_folder: demo_geomapfish
project_package: ${package}
host: ${host}
checker_path: /${instanceid}/wsgi/check_collector?
template_vars:
  package: ${package}
  srid: ${srid}
  extent: 489246, 78873, 837119, 296543
  apache_vhost: demo_geomapfish
managed_files: []
unmanaged_files:
  - demo_geomapfish/templates/mobile.html
  - demo_geomapfish/templates/desktop.html
  - demo_geomapfish/static-ngeo/js/mobile.js
  - demo_geomapfish/static-ngeo/js/desktop.js
