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
  '/api/collections',
];

// Define admin-only routes
const adminRoutes: string[] = [
  // You can add admin-specific routes here
];

// Check if we should skip auth in development
const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';

export async function proxy(request: NextRequest) {
  // Secara eksplisit mengambil metode HTTP
  const method = request.method.toUpperCase();
  const { pathname } = request.nextUrl;
  
  // Log untuk debugging
  console.log(`Middleware executing for: ${method} ${pathname}`);
  
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
    console.log('Not a protected route, skipping auth check');
    return NextResponse.next();
  }

  // Skip auth check for GET methods - Perhatikan pengecekan yang teliti
  if (method === 'GET') {
    console.log('GET method detected, skipping auth check');
    return NextResponse.next();
  }
  
  // Perhatikan penggunaan logging ini untuk membantu debugging
  console.log(`Authenticated route detected: ${method} ${pathname}`);
  
  // Skip auth check in development if enabled
  if (process.env.NODE_ENV === 'development' && skipAuth) {
    console.log('Development mode with skip auth enabled');
    return NextResponse.next();
  }

  // Get token from cookies instead of Authorization header
  const token = request.cookies.get('access_token')?.value;
  
  // Validate token
  if (!token) {
    console.log('No access token found in cookies');
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Missing token' },
      { status: 401 }
    );
  }

  try {
    // Verify token with explicit error handling
    const payload = await verifyJwtToken(token);
    if (!payload) {
      console.log('Invalid token detected');
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // For admin routes, check if user has admin role
    if (isAdminApiRoute && payload.role !== 'admin') {
      console.log('Non-admin user attempted to access admin route');
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Continue with the request if authenticated
    console.log('Auth successful, continuing request');
    return NextResponse.next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Error verifying token' },
      { status: 401 }
    );
  }
}

// Configure middleware to match specific routes
export const config = {
  matcher: [
    '/api/experiences/:path*',
    '/api/portfolio/:path*',
    '/api/techstack/:path*',
    '/api/faq/:path*',
    '/api/testimonial/:path*',
    '/api/collections/:path*',
  ],
};