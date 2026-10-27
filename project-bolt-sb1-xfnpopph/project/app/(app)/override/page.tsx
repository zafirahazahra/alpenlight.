'use client';

import { useStore } from '@/lib/store/provider';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ShieldAlert,
  Power,
  PowerOff,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OverridePage() {
  const { state, applyOverride, resetOverride } = useStore();
  const router = useRouter();
  const { settings, user, rooms } = state;

  useEffect(() => {
    if (user && user.role !== 'teknisi') {
      router.replace('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'teknisi') return null;

  const current = settings.override;

  const handleApply = (mode: 'all_on' | 'all_off') => {
    applyOverride(mode);
    toast.success(
      mode === 'all_on'
        ? 'Semua lampu dinyalakan.'
        : 'Semua lampu dimatikan.',
      { description: 'Quick Override aktif.' }
    );
  };

  const handleReset = () => {
    resetOverride();
    toast.success('Kembali ke mode normal.', {
      description: 'Lampu mengikuti mode dan sensor ruangan.',
    });
  };

  const onCount = rooms.filter((r) => r.isOn).length;

  return (
    <div>
      <PageHeader
        title="Quick Override"
        description="Kontrol darurat untuk menyalakan atau mematikan seluruh lampu kantor sekaligus."
        icon={ShieldAlert}
      />

      {/* Current status */}
      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Status Override Saat Ini</p>
            <div className="mt-1 flex items-center gap-2">
              {current === 'normal' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-lg font-semibold text-success">
                    Mode Normal
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span className="text-lg font-semibold text-warning">
                    {current === 'all_on' ? 'Semua Lampu ON' : 'Semua Lampu OFF'}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{onCount} lampu ON</Badge>
            <Badge variant="secondary">
              {rooms.length - onCount} lampu OFF
            </Badge>
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          className={`flex flex-col items-center gap-3 p-6 text-center transition-all ${
            current === 'all_on' ? 'ring-2 ring-primary' : ''
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Power className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-semibold">Nyalakan Semua Lampu</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Paksa seluruh lampu menyala pada kecerahan penuh.
            </p>
          </div>
          <Button
            className="w-full"
            disabled={current === 'all_on'}
            onClick={() => handleApply('all_on')}
          >
            <Power className="h-4 w-4" />
            Nyalakan Semua
          </Button>
        </Card>

        <Card
          className={`flex flex-col items-center gap-3 p-6 text-center transition-all ${
            current === 'all_off' ? 'ring-2 ring-destructive' : ''
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
            <PowerOff className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-semibold">Matikan Semua Lampu</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Paksa seluruh lampu mati untuk situasi darurat.
            </p>
          </div>
          <Button
            variant="destructive"
            className="w-full"
            disabled={current === 'all_off'}
            onClick={() => handleApply('all_off')}
          >
            <PowerOff className="h-4 w-4" />
            Matikan Semua
          </Button>
        </Card>

        <Card
          className={`flex flex-col items-center gap-3 p-6 text-center transition-all ${
            current === 'normal' ? 'ring-2 ring-success' : ''
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
            <RotateCcw className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-semibold">Kembali ke Mode Normal</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Lampu kembali mengikuti mode dan sensor ruangan.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            disabled={current === 'normal'}
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            Mode Normal
          </Button>
        </Card>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Teknisi tidak dapat melihat estimasi biaya listrik atau penghematan.
      </p>
    </div>
  );
}
