'use client';

import { useStore } from '@/lib/store/provider';
import { ROLE_LABELS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from './sidebar';
import { CircleDot } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  const user = state.user;

  return (
    <div className="flex min-h-screen bg-grid">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile brand dot */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CircleDot className="h-4 w-4" />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-medium">{user?.name ?? 'Tamu'}</span>
              <span className="text-[11px] text-muted-foreground">
                {user ? ROLE_LABELS[user.role] : 'Belum masuk'}
              </span>
            </div>
            <Badge
              variant="outline"
              className="border-success/40 bg-success/10 text-success"
            >
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
              Sistem Aktif
            </Badge>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
