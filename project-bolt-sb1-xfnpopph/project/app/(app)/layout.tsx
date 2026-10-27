'use client';

import { AppShell } from '@/components/layout/app-shell';
import { useStore } from '@/lib/store/provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (state.user === null) {
      router.replace('/login');
    }
  }, [state.user, router]);

  if (state.user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-pulse-soft rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
