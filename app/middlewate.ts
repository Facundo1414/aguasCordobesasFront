import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

export default withMiddlewareAuthRequired(async function middleware(req) {
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|favicon.ico|/public).*)',
  ],
};
