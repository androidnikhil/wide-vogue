# 🛡️ Database Management, Backup & CI/CD Workflow Guide

This document outlines the standard operating procedures for local database development, version-controlled Prisma migrations, automated backups, safe catalog synchronization, and Bitbucket CI/CD pipelines for **Madhav Shringar**.

---

## 🏗️ 1. Architecture: Local vs. Production Separation

To prevent accidental data loss and maintain zero conflict across development environments:

| Attribute | Local Development (Docker) | Production (Supabase) |
| :--- | :--- | :--- |
| **Host / Port** | `localhost:5433` (container port 5432) | `aws-0-<region>.pooler.supabase.com:6543 / 5432` |
| **Database Name** | `shringaarwebsite` | `postgres` |
| **Schema Deployment** | `prisma migrate deploy` (or `prisma db push`) | `prisma migrate deploy` via reviewed Git migrations |
| **Data Scope** | Mock data / synced public catalog items only | Live customers, orders, inventory, payments |
| **Isolation** | Strict: Docker overrides neutralize remote pooler env vars | Sealed: Never directly modified by local dev commands |

---

## ⚡ 2. Getting Started Locally for Teammates

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running)
- Node.js 20+

### Step 1: Clone & Configure Environment
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5433/shringaarwebsite?schema=public"
AUTH_SECRET="development-auth-secret-key-min-32-chars-long"
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
```

### Step 2: Start Application
```bash
docker compose up --build
```
This command:
1. Spawns an isolated PostgreSQL 16 container (`madhav-shringar-db`) on port `5433`.
2. Generates the Prisma client and deploys all pending migrations automatically.
3. Launches Next.js on [http://localhost:3000](http://localhost:3000).

---

## 🔄 3. Safe Catalog Synchronization (Local Seeding)

If you or a teammate wants realistic product items, banners, and categories locally without manually creating them:

```bash
npm run db:sync:catalog
```

### Safety Guarantees:
- **Strict Read-Only Source**: Only executes `SELECT` against Supabase.
- **Fail-Fast Safety Check**: Will immediately abort if the target database is not `localhost`, `127.0.0.1`, or `db`.
- **Zero Customer Data Leakage**: Excludes `User` passwords, `Order` histories, `Session` tokens, and customer addresses. Only public `Product`, `Banner`, `BlogPost`, and active `Coupon` records are synchronized.

---

## 📦 4. Production Database Backups & Integrity

### Creating a Snapshot Backup
```bash
npm run db:backup
```
- Dumps database schema and data into `./backups/backup_YYYYMMDD_HHMMSS.sql` (or `.json`).
- Automatically computes a SHA-256 integrity checksum (`.sha256`).
- Applies a **7-backup retention policy**, pruning older backups to conserve disk space.
- Persisted on host machine via Docker volume mount `./backups:/app/backups`.

### Disaster Recovery: Restoring from Backup
```bash
# Restore latest backup to local development
npm run db:restore

# Restore specific backup file
npx ts-node scripts/restore-db.ts ./backups/backup_20261027_105252.sql

# Restore to production (Requires explicit confirmation prompt)
npx ts-node scripts/restore-db.ts ./backups/backup_20261027_105252.sql --target-url="<SUPABASE_DIRECT_URL>"
```
*Note: If the target database is Supabase, the tool halts and demands manual entry of `CONFIRM_PRODUCTION_RESTORE` before executing any write operations.*

---

## 🗄️ 5. Database Migration Lifecycle

Never run `prisma db push` in production. Always follow version-controlled migrations:

```mermaid
flowchart TD
    A["1. Modify schema.prisma locally"] --> B["2. Generate migration:\nnpm run db:migrate:dev --name add_new_feature"]
    B --> C["3. Review generated SQL in prisma/migrations/"]
    C --> D["4. Test locally with docker compose up"]
    D --> E["5. Commit migration file & merge to main"]
    E --> F["6. Deploy to Supabase:\nnpm run db:migrate:deploy"]
```

### Useful CLI Commands:
- **Generate new migration locally:**
  ```bash
  npx prisma migrate dev --name <migration_name>
  ```
- **Check migration status against current DB:**
  ```bash
  npm run db:migrate:status
  ```
- **Deploy pending migrations to production:**
  ```bash
  npm run db:migrate:deploy
  ```

---

## 🚀 6. Bitbucket CI/CD & Build Unit Optimization

The Bitbucket pipeline ([bitbucket-pipelines.yml](file:///c:/Users/CHIRAG/Downloads/madhav_shringar/bitbucket-pipelines.yml)) is optimized to prevent unnecessary build unit consumption:

### Automated Triggers (On Push to `main`):
1. **Code Quality & Type Verification (Fast)**:
   - Runs `npm ci`, `npm run lint`, and `npm run type-check`.
   - **`npm test` is excluded from automatic runs**, cutting build minutes by ~60%.
2. **GitHub Sync Mirror**:
   - Synchronizes verified code to the GitHub mirror with strict ancestry checks.
   - Triggers automatic Vercel deployment.

### On-Demand Triggers (Manual via Bitbucket Web UI):
- **`apply-production-migrations`**: Deploys pending Prisma migrations to Supabase in a controlled `Production` deployment environment.
- **`run-tests-manually`**: Runs full Jest test suite on demand.
- **`docker-verify`**: Builds and tests the Docker container on demand.
