import pyramid.request
from pyramid.security import ALL_PERMISSIONS, Allow


class Root:
    """The Pyramid root object."""

    __acl__ = [(Allow, "role_admin", ALL_PERMISSIONS)]  # noqa: RUF012

    def __init__(self, request: pyramid.request.Request) -> None:
        self.request = request
