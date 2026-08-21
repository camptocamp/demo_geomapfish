# Copyright (c) 2019-2026, Camptocamp SA

import logging
import os

from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, ContainerClient
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response

_LOG = logging.getLogger(__name__)
_CLIENT = None

app = FastAPI()


def _get_azure_container_client(container: str) -> ContainerClient:
    """Get the Azure blob storage client."""
    if os.environ.get("AZURE_STORAGE_CONNECTION_STRING"):
        return BlobServiceClient.from_connection_string(
            os.environ["AZURE_STORAGE_CONNECTION_STRING"],
        ).get_container_client(container=container)
    if "AZURE_STORAGE_BLOB_CONTAINER_URL" in os.environ:
        return ContainerClient.from_container_url(os.environ["AZURE_STORAGE_BLOB_CONTAINER_URL"])

    return BlobServiceClient(
        account_url=os.environ["AZURE_STORAGE_ACCOUNT_URL"],
        credential=DefaultAzureCredential(),
    ).get_container_client(container=container)


@app.get("/swissalti3d")
async def swissalti3d(request: Request) -> Response:
    """Serve swissalti3d COG with range requests."""
    global _CLIENT  # pylint: disable=global-statement
    if _CLIENT is None:
        _CLIENT = _get_azure_container_client(os.environ["AZURE_CONTAINER_NAME"])
    blob = _CLIENT.get_blob_client(blob="swissalti3d_2m_archeo.tif")

    range_header = request.headers.get("Range")
    if range_header is None:
        raise HTTPException(status_code=400, detail="Range header is required")
    if not range_header.startswith("bytes="):
        raise HTTPException(status_code=400, detail="Range header must be of type bytes")

    range_header = range_header[6:]
    start_str, end_str = range_header.split("-")
    start = int(start_str)
    end = int(end_str)

    blob_properties = blob.get_blob_properties()
    _LOG.debug("Blob properties: %s", blob_properties)

    blob_data = blob.download_blob(offset=start, length=end - start + 1)

    return Response(
        content=blob_data.readall(),
        status_code=206,
        headers={
            "Content-Range": f"bytes {start}-{end}/{blob_properties.size}",
            "Accept-Ranges": "bytes",
            "Content-Type": blob_properties.content_settings.content_type,
        },
    )
