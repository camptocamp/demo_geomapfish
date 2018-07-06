project_folder: demo_geomapfish
project_package: ${package}
host: ${host}
# Legacy configuration option for checker
checker_path: /${instanceid}/wsgi/check_collector?
# New configuration option for checker
#checker_url: https://${host}/${instanceid}/wsgi/check_collector?
template_vars:
    package: demo
    srid: 21781
    extent: 489246,78873,837119,296543
    apache_vhost: demo_geomapfish
