from pyramid.config import Configurator


def includeme(config: Configurator) -> None:
    """Initialize the development tools for a Pyramid app."""
    del config  # Unused.
