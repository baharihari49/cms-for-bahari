// lib/auth-utils.ts

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Password verification
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Generate a refresh token
export function generateRefreshToken(): string {
  return uuidv4();
}