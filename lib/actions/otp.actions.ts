'use server';

import crypto from 'crypto';
import { prisma } from '@/db/prisma';
import { sendOtpEmail } from '@/email';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');

/**
 * Generate and dispatch a secure 6-digit OTP to the user's email
 */
export async function generateAndSendOtp(email: string, purpose: 'SIGN_UP' | 'SIGN_IN' = 'SIGN_UP') {
  try {
    const parseResult = emailSchema.safeParse(email?.trim());
    if (!parseResult.success) {
      return { success: false, message: 'Invalid email address format.' };
    }

    const cleanEmail = parseResult.data.toLowerCase().trim();

    // 1. If Sign Up, ensure email does not already exist
    if (purpose === 'SIGN_UP') {
      const existingUser = await prisma.user.findFirst({
        where: { email: cleanEmail },
        select: { id: true },
      });
      if (existingUser) {
        return {
          success: false,
          message: 'An account with this email address already exists. Please Sign In instead.',
        };
      }
    }

    // 2. Rate limiting check (must wait at least 45 seconds between requests)
    const existingToken = await prisma.verificationToken.findFirst({
      where: { identifier: cleanEmail },
      orderBy: { expires: 'desc' },
    });

    if (existingToken) {
      const tokenAgeMs = existingToken.expires.getTime() - Date.now();
      // If expires was 5 mins in future, and now > 4m 15s remaining, user requested less than 45s ago
      if (tokenAgeMs > 4 * 60 * 1000 + 15 * 1000) {
        return {
          success: false,
          message: 'Please wait a few moments before requesting another verification code.',
        };
      }
    }

    // 3. Generate cryptographically strong 6-digit numeric OTP
    const otpNumber = crypto.randomInt(100000, 1000000);
    const otp = otpNumber.toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // 4. Upsert/Save in VerificationToken table atomically
    await prisma.verificationToken.deleteMany({
      where: { identifier: cleanEmail },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: cleanEmail,
        token: otp,
        expires: expiresAt,
      },
    });

    // 5. Send Email via Hostinger SMTP
    const emailResult = await sendOtpEmail({ email: cleanEmail, otp });

    if (!emailResult.success) {
      return {
        success: false,
        message: 'Could not send verification email. Please check your email address or try again shortly.',
      };
    }

    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}. Valid for 5 minutes.`,
    };
  } catch (error: any) {
    console.error('OTP Generation Error:', error);
    // Generic, non-revealing error message to prevent leaking system details
    return {
      success: false,
      message: 'Unable to process OTP request at this moment. Please try again shortly.',
    };
  }
}

/**
 * Verify a submitted 6-digit OTP
 */
export async function verifyOtpCode(email: string, otp: string) {
  try {
    const cleanEmail = email?.toLowerCase().trim();
    const cleanOtp = otp?.trim();

    if (!cleanEmail || !cleanOtp || cleanOtp.length !== 6) {
      return { success: false, message: 'Please enter a valid 6-digit verification code.' };
    }

    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: cleanEmail,
        token: cleanOtp,
      },
    });

    if (!tokenRecord) {
      return {
        success: false,
        message: 'Incorrect verification code. Please check your email and try again.',
      };
    }

    if (tokenRecord.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.deleteMany({ where: { identifier: cleanEmail } });
      return {
        success: false,
        message: 'Verification code has expired. Please request a new code.',
      };
    }

    // OTP is valid! Delete token to prevent reuse
    await prisma.verificationToken.deleteMany({
      where: { identifier: cleanEmail },
    });

    return {
      success: true,
      message: 'Email verified successfully!',
    };
  } catch (error: any) {
    console.error('OTP Verification Error:', error);
    return {
      success: false,
      message: 'Failed to verify code. Please try again.',
    };
  }
}
