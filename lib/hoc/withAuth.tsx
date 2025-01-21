'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { requireAdmin?: boolean } = {}
) {
  return function WithAuthComponent(props: P) {
    const { user, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      } else if (options.requireAdmin && !isAdmin) {
        router.push('/');
      }
    }, [user, isAdmin, router]);

    if (!user || (options.requireAdmin && !isAdmin)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}