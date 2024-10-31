import os

import pyramid.request  # type: ignore[import-untyped]
import pyramid.response  # type: ignore[import-untyped]
from cornice import Service  # type: ignore[import-untyped]

index = Service(
    name="index",
    description="The index page",
    path="/",
    cors_origins=(os.environ.get("VISIBLE_WEB_HOST", "*"),),
)


@index.get()
def index_get(request: pyramid.request.Request) -> pyramid.response.Response:
    return request.response
