import logging
import os

import pyramid.request
import pyramid.response
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, ContainerClient
from cornice import Service
from pyramid.httpexceptions import HTTPBadRequest

_LOGGING = logging.getLogger(__name__)
_CLIENT = None


def _get_azure_container_client(container: str) -> ContainerClient:
    """Get the Azure blog storage client."""
    if "AZURE_STORAGE_CONNECTION_STRING" in os.environ and os.environ["AZURE_STORAGE_CONNECTION_STRING"]:
        return BlobServiceClient.from_connection_string(
            os.environ["AZURE_STORAGE_CONNECTION_STRING"]
        ).get_container_client(container=container)
    if "AZURE_STORAGE_BLOB_CONTAINER_URL" in os.environ:
        return ContainerClient.from_container_url(os.environ["AZURE_STORAGE_BLOB_CONTAINER_URL"])

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
    range_header = request.headers.get("Range")
    if range_header is None:
        raise HTTPBadRequest("Range header is required")
    if not range_header.startsWith("bytes="):
        raise HTTPBadRequest("Range header must of type bytes")
    range_header = range_header[6:]
    start_str, end_str = range_header.split("-")
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
