// hooks/useAuth.tsx
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => Promise<LogoutResult>;
  refreshAuth: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface LogoutResult {
  success: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

interface MeResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  error?: string;
}

// Create auth context with default value
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Function to fetch current user info
  const fetchUserInfo = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include', // Important for sending cookies
      });
      
      if (res.ok) {
        const data: MeResponse = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return true;
        } else {
          setUser(null);
        }
      } else if (res.status === 401) {
        // Try to refresh the token if unauthorized
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          // Try fetching user info again
          return await fetchUserInfo();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    
    return false;
  };

  // Try to refresh the token
  const tryRefreshToken = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/refresh', {
        credentials: 'include', // Important for cookies
      });
      
      return res.ok;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // Initialize on mount - check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      await fetchUserInfo();
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Function to refresh auth state
  const refreshAuth = async (): Promise<void> => {
    setLoading(true);
    await fetchUserInfo();
    setLoading(false);
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Important for receiving cookies
      });

      const data: LoginResponse = await res.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<LogoutResult> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logout', {
        credentials: 'include', // Important for sending cookies
      });

      if (res.ok) {
        setUser(null);
        router.push('/login'); // Redirect to login page
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user has specific role
  const hasRole = (role: string): boolean => {
    return !!user && user.role === role;
  };

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshAuth,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}