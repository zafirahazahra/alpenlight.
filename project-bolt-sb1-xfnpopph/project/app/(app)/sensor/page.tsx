'use client';

import { useStore } from '@/lib/store/provider';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/layout/stat-card';
import { RoomCard } from '@/components/rooms/room-card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  DoorOpen,
  Lightbulb,
  LightbulbOff,
  Cpu,
  Activity,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SensorPage() {
  const { state, setRoomPresence, setRoomLightCondition } = useStore();
  const router = useRouter();
  const { rooms, user, settings } = state;

  useEffect(() => {
    if (user && user.role !== 'teknisi') {
      router.replace('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'teknisi') return null;

  const onCount = rooms.filter((r) => r.isOn).length;
  const offCount = rooms.length - onCount;
  const sensorsActive = rooms.length;

  return (
    <div>
      <PageHeader
        title="Monitoring Sensor"
        description="Pantau kondisi pencahayaan, kehadiran, dan ubah kondisi sensor virtual untuk demonstrasi."
        icon={Zap}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <StatCard label="Total Ruangan" value={rooms.length} icon={DoorOpen} tone="accent" />
        <StatCard label="Lampu ON" value={onCount} icon={Lightbulb} tone="primary" />
        <StatCard label="Lampu OFF" value={offCount} icon={LightbulbOff} tone="default" />
        <StatCard
          label="Sensor Aktif"
          value={sensorsActive}
          icon={Cpu}
          tone="success"
          hint="Sensor gerak + cahaya"
        />
      </div>

      {settings.override !== 'normal' && (
        <Card className="mb-6 flex items-center gap-3 border-warning/40 bg-warning/10 p-4">
          <Activity className="h-5 w-5 text-warning" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning">
              Mode Override Aktif
            </p>
            <p className="text-xs text-muted-foreground">
              Kondisi sensor dapat diubah namun lampu mengikuti perintah override.
              Gunakan "Kembali ke Mode Normal" pada halaman Quick Override.
            </p>
          </div>
          <Badge variant="outline" className="border-warning/50 text-warning">
            {settings.override === 'all_on' ? 'ALL ON' : 'ALL OFF'}
          </Badge>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            controlEnabled={false}
            showSensorControls
            onPresence={setRoomPresence}
            onLightCondition={setRoomLightCondition}
            lockedMessage="Teknisi hanya mengubah kondisi sensor di halaman ini."
          />
        ))}
      </div>
    </div>
  );
}
