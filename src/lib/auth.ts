import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const authorize = async (credentials: Partial<Record<string, unknown>>) => {
  const parsedCredentials = z
    .object({ email: z.string().email(), password: z.string() })
    .safeParse(credentials);

  if (parsedCredentials.success) {
    const { email, password } = parsedCredentials.data;

    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = userResults[0];

    if (!user) return null;

    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

    if (passwordsMatch) {
      // Return user without the hashed password
      return { id: user.id.toString(), email: user.email };
    }
  }

  return null;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
});
