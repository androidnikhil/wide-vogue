require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error('Usage: node scripts/reset-password.js <email> <newPassword>');
    process.exit(1);
  }

  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    console.error('ENCRYPTION_KEY is not set in .env');
    process.exit(1);
  }

  // Hash the password exactly as lib/encrypt.ts does (HMAC SHA-256)
  const hashedPassword = crypto
    .createHmac('sha256', encryptionKey)
    .update(newPassword)
    .digest('hex');

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    console.log(`Successfully reset password for user: ${user.email}`);
  } catch (error) {
    console.error('Error updating user (check if email exists):', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
