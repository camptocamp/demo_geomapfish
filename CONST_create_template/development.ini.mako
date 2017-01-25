[app:app]
use = egg:demo
pyramid.reload_templates = true
pyramid.debug_authorization = false
pyramid.debug_notfound = true
pyramid.debug_routematch = false
pyramid.debug_templates = true
pyramid.includes =
    pyramid_debugtoolbar
mako.directories = demo:templates
    c2cgeoportal:templates
authtkt_secret = ${authtkt["secret"]}
authtkt_cookie_name = ${authtkt["cookie_name"]}
% if "timeout" in authtkt:
authtkt_timeout = ${authtkt["timeout"]}
% endif
app.cfg = %(here)s/.build/config.yaml

[filter:fanstatic]
use = egg:fanstatic#fanstatic
publisher_signature = fanstatic
% if instanceid == "":
base_url = /wsgi
% else:
base_url = /${instanceid}/wsgi
% endif
recompute_hashes = false
versioning = false
bottom = true
minified = false

[pipeline:main]
pipeline =
    egg:WebError#evalerror
    fanstatic
    app

[server:main]
use = egg:waitress#main
host = 0.0.0.0
port = ${waitress_port}

###
# logging configuration
# http://docs.pylonsproject.org/projects/pyramid/en/1.5-branch/narr/logging.html
###

[loggers]
keys = root, sqlalchemy, c2cgeoportal, demo

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console

[logger_c2cgeoportal]
level = INFO
handlers =
qualname = c2cgeoportal

[logger_demo]
level = DEBUG
handlers =
qualname = demo

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine
# "level = INFO" logs SQL queries.
# "level = DEBUG" logs SQL queries and results.
# "level = WARN" logs neither.  (Recommended for production systems.)

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(asctime)s %(levelname)-5.5s [%(name)s][%(threadName)s] %(message)s
