/**
 * ==============================================================================
 * Smart Build & Migration Runner for Madhav Shringar
 * ==============================================================================
 * Automatically applies pending database migrations on Vercel production
 * deployments before building Next.js, while allowing safe local builds
 * without requiring production credentials.
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
  console.log('[Migration] Applying pending database migrations to Supabase...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('[Migration] ✅ Database migrations applied successfully to Supabase.');
  } catch (err) {
    console.error('❌ [Migration Error] Failed to apply database migrations to Supabase:');
    console.error(err.message || err);
    process.exit(1);
  }
} else if (isVercel) {
  console.warn('[Migration Warning] Vercel environment detected but no database URL was found. Skipping migration deploy.');
} else {
  console.log('[Build] Local build detected. Skipping automatic migration deploy.');
}

console.log('[Build] Compiling Next.js application (next build)...');
execSync('npx next build', { stdio: 'inherit' });
console.log('✅ Build completed successfully.');
