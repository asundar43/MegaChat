import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/chat');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');
      const isOnLanding = nextUrl.pathname === '/';

      // Allow access to landing page
      if (isOnLanding) return true;

      // Redirect logged-in users away from auth pages
      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/chat', nextUrl));
      }

      // Allow access to auth pages for non-logged-in users
      if (isOnAuth) return true;

      // Protect dashboard routes
      if (isOnDashboard) {
        return isLoggedIn;
      }

      // Default allow
      return true;
    },
  },
} satisfies NextAuthConfig;
