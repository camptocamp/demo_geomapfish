import logging
from json import loads

from pyramid.view import view_config
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.security import remember
from pyramid.httpexceptions import HTTPBadRequest, HTTPFound, HTTPUnauthorized

from c2cgeoportal_geoportal.resources import defaultgroupsfinder

from duo_web import sign_request, verify_response


LOG = logging.getLogger(__name__)
logging.basicConfig(level=10)

def includeme(config):
    config.add_route('login', '/login')
    config.add_view(login, route_name='login')
    config.add_route('duoweb_post_action', '/duoweb/post_action')
    config.add_view(duoweb_post_action, route_name='duoweb_post_action')


def create_authentication(settings):
    timeout = settings.get("authtkt_timeout")
    timeout = None if timeout is None or timeout.lower() == "none" else int(timeout)
    reissue_time = settings.get("authtkt_reissue_time")
    reissue_time = None if reissue_time is None or reissue_time.lower() == "none" else int(reissue_time)
    max_age = settings.get("authtkt_max_age")
    max_age = None if max_age is None or max_age.lower() == "none" else int(max_age)
    http_only = settings.get("authtkt_http_only", "True")
    http_only = http_only.lower() in ("true", "yes", "1")
    secure = settings.get("authtkt_secure", "True")
    secure = secure.lower() in ("true", "yes", "1")
    samesite = settings.get("authtkt_samesite", "Lax")
    secret = settings.get("authtkt_secret")
    return DuoWebAuthenticationPolicy(
       secret,
        callback=defaultgroupsfinder,
        cookie_name=settings["authtkt_cookie_name"],
        samesite=None if samesite == "" else samesite,
        timeout=timeout,
        max_age=timeout,
        reissue_time=reissue_time,
        hashalg="sha512",
        http_only=http_only,
        secure=secure,
    )

class DuoWebAuthenticationPolicy(AuthTktAuthenticationPolicy):
    def authenticated_userid(self, request):
        userid = self.unauthenticated_userid(request)
        LOG.info('authenticated_userid: %s' % userid)
        if userid is not None:
            return userid


@view_config(route_name='login', renderer='json')
def login(request):
    login = request.params.get("login")
    password = request.params.get("password")
    if login is None or password is None:
        raise HTTPBadRequest()
    username = request.registry.validate_user(request, login, password)
    if username is None:
        raise HTTPUnauthorized()

    config = request.registry.settings.get('duo_web')
    return {
        'sig_request': sign_request(**config, username=username),
    }


@view_config(route_name='duoweb_post_action', renderer='json')
def duoweb_post_action(request):
    body = loads(request.body, encoding=request.charset)
    sig_response = body.get('sig_response')
    config = request.registry.settings.get('duo_web')
    authenticated_username = verify_response(**config, sig_response=sig_response)
    if authenticated_username is not None:
        headers = remember(request, authenticated_username)
        return HTTPFound(request.route_url('loginuser'), headers=headers)
    else:
        raise HTTPUnauthorized()
