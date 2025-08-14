export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/',
    '/users/:path*',
    '/stock/:path*',
    '/sales/:path*',
  ],
};


