'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store/provider';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/layout/stat-card';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Calculator as CalcIcon,
  Zap,
  Wallet,
  PiggyBank,
  Clock,
  Info,
} from 'lucide-react';
import {
  effectiveWatt,
  energyKwh,
  costRp,
  formatRp,
  formatKwh,
} from '@/lib/energy';
import { TARIF_PER_KWH } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function KalkulatorPage() {
  const { state } = useStore();
  const { rooms, user } = state;
  const router = useRouter();
  const [hours, setHours] = useState(8);

  useEffect(() => {
    if (user && user.role !== 'admin') router.replace('/');
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  // Simulasi: kondisi saat ini
  const simEnergy = rooms.reduce(
    (sum, r) => sum + energyKwh(effectiveWatt(r), hours),
    0
  );
  const simCost = costRp(simEnergy);

  // Baseline: semua 100%
  const baseEnergy = rooms.reduce(
    (sum, r) => sum + energyKwh(r.watt, hours),
    0
  );
  const baseCost = costRp(baseEnergy);
  const saved = Math.max(0, baseCost - simCost);

  return (
    <div>
      <PageHeader
        title="Kalkulator Listrik"
        description="Estimasi konsumsi, biaya, dan penghematan berdasarkan kondisi lampu saat ini."
        icon={CalcIcon}
      />

      {/* Duration control */}
      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <Label className="text-sm font-medium">Durasi Simulasi</Label>
            <p className="text-xs text-muted-foreground">
              Pilih durasi 1–24 jam untuk menghitung estimasi.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                max={24}
                value={hours}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isNaN(v)) setHours(Math.min(24, Math.max(1, v)));
                }}
                className="w-20 text-center tabular-nums"
              />
              <span className="text-sm text-muted-foreground">jam</span>
            </div>
            <Slider
              value={[hours]}
              min={1}
              max={24}
              step={1}
              onValueChange={(v) => setHours(v[0])}
              className="w-40 hidden sm:block"
            />
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <StatCard
          label="Estimasi Konsumsi"
          value={formatKwh(simEnergy)}
          icon={Zap}
          tone="accent"
          hint={`${hours} jam, kondisi saat ini`}
        />
        <StatCard
          label="Estimasi Biaya"
          value={formatRp(simCost)}
          icon={Wallet}
          tone="warning"
          hint={`Tarif Rp${TARIF_PER_KWH}/kWh`}
        />
        <StatCard
          label="Estimasi Penghematan"
          value={formatRp(saved)}
          icon={PiggyBank}
          tone="success"
          hint={`vs baseline 100%`}
        />
      </div>

      {/* Detail breakdown */}
      <Card className="p-5">
        <h3 className="mb-4 font-semibold">Rincian per Ruangan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Ruangan</th>
                <th className="py-2 px-4 font-medium text-center">Status</th>
                <th className="py-2 px-4 font-medium text-right">Daya</th>
                <th className="py-2 px-4 font-medium text-center">Kecerahan</th>
                <th className="py-2 px-4 font-medium text-right">Energi</th>
                <th className="py-2 pl-4 font-medium text-right">Biaya</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => {
                const watt = effectiveWatt(r);
                const energy = energyKwh(watt, hours);
                const cost = costRp(energy);
                return (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 font-medium">{r.name}</td>
                    <td className="py-2.5 px-4 text-center">
                      <Badge
                        variant={r.isOn ? 'default' : 'secondary'}
                        className={
                          r.isOn
                            ? 'border-transparent bg-primary text-primary-foreground'
                            : ''
                        }
                      >
                        {r.isOn ? 'ON' : 'OFF'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      {watt.toFixed(0)} W
                    </td>
                    <td className="py-2.5 px-4 text-center tabular-nums">
                      {r.brightness}%
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      {energy.toFixed(3)} kWh
                    </td>
                    <td className="py-2.5 pl-4 text-right tabular-nums">
                      {formatRp(cost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-semibold">
                <td className="py-3 pr-4" colSpan={4}>
                  Baseline (semua 100%, {hours} jam)
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  {baseEnergy.toFixed(2)} kWh
                </td>
                <td className="py-3 pl-4 text-right tabular-nums">
                  {formatRp(baseCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <Separator className="my-4" />
      <div className="flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <span>
          Hasil merupakan estimasi simulasi, bukan tagihan listrik sebenarnya.
          Tarif tetap Rp{TARIF_PER_KWH}/kWh. Perhitungan diperbarui saat
          kondisi lampu, kecerahan, atau durasi berubah.
        </span>
      </div>
    </div>
  );
}
