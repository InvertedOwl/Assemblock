from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.db.models import Count

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

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
def scripts(req):
    if req.method == "GET":
        from .models import Script
        user = req.user
        scripts = Script.objects.filter(owner=user, unlisted=False).annotate(favorites_count=Count('favorited_by')).order_by("-updated_at")
        scripts_list = [
            {
                "id": script.id,
                "title": script.title,
                "created_at": script.created_at,
                "updated_at": script.updated_at,
                "owner": User.objects.get(id=script.owner_id).first_name + " " + User.objects.get(id=script.owner_id).last_name,
                "favorited": script.favorites_count,
                "is_favorited": user in script.favorited_by.all(),
                "is_owner": script.owner == user
            }
            for script in scripts
        ]
        return JsonResponse({"scripts": scripts_list})

@login_required
def script(req):
    if req.method == "POST":
        data = json.loads(req.body)
        script_id = data.get("id")
        script_json = data.get("script_json")
        title = data.get("title", "Untitled Script")
        unlisted = data.get("unlisted", False)
        favorited = data.get("favorited", None)
        settings = data.get("settings", {})

        from .models import Script

        # Normalize script_id: treat empty string as None and validate numeric ids
        if script_id == "":
            script_id = None
        if script_id is not None:
            try:
                script_pk = int(script_id)
            except (ValueError, TypeError):
                return JsonResponse({"error": "Invalid script id. Expected integer or null."}, status=400)
        else:
            script_pk = None

        if script_pk:
            try:
                script = Script.objects.get(id=script_pk)
                if script.owner != req.user:
                    return JsonResponse({"error": "You do not own this script and cannot modify it."}, status=403)

                # Update the script if the user owns it
                script.script_json = script_json
                script.title = title
                script.unlisted = unlisted
                script.settings_json = settings

                # Handle favorited logic
                if favorited is not None:
                    if favorited:
                        script.favorited_by.add(req.user)
                    else:
                        script.favorited_by.remove(req.user)

                script.save()
            except Script.DoesNotExist:
                return JsonResponse({"error": "Script not found."}, status=404)
        else:
            # Create a new script if no id is provided
            script = Script.objects.create(
                owner=req.user,
                title=title,
                script_json=script_json,
                unlisted=unlisted,
                settings_json=settings
            )

            # Handle favorited logic for new script
            if favorited:
                script.favorited_by.add(req.user)

        return JsonResponse({"success": True, "script_id": script.id})

    elif req.method == "GET":
        script_id = req.GET.get("id")
        # Validate presence
        if script_id is None or script_id == "":
            return JsonResponse({"error": "Missing script id in query params. Use ?id=<id>."}, status=400)

        # Validate numeric
        try:
            script_pk = int(script_id)
        except (ValueError, TypeError):
            return JsonResponse({"error": "Invalid script id. Expected integer."}, status=400)

        from .models import Script

        try:
            script = Script.objects.get(id=script_pk)
            response_data = {
                "id": script.id,
                "title": script.title,
                "script_json": script.script_json,
                "created_at": script.created_at,
                "updated_at": script.updated_at,
                "unlisted": script.unlisted,
                "favorited": req.user in script.favorited_by.all(),
                "settings": script.settings_json,
            }

            # If the user does not own the script, include the owner's information
            if script.owner != req.user:
                response_data["owner"] = {
                    "id": script.owner.id,
                    "username": script.owner.username,
                    "first_name": script.owner.first_name,
                    "last_name": script.owner.last_name
                }

            return JsonResponse(response_data)
        except Script.DoesNotExist:
            return JsonResponse({"error": "Script not found."}, status=404)