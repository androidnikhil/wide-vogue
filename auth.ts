/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import { cookies } from 'next/headers';
import { compare } from './lib/encrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sendWelcomeEmail } from '@/email';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'firebase',
      name: 'Firebase',
      credentials: {
        idToken: { type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;
        
        try {
          const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "AIzaSyBIsOiajJyb3JSDT0Axn5s1h5KcLYwYlPg";
          
          // Verify token using Firebase REST API
          const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: credentials.idToken })
          });
          
          const data = await res.json();
          if (!data.users || data.users.length === 0) {
            console.error("Firebase accounts:lookup error or no users returned:", data);
            return null;
          }
          
          const firebaseUser = data.users[0];
          
          let user: any = null;

          if (firebaseUser.phoneNumber) {
            // PHONE AUTHENTICATION
            const rawPhone = firebaseUser.phoneNumber.replace(/\D/g, '');
            const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;

            // Search by real phoneNumber or previous test emails
            user = await prisma.user.findFirst({
              where: {
                OR: [
                  { phoneNumber: cleanPhone },
                  { email: `${cleanPhone}@madhavshringaar.com` },
                  { email: `+91${cleanPhone}@madhavshringaar.com` },
                ],
              },
            });

            if (!user) {
              // Create user without ANY fake email
              user = await prisma.user.create({
                data: {
                  phoneNumber: cleanPhone,
                  email: null, // No fake placeholder email
                  name: 'NO_NAME',
                  password: '',
                },
              });
            } else if (user.email?.endsWith('@madhavshringaar.com') || !user.phoneNumber) {
              // Clean up previous placeholder email if present
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  phoneNumber: cleanPhone,
                  email: user.email?.endsWith('@madhavshringaar.com') ? null : user.email,
                },
              });
            }

            const rawName = user.name?.trim();
            const isNumeric = rawName && /^\+?\d{7,15}$/.test(rawName.replace(/\s+/g, ''));
            const validName = rawName && rawName !== 'NO_NAME' && !isNumeric ? rawName : null;

            return {
              id: user.id,
              name: validName,
              email: user.email || '',
              role: user.role,
            };
          } else if (firebaseUser.email) {
            // GOOGLE / EMAIL AUTHENTICATION
            const email = firebaseUser.email;
            const name = firebaseUser.displayName || email.split('@')[0];
            const designatedAdminEmail = (process.env.ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com').toLowerCase();
            const isAdminEmail = email.toLowerCase() === designatedAdminEmail;

            user = await prisma.user.findFirst({
              where: { email },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  email,
                  name,
                  image: firebaseUser.photoURL || null,
                  password: '',
                  role: isAdminEmail ? 'admin' : 'user',
                },
              });

              // Trigger Welcome Email asynchronously
              sendWelcomeEmail({ name, email }).catch((err) =>
                console.error("Welcome email failed:", err)
              );
            } else if (isAdminEmail && user.role !== 'admin') {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { role: 'admin' },
              });
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }

          return null;
        } catch (error) {
          console.error("Firebase auth error in authorize():", error);
          return null;
        }
      }
    }),
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );

          // If password is correct, return user
          if (isMatch) {
            const designatedAdminEmail = (process.env.ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com').toLowerCase();
            if (user.email?.toLowerCase() === designatedAdminEmail && user.role !== 'admin') {
              await prisma.user.update({
                where: { id: user.id },
                data: { role: 'admin' },
              });
              user.role = 'admin';
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, trigger, token }: any) {
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.role = token.role;

        // Fetch fresh user fields from database so profile updates reflect in real-time
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { name: true, email: true, phoneNumber: true, role: true },
          });

          if (dbUser) {
            const rawName = dbUser.name?.trim();
            const isNumeric = rawName && /^\+?\d{7,15}$/.test(rawName.replace(/\s+/g, ''));
            const isRealName = Boolean(rawName && rawName !== 'NO_NAME' && !isNumeric);

            session.user.name = isRealName ? rawName : null;
            session.user.email = dbUser.email;
            (session.user as any).phoneNumber = dbUser.phoneNumber;
            session.user.role = dbUser.role;
          } else {
            session.user.name = token.name;
          }
        } catch {
          session.user.name = token.name;
        }
      }

      if (trigger === 'update' && user?.name) {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        const rawName = user.name?.trim();
        const isNumeric = rawName && /^\+?\d{7,15}$/.test(rawName.replace(/\s+/g, ''));
        const validName = rawName && rawName !== 'NO_NAME' && !isNumeric ? rawName : null;
        token.name = validName;

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      // Handle session updates
      if (session?.user?.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);