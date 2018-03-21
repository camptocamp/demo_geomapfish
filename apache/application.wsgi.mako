import site
import sys
import re
import os
from logging.config import fileConfig

os.environ['SENTRY_URL'] = 'https://eb74985290ea4f3c9ae6665db9252d72:0f56f89956d34815a336fc04c3fce1e4@sentry.camptocamp.com/14'
os.environ['SENTRY_CLIENT_ENVIRONMENT'] = '${instanceid}'
os.environ['SENTRY_CLIENT_RELEASE'] = '2.3'
os.environ['SENTRY_TAG_SERVICE'] = 'wsgi'

root = "${project_directory}"

sys.path = ["${python_path}"] + sys.path

from pyramid.paster import get_app

configfile = os.path.join(root, "geoportal", "${'development' if development == 'TRUE' else 'production'}.ini")

# Load the logging config without using pyramid to be able to use environment variables in there.
vars = dict(__file__=configfile, here=os.path.dirname(configfile))
vars.update(os.environ)
fileConfig(configfile, defaults=vars)

application = get_app(configfile, 'main')
