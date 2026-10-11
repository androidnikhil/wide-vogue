/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import { cookies } from 'next/headers';
import { compare } from './lib/encrypt';
import CredentialsProvider from 'next-auth/providers/credentials';

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
          
          // Clean phone digits without '+' sign (e.g. 7078211946)
          const rawPhone = firebaseUser.phoneNumber ? firebaseUser.phoneNumber.replace(/\D/g, '') : '';
          const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;
          
          // Primary clean email
          const email = firebaseUser.email || (cleanPhone ? `${cleanPhone}@madhavshringaar.com` : `${firebaseUser.localId}@madhavshringaar.com`);
          const name = firebaseUser.displayName || (cleanPhone ? 'Phone User' : 'NO_NAME');
          
          // Find or create user in Prisma - check for all common phone formats to avoid duplicates
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { email },
                ...(firebaseUser.phoneNumber ? [{ email: `${firebaseUser.phoneNumber}@madhavshringaar.com` }] : []),
                ...(cleanPhone ? [
                  { email: `${cleanPhone}@madhavshringaar.com` },
                  { email: `91${cleanPhone}@madhavshringaar.com` },
                  { email: `+91${cleanPhone}@madhavshringaar.com` },
                ] : []),
              ],
            },
          });
          
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name,
                password: '', // Firebase users don't need a DB password
              }
            });
          }
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
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
      // Set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name then set a generic name based on email format
        if (user.name === 'NO_NAME') {
          if (user.email?.endsWith('@madhavshringaar.com')) {
            token.name = 'Phone User';
          } else {
            token.name = user.email!.split('@')[0];
          }

          // Update database to reflect the token name safely
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { name: token.name },
            });
          } catch (updateErr) {
            console.error("Failed to update user name in jwt callback:", updateErr);
          }
        }

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