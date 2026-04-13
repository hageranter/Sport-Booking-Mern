'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pathname.startsWith('/admin') && user.role !== 'Admin') {
      router.replace('/');
      return;
    }
    if (pathname.startsWith('/owner') && user.role !== 'CourtOwner' && user.role !== 'Admin') {
      router.replace('/');
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  return <>{children}</>;
}
