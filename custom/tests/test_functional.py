import pytest


@pytest.mark.asyncio
async def test_index_endpoint(async_client) -> None:
    """Test the root endpoint returns 200."""
    res = await async_client.get("/")
    assert res.status_code == 200


@pytest.mark.asyncio
async def test_health_check(async_client) -> None:
    """Test the c2c health check endpoint."""
    res = await async_client.get("/c2c/health", follow_redirects=True)
    assert res.status_code == 200
