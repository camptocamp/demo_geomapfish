import logging

# from oauthlib.oauth2 import WebApplicationClient
from pyramid.view import view_config
from requests_oauthlib import OAuth2Session

LOG = logging.getLogger(__name__)


oauth = OAuth2Session(
    "803fbeb6549dfb9fd6f2", scope=["read:org"], redirect_uri="https://localhost:8484/callback", state="1234"
)
LOG.error(oauth.authorization_url("https://github.com/login/oauth/authorize"))


@view_config(route_name="callback", renderer="json")
def callback(request):
    # https://github.com/login/oauth/authorize?client_id=803fbeb6549dfb9fd6f2&redirect_uri=https%3A%2F%2Flocalhost%3A8484%2Fcallback&scope=read:org
    # client = WebApplicationClient('803fbeb6549dfb9fd6f2')
    # LOG.error(client.prepare_request_uri('https://github.com/login/oauth/authorize',
    # scope=['user'], redirect_uri="redirect_uri=https://localhost:8484/callback"))
    # LOG.error(client.parse_request_uri_response(request.current_route_url(_query=request.GET)))
    # {'code': '8cc704fb585ce137ed7e'}
    LOG.error(oauth.authorization_url("https://github.com/login/oauth/authorize"))

    if "error" in request.GET:
        LOG.error(request.GET)
        return dict(request.GET)

    LOG.error(request.current_route_url(_query=request.GET))

    token = oauth.fetch_token(
        "https://github.com/login/oauth/access_token",
        authorization_response=request.current_route_url(_query=request.GET),
        client_secret="4fa29c69757a5b1f9b0ba9a3a9bc6ae4df4e89a3",
    )
    LOG.error(token)

    user = oauth.get("https://api.github.com/user").json()
    LOG.error(
        [
            n["name"]
            for n in oauth.post(
                "https://api.github.com/graphql",
                json={
                    "query": """query Teams($org: String!, $user: String!) {
organization(login: $org) {
    teams(first: 100, userLogins: [$user]) {
      totalCount
      nodes {
        name
        description
      }
    }
  }
}
""",
                    "variables": {"org": "camptocamp", "user": user["login"]},
                },
            ).json()["data"]["organization"]["teams"]["nodes"]
        ]
    )

    return {}
