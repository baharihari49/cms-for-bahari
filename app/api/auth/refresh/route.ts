// app/api/auth/refresh/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateRefreshToken } from '@/lib/auth-utils';
import { signJwtToken } from '@/lib/jwt-edge';

export async function GET(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Find user with the provided refresh token
    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const newRefreshToken = generateRefreshToken();
    
    // Create payload for token
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    
    // Sign new JWT token
    const accessToken = await signJwtToken(payload);

    // Update user with new refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
    });

    // Set new access token as HTTP-only cookie
    response.cookies.set({
      name: 'access_token',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    // Set new refresh token as HTTP-only cookie
    response.cookies.set({
      name: 'refresh_token',
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/api/auth',
    });

    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}