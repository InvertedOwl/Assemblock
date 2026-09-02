# Assemblock

Assemblock is a Django backend with a React/Vite frontend.

## Requirements

- Python 3.11, 3.12, or 3.13
- Poetry
- Node.js and npm

The project declares Python `^3.11`. Python 3.14 may work, but it is not the
target version and can cause dependency installation problems.

## Fresh Setup

Run these commands from the repository root:

```powershell
poetry install
cd client
npm install
cd ..
```

Create `_server/.env` with these local development values:

```env
DJANGO_SECRET_KEY=testing
ASSET_URL=http://localhost:5173
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

`ASSET_URL` is the Vite server origin. Do not add `/static/core`; the Django
templates add that path themselves.

## Create the Database

From `_server/`, create all Django tables with:

```powershell
cd _server
poetry run python manage.py migrate
```

This creates `_server/db.sqlite3`. After changing a Django model, run:

```powershell
poetry run python manage.py makemigrations
poetry run python manage.py migrate
```

Create an optional admin account with:

```powershell
poetry run python manage.py createsuperuser
```

## Run Locally

Start the frontend in one terminal:

```powershell
cd client
npm run dev
```

Start Django in a second terminal:

```powershell
cd _server
poetry run python manage.py runserver
```

Open `http://127.0.0.1:8000`. Keep both servers running. Vite serves the
frontend assets on `http://localhost:5173`.

## Build for Production

Build the frontend from the repository root:

```powershell
cd client
npm install
npm run build
```

The build writes the Vite manifest and compiled assets to
`_server/core/static/core/`. Install backend dependencies and collect static
files:

```powershell
cd ..\_server
poetry install --no-root
```

## Collect Static Files

Run this from `_server/` after every frontend production build:

```powershell
poetry run python manage.py collectstatic --noinput
```

This copies and processes the frontend assets into `_server/staticfiles/`,
where WhiteNoise serves them in production.

For a quick local production preview:

```powershell
poetry run python manage.py runserver --insecure
```

For a real deployment, point a WSGI server at `_server.wsgi` and configure:

- `DJANGO_DEBUG=False`
- `DJANGO_SECRET_KEY` to a private production value
- `DJANGO_ALLOWED_HOSTS`
- `CSRF_TRUSTED_ORIGINS`
- `ASSET_URL` to the deployed asset host

## Troubleshooting Poetry

If Poetry fails before running Django with `ModuleNotFoundError: No module
named 'idna'`, repair the user-level Poetry installation:

```powershell
py -3.13 -m pip install --user --upgrade poetry requests idna
```

Use the installed Python version in place of `3.13` if needed. Then retry the
Poetry commands above. The Django command must include both `python` and a
management command, for example:

```powershell
poetry run python manage.py runserver
```