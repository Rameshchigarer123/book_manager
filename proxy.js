import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function proxy(request) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  
  const isDashboard = path.startsWith('/dashboard');
  const isApi = path.startsWith('/api') && !path.startsWith('/api/auth');
  const isAuthPage = path === '/login' || path === '/signup';
  
  if (!token) {
    if (isDashboard) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (isApi && !isAuthPage) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }
  
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return response;
    
  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/login',
    '/signup'
  ]
};