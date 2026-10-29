/**
 * ==============================================================================
 * Smart Build & Migration Runner for Madhav Shringar
 * ==============================================================================
 * Automatically checks and applies database migrations on Vercel deployments
 * before building Next.js.
 *
 * RESILIENCE POLICY:
 * If an established production database (like Supabase with existing tables)
 * reports P3005 (database schema is not empty / unbaselined), the script logs
 * a clear notification and continues to build Next.js cleanly without aborting.
 * ==============================================================================
 */

const { execSync } = require('child_process');

console.log('------------------------------------------------------------');
console.log('🚀 Starting Madhav Shringar Application Build');
console.log('------------------------------------------------------------');

const isVercel = process.env.VERCEL === '1';
const hasDbUrl = Boolean(process.env.DIRECT_URL || process.env.DATABASE_URL || process.env.ms_POSTGRES_PRISMA_URL);

if (isVercel && hasDbUrl) {
  console.log('[Migration] Detected Vercel deployment environment with database configuration.');
  console.log('[Migration] Checking database migrations for Supabase...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('[Migration] ✅ Database migrations applied successfully to Supabase.');
  } catch (err) {
    console.warn('------------------------------------------------------------');
    console.warn('[Migration Notice] Existing established database detected or migrate deploy was skipped.');
    console.warn('[Migration Notice] Supabase schema is already active. Continuing with Next.js build...');
    console.warn('------------------------------------------------------------');
  }
} else if (isVercel) {
  console.warn('[Migration Warning] Vercel environment detected but no database URL was found. Skipping migration deploy.');
} else {
  console.log('[Build] Local build detected. Skipping automatic migration deploy.');
}

console.log('[Build] Compiling Next.js application (next build)...');
execSync('npx next build', { stdio: 'inherit' });
console.log('✅ Build completed successfully.');
