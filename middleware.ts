// middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/jwt-edge';

// Define protected routes
const protectedRoutes: string[] = [
  '/api/experiences',
  '/api/portfolio',
  '/api/techstack',
  '/api/faq',
  '/api/testimonial',
];

// Define admin-only routes
const adminRoutes: string[] = [
  // You can add admin-specific routes here
];

// Check if we should skip auth in development
const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's an API route that requires protection
  const isProtectedApiRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) && 
    (pathname === route || pathname.startsWith(`${route}/`))
  );
  
  // Check if it's an admin-only route
  const isAdminApiRoute = adminRoutes.some(route => 
    pathname.startsWith(route) && 
    (pathname === route || pathname.startsWith(`${route}/`))
  );

  // Skip middleware if not a protected route
  if (!isProtectedApiRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }
  
  // Skip auth check in development if enabled
  if (process.env.NODE_ENV === 'development' && skipAuth) {
    return NextResponse.next();
  }

  // Get token from cookies instead of Authorization header
  const token = request.cookies.get('access_token')?.value;
  
  // Validate token
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Missing token' },
      { status: 401 }
    );
  }

  // Verify token - perhatikan penggunaan await, karena fungsi sekarang async
  const payload = await verifyJwtToken(token);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }

  // For admin routes, check if user has admin role
  if (isAdminApiRoute && payload.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Admin access required' },
      { status: 403 }
    );
  }

  // Continue with the request if authenticated
  return NextResponse.next();
}

// Configure middleware to match specific routes
export const config = {
  matcher: [
    '/api/experiences/:path*',
    '/api/portfolio/:path*',
    '/api/techstack/:path*',
    '/api/faq/:path*',
    '/api/testimonial/:path*',
    // Add other protected routes here
  ],
};