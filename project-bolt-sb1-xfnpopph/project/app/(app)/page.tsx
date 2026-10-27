'use client';

import { useStore } from '@/lib/store/provider';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/layout/stat-card';
import { RoomCard } from '@/components/rooms/room-card';
import { ROLE_LABELS } from '@/lib/constants';
import {
  totalCost,
  totalEnergy,
  savings,
  baselineCost,
  formatRp,
  formatKwh,
} from '@/lib/energy';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Lightbulb,
  LightbulbOff,
  DoorOpen,
  Zap,
  Wallet,
  PiggyBank,
  Activity,
  Cpu,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  const { state } = useStore();
  const { rooms, user, settings, overtimeRequests } = state;
  if (!user) return null;

  const onCount = rooms.filter((r) => r.isOn).length;
  const offCount = rooms.length - onCount;
  const hours = 8; // default 8 jam kerja
  const energy = totalEnergy(rooms, hours);
  const cost = totalCost(rooms, hours);
  const saved = savings(rooms, hours);
  const pendingOvertime = overtimeRequests.filter(
    (r) => r.status === 'pending'
  ).length;

  return (
    <div>
      <PageHeader
        title={`Dashboard ${ROLE_LABELS[user.role]}`}
        description={
          user.role === 'admin'
            ? 'Pantau konsumsi energi dan kendalikan sistem pencahayaan kantor.'
            : user.role === 'teknisi'
            ? 'Pantau kondisi pencahayaan dan sensor seluruh ruangan.'
            : 'Pantau status lampu ruangan kantor secara realtime.'
        }
        icon={LayoutDashboard}
      />

      {/* Stat cards per role */}
      {user.role === 'admin' && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Total Ruangan"
            value={rooms.length}
            icon={DoorOpen}
            tone="accent"
          />
          <StatCard
            label="Lampu ON"
            value={onCount}
            icon={Lightbulb}
            tone="primary"
            hint={`${Math.round((onCount / rooms.length) * 100)}% menyala`}
          />
          <StatCard
            label="Lampu OFF"
            value={offCount}
            icon={LightbulbOff}
            tone="default"
          />
          <StatCard
            label="Estimasi Energi"
            value={formatKwh(energy)}
            icon={Zap}
            tone="accent"
            hint={`/${hours} jam`}
          />
          <StatCard
            label="Estimasi Biaya"
            value={formatRp(cost)}
            icon={Wallet}
            tone="warning"
            hint={`/${hours} jam`}
          />
          <StatCard
            label="Estimasi Hemat"
            value={formatRp(saved)}
            icon={PiggyBank}
            tone="success"
            hint={`vs baseline 100%`}
          />
        </div>
      )}

      {user.role === 'teknisi' && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Ruangan" value={rooms.length} icon={DoorOpen} tone="accent" />
          <StatCard label="Lampu ON" value={onCount} icon={Lightbulb} tone="primary" />
          <StatCard label="Lampu OFF" value={offCount} icon={LightbulbOff} tone="default" />
          <StatCard
            label="Status Sensor"
            value="Normal"
            icon={Cpu}
            tone="success"
            hint="6 sensor aktif"
          />
        </div>
      )}

      {user.role === 'karyawan' && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Ruangan" value={rooms.length} icon={DoorOpen} tone="accent" />
          <StatCard label="Lampu ON" value={onCount} icon={Lightbulb} tone="primary" />
          <StatCard label="Lampu OFF" value={offCount} icon={LightbulbOff} tone="default" />
          <StatCard
            label="Status Operasional"
            value="Kantor Buka"
            icon={CheckCircle2}
            tone="success"
            hint="Jam kerja aktif"
          />
        </div>
      )}

      {/* Override banner */}
      {settings.override !== 'normal' && (
        <Card className="mt-6 flex items-center gap-3 border-warning/40 bg-warning/10 p-4">
          <Activity className="h-5 w-5 text-warning" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning">
              Quick Override Aktif
            </p>
            <p className="text-xs text-muted-foreground">
              {settings.override === 'all_on'
                ? 'Seluruh lampu dinyalakan oleh Teknisi.'
                : 'Seluruh lampu dimatikan oleh Teknisi.'}
            </p>
          </div>
          <Badge variant="outline" className="border-warning/50 text-warning">
            {settings.override === 'all_on' ? 'ALL ON' : 'ALL OFF'}
          </Badge>
        </Card>
      )}

      {/* Admin: pending overtime hint */}
      {user.role === 'admin' && pendingOvertime > 0 && (
        <Card className="mt-6 flex items-center gap-3 border-accent/40 bg-accent/10 p-4">
          <Clock className="h-5 w-5 text-accent" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-accent">
              {pendingOvertime} permintaan lembur menunggu persetujuan
            </p>
            <p className="text-xs text-muted-foreground">
              Tinjau permintaan lembur karyawan pada halaman Persetujuan Lembur.
            </p>
          </div>
        </Card>
      )}

      {/* Room summary */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Status Ruangan</h2>
          <Badge variant="secondary">{rooms.length} ruangan</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              controlEnabled={false}
              lockedMessage="Dasbor hanya untuk pemantauan."
            />
          ))}
        </div>
      </div>
    </div>
  );
}
