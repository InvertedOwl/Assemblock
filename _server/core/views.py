from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http import JsonResponse

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

@login_required
def get_me(req):
    user = req.user
    # Remove password before sending user data
    user_dict = model_to_dict(user)
    user_dict.pop("password", None)
    return JsonResponse({"user": user_dict})

@login_required
def script(req):
    if req.method == "POST":
        data = json.loads(req.body)
        script_id = data.get("id")
        script_json = data.get("script_json")
        title = data.get("title", "Untitled Script")

        from .models import Script

        if script_id:
            try:
                script = Script.objects.get(id=script_id, owner=req.user)
                script.script_json = script_json
                script.title = title
                script.save()
            except Script.DoesNotExist:
                return JsonResponse({"error": "Script not found."}, status=404)
        else:
            script = Script.objects.create(
                owner=req.user,
                title=title,
                script_json=script_json
            )

        return JsonResponse({"success": True, "script_id": script.id})
    elif req.method == "GET":
        script_id = req.GET.get("id")
        from .models import Script

        try:
            script = Script.objects.get(id=script_id, owner=req.user)
            return JsonResponse({
                "id": script.id,
                "title": script.title,
                "script_json": script.script_json,
                "created_at": script.created_at,
                "updated_at": script.updated_at
            })
        except Script.DoesNotExist:
            return JsonResponse({"error": "Script not found."}, status=404)