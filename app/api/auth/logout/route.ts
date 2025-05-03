// app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJwtToken } from '@/lib/jwt-edge';

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;

    // Clear refresh token in database if we can identify the user
    if (accessToken) {
      try {
        const payload = await verifyJwtToken(accessToken);
        if (payload && payload.userId) {
          // Clear refresh token in the database
          await prisma.user.update({
            where: { id: payload.userId },
            data: { refreshToken: null },
          });
        }
      } catch (tokenError) {
        // Ignore token verification errors - we'll clear cookies anyway
        console.debug('Token verification failed during logout:', tokenError);
      }
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear cookies by setting them to empty and expiring immediately
    response.cookies.set({
      name: 'access_token',
      value: '',
      httpOnly: true,
      expires: new Date(0), // Immediately expire
      path: '/',
    });

    response.cookies.set({
      name: 'refresh_token',
      value: '',
      httpOnly: true,
      expires: new Date(0), // Immediately expire
      path: '/api/auth',
    });

    return response;
  } catch (logoutError) {
    console.error('Logout failed:', logoutError);
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    );
  }
}