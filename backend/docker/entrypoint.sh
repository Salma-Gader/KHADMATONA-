#!/bin/sh
set -e

# Config/route/view caching has to happen at container *start*, not at
# `docker build` time - the env vars it bakes in (DB_HOST, APP_KEY, Cloudinary
# keys, ...) only exist once docker-compose injects them via env_file, which
# happens on `docker compose up`, long after the image is built.
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link || true

# Deliberately NOT running `php artisan migrate` here - see README.md's
# Deployment section: migrations are a manual, explicit step so they never
# race across multiple container starts/replicas.

exec "$@"
