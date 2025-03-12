import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith('/chat');
      const isOnRegister = nextUrl.pathname.startsWith('/auth/register');
      const isOnLogin = nextUrl.pathname.startsWith('/auth/login');
      const isOnLanding = nextUrl.pathname === '/';

      if (isOnLanding) {
        return true; // Always allow access to landing page
      }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/chat', nextUrl as unknown as URL));
      }

      if (isOnRegister || isOnLogin) {
        return true; // Always allow access to register and login pages
      }

      if (isOnChat) {
        return isLoggedIn; // Require auth for chat pages
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
