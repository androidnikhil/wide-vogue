require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setAdmin() {
  const targetEmail = (process.argv[2] || process.env.ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com').toLowerCase().trim();

  console.log(`Setting admin privileges for: ${targetEmail}`);

  try {
    const existing = await prisma.user.findFirst({
      where: {
        email: {
          equals: targetEmail,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: { role: 'admin' },
      });
      console.log(`[SUCCESS] User '${updated.email}' (ID: ${updated.id}) is now set to role: '${updated.role}'`);
    } else {
      const created = await prisma.user.create({
        data: {
          email: targetEmail,
          name: 'Nikhil Pandey',
          role: 'admin',
          password: '',
        },
      });
      console.log(`[SUCCESS] User did not exist, created new admin user '${created.email}' (ID: ${created.id}) with role: '${created.role}'`);
    }
  } catch (err) {
    console.error('[ERROR] Failed to set admin privileges:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setAdmin();
