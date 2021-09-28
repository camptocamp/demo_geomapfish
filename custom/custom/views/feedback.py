import os

import pyramid.request
from cornice import Service
from pyramid.httpexceptions import HTTPBadRequest
from pyramid.view import view_config

from c2cgeoportal_commons.models import DBSession

from .. import models
from ..models import Feedback
from ..util.sendmail import send_mail

feedback = Service(
    name="feedback",
    description="The feedback service",
    path="/feedback",
    cors_origins=(os.environ.get("VISIBLE_WEB_HOST", "*"),),
)


@feedback.post()
def feedback_post(request: pyramid.request.Request) -> None:
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
    DBSession.add(new_feedback)
    DBSession.flush()

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
