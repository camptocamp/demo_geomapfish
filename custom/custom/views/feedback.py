import logging
import os
from typing import Any

import pyramid.request
import requests
from cornice import Service
from custom.models.feedback import Feedback
from custom.util.send_mail import send_mail
from pyramid.httpexceptions import HTTPBadRequest

LOG = logging.getLogger(__name__)

feedback = Service(
    name="feedback",
    description="The feedback service",
    path="/feedback",
    cors_origins=(
        (f'https://{os.environ["VISIBLE_WEB_HOST"]}' if "VISIBLE_WEB_HOST" in os.environ else "*"),
    ),
)


@feedback.post()
def feedback_post(request: pyramid.request.Request) -> Any:
    # Just to demonstrate that we can fet the user information
    try:
        LOG.info(
            requests.get(
                f"{os.environ['GEOPORTAL_INTERNAL_URL']}/loginuser",
                headers={"Cookie": request.headers.get("Cookie"), "Referer": request.referrer},
            ).json()
        )
    except Exception:
        LOG.exception("Error on get user information")

    if (
        "permalink" not in request.params
        or "ua" not in request.params
        or "email" not in request.params
        or "email_optional" not in request.params
        or "feedback" not in request.params
    ):
        return HTTPBadRequest(detail="parameter missing")

    new_feedback = Feedback()
    new_feedback.ua = request.params["ua"]
    new_feedback.permalink = request.params["permalink"]
    new_feedback.email = request.params["email"]
    email_optional = request.params["email_optional"]
    new_feedback.text = request.params["feedback"]
    request.dbsession.add(new_feedback)
    request.dbsession.flush()

    if "admin_email" in request.registry.settings:
        mail_list = [request.registry.settings["admin_email"]]

    if email_optional is not None and email_optional != "":
        mail_list.append(email_optional)
    instance = request.params["permalink"].split("?")[0]
    text = "\n\n".join(
        [
            "Ceci est un email automatique. Un nouveau feedback a été inséré dans la BD.",
            "Cela concerne l'instance : " + instance,
            "Son identifiant est le : " + str(new_feedback.id_feedback),
            "User agent : " + new_feedback.ua,
            "Permalink : " + new_feedback.permalink,
            "User email : " + new_feedback.email,
            "User text : " + new_feedback.text,
        ]
    )
    subject = "Feedback - Guichet cartographique"

    if mail_list[0] != "example@example.com":
        send_mail(mail_list, text, subject)

    return {"success": True}
