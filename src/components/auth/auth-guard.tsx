'use client';

import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/util/paths';
import { useRouter } from 'next/navigation';
import { Fragment, useLayoutEffect, useState } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.AUTH.SIGN_IN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (!mounted) return null;

  if (isLoading) return null;

  if (!isAuthenticated) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
} 