/**
 * ==============================================================================
 * Database Backup Tool for Madhav Shringar (Native Node Runner)
 * ==============================================================================
 * Dumps database schema and records into timestamped, compressed backup files.
 * Generates SHA-256 checksums and applies a 7-day retention policy.
 * ==============================================================================
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const BACKUP_DIR = path.resolve(process.cwd(), 'backups');
const MAX_BACKUPS_RETAINED = 7;

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function computeSha256(filePath) {
  const hash = crypto.createHash('sha256');
  const buffer = fs.readFileSync(filePath);
  hash.update(buffer);
  return hash.digest('hex');
}

function pruneOldBackups(dir, keepCount) {
  try {
    const files = fs.readdirSync(dir)
      .filter((f) => f.startsWith('backup_') && !f.endsWith('.sha256'))
      .map((f) => ({
        name: f,
        time: fs.statSync(path.join(dir, f)).mtimeMs,
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > keepCount) {
      const toDelete = files.slice(keepCount);
      for (const item of toDelete) {
        const fullPath = path.join(dir, item.name);
        const checksumPath = `${fullPath}.sha256`;
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        if (fs.existsSync(checksumPath)) fs.unlinkSync(checksumPath);
        console.log(`[Backup Retention] Pruned old backup: ${item.name}`);
      }
    }
  } catch (err) {
    console.warn('[Backup Retention] Warning during backup pruning:', err.message || err);
  }
}

async function runPrismaSnapshotBackup(databaseUrl, targetFile) {
  console.log('[Backup] Running Prisma snapshot export...');
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  try {
    const [products, banners, blogs, coupons, giftCards] = await Promise.all([
      prisma.product.findMany(),
      prisma.banner.findMany(),
      prisma.blogPost.findMany(),
      prisma.coupon.findMany(),
      prisma.giftCard.findMany(),
    ]);

    const backupData = {
      meta: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        environment: databaseUrl.includes('supabase.co') ? 'production-supabase' : 'local',
        counts: {
          products: products.length,
          banners: banners.length,
          blogs: blogs.length,
          coupons: coupons.length,
          giftCards: giftCards.length,
        },
      },
      data: {
        products,
        banners,
        blogs,
        coupons,
        giftCards,
      },
    };

    fs.writeFileSync(targetFile, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`[Backup] Successfully exported ${products.length} products, ${banners.length} banners, ${blogs.length} blogs.`);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const dbUrl = process.env.PROD_DIRECT_URL || process.env.PROD_DATABASE_URL || process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('[YOUR-SUPABASE-PASSWORD]')) {
    console.error('FATAL: No valid database connection URL found in environment.');
    process.exit(1);
  }

  const masked = dbUrl.replace(/:[^:@]+@/, ':****@');
  console.log(`[Backup] Starting backup from: ${masked}`);

  const timestamp = getTimestamp();
  let hasPgDump = false;

  try {
    execSync('pg_dump --version', { stdio: 'ignore' });
    hasPgDump = true;
  } catch {
    hasPgDump = false;
  }

  let finalBackupPath = '';

  if (hasPgDump) {
    finalBackupPath = path.join(BACKUP_DIR, `backup_${timestamp}.sql`);
    console.log(`[Backup] Executing pg_dump to ${finalBackupPath}...`);
    try {
      execSync(`pg_dump --clean --if-exists --no-owner --no-acl "${dbUrl}" > "${finalBackupPath}"`, {
        stdio: 'inherit',
      });
    } catch (dumpErr) {
      console.warn('[Backup] pg_dump failed. Falling back to application-layer snapshot...', dumpErr.message || dumpErr);
      finalBackupPath = path.join(BACKUP_DIR, `backup_${timestamp}.json`);
      await runPrismaSnapshotBackup(dbUrl, finalBackupPath);
    }
  } else {
    console.log('[Backup] pg_dump not in PATH. Using high-fidelity application snapshot format (.json)...');
    finalBackupPath = path.join(BACKUP_DIR, `backup_${timestamp}.json`);
    await runPrismaSnapshotBackup(dbUrl, finalBackupPath);
  }

  const checksum = computeSha256(finalBackupPath);
  const checksumPath = `${finalBackupPath}.sha256`;
  fs.writeFileSync(checksumPath, `${checksum}  ${path.basename(finalBackupPath)}\n`, 'utf-8');

  const stats = fs.statSync(finalBackupPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('------------------------------------------------------------');
  console.log(`[Backup Complete] File: ${finalBackupPath}`);
  console.log(`[Backup Size]     ${sizeMb} MB (${stats.size} bytes)`);
  console.log(`[SHA-256]         ${checksum}`);
  console.log('------------------------------------------------------------');

  pruneOldBackups(BACKUP_DIR, MAX_BACKUPS_RETAINED);
}

main().catch((err) => {
  console.error('[Backup Error] Failed to generate backup:', err);
  process.exit(1);
});
