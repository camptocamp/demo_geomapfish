# A helm values file to be used with this chart:
# https://github.com/camptocamp/private-geo-charts/tree/master/c2cgeoportal
image:
  repositoryPrefix: camptocamp/demo
  tag: stable
  pullPolicy: Always

tilecloudchain:
  s3:
    enabled: true
    key: ${docker_services['tilecloudchain']['environment']['AWS_ACCESS_KEY_ID']}
    secret: ${docker_services['tilecloudchain']['environment']['AWS_SECRET_ACCESS_KEY']}

qgisserver:
  enabled: true

postgresql:
  database: ${docker_services['config']['environment']['PGDATABASE']}
