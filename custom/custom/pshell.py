# Copyright (c) 2019-2026, Camptocamp SA

from typing import Any

from . import models


def setup(env: dict[str, Any]) -> None:
    request = env["request"]

    # start a transaction
    request.tm.begin()

    # inject some vars into the shell builtins
    env["tm"] = request.tm
    env["dbsession"] = request.dbsession
    env["models"] = models
