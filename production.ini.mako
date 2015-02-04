[app:app]
use = egg:demo
pyramid.reload_templates = false
pyramid.debug_authorization = false
pyramid.debug_notfound = false
pyramid.debug_routematch = false
pyramid.debug_templates = false
mako.directories = demo:templates
    c2cgeoportal:templates
app.cfg = %(here)s/.build/config.yaml
authtkt_secret = ${authtkt_secret}
authtkt_cookie_name = ${authtkt_cookie_name}

[filter:fanstatic]
use = egg:fanstatic#fanstatic
publisher_signature = fanstatic
base_url = /${instanceid}/wsgi
recompute_hashes = false
versioning = false
bottom = true
minified = true

[pipeline:main]
pipeline =
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
keys = root, demo

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console

[logger_demo]
level = INFO
handlers =
qualname = demo

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(asctime)s %(levelname)-5.5s [%(name)s][%(threadName)s] %(message)s
