from pyramid.config import Configurator


def includeme(config: Configurator) -> None:
    config.add_static_view("static", "static", cache_max_age=3600)
