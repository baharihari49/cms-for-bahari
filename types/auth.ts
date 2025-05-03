// types/auth.ts

// Importing User from the generated Prisma types
import { Prisma } from '@prisma/client';

// Define a User type based on the Prisma schema
type User = {
  id: string;
  email: string;
  password: string;
  name: string | null;
  role: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: Omit<User, 'password' | 'refreshToken'>;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}