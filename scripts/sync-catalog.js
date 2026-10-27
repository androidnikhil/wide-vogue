/**
 * ==============================================================================
 * Safe Developer Catalog Synchronization Tool (Fast Native Runner)
 * ==============================================================================
 * Synchronizes public catalog items (Products, Banners, Blog Posts, Coupons)
 * from Production Supabase into the local PostgreSQL development environment.
 *
 * SAFETY PRINCIPLES:
 * 1. Strictly READ-ONLY on Production Supabase.
 * 2. Destination MUST be local (localhost / 127.0.0.1 / db).
 * 3. Never copies sensitive customer data (Users, Passwords, Orders, Sessions).
 * ==============================================================================
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

function isLocalDatabaseUrl(url) {
  try {
    const parsed = new URL(url.replace('postgresql://', 'http://').replace('postgres://', 'http://'));
    const host = parsed.hostname.toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === 'db';
  } catch {
    return false;
  }
}

async function main() {
  const prodUrl = process.env.PROD_DIRECT_URL || process.env.PROD_DATABASE_URL;
  const localUrl = process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;

  if (!prodUrl || prodUrl.includes('[YOUR-SUPABASE-PASSWORD]') || prodUrl.includes('<password>')) {
    console.log('[Sync Skipped] No valid PROD_DATABASE_URL configured in .env. Skipping live catalog sync.');
    return;
  }

  if (!localUrl) {
    console.error('FATAL: No local target DATABASE_URL specified in environment.');
    process.exit(1);
  }

  // HARD SAFETY CHECK: Destination MUST be local
  if (!isLocalDatabaseUrl(localUrl)) {
    console.error('FATAL SAFETY VIOLATION: Target database is NOT local (localhost, 127.0.0.1, or db).');
    console.error(`Attempted target host: ${localUrl.replace(/:[^:@]+@/, ':****@')}`);
    console.error('Operation aborted to prevent accidental write/overwrite of remote databases.');
    process.exit(1);
  }

  console.log('------------------------------------------------------------');
  console.log('[Catalog Sync] Initializing safe one-way catalog synchronization');
  console.log(`[Source (Prod)] : ${prodUrl.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`[Target (Local)]: ${localUrl.replace(/:[^:@]+@/, ':****@')}`);
  console.log('------------------------------------------------------------');

  const prodPrisma = new PrismaClient({ datasources: { db: { url: prodUrl } } });
  const localPrisma = new PrismaClient({ datasources: { db: { url: localUrl } } });

  try {
    // 1. Sync Products
    console.log('[Sync] Reading products from production...');
    const products = await prodPrisma.product.findMany();
    console.log(`[Sync] Found ${products.length} products in production.`);

    for (const p of products) {
      const { id, createdAt, updatedAt, ...rest } = p;
      await localPrisma.product.upsert({
        where: { slug: p.slug },
        update: rest,
        create: { id, ...rest },
      });
    }
    console.log(`[Sync] Successfully synchronized ${products.length} products.`);

    // 2. Sync Banners
    console.log('[Sync] Reading banners from production...');
    const banners = await prodPrisma.banner.findMany();
    for (const b of banners) {
      const { id, createdAt, updatedAt, ...rest } = b;
      await localPrisma.banner.upsert({
        where: { id: b.id },
        update: rest,
        create: { id, ...rest },
      });
    }
    console.log(`[Sync] Successfully synchronized ${banners.length} banners.`);

    // 3. Sync Blog Posts
    console.log('[Sync] Reading blog posts from production...');
    const blogs = await prodPrisma.blogPost.findMany();
    for (const blog of blogs) {
      const { id, createdAt, updatedAt, ...rest } = blog;
      await localPrisma.blogPost.upsert({
        where: { slug: blog.slug },
        update: rest,
        create: { id, ...rest },
      });
    }
    console.log(`[Sync] Successfully synchronized ${blogs.length} blog posts.`);

    // 4. Sync Public Coupons
    console.log('[Sync] Reading active coupons from production...');
    const coupons = await prodPrisma.coupon.findMany({ where: { isActive: true } });
    for (const c of coupons) {
      const { id, createdAt, ...rest } = c;
      await localPrisma.coupon.upsert({
        where: { code: c.code },
        update: rest,
        create: { id, ...rest },
      });
    }
    console.log(`[Sync] Successfully synchronized ${coupons.length} coupons.`);

    console.log('------------------------------------------------------------');
    console.log('[Sync Complete] Local database catalog is now up to date with production.');
    console.log('Customer data, orders, and payment records were untouched and excluded.');
    console.log('------------------------------------------------------------');
  } finally {
    await prodPrisma.$disconnect();
    await localPrisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[Sync Error] Failed to complete catalog synchronization:', err);
  process.exit(1);
});
