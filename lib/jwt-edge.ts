// lib/jwt-edge.ts - Compatible with Edge Runtime
// This uses jose library which is compatible with Edge Runtime

import { jwtVerify, SignJWT } from 'jose';
import { NextRequest } from 'next/server';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Secret key should be at least 32 bytes for HS256
const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production-at-least-32-chars'
);

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Convert duration string like '1d' to seconds
function parseExpiration(duration: string): number {
  const units = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    w: 7 * 24 * 60 * 60,
  };
  
  const match = duration.match(/^(\d+)([smhdw])$/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2] as keyof typeof units;
    return value * units[unit];
  }
  
  return 24 * 60 * 60; // Default to 1 day
}

// Generate a JWT token
export async function signJwtToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
  const expiresIn = parseExpiration(JWT_EXPIRES_IN);
  
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(secretKey);
}

// Verify and decode a JWT token
export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Parse token from Authorization header
export function parseAuthHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

// Get token from request
export function getJwtTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  return parseAuthHeader(authHeader || '');
}