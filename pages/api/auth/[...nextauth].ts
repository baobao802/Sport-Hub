import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import https from 'https';
import { parse } from 'cookie';
import { randomBytes, randomUUID } from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
      }),
    ],
    pages: {
      signIn: '/login',
    },
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          const loginResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              accessToken: account?.access_token,
            },
            // {
            //   httpsAgent: new https.Agent({
            //     rejectUnauthorized: false,
            //   }),
            // },
          );
          res.setHeader('Set-Cookie', loginResponse.headers['set-cookie']!);
          token.accessToken = parse(
            loginResponse.headers['set-cookie']?.join(';') as string,
          ).access_token;
        }
        return token;
      },
      async session({ session, token }) {
        (session as any).accessToken = token.accessToken;
        return session;
      },
    },
    session: {
      maxAge: 5 * 24 * 60 * 60,
      generateSessionToken: () => {
        return randomUUID?.() ?? randomBytes(32).toString('hex');
      },
    },
    jwt: {
      maxAge: 5 * 24 * 60 * 60,
    },
  });
}
