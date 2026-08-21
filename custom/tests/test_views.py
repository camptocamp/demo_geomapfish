import pytest


@pytest.mark.asyncio
async def test_index(async_client) -> None:
    """Test the index endpoint returns empty dict."""
    response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json() == {}


@pytest.mark.asyncio
async def test_notfound(async_client) -> None:
    """Test that unknown routes return 404."""
    response = await async_client.get("/nonexistent")
    assert response.status_code == 404
