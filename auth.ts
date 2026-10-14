/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import { cookies } from 'next/headers';
import { compare } from './lib/encrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sendWelcomeEmail } from '@/email';

export const isDesignatedAdmin = (email?: string | null, phone?: string | null): boolean => {
  const adminEmails = [
    (process.env.ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com').toLowerCase(),
    'nikhil.pandey@madhavshringaar.com',
    'nikhilpandey00999@gmail.com',
  ];
  const adminPhones = [
    '9876543210',
    '7078211946',
    '7982160480',
    process.env.SUPPORT_PHONE?.replace(/\D/g, '') || '',
    process.env.WHATSAPP_NUMBER?.replace(/\D/g, '') || '',
  ].filter(Boolean);

  const emailLower = email?.trim().toLowerCase();
  const phoneClean = phone?.replace(/\D/g, '');

  if (emailLower && adminEmails.includes(emailLower)) return true;
  if (phoneClean && adminPhones.some((p) => p && (phoneClean === p || phoneClean.endsWith(p)))) return true;
  return false;
};

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
            const isAdminByPhone = isDesignatedAdmin(null, cleanPhone);

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
                  email: null,
                  name: 'NO_NAME',
                  password: '',
                  role: isAdminByPhone ? 'admin' : 'user',
                },
              });
            } else {
              const shouldBeAdmin = isAdminByPhone || isDesignatedAdmin(user.email, cleanPhone);
              const needsEmailCleanup = user.email?.endsWith('@madhavshringaar.com');
              const needsRoleUpgrade = shouldBeAdmin && user.role !== 'admin';

              if (needsEmailCleanup || !user.phoneNumber || needsRoleUpgrade) {
                user = await prisma.user.update({
                  where: { id: user.id },
                  data: {
                    phoneNumber: cleanPhone,
                    email: needsEmailCleanup ? null : user.email,
                    ...(needsRoleUpgrade ? { role: 'admin' } : {}),
                  },
                });
              }
            }

            const rawName = user.name?.trim();
            const isNumeric = rawName && /^\+?\d{7,15}$/.test(rawName.replace(/\s+/g, ''));
            const validName = rawName && rawName !== 'NO_NAME' && !isNumeric ? rawName : null;

            return {
              id: user.id,
              name: validName,
              email: user.email || '',
              role: isDesignatedAdmin(user.email, cleanPhone) ? 'admin' : user.role,
            };
          } else if (firebaseUser.email) {
            // GOOGLE / EMAIL AUTHENTICATION
            const email = firebaseUser.email;
            const name = firebaseUser.displayName || email.split('@')[0];
            const isAdmin = isDesignatedAdmin(email, null);

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
                  role: isAdmin ? 'admin' : 'user',
                },
              });

              // Trigger Welcome Email asynchronously
              sendWelcomeEmail({ name, email }).catch((err) =>
                console.error("Welcome email failed:", err)
              );
            } else if (isAdmin && user.role !== 'admin') {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { role: 'admin' },
              });
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: isAdmin ? 'admin' : user.role,
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
            const isAdmin = isDesignatedAdmin(user.email, user.phoneNumber);
            if (isAdmin && user.role !== 'admin') {
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
              role: isAdmin ? 'admin' : user.role,
            };
          }
        }
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
            select: { id: true, name: true, email: true, phoneNumber: true, role: true },
          });

          if (dbUser) {
            const rawName = dbUser.name?.trim();
            const isNumeric = rawName && /^\+?\d{7,15}$/.test(rawName.replace(/\s+/g, ''));
            const isRealName = Boolean(rawName && rawName !== 'NO_NAME' && !isNumeric);

            const shouldBeAdmin = isDesignatedAdmin(dbUser.email, dbUser.phoneNumber);
            if (shouldBeAdmin && dbUser.role !== 'admin') {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: { role: 'admin' },
              });
              dbUser.role = 'admin';
            }

            session.user.name = isRealName ? rawName : null;
            session.user.email = dbUser.email;
            (session.user as any).phoneNumber = dbUser.phoneNumber;
            session.user.role = shouldBeAdmin ? 'admin' : dbUser.role;
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
        const shouldBeAdmin = isDesignatedAdmin(user.email, (user as any).phoneNumber);
        token.id = user.id;
        token.role = shouldBeAdmin ? 'admin' : user.role;

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
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);