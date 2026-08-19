import os

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

os.environ.setdefault("CUSTOM__SQLALCHEMY_URL", "sqlite:///./testing.sqlite")

from custom import app  # noqa: E402


@pytest_asyncio.fixture
async def async_client():
    """Async HTTP client for testing FastAPI app."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
