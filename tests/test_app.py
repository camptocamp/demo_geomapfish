import requests


def test_app():
    response = requests.get("https://front:443", verify=False)
    assert response.status_code == 200


def test_dynamic():
    response = requests.get("https://front:443/dynamic.json?interface=desktop", verify=False)
    assert response.status_code == 200


def test_check():
    response = requests.get("https://front:443/c2c/health_check?max_level=1", verify=False)
    assert response.status_code == 200
