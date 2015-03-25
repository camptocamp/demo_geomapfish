from pyramid.paster import get_app
from logging.config import fileConfig

configfile = "${directory}/${'development' if development == 'TRUE' else 'production'}.ini"
fileConfig(configfile)
application = get_app(configfile, 'main')
