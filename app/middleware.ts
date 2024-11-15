import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  if (!token && !request.nextUrl.pathname.startsWith('/login-page')) {
    const loginUrl = new URL('/login-page', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'], // Excluye rutas específicas como estáticos y APIs
};
