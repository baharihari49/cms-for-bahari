// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateRefreshToken } from '@/lib/auth-utils';
import { signJwtToken } from '@/lib/jwt-edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Check if required fields are present
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const refreshToken = generateRefreshToken();
    
    // Buat payload untuk token
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    
    try {
      // Gunakan try-catch terpisah untuk menangkap error spesifik pada pembuatan token
      const accessToken = await signJwtToken(payload);
      
      // Update user with new refresh token
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      // Remove sensitive data before sending response
      // Menggunakan pendekatan yang type-safe: memilih properti yang ingin dipertahankan
      const userWithoutSensitiveData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Buat response object
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: userWithoutSensitiveData,
        // Tidak perlu mengembalikan token dalam response JSON
      });

      // Set access token sebagai HTTP-only cookie
      response.cookies.set({
        name: 'access_token',
        value: accessToken,
        httpOnly: true,         // Tidak dapat diakses oleh JavaScript
        secure: process.env.NODE_ENV === 'production', // HTTPS only di production
        sameSite: 'strict',     // Mencegah CSRF attacks
        maxAge: 60 * 60 * 24,   // 1 hari dalam detik
        path: '/',              // Berlaku untuk semua path
      });

      // Set refresh token juga sebagai HTTP-only cookie
      response.cookies.set({
        name: 'refresh_token',
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 hari
        path: '/api/auth',       // Hanya berlaku untuk endpoints auth
      });

      return response;
    } catch (error) {
      console.error('Token generation error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to generate authentication token' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
  }
}