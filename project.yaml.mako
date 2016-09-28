project_folder: demo_geomapfish
project_package: ${package}
host: testgmf.sig.cloud.camptocamp.net
checker_path: /${instanceid}/wsgi/check_collector?
template_vars:
    package: ${package}
    srid: ${srid}
    extent: 489246, 78873, 837119, 296543
    mobile_application_title: 'Demo Geoportal Mobile Application'
    apache_vhost: demo_geomapfish
