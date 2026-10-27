'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Lightbulb,
  LogIn,
  UserCircle2,
  ShieldCheck,
  Wrench,
  AlertCircle,
} from 'lucide-react';

export default function LoginPage() {
  const { login, loginAsEmployee } = useStore();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const user = login(username.trim(), password);
    if (!user) {
      setError('Username atau password salah. Silakan coba lagi.');
      setLoading(false);
      return;
    }
    toast.success(`Selamat datang, ${user.name}!`);
    router.push('/');
  };

  const handleEmployee = () => {
    loginAsEmployee();
    toast.success('Masuk sebagai Karyawan');
    router.push('/');
  };

  const fillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-grid p-4">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground glow-lamp">
            <Lightbulb className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AlpenLight</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sistem Smart Lighting Kantor Alpen
          </p>
        </div>

        <Card className="p-6 shadow-lg">
          <div className="mb-5 flex items-center gap-2">
            <LogIn className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Masuk ke Sistem</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              <LogIn className="h-4 w-4" />
              Masuk
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">atau</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleEmployee}
          >
            <UserCircle2 className="h-4 w-4" />
            Masuk sebagai Karyawan
          </Button>
        </Card>

        {/* Demo accounts */}
        <Card className="mt-4 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Akun Demo
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemo('admin', 'admin123')}
              className="flex w-full items-center justify-between rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Admin
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                admin / admin123
              </span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('teknisi', 'teknisi123')}
              className="flex w-full items-center justify-between rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-warning" />
                Teknisi
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                teknisi / teknisi123
              </span>
            </button>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Klik akun untuk mengisi otomatis. Login hanya untuk simulasi lokal.
          </p>
        </Card>
      </div>
    </div>
  );
}
