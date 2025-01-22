'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { LoadingSpinner } from '@/components/loading-spinner';

interface WithAuthOptions {
  requireAdmin?: boolean;
  redirectTo?: string;
  allowIfAuthed?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function WithAuthComponent(props: P) {
    const { user, isAdmin, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isLoading) {
        // Handle authentication requirements
        if (!user && !options.allowIfAuthed) {
          router.push(options.redirectTo || '/login');
          return;
        }

        // Handle admin requirements
        if (options.requireAdmin && !isAdmin) {
          router.push('/');
          return;
        }

        // Handle redirect if already authenticated
        if (options.allowIfAuthed && user) {
          router.push(options.redirectTo || '/');
          return;
        }
      }
    }, [user, isAdmin, isLoading, router]);

    // Show loading state
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // Handle authentication requirements
    if (!user && !options.allowIfAuthed) {
      return null;
    }

    // Handle admin requirements
    if (options.requireAdmin && !isAdmin) {
      return null;
    }

    // Handle redirect if already authenticated
    if (options.allowIfAuthed && user) {
      return null;
    }

    // Render the protected component
    return <WrappedComponent {...props} />;
  };
}