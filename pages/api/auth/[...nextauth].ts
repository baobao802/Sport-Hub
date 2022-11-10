import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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
          token.accessToken = account.access_token;
          const loginResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              accessToken: account?.access_token,
            },
          );
          res.setHeader('Set-Cookie', loginResponse.headers['set-cookie']!);
        }
        return token;
      },
    },
    session: {
      maxAge: 10 * 60 * 60,
    },
    jwt: {
      maxAge: 10 * 60 * 60,
    },
  });
}
