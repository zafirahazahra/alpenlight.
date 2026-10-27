'use client';

import { useStore } from '@/lib/store/provider';
import type { Role } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PUBLIC_PATHS = ['/login'];

export function useRequireAuth(allowedRoles?: Role[]) {
  const { state } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!state.user && !isPublic) {
      router.replace('/login');
      return;
    }
    if (state.user && pathname === '/login') {
      router.replace('/');
      return;
    }
    if (state.user && allowedRoles && !allowedRoles.includes(state.user.role)) {
      router.replace('/');
    }
  }, [state.user, pathname, router, allowedRoles]);
}
