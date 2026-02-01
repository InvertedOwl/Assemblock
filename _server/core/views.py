import json
import os

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.db.models import Count
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render

# Load manifest and front-end entrypoint metadata once when the server starts
MANIFEST = {}
ENTRYPOINT = {}
ENTRY_JS = ""
ENTRY_CSS = ""

if not settings.DEBUG:
    manifest_path = settings.BASE_DIR / "core" / "static" / "core" / "manifest.json"
    try:
        with open(manifest_path, encoding="utf-8") as manifest_file:
            MANIFEST = json.load(manifest_file)
    except FileNotFoundError as exc:
        raise RuntimeError(
            "Missing manifest.json. Run the front-end build before starting the server with DEBUG=False."
        ) from exc

    # Prefer the entry flagged by Vite, otherwise fall back to the common keys.
    entry_key = next(
        (key for key, value in MANIFEST.items() if value.get("isEntry")),
        None,
    )
    fallback_keys = ("src/main.jsx", "src/main.tsx", "src/main.ts")
    if entry_key is None:
        entry_key = next((key for key in fallback_keys if key in MANIFEST), None)

    if entry_key is None:
        raise RuntimeError("Could not locate the Vite entry in manifest.json")

    ENTRYPOINT = MANIFEST[entry_key]
    ENTRY_JS = ENTRYPOINT.get("file", "")
    css_files = ENTRYPOINT.get("css") or []
    ENTRY_CSS = css_files[0] if css_files else ""

# Create your views here.
@login_required
def index(req):
    print("IS DEBUG " + str(settings.DEBUG))
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else ENTRY_JS,
        "css_file": "" if settings.DEBUG else ENTRY_CSS,
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
        # Pagination params
        try:
            page = int(req.GET.get('page', 1))
        except (ValueError, TypeError):
            page = 1
        try:
            page_size = int(req.GET.get('page_size', 10))
        except (ValueError, TypeError):
            page_size = 10

        queryset = Script.objects.filter(owner=user, unlisted=False, removed=False).annotate(favorites_count=Count('favorited_by')).order_by("-updated_at")
        paginator = Paginator(queryset, page_size)
        try:
            page_obj = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            page_obj = paginator.page(1)

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
            for script in page_obj.object_list
        ]

        return JsonResponse({
            "scripts": scripts_list,
            "page": page_obj.number,
            "page_size": page_size,
            "total_pages": paginator.num_pages,
            "total_count": paginator.count
        })

@login_required
def public_scripts(req):
    if req.method == "GET":
        from .models import Script
        # Pagination params
        try:
            page = int(req.GET.get('page', 1))
        except (ValueError, TypeError):
            page = 1
        try:
            page_size = int(req.GET.get('page_size', 10))
        except (ValueError, TypeError):
            page_size = 10

        queryset = Script.objects.filter(unlisted=False, removed=False).annotate(favorites_count=Count('favorited_by')).order_by("-updated_at")
        paginator = Paginator(queryset, page_size)
        try:
            page_obj = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            page_obj = paginator.page(1)

        scripts_list = [
            {
                "id": script.id,
                "title": script.title,
                "created_at": script.created_at,
                "updated_at": script.updated_at,
                "owner": User.objects.get(id=script.owner_id).first_name + " " + User.objects.get(id=script.owner_id).last_name,
                "favorited": script.favorites_count,
                "is_favorited": req.user in script.favorited_by.all(),
                "is_owner": script.owner == req.user
            }
            for script in page_obj.object_list
        ]

        return JsonResponse({
            "scripts": scripts_list,
            "page": page_obj.number,
            "page_size": page_size,
            "total_pages": paginator.num_pages,
            "total_count": paginator.count
        })

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
        removed = data.get("removed", False)

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

                # Always allow toggling favorites for the current user.
                if favorited is not None:
                    if favorited:
                        script.favorited_by.add(req.user)
                    else:
                        script.favorited_by.remove(req.user)

                # Only the owner may modify the script content or metadata.
                if script.owner == req.user:
                    script.script_json = script_json
                    script.title = title
                    script.unlisted = unlisted
                    script.settings_json = settings
                    script.removed = removed
                    script.save()
                else:
                    # Non-owners may not change other fields; ignore them and return success.
                    pass
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
            # Never return scripts marked as removed
            if getattr(script, "removed", False):
                return JsonResponse({"error": "Script not found."}, status=404)
            response_data = {
                "id": script.id,
                "title": script.title,
                "script_json": script.script_json,
                "created_at": script.created_at,
                "updated_at": script.updated_at,
                "unlisted": script.unlisted,
                "favorited": req.user in script.favorited_by.all(),
                "is_owner": script.owner == req.user,
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
    elif req.method == "DELETE":
        print("Received DELETE request for script")
        # Expect JSON body with {"id": <script_id>} to delete a script
        try:
            data = json.loads(req.body)
        except (ValueError, TypeError):
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        script_id = data.get("id")
        if script_id is None or script_id == "":
            return JsonResponse({"error": "Missing script id in request body."}, status=400)

        try:
            script_pk = int(script_id)
        except (ValueError, TypeError):
            return JsonResponse({"error": "Invalid script id. Expected integer."}, status=400)

        from .models import Script

        try:
            script = Script.objects.get(id=script_pk)
            # Only the owner can delete the script
            if script.owner != req.user:
                return JsonResponse({"error": "Permission denied. Only owner can delete."}, status=403)

            # Prefer soft-delete when `removed` field exists, otherwise hard delete
            if hasattr(script, "removed"):
                script.removed = True
                script.save()
            else:
                script.delete()

            return JsonResponse({"success": True})
        except Script.DoesNotExist:
            return JsonResponse({"error": "Script not found."}, status=404)