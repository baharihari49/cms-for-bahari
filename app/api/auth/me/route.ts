// app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJwtToken } from '@/lib/jwt-edge';

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify the token
    try {
      const payload = await verifyJwtToken(accessToken);
      
      if (!payload || !payload.userId) {
        return NextResponse.json(
          { success: false, error: 'Invalid token' },
          { status: 401 }
        );
      }
      
      // Find user in database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Remove sensitive data dengan membuat objek baru
      // yang hanya berisi properti yang ingin dipertahankan
      const userWithoutSensitiveData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      
      return NextResponse.json({
        success: true,
        user: userWithoutSensitiveData,
      });
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user data' },
      { status: 500 }
    );
  }
}