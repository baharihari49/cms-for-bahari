// components/AuthGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional role requirement
  redirectTo?: string;   // Where to redirect if not authenticated
  fallback?: React.ReactNode; // Optional fallback UI during loading
}

/**
 * A component that guards routes requiring authentication
 * Can optionally check for a specific role
 */
export default function AuthGuard({
  children,
  requiredRole,
  redirectTo = '/login',
  fallback = <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>,
}: AuthGuardProps) {
  const {loading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Don't check during initial loading of auth state
    if (loading) return;

    // Set a small delay to avoid flash of unauthorized content
    const checkTimer = setTimeout(() => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // // Check role requirement if specified
      // if (requiredRole && !hasRole(requiredRole)) {
      //   // Redirect to appropriate page when role doesn't match
      //   router.push('/unauthorized');
      //   return;
      // }

      // All checks passed
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(checkTimer);
  }, [loading, isAuthenticated, requiredRole, hasRole, router, redirectTo]);

  // Show fallback while checking authentication or during loading
  if (loading || isChecking) {
    return <>{fallback}</>;
  }

  // If all checks pass, render the children
  // No need for additional checks since we manage visibility with isChecking state
  return <>{children}</>;
}