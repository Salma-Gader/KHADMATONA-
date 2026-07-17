# KHADMATONA

**A Laravel 12 REST API powering KHADMATONA GROUP's real-estate platform — built as a modular
monolith designed to grow into a full ERP/CRM and an Artisans & Home Services Marketplace
without requiring a rewrite.**

> Status: MVP foundation complete (Core layer + module skeletons wired). Business logic for the
> Property/Lead/Lookup/Settings modules is the current implementation phase.

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [Running Migrations](#running-migrations)
- [Running Tests](#running-tests)
- [Code Quality Tools](#code-quality-tools)
- [Modules](#modules)
- [API Overview](#api-overview)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [License](#license)

---

## Description

KHADMATONA GROUP is building a single Moroccan digital ecosystem in phases:

1. **MVP (this repository, current focus):** a premium real-estate showcase website — public
   listings with search/filters, property detail pages, visit/sell/rent request forms — plus an
   admin back-office for managing listings and inbound leads.
2. **Phase 2 (planned):** an IMMO ERP & CRM covering owners, contracts, finance, HR, rental &
   Airbnb management, maintenance, omni-channel communication, AI matching/estimation, document
   management, client/owner portals, and multi-agency/franchise support.
3. **Phase 3 (planned):** an Artisans & Home Services Marketplace — 24 trade categories,
   intelligent search, quoting, ratings, subscriptions, verified profiles, and 24/7 emergency
   dispatch.

This repository contains the backend API. It is deliberately architected so Phases 2 and 3 can
be added as new, isolated modules — without modifying or re-architecting what ships for the
MVP. See [`PROJECT_RULES.md`](./PROJECT_RULES.md) for the full engineering rationale.

## Features

- Real-estate listing search, filtering, and detail pages *(in development)*
- Visit / sell / rent / contact lead capture *(in development)*
- Admin back-office for property and lead management *(in development)*
- Full internationalization: Arabic (RTL), French, English, with a per-locale i18n bundle API
- Dark/light theme preference, stored per user
- Role- and permission-based access control (`spatie/laravel-permission`)
- Polymorphic media library with automatic responsive/WebP conversions
- Full activity/audit logging on business-critical models
- Consistent, versioned, envelope-based JSON API (`/api/v1`)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Laravel 12 |
| Language | PHP 8.4 |
| Database | MySQL 8.4 |
| Cache / Queue | Redis |
| Authentication | Laravel Sanctum |
| Roles & Permissions | `spatie/laravel-permission` |
| Media Library | `spatie/laravel-medialibrary` |
| Activity Logging | `spatie/laravel-activitylog` |
| API Query Building | `spatie/laravel-query-builder` |
| Testing | Pest |
| Code Style | Laravel Pint (PSR-12) |
| Local Environment | Docker (Sail-generated `compose.yaml`) |
| Dev Mail Catcher | Mailpit |

## Architecture

The backend is a **modular monolith**: one Laravel application, one MySQL database, and strict
internal boundaries between business domains — not a set of microservices, and not a single
undifferentiated app either.

- **API-first / headless.** Laravel serves `/api/v1` only. The public site, admin back-office,
  and future mobile apps/portals are independent clients of this API.
- **Clean Architecture per module:** `Domain` (entities, repository contracts, events) →
  `Application` (services/actions) → `Infrastructure` (repository implementations, adapters) →
  `Presentation` (`Http`: controllers, requests, resources, routes). Dependencies point inward.
- **A `Core` layer** (`app/Core/`) holds everything cross-cutting — authentication, roles &
  permissions, localization, theming, media, notifications, activity logging — so every module
  reuses the same foundation instead of reinventing it.
- **Module isolation:** business modules never import each other's classes directly. They
  communicate only through domain events, Core-published contracts, or shared polymorphic
  tables (`media`, `translations`, permissions).

Full details, including the rationale for every architectural decision, live in
[`PROJECT_RULES.md`](./PROJECT_RULES.md).

## Folder Structure

```
KHADMATONA-/
├─ backend/                     # this Laravel API
│  ├─ app/
│  │  ├─ Core/                  # cross-cutting: Auth, Permissions, Localization, Theme,
│  │  │                         # Media, Notification, ActivityLog, Support
│  │  ├─ Modules/                # business domains: Property, Lead, Lookup, Settings, ...
│  │  ├─ Models/User.php
│  │  └─ Providers/
│  ├─ bootstrap/
│  │  ├─ app.php                 # middleware, exception handling, api/v1 prefix
│  │  └─ providers.php            # manifest of every registered Core + Module provider
│  ├─ config/
│  ├─ database/                  # shared/Core migrations + seeders entrypoint
│  ├─ lang/{ar,fr,en}/            # translation bundles
│  ├─ routes/api.php              # requires each module's Http/routes.php
│  ├─ compose.yaml                # Docker services: app, mysql, redis, mailpit
│  └─ tests/
├─ frontend/                     # reserved for the future SPA (currently empty)
├─ PROJECT_RULES.md               # engineering guide — read this first
├─ CLAUDE.md                      # AI assistant context (gitignored, not committed)
└─ README.md                      # this file
```

See [`PROJECT_RULES.md §8`](./PROJECT_RULES.md#8-folder-structure) for the internal structure
every module follows.

## Installation

**Prerequisites:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with WSL2 backend on
  Windows). No local PHP, Composer, MySQL, or Redis installation is required — everything runs
  in containers.
- Git.

**Steps:**

```bash
git clone https://github.com/Salma-Gader/KHADMATONA-.git
cd KHADMATONA-/backend
cp .env.example .env
```

Then follow [Docker Setup](#docker-setup) below to build and start the stack, generate the
application key, and run migrations.

> **Windows note:** Sail's own `./vendor/bin/sail` wrapper script only recognizes macOS, Linux,
> and WSL2 — it will refuse to run under Git Bash/MSYS. On such a setup, drive the same
> `compose.yaml` directly with `docker compose` (examples below use this form throughout; it
> targets the identical containers).

## Docker Setup

The stack is defined in `backend/compose.yaml` and includes four services: `laravel.test` (the
app, PHP 8.4), `mysql` (8.4), `redis`, and `mailpit` (dev SMTP catcher + web UI on `:8025`).

```bash
cd backend

# Export WWWUSER/WWWGROUP once if starting completely fresh (already set in .env otherwise)
export WWWUSER=$(id -u); export WWWGROUP=$(id -g)

docker compose -f compose.yaml pull mysql redis mailpit
docker compose -f compose.yaml build laravel.test
docker compose -f compose.yaml up -d
```

Verify everything is up:

```bash
docker compose -f compose.yaml ps
docker compose -f compose.yaml exec laravel.test php artisan --version
# Expect: Laravel Framework 12.x on PHP 8.4.x
```

If you have Docker Desktop with WSL2 (a native Linux shell), you can instead use Sail's own
CLI, which wraps the same commands:

```bash
./vendor/bin/sail up -d
./vendor/bin/sail artisan --version
```

The app is served at **http://localhost**, Mailpit's web UI at **http://localhost:8025**.

## Environment Variables

Key variables in `backend/.env` (see `.env.example` for the full, safe-to-share template):

| Variable | Purpose | MVP default |
|---|---|---|
| `APP_NAME` | Application name | `KHADMATONA` |
| `APP_LOCALE` / `APP_FALLBACK_LOCALE` | Default / fallback locale | `fr` |
| `SUPPORTED_LOCALES` | Locales the `SetLocale` middleware and i18n endpoint accept | `ar,fr,en` |
| `DB_CONNECTION` / `DB_HOST` / `DB_DATABASE` | Database connection (container service name, not `127.0.0.1`) | `mysql` / `mysql` / `khadmatona` |
| `REDIS_HOST` | Redis connection (container service name) | `redis` |
| `CACHE_STORE` / `QUEUE_CONNECTION` | Cache and queue drivers | `redis` / `redis` |
| `MAIL_MAILER` / `MAIL_HOST` / `MAIL_PORT` | Dev mail via Mailpit | `smtp` / `mailpit` / `1025` |
| `SANCTUM_STATEFUL_DOMAINS` | Domains allowed SPA cookie auth | `localhost,localhost:3000,127.0.0.1` |
| `WWWUSER` / `WWWGROUP` | Host UID/GID for the app container's file permissions | set automatically |

Never commit `backend/.env` — it's gitignored. Keep `.env.example` up to date with any new
non-secret configuration key you introduce.

## Running Migrations

```bash
docker compose -f compose.yaml exec laravel.test php artisan migrate

# Fresh database + seed (Admin role + admin user), useful in local development:
docker compose -f compose.yaml exec laravel.test php artisan migrate:fresh --seed
```

Migrations are distributed across modules — each module (and each Core capability) loads its
own migrations from its own folder via its service provider; there is no single monolithic
`database/migrations/` folder holding everything.

## Running Tests

```bash
docker compose -f compose.yaml exec laravel.test php artisan test
```

Tests are written in [Pest](https://pestphp.com/). Pest runs on top of PHPUnit as its engine —
both are legitimate dependencies, don't try to remove PHPUnit.

## Code Quality Tools

```bash
# PSR-12 formatting (Laravel Pint)
docker compose -f compose.yaml exec laravel.test ./vendor/bin/pint

# Check formatting without modifying files (useful in CI)
docker compose -f compose.yaml exec laravel.test ./vendor/bin/pint --test
```

Run Pint before every commit — see [`PROJECT_RULES.md §7`](./PROJECT_RULES.md#7-coding-standards-psr-12).

## Modules

| Module | Status | Purpose |
|---|---|---|
| **Property** | Skeleton wired | Listings, images, publish workflow |
| **Lead** | Skeleton wired | Visit / sell / rent / contact request capture |
| **Lookup** | Skeleton wired | Cities, districts, property types (reference data) |
| **Settings** | Skeleton wired | Site-wide configuration, SEO defaults |
| *CRM, Finance, Rental, Marketplace, ...* | Planned (Phase 2/3) | See `PROJECT_RULES.md §1` |

"Skeleton wired" means the module's folder structure, service provider, migration path, and
route inclusion all exist and boot correctly, but no models, migrations, or endpoints have been
implemented yet — that's the next phase of work.

Every Core capability shared across all modules is documented in
[`PROJECT_RULES.md`](./PROJECT_RULES.md) and [`CLAUDE.md`](./CLAUDE.md).

## API Overview

- Base path: **`/api/v1`** (versioned once, centrally, in `bootstrap/app.php`).
- Authentication: **Laravel Sanctum** — SPA cookie/session for first-party web clients,
  Personal Access Tokens for mobile/third-party clients.
- **Response envelope** — success:
  ```json
  { "success": true, "data": { }, "meta": { } }
  ```
  error:
  ```json
  { "success": false, "message": "...", "errors": { }, "code": "validation_error" }
  ```
- **Localization endpoint** (already implemented and verified):
  ```
  GET /api/v1/i18n/{locale}   # locale ∈ {ar, fr, en}
  ```
  Returns a merged JSON bundle of that locale's translation files.
- Pagination, filtering, sorting, and searching follow a consistent, allow-listed contract via
  `spatie/laravel-query-builder` — see [`PROJECT_RULES.md §10`](./PROJECT_RULES.md#10-api-conventions).

## Development Workflow

1. Read [`PROJECT_RULES.md`](./PROJECT_RULES.md) before your first PR.
2. Branch off `main` (naming: `feature/`, `fix/`, `refactor/`, `docs/`, `chore/`, `test/`).
3. Write code following the module template in `PROJECT_RULES.md §8`, keeping controllers thin
   and business logic in the Application layer.
4. Add tests (Pest) for anything new.
5. Run Pint and the test suite locally.
6. Open a PR with a [Conventional Commits](https://www.conventionalcommits.org/)-style title;
   squash-merge once approved.

Full details, branch naming, commit conventions, and the code review checklist are in
[`PROJECT_RULES.md §17–20`](./PROJECT_RULES.md#17-git-workflow).

## Deployment

Two documented production paths, both building from the same `Dockerfile.prod` images
(`backend/Dockerfile.prod`, `frontend/admin/Dockerfile.prod`) — separate from
`backend/compose.yaml` and `frontend/admin/compose.yaml`, which are local dev only (Sail, and a
bind-mounted `npm run dev` container respectively) and unaffected by either.

| | Recommended: Coolify | Alternative: plain `docker compose` |
|---|---|---|
| Guide | [`COOLIFY_DEPLOYMENT.md`](./COOLIFY_DEPLOYMENT.md) | [`DOCKER_COMPOSE_DEPLOYMENT.md`](./DOCKER_COMPOSE_DEPLOYMENT.md) |
| Best for | Most deployments — a dashboard, managed MySQL/Redis, auto-deploy-on-push, one-click SSL | Full manual control, an existing CI/CD-driven pipeline, or a VPS that shouldn't run an extra management platform |
| Reverse proxy / SSL | Coolify's built-in Traefik + automatic Let's Encrypt | This repo's own `docker-compose.prod.yml` + Caddy |
| Databases | Coolify-managed MySQL/Redis resources | Plain `mysql`/`redis` containers in the same compose file |

**Never run both on the same VPS** — Coolify's proxy and `docker-compose.prod.yml`'s `caddy`
service both need to bind host ports 80/443 and will conflict. Pick one platform per server; see
either guide's own warning about this before starting.

**Never commit** real production secrets. `backend/.env` is gitignored; `.env.example` and the
various `.example`-suffixed templates referenced by both guides are safe to commit and are kept
up to date with every new non-secret configuration key.

## License

Proprietary and confidential — © KHADMATONA GROUP. All rights reserved. This codebase is not
licensed for reuse, redistribution, or public disclosure outside the organization unless
explicitly agreed in writing.
