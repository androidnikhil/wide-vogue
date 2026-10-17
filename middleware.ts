import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (public images)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - any static file with an extension (e.g. .svg, .png, .jpg, .webp, .ico, .css, .js)
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};