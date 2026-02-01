# Assemblock

Local dev:
- `npm run dev` inside `client/`
- `poetry run python manage.py runserver` inside `_server/`

Production build + deploy steps:
1. `cd client` and run `npm install` (first time) then `npm run build`. This writes the Vite manifest and hashed assets into `_server/core/static/core/`.
2. `cd ../_server` and run `poetry install --no-root` to sync dependencies (includes WhiteNoise).
3. Still in `_server/`, run `poetry run python manage.py collectstatic --noinput`. The compiled assets move into `_server/staticfiles/` where WhiteNoise serves them.
4. Launch the Django app with `poetry run python manage.py runserver --insecure` for a quick prod preview, or point your real WSGI server (Gunicorn/Uvicorn) at `_server.wsgi`.
5. Ensure the environment sets `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, and `ASSET_URL` (for dev proxy) before starting the process.