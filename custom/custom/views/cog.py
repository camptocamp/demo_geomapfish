import logging
import logging.config
import os
import subprocess  # nosec
from itertools import product

import boto3
import botocore.client
import c2cwsgiutils.pyramid_logging
import c2cwsgiutils.setup_process
import jsonschema_validator
import psycopg2
import pyramid.request
import pyramid.response
import requests
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, ContainerClient, ContentSettings
from c2cwsgiutils import sentry
from cornice import Service
from PIL import Image
from prometheus_client import Counter, Summary
from pyramid.httpexceptions import HTTPBadRequest
from ruamel.yaml import YAML
from shapely.geometry.base import BaseGeometry
from shapely.geometry.polygon import Polygon
from shapely.ops import unary_union
from shapely.wkb import loads as loads_wkb

from custom.models.feedback import Feedback
from custom.util.send_mail import send_mail

_LOGGING = logging.getLogger(__name__)
_CLIENT = None


def _get_azure_container_client(container: str) -> ContainerClient:
    """Get the Azure blog storage client."""
    if "AZURE_STORAGE_CONNECTION_STRING" in os.environ and os.environ["AZURE_STORAGE_CONNECTION_STRING"]:
        return BlobServiceClient.from_connection_string(
            os.environ["AZURE_STORAGE_CONNECTION_STRING"]
        ).get_container_client(container=container)
    elif "AZURE_STORAGE_BLOB_CONTAINER_URL" in os.environ:
        return ContainerClient.from_container_url(os.environ["AZURE_STORAGE_BLOB_CONTAINER_URL"])
    else:
        return BlobServiceClient(
            account_url=os.environ["AZURE_STORAGE_ACCOUNT_URL"],
            credential=DefaultAzureCredential(),
        ).get_container_client(container=container)


feedback = Service(
    name="cog_swissalti3d",
    description="Serve swissalti3d COG",
    path="/cog/swissalti3d",
    cors_origins="*",
)


@feedback.get()
def swissalti3d(request: pyramid.request.Request) -> pyramid.response.Response:
    # Just to demonstrate that we can fet the user information
    global _CLIENT
    if _CLIENT is None:
        _CLIENT = _get_azure_container_client(os.environ["TILEGENERATION_AZURE_CONTAINER"])
    blob = _CLIENT.get_blob_client(blob="swissalti3d_2m_archeo.tif")
    range = request.headers.get("Range")
    if range is None:
        raise HTTPBadRequest("Range header is required")
    if not range.startsWith("bytes="):
        raise HTTPBadRequest("Range header must of type bytes")
    range = range[6:]
    start_str, end_str = range.split("-")
    start = int(start_str)
    end = int(end_str)

    blob_properties = blob.get_blob_properties()
    _LOGGING.debug(blob_properties)
    request.response.headers["Content-Range"] = f"bytes {start}-{end}/{blob_properties.size}"
    request.response.headers["Accept-Ranges"] = "bytes"
    request.response.headers["Content-Type"] = blob_properties.content_settings.content_type

    blob_data = blob.download_blob(offset=start, length=end - start)
    request.response.body = blob_data.readall()
    return request.response
