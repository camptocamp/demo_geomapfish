import os

import pyramid.request
import pyramid.response
from cornice import Service

index = Service(
    name="index",
    description="The index page",
    path="/",
    cors_origins=(os.environ.get("VISIBLE_WEB_HOST", "*"),),
)


@index.get()
def index_get(request: pyramid.request.Request) -> pyramid.response.Response:
    return request.response
