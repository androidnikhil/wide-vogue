/**
 * ==============================================================================
 * Database Restore & Disaster Recovery Tool for Madhav Shringar (Native Runner)
 * ==============================================================================
 * Restores schema & data from verified backup files with integrity verification
 * and strict safety gates to prevent accidental production overwrite.
 * ==============================================================================
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const BACKUP_DIR = path.resolve(process.cwd(), 'backups');

function computeSha256(filePath) {
  const hash = crypto.createHash('sha256');
  const buffer = fs.readFileSync(filePath);
  hash.update(buffer);
  return hash.digest('hex');
}

function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function findLatestBackup() {
  if (!fs.existsSync(BACKUP_DIR)) return null;
  const files = fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith('backup_') && !f.endsWith('.sha256'))
    .map((f) => ({
      name: f,
      fullPath: path.join(BACKUP_DIR, f),
      time: fs.statSync(path.join(BACKUP_DIR, f)).mtimeMs,
    }))
    .sort((a, b) => b.time - a.time);

  return files.length > 0 ? files[0].fullPath : null;
}

async function restoreJsonSnapshot(databaseUrl, filePath) {
  console.log(`[Restore] Parsing snapshot: ${filePath}`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const snapshot = JSON.parse(raw);

  if (!snapshot.data) {
    throw new Error('Invalid snapshot structure: missing "data" property.');
  }

  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  try {
    const { products = [], banners = [], blogs = [], coupons = [] } = snapshot.data;

    console.log(`[Restore] Restoring ${products.length} products...`);
    for (const p of products) {
      const { id, createdAt, updatedAt, ...rest } = p;
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: rest,
        create: { id, ...rest },
      });
    }

    console.log(`[Restore] Restoring ${banners.length} banners...`);
    for (const b of banners) {
      const { id, createdAt, updatedAt, ...rest } = b;
      await prisma.banner.upsert({
        where: { id: b.id },
        update: rest,
        create: { id, ...rest },
      });
    }

    console.log(`[Restore] Restoring ${blogs.length} blog posts...`);
    for (const blog of blogs) {
      const { id, createdAt, updatedAt, ...rest } = blog;
      await prisma.blogPost.upsert({
        where: { slug: blog.slug },
        update: rest,
        create: { id, ...rest },
      });
    }

    console.log(`[Restore] Restoring ${coupons.length} coupons...`);
    for (const c of coupons) {
      const { id, createdAt, ...rest } = c;
      await prisma.coupon.upsert({
        where: { code: c.code },
        update: rest,
        create: { id, ...rest },
      });
    }

    console.log('[Restore] JSON snapshot restored successfully!');
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const args = process.argv.slice(2);
  let backupFile = args.find((a) => !a.startsWith('--'));

  if (!backupFile) {
    backupFile = findLatestBackup();
    if (!backupFile) {
      console.error('FATAL: No backup file specified and no existing backups found in ./backups');
      process.exit(1);
    }
  }

  if (!fs.existsSync(backupFile)) {
    console.error(`FATAL: Specified backup file not found: ${backupFile}`);
    process.exit(1);
  }

  const checksumFile = `${backupFile}.sha256`;
  if (fs.existsSync(checksumFile)) {
    const expectedChecksum = fs.readFileSync(checksumFile, 'utf-8').trim().split(/\s+/)[0];
    const actualChecksum = computeSha256(backupFile);
    if (expectedChecksum.toLowerCase() !== actualChecksum.toLowerCase()) {
      console.error('FATAL: Integrity checksum verification failed! Backup file may be corrupted.');
      console.error(`Expected: ${expectedChecksum}`);
      console.error(`Actual:   ${actualChecksum}`);
      process.exit(1);
    }
    console.log('[Restore] Integrity checksum verified successfully.');
  }

  const targetUrlArg = args.find((a) => a.startsWith('--target-url='))?.split('=')[1];
  const targetUrl = targetUrlArg || process.env.DATABASE_URL;

  if (!targetUrl) {
    console.error('FATAL: No target DATABASE_URL specified.');
    process.exit(1);
  }

  const isProduction = targetUrl.includes('supabase.co') || targetUrl.includes('pooler.supabase.com');
  const maskedTarget = targetUrl.replace(/:[^:@]+@/, ':****@');

  console.log(`[Restore] Target Database: ${maskedTarget}`);
  console.log(`[Restore] Selected Backup: ${backupFile}`);

  if (isProduction) {
    console.warn('\n⚠️  CRITICAL WARNING: The target database appears to be PRODUCTION (Supabase)!');
    console.warn('Proceeding will overwrite or modify live production tables.\n');

    const confirmation = await askConfirmation('Type "CONFIRM_PRODUCTION_RESTORE" to proceed: ');
    if (confirmation !== 'CONFIRM_PRODUCTION_RESTORE') {
      console.log('[Restore Aborted] Confirmation did not match. No changes made.');
      process.exit(0);
    }
  }

  if (backupFile.endsWith('.sql')) {
    console.log(`[Restore] Executing SQL restore via psql...`);
    execSync(`psql "${targetUrl}" < "${backupFile}"`, { stdio: 'inherit' });
    console.log('[Restore] SQL restoration complete.');
  } else if (backupFile.endsWith('.json')) {
    await restoreJsonSnapshot(targetUrl, backupFile);
  } else {
    throw new Error(`Unsupported backup format: ${path.extname(backupFile)}`);
  }
}

main().catch((err) => {
  console.error('[Restore Error] Operation failed:', err.message || err);
  process.exit(1);
});
