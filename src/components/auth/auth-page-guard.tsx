'use client';

import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/util/paths';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthPageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.USER.HOME);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 