from custom import models


def test_my_view_success(testapp, dbsession) -> None:
    model = models.MyModel(name="one", value=55)
    dbsession.add(model)
    dbsession.flush()

    res = testapp.get("/", status=200)
    assert res.body


def test_notfound(testapp) -> None:
    res = testapp.get("/badurl", status=404)
    assert res.status_code == 404
