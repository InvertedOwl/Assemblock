from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.db.models import Count
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


@login_required
def index(req):
    asset_url = os.environ.get("ASSET_URL", "")
    # If ASSET_URL provided without scheme (e.g. "static.assemblock.dev"),
    # default to https to avoid producing relative URLs like
    # https://assemblock.dev/static.assemblock.dev/...
    if asset_url and not asset_url.startswith(("http://", "https://")):
        asset_url = "https://" + asset_url

    context = {
        "asset_url": asset_url,
        "debug": settings.DEBUG,
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