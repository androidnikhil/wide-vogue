# 🚀 Madhav Shringar - Deployment & Developer Guide

Welcome to the **Madhav Shringar** e-commerce deployment guide. This document provides clear, step-by-step instructions for running the app locally, testing production builds with Docker, understanding automated checks in CI/CD, and deploying to Vercel.

---

## ⚡ Quick Start (TL;DR)

Choose how you want to run the application:

| What do you want to do? | Command | URL |
| :--- | :--- | :--- |
| **Run locally with Docker (Easiest)** | `docker compose up web-dev --build` | [http://localhost:3000](http://localhost:3000) |
| **Test production build locally** | `docker compose --profile prod up web-prod --build` | [http://localhost:3001](http://localhost:3001) |
| **Run directly on host machine** | `npm install --legacy-peer-deps`<br>`npm run dev` | [http://localhost:3000](http://localhost:3000) |
| **Run all automated quality checks** | `npm run lint && npm run type-check && npm test` | Terminal |

---

## 🗺️ How Code Moves to Production

Here is the exact journey of your code from your laptop to the live website:

```mermaid
flowchart LR
    A["💻 You write code locally"] --> B["📤 Push to Bitbucket branch"]
    B --> C["🧪 Bitbucket CI runs tests & lint"]
    C --> D["🔀 Merge pull request into main"]
    D --> E["🔄 Bitbucket syncs main to GitHub"]
    E --> F["🚀 Vercel automatically deploys to live site"]
```

> [!NOTE]
> **No duplicate deployments:** You do not need to manually run deployment commands. When `main` passes all automated tests in Bitbucket, it syncs to GitHub, and Vercel automatically deploys the live store.

---

## 🔐 1. Setting Up Your Environment Variables

Never commit passwords or secret keys to GitHub or Bitbucket. The project uses [`.env.example`](../.env.example) as a template.

### Step 1: Create your local environment file
Copy the template to create your personal local configuration:
```bash
cp .env.example .env.local
```

### Step 2: Fill in the three required keys
For basic local development, you only need three values:
1. **`DATABASE_URL`**:
   - If using **Docker Compose**: leave as `postgresql://postgres:postgrespassword@localhost:5433/shringaarwebsite?schema=public`
   - If using **local PostgreSQL**: `postgresql://<user>:<password>@localhost:5432/shringaarwebsite?schema=public`
2. **`AUTH_SECRET`**: Any random 32+ character string (generate in terminal: `openssl rand -base64 32`)
3. **`ENCRYPTION_KEY`**: 64-character hex string for password hashing (generate in terminal: `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`)

> [!TIP]
> Third-party payment keys (`STRIPE_*`, `RAZORPAY_*`, `PAYPAL_*`) and email credentials (`EMAIL_*`) are optional for browsing and UI testing. Safe dummy placeholders are provided so the app builds and runs without crashing if you don't have active gateway keys.

### Credential Separation by Environment

| Setting | 💻 Development (Local/Docker) | 🔍 Preview (Vercel PR Previews) | 🌐 Production (Live Website) |
| :--- | :--- | :--- | :--- |
| **App URL** | `http://localhost:3000` | `https://*.vercel.app` | `https://madhavshringar.com` |
| **Database** | Local Postgres container | Staging database / Neon branch | Production database / Neon cluster |
| **Payments** | Test keys (`rzp_test_`, `pk_test_`) | Test keys (`rzp_test_`, `pk_test_`) | Live keys (`rzp_live_`, `pk_live_`) |
| **Emails** | Test SMTP or dummy account | Test SMTP | Production company SMTP |

---

## 🐳 2. Running with Docker (Recommended)

Docker gives you an isolated PostgreSQL database and Next.js server without needing to install PostgreSQL on your machine.

### Option A: Local Development (Hot-Reloading Enabled)
Use this for daily coding. When you edit code in VS Code, the browser updates automatically.

1. **Start the database and development server:**
   ```bash
   docker compose up web-dev --build
   ```
2. **Open in browser:**
   Visit **[http://localhost:3000](http://localhost:3000)**.
3. **Stop when finished:**
   Press `Ctrl + C` or run:
   ```bash
   docker compose down
   ```

> [!TIP]
> **Why port 5433 for Postgres?**
> Docker maps PostgreSQL to port `5433` on your host computer instead of `5432`. This prevents conflicts if you already have another PostgreSQL database running locally on port 5432.

---

### Option B: Production-Build Testing
Use this to test the exact production image (minified bundle, non-root user security, standalone server) before submitting a pull request.

1. **Build and start the production container:**
   ```bash
   docker compose --profile prod up web-prod --build
   ```
2. **Verify in browser:**
   Visit **[http://localhost:3001](http://localhost:3001)**.
3. **Check container response in terminal:**
   ```bash
   curl -I http://localhost:3001
   ```
4. **Stop production testing:**
   ```bash
   docker compose --profile prod down
   ```

---

## 💻 3. Running Directly on Your Computer (Without Docker)

If you prefer running Node.js and PostgreSQL directly on your laptop:

### Prerequisites:
- **Node.js**: Version 20 or higher (`node -v`)
- **PostgreSQL**: Running locally on port 5432

### Step-by-Step:
1. **Install dependencies:**
   ```bash
   npm ci --legacy-peer-deps
   ```
2. **Sync database schema:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. Open **[http://localhost:3000](http://localhost:3000)**.

---

## ✅ 4. Pre-Commit Quality Checks

Before committing or creating a pull request, run these four checks locally to ensure CI will pass:

```bash
# 1. Check code style and syntax
npm run lint

# 2. Check TypeScript types
npm run type-check

# 3. Run unit tests
npm test

# 4. Verify Next.js production build
npm run build
```

### What Each Check Does:
- **`npm run lint`**: Uses ESLint 9 to detect code syntax issues (ignores build artifacts like `.next/`).
- **`npm run type-check`**: Runs the TypeScript compiler (`tsc --noEmit`) to catch type mismatches.
- **`npm test`**: Runs unit tests for business logic (e.g., loyalty points calculations, payment flow mocks).
- **`npm run build`**: Runs Prisma database push and Next.js compiler to guarantee the app compiles cleanly.

---

## 🔄 5. Bitbucket Pipelines (CI/CD)

The pipeline configuration in [`bitbucket-pipelines.yml`](../bitbucket-pipelines.yml) protects the codebase with automated gates:

### What happens when you push to a branch or pull request?
1. **Lint and Type Check Step**: Runs `npm run lint` and `npm run type-check`.
2. **Unit Tests Step**: Runs `npm test`.
3. **Docker Verification Step**: Builds both the `development` and `production` Docker images.
4. **No deployment occurs**: Code is verified only.

### What happens when you merge into `main`?
1. Runs all three quality checks (Lint, Types, Tests, Docker).
2. **Syncs to GitHub**: If and only if all checks pass, pushes the exact commit to GitHub:
   ```bash
   git remote add github https://x-access-token:${GITHUB_TOKEN}@github.com/androidnikhil/wide-vogue.git
   git push github HEAD:main --force
   ```
3. **Vercel deploys**: Vercel detects the new commit on GitHub and triggers production deployment.

---

## ☁️ 6. Vercel Production Settings

Vercel handles the live production hosting:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (`prisma db push && next build`)
- **Install Command**: `npm install --legacy-peer-deps` (automatically picked up from [`.npmrc`](../.npmrc))
- **Output Directory**: `.next`
- **Environment Variables**: Managed inside **Vercel Project Settings > Environment Variables** (set with production credentials).

---

## ❓ Frequently Asked Questions & Troubleshooting

### Q: Why do I need `--legacy-peer-deps`?
> **Answer:** Next.js 16 is a major release, while `next-auth@5.0.0-beta.25` specifies peer dependency ranges up to Next 15. The project includes [`.npmrc`](../.npmrc) with `legacy-peer-deps=true` so `npm install` works smoothly.

### Q: Why did `npm run lint` fail in earlier versions?
> **Answer:** Next.js 16 completely removed the `next lint` CLI command in favor of using `eslint` directly. The project script has been updated to `eslint .` with ESLint 9 Flat Config.

### Q: How do I reset a user's or admin's password locally?
> **Answer:** Use the built-in password reset script:
> ```bash
> node scripts/reset-password.js user@example.com MyNewPassword123
> ```

### Q: How do I sync database changes after editing `prisma/schema.prisma`?
> **Answer:**
> ```bash
> npx prisma generate
> npx prisma db push
> ```

---

## 📁 Key File Index

| File | Purpose |
| :--- | :--- |
| [`Dockerfile`](../Dockerfile) | Multi-stage container recipe for development and standalone production. |
| [`docker-compose.yml`](../docker-compose.yml) | Orchestrates local PostgreSQL, development server, and production testing container. |
| [`.dockerignore`](../.dockerignore) | Excludes node_modules, build caches, and `.env` secrets from Docker builds. |
| [`.env.example`](../.env.example) | Template of all required and optional environment variables with dummy values. |
| [`bitbucket-pipelines.yml`](../bitbucket-pipelines.yml) | Automated CI test runner and Bitbucket-to-GitHub synchronization pipeline. |
| [`package.json`](../package.json) | Node scripts (`dev`, `build`, `lint`, `type-check`, `test`). |
