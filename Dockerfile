# ==============================================================================
# Multi-stage Dockerfile for Madhav Shringar E-Commerce
# Supports both local development (target: development)
# and optimized production testing (target: runner)
# ==============================================================================

FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# ------------------------------------------------------------------------------
# Dependencies stage
# ------------------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json .npmrc* ./
COPY prisma ./prisma/
RUN --mount=type=cache,target=/root/.npm npm ci --legacy-peer-deps

# ------------------------------------------------------------------------------
# Development stage
# ------------------------------------------------------------------------------
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "dev"]

# ------------------------------------------------------------------------------
# Builder stage (production build)
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV DOCKER_BUILD=1
# NextAuth / App URL placeholders for build time
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV AUTH_SECRET="build_time_placeholder_auth_secret_32_chars"
ENV ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
ENV DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/shringaarwebsite?schema=public"

RUN npx prisma generate
RUN npx next build

# ------------------------------------------------------------------------------
# Production Runner stage
# ------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and standalone server bundle
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
