# Doing The Thing

A minimal accountability app that helps you follow through on tasks — not by organizing them, but by making avoidance slightly harder than action.

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### Local Development

1. **Start the database and mail server:**

```bash
docker compose --profile dev up -d
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example apps/web/.env
```

Edit `apps/web/.env` with your values. For local dev, the defaults work with the Docker services.

4. **Generate VAPID keys (for push notifications):**

```bash
node scripts/generate-vapid-keys.js
```

Add the output to your `.env` file.

5. **Push database schema:**

```bash
cd apps/web && npx drizzle-kit push
```

6. **Start the dev server:**

```bash
npm run dev
```

The app is at [http://localhost:3003](http://localhost:3003).
Maildev UI (for magic link emails) is at [http://localhost:1080](http://localhost:1080).

### Production Deployment (Coolify / Docker)

1. Set environment variables in your Coolify project (see `.env.example`).

2. Deploy using docker-compose:

```bash
docker compose --profile prod up -d
```

The `web` service builds the Next.js app and serves it on port 3000.

## Project Structure

```
doing-the-thing/
├── apps/web/              # Next.js 14 app (App Router)
│   ├── app/               # Pages and routes
│   ├── components/        # UI and feature components
│   ├── lib/               # DB, auth, actions, notifications
│   └── public/            # Static assets, service worker, manifest
├── packages/shared/       # Shared types, validation, constants
├── docker-compose.yml     # PostgreSQL + app services
└── scripts/               # Utility scripts
```

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Actions)
- **Database:** PostgreSQL 16 + Drizzle ORM
- **Auth:** Auth.js v5 (email magic link)
- **Notifications:** Web Push API + node-cron scheduler
- **Styling:** Tailwind CSS + Olive Crate design system
- **Deployment:** Docker, Coolify-ready

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/doing_the_thing` |
| `NEXTAUTH_SECRET` | Auth.js secret (generate with `openssl rand -base64 32`) | — |
| `NEXTAUTH_URL` | App URL | `http://localhost:3003` |
| `EMAIL_SERVER` | SMTP server URL | `smtp://localhost:1025` |
| `EMAIL_FROM` | Sender email | `noreply@getdoingthething.com` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key for Web Push | — |
| `VAPID_PRIVATE_KEY` | VAPID private key | — |
| `VAPID_CONTACT` | VAPID contact email | `mailto:admin@getdoingthething.com` |
