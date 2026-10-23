# 🚀 Madhav Shringar — Simple Deployment & Developer Guide

This guide explains how to run the project locally with Docker, test the production image, run automated checks, and understand how code deploys to the live website.

---

## ⚡ 1. Local Quick Start (Docker)

Docker runs an isolated PostgreSQL database and Next.js server locally. You do not need to install PostgreSQL manually on your computer.

| Action | Command | URL |
| :--- | :--- | :--- |
| **Start Application** (Next.js + Postgres) | `docker compose up --build` | [http://localhost:3000](http://localhost:3000) |
| **Stop Application** (Safely persists data) | `docker compose down` | — |

> [!TIP]
> **Automatic Database Setup:**  
> When running `docker compose up --build`, Prisma automatically pushes the database schema and generates the client inside the container on startup. You do not need any manual database setup!

---

## 🔐 2. Local Environment Setup

1. **Create your local `.env` file:**
   ```bash
   cp .env.example .env
   ```
2. **The 3 required values for local development:**
   - **`DATABASE_URL`**: `postgresql://postgres:postgrespassword@localhost:5433/shringaarwebsite?schema=public` *(Notice port `5433` for Docker Postgres)*
   - **`AUTH_SECRET`**: Any 32+ character string (e.g. `openssl rand -base64 32`)
   - **`ENCRYPTION_KEY`**: A 64-character hex string (e.g. `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`)

> [!NOTE]
> Payment keys (`RAZORPAY_*`, `STRIPE_*`) and email credentials use safe test dummy fallbacks in development, so the app runs without active gateway keys.

---

## ✅ 3. Pre-Commit Quality Checks

Before pushing your changes, run these fast local checks:

```bash
# 1. Run unit and IST timezone tests
npm test

# 2. Check code quality and syntax
npm run lint

# 3. Validate Docker Compose configuration
docker compose config -q
```

All three must pass before creating a pull request.

---

## 🗺️ 4. How Code Moves to Production

Bitbucket is the **sole source of truth** for all code and pull requests. You only ever push to Bitbucket.

```mermaid
flowchart LR
    A["💻 You push to Bitbucket main"] --> B["🧪 Bitbucket CI runs fast checks (~1.3 mins)\n(lint, tsc, jest)"]
    B -->|All checks pass| C["🔄 Bitbucket syncs to GitHub mirror"]
    C --> D["🚀 Vercel automatically deploys live store"]
    B -->|Any check fails| E["❌ Pipeline stops\n(GitHub & Vercel never receive the code)"]
```

### The Release Journey:
1. **You push to Bitbucket `main`:**
   ```bash
   git push origin main
   ```
2. **Bitbucket Pipelines automatically executes 2 fast steps (~1.3 minutes total):**
   - **Step 1: Code Quality & Automated Tests** (`npm ci`, `npm run lint`, `tsc --noEmit`, `npm test` consolidated in a single step with caching).
   - **Step 2: Fast-forward Sync to GitHub Mirror** (Transfers the verified commit to GitHub with ancestry checks).
   *(Note: Heavy Docker compilation is moved to on-demand manual triggers to keep pipeline runs under ~1.3 minutes, preserving Bitbucket's 50-minute monthly free plan).*
3. **GitHub receives the verified commit:**
   GitHub acts strictly as a downstream deployment bridge for Vercel.
4. **Vercel deploys to Production:**
   Vercel detects the verified GitHub commit, executes `next build`, and publishes atomically to **[https://www.madhavshringaar.com](https://www.madhavshringaar.com)**.

---

## 🛡️ 5. Production Database Safety

- **Zero Automatic Schema Mutation:**  
  The application build command is strictly `next build`. Normal deployments **never** run `prisma db push` or mutate the live database.
- **Data Protection:**  
  All live products, inventory, customer accounts, and order histories remain completely safe during standard code releases.
- **Database Migrations:**  
  Any future database schema changes must be planned, reviewed, and applied separately from application deployments.

---

## 🔄 6. Emergency Rollback

If an unexpected problem ever occurs on the live store:

1. **Instant Vercel Rollback (< 2 seconds):**  
   Open the **Vercel Dashboard > Deployments**, find the last working deployment, click the `...` menu, and select **"Instant Rollback"**. Vercel immediately switches traffic back to the previous release.
2. **Revert in Git:**  
   ```bash
   git checkout main
   git pull origin main
   git revert <bad_commit_hash> -m 1
   git push origin main
   ```
   Bitbucket CI will validate the revert commit, sync it to GitHub, and Vercel will deploy the clean code automatically.
