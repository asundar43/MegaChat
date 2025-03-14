import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/chat/:path*',
    '/api/chat/:path*',
    '/settings/:path*',
    
    // Exclude the following routes from authentication:
    // '/' - Landing page
    // '/auth/login' - Login page
    // '/auth/register' - Registration page
    // Add other protected routes here, but NOT the landing page
  ],
};
