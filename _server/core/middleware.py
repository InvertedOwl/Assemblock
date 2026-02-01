import os

import requests
from django.http import StreamingHttpResponse


STATIC_PROXY_PREFIX = "/static/core"


def asset_proxy_middleware(next_handler):
    def middleware(request):
        if "." in request.path:
            asset_url = os.environ.get("ASSET_URL", "")
            if asset_url and not asset_url.startswith(("http://", "https://")):
                asset_url = "https://" + asset_url

            upstream_path = request.path
            if upstream_path.startswith(STATIC_PROXY_PREFIX):
                upstream_path = upstream_path[len(STATIC_PROXY_PREFIX):]

            response = requests.get(f"{asset_url}{upstream_path}", stream=True)

            return StreamingHttpResponse(
                response.raw,
                content_type=response.headers.get("content-type"),
                status=response.status_code,
                reason=response.reason,
            )

        return next_handler(request)

    return middleware