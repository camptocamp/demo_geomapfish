from custom import models
from custom.views.default import my_view
from custom.views.notfound import notfound_view


def test_my_view_failure(app_request) -> None:
    info = my_view(app_request)
    assert info.status_int == 500


def test_my_view_success(app_request, dbsession) -> None:
    model = models.MyModel(name="one", value=55)
    dbsession.add(model)
    dbsession.flush()

    info = my_view(app_request)
    assert app_request.response.status_int == 200
    assert info["one"].name == "one"
    assert info["project"] == "custom"


def test_notfound_view(app_request) -> None:
    info = notfound_view(app_request)
    assert app_request.response.status_int == 404
    assert info == {}
