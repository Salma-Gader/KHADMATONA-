# Deploying KHADMATONA to Production with Coolify

**Coolify is the recommended, primary production deployment method for this project.** This is a
complete, self-contained guide — a developer with a fresh VPS and this repository should not
need any other document to get the backend and frontend live this way.

> A manual, no-platform alternative also exists — plain `docker compose` with your own Caddy
> reverse proxy, defined in `docker-compose.prod.yml` at the repo root. See
> [`DOCKER_COMPOSE_DEPLOYMENT.md`](./DOCKER_COMPOSE_DEPLOYMENT.md) for when that's a better fit
> than Coolify, and read its warning about never running both on the same VPS (they'd fight over
> ports 80/443).

## Table of Contents

- [1. Architecture](#1-architecture)
- [2. Prerequisites](#2-prerequisites)
- [3. Install Coolify on the VPS](#3-install-coolify-on-the-vps)
- [4. Connect GitHub and enable auto-deploy](#4-connect-github-and-enable-auto-deploy)
- [5. Deploy MySQL](#5-deploy-mysql)
- [6. Deploy Redis](#6-deploy-redis)
- [7. Deploy the backend (Laravel API)](#7-deploy-the-backend-laravel-api)
- [8. Deploy the frontend (Next.js)](#8-deploy-the-frontend-nextjs)
- [9. First-time setup](#9-first-time-setup)
- [10. Queue workers and the scheduler](#10-queue-workers-and-the-scheduler)
- [11. Domains, HTTPS, and SSL](#11-domains-https-and-ssl)
- [12. Releasing updates](#12-releasing-updates)
- [13. Verification checklist](#13-verification-checklist)
- [14. Troubleshooting](#14-troubleshooting)

---

## 1. Architecture

Four independent Coolify resources, each its own container, all on the same project's internal
Docker network that Coolify manages automatically:

| Resource | Type | Built from | Public domain |
|---|---|---|---|
| `khadmatona-backend` | Application (Dockerfile) | `backend/Dockerfile.prod` | `api.yourdomain.com` |
| `khadmatona-frontend` | Application (Dockerfile) | `frontend/admin/Dockerfile.prod` | `app.yourdomain.com` |
| `khadmatona-mysql` | Database (MySQL 8.4) | Coolify-managed image | internal only |
| `khadmatona-redis` | Database (Redis) | Coolify-managed image | internal only |

```
                    ┌────────────────────────────┐
  Internet ── 443 ──▶  Coolify proxy (Traefik)    │
                    │  Let's Encrypt SSL, auto     │
                    └───────────┬────────────┬────┘
                                │            │
                    api.yourdomain.com   app.yourdomain.com
                                │            │
                    ┌───────────▼───┐  ┌─────▼──────────┐
                    │ khadmatona-    │  │ khadmatona-     │
                    │ backend        │  │ frontend        │
                    │ (nginx +       │  │ (Next.js        │
                    │  php-fpm +     │  │  standalone     │
                    │  queue-worker, │  │  server.js)     │
                    │  supervisord)  │  │                 │
                    └───┬────────┬───┘  └─────────────────┘
                        │        │
              ┌─────────▼──┐  ┌──▼──────────┐
              │ khadmatona- │  │ khadmatona- │
              │ mysql       │  │ redis       │
              └─────────────┘  └─────────────┘
```

The backend image (`backend/Dockerfile.prod`) is self-contained: nginx and php-fpm serve the
Laravel app, and a queue worker (`php artisan queue:work`) runs alongside them under
`supervisord` — see `backend/docker/supervisor/production.conf`. That worker matters because
`App\Core\Media\Concerns\HasMediaConversions` queues thumb/medium image conversions; without a
worker consuming that queue, `cover_image`/`images` URLs in API responses never resolve.

Nothing in `backend/Dockerfile.prod` or `frontend/admin/Dockerfile.prod` is Coolify-specific —
they build and run identically under plain `docker build`/`docker run`, which is exactly how they
were built and smoke-tested while being written. Coolify just automates the build, the proxy, the
databases, and the deploy trigger around them.

## 2. Prerequisites

- **A VPS** running a fresh Ubuntu 22.04/24.04 (or other Coolify-supported Linux) install, root
  or sudo SSH access, and a public IPv4 address.
  - Minimum: 2 vCPU / 4 GB RAM. Below that, MySQL + Redis + the backend's queue worker + Coolify's
    own management containers will compete hard for memory.
  - Recommended: 4 vCPU / 8 GB RAM, SSD storage.
- **A domain you control**, with two DNS **A records** already created and pointing at the VPS's
  IP *before* you deploy — Coolify requests a Let's Encrypt certificate per domain on first
  deploy, and that request fails if DNS isn't resolving yet:
  - `api.yourdomain.com` → VPS IP
  - `app.yourdomain.com` → VPS IP
- **Docker**: you don't need to install it yourself — Coolify's installer does this for you on a
  fresh VPS. If Docker is already installed, Coolify detects and reuses it.
- **GitHub access** to `Salma-Gader/KHADMATONA-` (or your fork) — Coolify's GitHub App
  integration is the recommended connection method (private repo access + auto-deploy webhooks
  without managing your own deploy key).
- **Real production credentials** ready to paste in during setup:
  - Cloudinary cloud name + API key + API secret (`console.cloudinary.com` → Settings → API Keys)
  - SMTP credentials for transactional mail (Mailpit only exists in local dev — there is no dev
    mail catcher in production)

## 3. Install Coolify on the VPS

SSH into the VPS as root (or a sudo user) and run Coolify's official installer:

```bash
curl -fsSL https://cdn.coolify.io/coolify/install.sh | bash
```

This installs Docker (if missing), pulls Coolify's own containers, and starts its dashboard on
port `8000`. Once it finishes:

1. Visit `http://<vps-ip>:8000` and complete the first-run wizard — this creates your Coolify
   admin account. Do this immediately; the setup wizard is unauthenticated until the first admin
   account is created.
2. Optional but recommended: under **Settings → Instance**, put the Coolify dashboard itself
   behind its own domain (e.g. `coolify.yourdomain.com`) instead of leaving it on the bare
   `ip:8000`.
3. Under **Settings → Servers**, confirm the "localhost" server Coolify auto-registers (the VPS
   it's running on) shows as validated/reachable — this is the server every resource below
   deploys to.

## 4. Connect GitHub and enable auto-deploy

**Sources → Add → GitHub App** (recommended over a plain deploy key — it gives Coolify push-event
webhooks for automatic redeploys and scoped, revocable repo access). Authorize it against
`Salma-Gader/KHADMATONA-`. If the repo is private, grant the GitHub App access to it specifically
rather than your whole account.

You'll pick this source when creating both the backend and frontend applications below. Whether
a push to the deploy branch triggers an automatic redeploy is a **per-resource** toggle — set it
individually in step 7 and 8, not here.

## 5. Deploy MySQL

**Project → Add Resource → Database → MySQL.** Pick version **8.4** (matches
`backend/compose.yaml`'s local dev version — don't drift versions between environments).

Deploy it, then open the resource's **Connection Details** tab and record:

- **Internal hostname** — Coolify generates this (e.g. something like
  `mysql-<random>` or the container's service name inside its private network). It is **not**
  the literal string `mysql` — that hostname only applies to the alternative
  `docker-compose.prod.yml` path (see `DOCKER_COMPOSE_DEPLOYMENT.md`), not this one.
- **Port** — usually `3306`.
- **Database name, username, password** — Coolify generates these; you can rename the database
  to `khadmatona` for clarity if you prefer, as long as you use the same name in the backend's
  env vars in step 7.

Leave this resource on its own — don't expose it publicly. Only the backend app needs to reach
it, over Coolify's internal network.

## 6. Deploy Redis

**Project → Add Resource → Database → Redis.** Deploy it, then open **Connection Details** and
record the same three things: internal hostname, port (usually `6379`), and password (Redis may
or may not have one depending on how Coolify provisioned it — note whichever applies).

## 7. Deploy the backend (Laravel API)

**Project → Add Resource → Application → Dockerfile**, pointing at the GitHub source from step 4:

| Setting | Value |
|---|---|
| Repository | `Salma-Gader/KHADMATONA-` |
| Branch | `main` (or your release branch) |
| Base Directory | `/backend` |
| Dockerfile Location | `Dockerfile.prod` (relative to the base directory) |
| Port | `80` |
| Health Check Path | `/up` |
| Domain | `https://api.yourdomain.com` |
| Auto Deploy on Push | on, once you've confirmed the first manual deploy works |

The health check path is Laravel's own built-in health route (`bootstrap/app.php`'s
`health: '/up'`) — Coolify uses it to know the container is actually serving traffic, not just
running.

### Backend environment variables

Add every one of these under the application's **Environment Variables** tab. Values in
`<angle brackets>` come from steps 5–6; everything else is a real production value you provide.

```
APP_NAME=KHADMATONA
APP_ENV=production
APP_KEY=                                    # leave blank - generated in step 9
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr
APP_FAKER_LOCALE=fr_FR
SUPPORTED_LOCALES=ar,fr,en
APP_MAINTENANCE_DRIVER=file
BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=<internal hostname from step 5>
DB_PORT=<port from step 5, usually 3306>
DB_DATABASE=<database name from step 5>
DB_USERNAME=<username from step 5>
DB_PASSWORD=<password from step 5>

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.yourdomain.com              # leading dot - shared across api./app. subdomains
SANCTUM_STATEFUL_DOMAINS=app.yourdomain.com
FRONTEND_URL=https://app.yourdomain.com

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis

MEDIA_DISK=cloudinary
CLOUDINARY_CLOUD_NAME=<real value>
CLOUDINARY_API_KEY=<real value>
CLOUDINARY_API_SECRET=<real value>

CACHE_STORE=redis
REDIS_CLIENT=predis
REDIS_HOST=<internal hostname from step 6>
REDIS_PASSWORD=<password from step 6, or null if none>
REDIS_PORT=<port from step 6, usually 6379>

MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=<real SMTP host>
MAIL_PORT=587
MAIL_USERNAME=<real SMTP username>
MAIL_PASSWORD=<real SMTP password>
MAIL_FROM_ADDRESS=hello@yourdomain.com
MAIL_FROM_NAME=KHADMATONA
```

`SESSION_DOMAIN` / `SANCTUM_STATEFUL_DOMAINS` / `FRONTEND_URL` matter more here than almost
anywhere else in this setup — get them wrong and the frontend's login silently fails with a
rejected cross-site cookie, not an obvious error message. See the
[troubleshooting section](#14-troubleshooting) if that happens.

Click **Deploy**. The build runs exactly what was already built and smoke-tested locally:
Composer install in a throwaway build stage, then a `php:8.4-fpm-alpine` runtime with nginx,
php-fpm, and the queue worker under supervisord.

## 8. Deploy the frontend (Next.js)

**Project → Add Resource → Application → Dockerfile**, same GitHub source:

| Setting | Value |
|---|---|
| Repository | `Salma-Gader/KHADMATONA-` |
| Branch | same as backend |
| Base Directory | `/frontend/admin` |
| Dockerfile Location | `Dockerfile.prod` |
| Port | `3000` |
| Domain | `https://app.yourdomain.com` |
| Auto Deploy on Push | on, once confirmed working |

### `NEXT_PUBLIC_API_URL` must be a Build Variable, not a Runtime Environment Variable

This is the single most common mistake deploying this frontend. Next.js inlines every
`NEXT_PUBLIC_*` variable into the compiled client-side JavaScript bundle **at build time** — by
the time the container is actually running, it's too late for a runtime environment variable to
change it. `frontend/admin/Dockerfile.prod` reflects this: it declares
`ARG NEXT_PUBLIC_API_URL` and consumes it during `RUN npm run build`, not in the final runtime
stage.

Coolify's UI has a separate section for build-time arguments (labeled **Build Variables** /
**Build Args**, depending on your Coolify version) distinct from the application's runtime
**Environment Variables**. Set it there:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

If you set this as a normal runtime environment variable instead, the build will silently
succeed but the deployed app will keep calling whatever placeholder value it was built with
(likely `http://localhost`) — see
[troubleshooting](#14-troubleshooting) for how to recognize and fix this after the fact.

Click **Deploy**.

## 9. First-time setup

Once the backend container is up, open its **Terminal** tab in the Coolify UI (or SSH to the VPS
and `docker exec -it <container> sh`) and run, in order:

```bash
# 1. Generate the application encryption key
php artisan key:generate --force

# 2. Run all migrations, including the posts table etc.
php artisan migrate --force

# 3. Seed the Admin role (and any other required permission seeders)
php artisan db:seed --class="App\Core\Permissions\Database\Seeders\PermissionSeeder" --force

# 4. Create the public/storage symlink, if it doesn't already exist
php artisan storage:link
```

A few notes on each step:

- **`storage:link`** is actually already run automatically on every container start by
  `backend/docker/entrypoint.sh` (`php artisan storage:link || true`) — the `|| true` means it
  silently no-ops if the symlink already exists. Running it manually here is only useful to
  confirm it worked, or to recreate it if something deleted it.
- **`key:generate --force`** writes `APP_KEY` into the **running container's** in-memory/`.env`
  state, not back into Coolify's stored configuration. **Copy the generated key** — run
  `php artisan config:show app.key` right after, or check the command's own output — and paste
  it into the backend application's `APP_KEY` environment variable in the Coolify UI, then
  **redeploy**. If you skip this, the next rebuild generates a *new* random key, which silently
  invalidates every existing session and any signed URLs (password reset links, etc.) currently
  in flight.
- You only need to create the Admin user once. If no seeder creates one yet, register the first
  user through the frontend's sign-up flow (if enabled) or via `php artisan tinker` and assign
  the `Admin` role manually with `spatie/laravel-permission`'s `$user->assignRole('Admin')`.

## 10. Queue workers and the scheduler

### Queue worker (already running, no extra setup needed)

The backend container's `supervisord` (`backend/docker/supervisor/production.conf`) already
starts `php artisan queue:work --tries=3 --sleep=3 --max-time=3600` alongside nginx and php-fpm,
inside the same `khadmatona-backend` resource. You don't need a separate Coolify resource for
this to work — verify it's alive from the resource's **Logs** tab; you should see periodic queue
worker output interleaved with nginx access logs.

`--max-time=3600` forces the worker to restart itself every hour, which supervisord immediately
relaunches (`autorestart=true`) — this bounds any slow memory leak from a badly-behaved job
without needing you to babysit it.

**If you need independent scaling** (e.g. a burst of media uploads is backing up the queue and
you want more worker throughput without redeploying the web process), create a **second**
Coolify Application resource pointed at the same repo/`Dockerfile.prod`, but override its
**Custom Start Command** to:

```
php artisan queue:work --tries=3 --sleep=3 --max-time=3600
```

`backend/docker/entrypoint.sh` still runs first either way (it's the image's `ENTRYPOINT`, not
its `CMD`), so config caching still happens correctly before the queue worker starts — only the
final command changes. Give this second resource the same environment variables as the backend
app, but no public domain (it doesn't serve HTTP).

### Scheduler (not currently needed, but ready to wire up)

`backend/routes/console.php` doesn't register any scheduled commands yet (`bootstrap/app.php` has
no `->withSchedule()` call), so there's nothing to run on a timer today. When a scheduled task is
added, wire it up with Coolify's built-in **Scheduled Tasks** feature on the `khadmatona-backend`
resource, rather than adding a cron daemon inside the container:

1. On the backend resource, open the **Scheduled Tasks** tab.
2. Add a task with the command `php artisan schedule:run` and the cron expression `* * * * *`
   (every minute) — this is the one standard entry Laravel has always needed in a real crontab;
   Coolify just runs it for you via `docker exec` on that VPS-level schedule instead.
3. Laravel's own scheduler (defined via `->withSchedule()` in `bootstrap/app.php`) then decides
   which registered commands actually need to run at that minute.

## 11. Domains, HTTPS, and SSL

Nothing to configure here beyond the **Domain** field you already set in steps 7 and 8. Coolify's
built-in proxy (Traefik) automatically:

- Requests a Let's Encrypt certificate for each domain the first time it sees traffic for it.
- Renews certificates before they expire.
- Terminates TLS and forwards plain HTTP to the right container internally.

The only thing that can make this fail is DNS not actually pointing at the VPS yet when you
deploy (see [prerequisites](#2-prerequisites)) — Coolify's ACME challenge needs the domain to
resolve to this server *before* it requests the certificate. If you deploy before DNS propagates,
fix DNS and then trigger a redeploy (or use the resource's "Restart Proxy"/"Regenerate SSL"
action if your Coolify version exposes one) rather than waiting indefinitely.

## 12. Releasing updates

With **Auto Deploy on Push** enabled (steps 7–8), a `git push` to the deploy branch triggers a
webhook that rebuilds and redeploys the corresponding resource automatically — backend and
frontend redeploy independently, based on which paths changed, if you've scoped the webhook that
way, or both every time otherwise.

To trigger a deploy manually instead (or to re-run one that failed), open the resource and click
**Redeploy**.

**Migrations are never automatic.** Neither the Dockerfile nor Coolify runs
`php artisan migrate` on deploy — this is intentional (see the comment in
`backend/docker/entrypoint.sh`), so schema changes never race across a rolling restart or
multiple replicas. After any deploy that includes a new migration, open the backend's Terminal
tab and run:

```bash
php artisan migrate --force
```

## 13. Verification checklist

Run through this after the first deploy, and after any deploy that touches auth, sessions, or
CORS-adjacent config:

- [ ] `curl -I https://api.yourdomain.com/up` → `200`
- [ ] `curl -I https://api.yourdomain.com/api/v1/i18n/fr` → `200`
- [ ] `curl -I https://app.yourdomain.com/login` → `200`
- [ ] `https://app.yourdomain.com/` loads in a browser and renders real property data (this page
      makes a server-side fetch to the backend — if it 500s, see
      [troubleshooting](#14-troubleshooting))
- [ ] Logging in via `https://app.yourdomain.com/login` with the seeded Admin account succeeds
      and lands on `/dashboard`
- [ ] Creating a property with a cover image in the dashboard shows a real thumbnail shortly
      after upload (confirms Cloudinary credentials *and* the queued media-conversion job *and*
      the queue worker are all working end-to-end)
- [ ] Both domains show a valid, browser-trusted HTTPS certificate (no "not secure" warning)
- [ ] The backend resource's Logs tab shows `nginx`, `php-fpm`, and periodic queue-worker output
      all present — confirms supervisord is running all three processes, not just one

## 14. Troubleshooting

### `APP_KEY`

- **Symptom:** every request 500s immediately after a fresh deploy, or
  `RuntimeException: No application encryption key has been specified.`
  **Fix:** you deployed before running `php artisan key:generate --force` (step 9), or you ran it
  but never copied the generated key back into Coolify's stored `APP_KEY` env var before a
  rebuild wiped it. Regenerate, copy the value into the Coolify UI, redeploy.
- **Symptom:** all users get logged out and every previously-issued signed URL (password reset
  links, etc.) stops working after a routine redeploy.
  **Fix:** the same mistake as above, caught after the fact — a rebuild regenerated `APP_KEY`
  because it wasn't persisted in the stored environment variables. Once fixed, this stops
  recurring on future deploys.

### `public/storage` symlink

- **Symptom:** locally-uploaded/fallback images 404 even though the API says they exist.
  **Fix:** `backend/docker/entrypoint.sh` runs `php artisan storage:link || true` on every
  container start, so this should self-heal on the next restart. If it doesn't, run
  `php artisan storage:link` manually from the Terminal tab and check for a permissions error in
  the output (see the [permissions](#permission-issues) entry below).
- Note this mostly matters for the `local` filesystem fallback — production media (property/blog
  cover images) is served from **Cloudinary** (`MEDIA_DISK=cloudinary`), not this symlink, so a
  broken symlink alone won't break the main gallery/cover-image experience.

### `SESSION_DOMAIN`

- **Symptom:** login appears to succeed (the request returns 200) but the frontend immediately
  looks logged-out again on the next page load.
  **Fix:** `SESSION_DOMAIN` must be the shared parent domain with a **leading dot**
  (`.yourdomain.com`), not either subdomain alone (`api.yourdomain.com` or `app.yourdomain.com`).
  Without the shared parent domain, the session cookie the API sets is scoped only to
  `api.yourdomain.com` and the frontend on `app.yourdomain.com` never sees it.

### `SANCTUM_STATEFUL_DOMAINS`

- **Symptom:** the browser's network tab shows the login `POST` returning 419 or the session
  cookie never getting set at all; Laravel logs show `CSRF token mismatch` or an authentication
  exception on what should be a stateful SPA request.
  **Fix:** `SANCTUM_STATEFUL_DOMAINS` must list the **frontend's** domain
  (`app.yourdomain.com`) — it tells Sanctum which origins are trusted enough to authenticate via
  cookie instead of a bearer token. Listing the API's own domain here instead of the frontend's is
  a common copy-paste mistake.

### Cross-domain authentication and cookies (general)

If login still doesn't stick after checking the two settings above:

1. Confirm both domains are actually on the same parent domain (`api.` and `app.` under the same
   `yourdomain.com`) — Sanctum's cookie-based SPA auth fundamentally requires a shared parent
   domain; two unrelated domains (`khadmatona-api.com` and `khadmatona-app.net`) cannot share a
   session cookie no matter how you configure `SESSION_DOMAIN`.
2. Confirm you're testing over `https://`, not `http://` — with `SESSION_ENCRYPT`/secure cookies
   in play, a mixed-scheme setup (proxy terminates HTTPS but something downstream still thinks
   it's HTTP) can silently drop the `Secure` cookie. Coolify's proxy handles this correctly by
   default; this only tends to bite custom proxy setups layered on top.
3. Check the browser's dev tools → Application → Cookies for the actual domain/flags the cookie
   was set with, rather than guessing from symptoms alone.

### Redis connection issues

- **Symptom:** `Class "Redis" not found` on any request or artisan command that touches Redis
  (migrations that seed cache/queue tables, queue workers, cache reads).
  **Fix:** `REDIS_CLIENT` must be `predis`, not `phpredis` — `backend/Dockerfile.prod` doesn't
  compile the phpredis PECL extension in; `predis/predis` (already a `composer.json` dependency,
  pure PHP, no extension needed) is what this image actually supports, and what local dev uses
  too.
- **Symptom:** `Connection refused` or `getaddrinfo failed` in the backend logs; queued jobs
  never process; cache-dependent pages error out.
  **Fix:** double check `REDIS_HOST` is the **internal hostname Coolify generated** for the
  `khadmatona-redis` resource (step 6's Connection Details), not a placeholder like `redis` or
  `127.0.0.1` — those only resolve inside the alternative `docker-compose.prod.yml` path or on
  your own laptop, never inside a Coolify-managed container.
- **Symptom:** `NOAUTH Authentication required.`
  **Fix:** `REDIS_PASSWORD` is empty/`null` in the backend's env vars but the Redis resource
  actually has a password set — copy the real password from Redis's Connection Details tab.

### MySQL connection issues

- **Symptom:** `SQLSTATE[HY000] [2002] Connection refused` or similar on any request that touches
  the database.
  **Fix:** same class of mistake as Redis — `DB_HOST` must be the MySQL resource's real internal
  hostname from step 5, not `mysql` or `127.0.0.1`.
- **Symptom:** `SQLSTATE[HY000] [1045] Access denied for user`.
  **Fix:** `DB_USERNAME`/`DB_PASSWORD`/`DB_DATABASE` don't match what the MySQL resource was
  actually provisioned with — re-check the Connection Details tab; these are Coolify-generated
  values, not ones you invent yourself.
- **Symptom:** connection works, but `php artisan migrate` fails with a "table already exists" or
  similar on what should be a fresh database.
  **Fix:** you're pointed at a MySQL resource/database that already has data in it from a
  previous attempt. Either reuse it as-is (skip re-migrating a table that already matches) or
  provision a fresh database inside the same MySQL resource and repoint `DB_DATABASE`.

### Docker build failures

- **Symptom:** `composer install` fails with something like
  `spatie/laravel-medialibrary requires ext-exif * -> it is missing from your system`.
  **Fix:** this is already handled in `backend/Dockerfile.prod` — the vendor build stage passes
  `--ignore-platform-reqs` to `composer install`, because the plain `composer:2` build image
  doesn't carry every PHP extension the final runtime stage installs, even though the runtime
  image satisfies all of them. If you ever modify this Dockerfile, keep that flag on the vendor
  stage's `composer install` line.
- **Symptom:** the build fails while sending the Docker build context, with an error mentioning
  `public/storage` or "invalid file request".
  **Fix:** `backend/.dockerignore` already excludes `public/storage` — it's a local
  `artisan storage:link` symlink that some Docker build-context transfer implementations
  (notably Docker Desktop on Windows) can't handle. If this reappears, confirm
  `backend/.dockerignore` still contains that line.
- **Symptom:** the frontend build fails or hangs on `npm ci`.
  **Fix:** confirm `frontend/admin/package-lock.json` is committed and in sync with
  `package.json` — `npm ci` (used in `Dockerfile.prod`, unlike `npm install`) fails hard on any
  mismatch instead of silently resolving one.

### Permission issues

- **Symptom:** `The stream or file ".../storage/logs/laravel.log" could not be opened` or similar
  "permission denied" errors writing to `storage/` or `bootstrap/cache/`.
  **Fix:** `backend/Dockerfile.prod` already runs
  `chown -R www-data:www-data storage bootstrap/cache` at build time, and php-fpm/nginx both run
  as `www-data` inside the container by default on the `php:8.4-fpm-alpine` base image. If you've
  customized the Dockerfile to run as a different user, make sure that `chown` line uses the same
  user your php-fpm pool actually runs as.
- **Symptom:** permission errors specifically after mounting a *host* volume over `storage/`
  (not something the current setup does, but easy to introduce later if you add persistent
  volumes for local file storage) — the container's `www-data` UID/GID won't automatically match
  whatever owns the files on the host. Keep `MEDIA_DISK=cloudinary` for user-uploaded media
  (already the default) to avoid this class of problem entirely; it's only a risk if you add your
  own bind-mounted volumes later.

### Dockerfile-specific problems

- **Frontend shows stale/wrong API behavior after a backend-only change.** Expected — the two
  resources deploy independently. Redeploy the frontend too if the change affects any
  `NEXT_PUBLIC_*` build variable, or if you're unsure, redeploy both together.
- **Homepage (or any SSR page) returns 500 with `ApiError: Could not reach the server` in the
  frontend logs.** `NEXT_PUBLIC_API_URL` either wasn't set as a **Build Variable** (see step 8) or
  was set to the wrong domain when the image was last built. Because the value is compiled into
  the JS bundle, fixing the variable alone isn't enough — you must trigger a full rebuild
  (**Redeploy**, not just a container restart) for the corrected value to take effect.
- **Queue worker logs show jobs failing repeatedly with a Cloudinary auth error.**
  `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` are wrong or belong to a different Cloudinary
  account/cloud than `CLOUDINARY_CLOUD_NAME` — re-copy all three together from the same
  Cloudinary console page, not from memory or an old note.
