---
project_folder: demo_geomapfish
project_package: ${package}
hecker_url: https://localhost/${instanceid}/wsgi/c2c/health_check?
checker_headers:
  Host: ${host}
managed_files: []
template_vars:
  package: demo
  srid: 21781
  extent: 489246,78873,837119,296543
  apache_vhost: demo_geomapfish
