import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'fallback-client-id', 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'fallback-client-secret', 
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/calendar.events',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret', // Fallback in case of undefined
  callbacks: {
    async signIn({ account, profile }) {
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
