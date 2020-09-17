from pyramid.i18n import TranslationStringFactory
from pyramid.view import view_config

_ = TranslationStringFactory("geomapfish_geoportal-server")


@view_config(route_name="translation_test", renderer="json")
def translation_test(request):
    return {
        "value": request.translate(_("value"))
    }
