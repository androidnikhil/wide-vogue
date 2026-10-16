'use server';

import { prisma } from '@/db/prisma';

// Security settings
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 60 * 1000; // 1 Hour (3,600,000 ms)
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 Minutes rolling window

// Fast dual-layer in-memory fallback store
interface MemoryRecord {
  attempts: number;
  attemptsExpiresAt: number;
  lockedUntil?: number;
}
const memoryStore = new Map<string, MemoryRecord>();

/**
 * Normalizes user identifier (email or phone) to lowercase and trimmed.
 */
function normalizeIdentifier(rawId: string): string {
  if (!rawId) return '';
  return rawId.trim().toLowerCase();
}

export type LockoutCheckResult = {
  isLocked: boolean;
  remainingMinutes?: number;
  remainingAttempts?: number;
  message?: string;
};

export type FailedAttemptResult = {
  isLocked: boolean;
  attemptsCount: number;
  remainingAttempts: number;
  remainingMinutes?: number;
  message: string;
};

/**
 * Check if an identifier (email/phone) is currently locked out.
 */
export async function checkLoginLockout(rawIdentifier: string): Promise<LockoutCheckResult> {
  const cleanId = normalizeIdentifier(rawIdentifier);
  if (!cleanId) return { isLocked: false };

  const nowMs = Date.now();
  const now = new Date(nowMs);

  // 1. First check in-memory store for instant response
  const memRecord = memoryStore.get(cleanId);
  if (memRecord?.lockedUntil && memRecord.lockedUntil > nowMs) {
    const remainingMinutes = Math.max(1, Math.ceil((memRecord.lockedUntil - nowMs) / (60 * 1000)));
    return {
      isLocked: true,
      remainingMinutes,
      message: `Too many failed login attempts. For security reasons, this account is temporarily locked for 1 hour. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`,
    };
  }

  // 2. Check Database for distributed/persistent lockout
  try {
    const lockoutToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: `lockout:${cleanId}`,
        expires: { gt: now },
      },
    });

    if (lockoutToken) {
      const remainingMs = lockoutToken.expires.getTime() - nowMs;
      const remainingMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));

      // Sync to memory
      memoryStore.set(cleanId, {
        attempts: MAX_FAILED_ATTEMPTS,
        attemptsExpiresAt: nowMs + ATTEMPT_WINDOW_MS,
        lockedUntil: lockoutToken.expires.getTime(),
      });

      return {
        isLocked: true,
        remainingMinutes,
        message: `Too many failed login attempts. For security reasons, this account is temporarily locked for 1 hour. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`,
      };
    }

    // Clean up expired DB records in background
    prisma.verificationToken.deleteMany({
      where: {
        identifier: `lockout:${cleanId}`,
        expires: { lte: now },
      },
    }).catch(() => {});

    // Check attempts in DB
    const attemptsRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: `attempts:${cleanId}`,
        expires: { gt: now },
      },
    });

    const currentAttempts = attemptsRecord ? parseInt(attemptsRecord.token, 10) || 0 : (memRecord?.attempts || 0);
    const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - currentAttempts);

    return {
      isLocked: false,
      remainingAttempts,
    };
  } catch (error) {
    console.warn('DB checkLoginLockout fallback to memory:', error);
    const currentAttempts = memRecord && memRecord.attemptsExpiresAt > nowMs ? memRecord.attempts : 0;
    return {
      isLocked: false,
      remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - currentAttempts),
    };
  }
}

/**
 * Record a failed login attempt.
 * Increments attempt count. If attempts reach 5, locks account for 1 hour.
 */
export async function recordFailedLogin(rawIdentifier: string): Promise<FailedAttemptResult> {
  const cleanId = normalizeIdentifier(rawIdentifier);
  if (!cleanId) {
    return {
      isLocked: false,
      attemptsCount: 1,
      remainingAttempts: MAX_FAILED_ATTEMPTS - 1,
      message: 'Invalid email or password.',
    };
  }

  const nowMs = Date.now();
  const now = new Date(nowMs);

  // 1. In-memory tracking
  let memRecord = memoryStore.get(cleanId);
  if (!memRecord || memRecord.attemptsExpiresAt <= nowMs) {
    memRecord = {
      attempts: 0,
      attemptsExpiresAt: nowMs + ATTEMPT_WINDOW_MS,
    };
  }

  // Check if already locked
  if (memRecord.lockedUntil && memRecord.lockedUntil > nowMs) {
    const remainingMinutes = Math.max(1, Math.ceil((memRecord.lockedUntil - nowMs) / (60 * 1000)));
    return {
      isLocked: true,
      attemptsCount: MAX_FAILED_ATTEMPTS,
      remainingAttempts: 0,
      remainingMinutes,
      message: `Too many failed login attempts. For security reasons, this account is temporarily locked for 1 hour. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`,
    };
  }

  const newAttempts = memRecord.attempts + 1;
  memRecord.attempts = newAttempts;
  memRecord.attemptsExpiresAt = nowMs + ATTEMPT_WINDOW_MS;

  // 2. Threshold check: 5 attempts
  if (newAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockoutExpiresAt = nowMs + LOCKOUT_DURATION_MS;
    memRecord.lockedUntil = lockoutExpiresAt;
    memoryStore.set(cleanId, memRecord);

    // Persist to DB asynchronously
    try {
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: { in: [`attempts:${cleanId}`, `lockout:${cleanId}`] },
        },
      });

      await prisma.verificationToken.create({
        data: {
          identifier: `lockout:${cleanId}`,
          token: 'LOCKED',
          expires: new Date(lockoutExpiresAt),
        },
      });
    } catch (dbError) {
      console.warn('DB recordFailedLogin lockout persist notice:', dbError);
    }

    return {
      isLocked: true,
      attemptsCount: newAttempts,
      remainingAttempts: 0,
      remainingMinutes: 60,
      message:
        'You have entered the wrong password 5 times. For your security, this account has been locked for 1 hour. Please try again after 1 hour or reset your password.',
    };
  }

  memoryStore.set(cleanId, memRecord);

  // Persist attempt counter to DB
  try {
    await prisma.verificationToken.deleteMany({
      where: { identifier: `attempts:${cleanId}` },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: `attempts:${cleanId}`,
        token: String(newAttempts),
        expires: new Date(nowMs + ATTEMPT_WINDOW_MS),
      },
    });
  } catch (dbError) {
    console.warn('DB recordFailedLogin attempt persist notice:', dbError);
  }

  const remaining = MAX_FAILED_ATTEMPTS - newAttempts;

  return {
    isLocked: false,
    attemptsCount: newAttempts,
    remainingAttempts: remaining,
    message: `Invalid email or password. You have ${remaining} attempt${remaining > 1 ? 's' : ''} remaining before your account is locked for 1 hour.`,
  };
}

/**
 * Reset and clear all login attempt and lockout records for this identifier upon successful login.
 */
export async function clearLoginAttempts(rawIdentifier: string): Promise<void> {
  const cleanId = normalizeIdentifier(rawIdentifier);
  if (!cleanId) return;

  memoryStore.delete(cleanId);

  try {
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: {
          in: [`attempts:${cleanId}`, `lockout:${cleanId}`],
        },
      },
    });
  } catch (dbError) {
    console.warn('DB clearLoginAttempts notice:', dbError);
  }
}
