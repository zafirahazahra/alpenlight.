'use client';

import { useStore } from '@/lib/store/provider';
import { ROLE_LABELS } from '@/lib/constants';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Lightbulb,
  Calculator,
  Clock,
  Zap,
  ShieldAlert,
  Menu,
  LogOut,
  LightbulbIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teknisi', 'karyawan'] },
  { href: '/monitoring', label: 'Monitoring & Kontrol', icon: Lightbulb, roles: ['admin', 'karyawan'] },
  { href: '/sensor', label: 'Monitoring Sensor', icon: Zap, roles: ['teknisi'] },
  { href: '/override', label: 'Quick Override', icon: ShieldAlert, roles: ['teknisi'] },
  { href: '/kalkulator', label: 'Kalkulator Listrik', icon: Calculator, roles: ['admin'] },
  { href: '/lembur', label: 'Persetujuan Lembur', icon: Clock, roles: ['admin'] },
  { href: '/lembur/ajukan', label: 'Ajukan Lembur', icon: Clock, roles: ['karyawan'] },
];

export function Sidebar() {
  const { state, logout } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const user = state.user;
  const items = NAV_ITEMS.filter((i) =>
    user ? i.roles.includes(user.role) : false
  );

  const initials = user
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const NavList = () => (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              active
                ? 'bg-primary/15 text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            style={active ? { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' } : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const Brand = () => (
    <Link href="/" className="flex items-center gap-2.5 px-5 py-5" onClick={() => setOpen(false)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground glow-lamp">
        <LightbulbIcon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold leading-tight tracking-tight">
          AlpenLight
        </span>
        <span className="text-[11px] text-muted-foreground leading-tight">
          Smart Lighting Kantor
        </span>
      </div>
    </Link>
  );

  const UserCard = () => (
    <div className="mt-auto px-3 pb-4">
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{user?.name}</span>
          <Badge
            variant="secondary"
            className="mt-0.5 w-fit text-[10px] py-0 h-4"
          >
            {user ? ROLE_LABELS[user.role] : ''}
          </Badge>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={logout}
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 border-r bg-card h-screen sticky top-0">
        <Brand />
        <Separator />
        <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">
          <NavList />
        </div>
        <Separator />
        <UserCard />
      </aside>

      {/* Mobile sheet trigger */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Buka menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <SheetTitle className="sr-only">Navigasi AlpenLight</SheetTitle>
            <Brand />
            <Separator />
            <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">
              <NavList />
            </div>
            <Separator />
            <UserCard />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
