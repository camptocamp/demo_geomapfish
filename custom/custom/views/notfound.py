from pyramid.view import notfound_view_config


@notfound_view_config(renderer="custom:templates/404.mako")
def notfound_view(request):
    request.response.status = 404
    return {}
