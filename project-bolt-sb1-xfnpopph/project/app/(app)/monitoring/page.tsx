'use client';

import { useStore } from '@/lib/store/provider';
import { PageHeader } from '@/components/layout/page-header';
import { RoomCard } from '@/components/rooms/room-card';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Lightbulb,
  SlidersHorizontal,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MonitoringPage() {
  const {
    state,
    setRoomOn,
    setRoomBrightness,
    setRoomMode,
    setEmployeeControl,
  } = useStore();
  const router = useRouter();
  const { rooms, user, settings } = state;

  useEffect(() => {
    if (user && user.role === 'teknisi') {
      router.replace('/sensor');
    }
  }, [user, router]);

  if (!user) return null;
  if (user.role === 'teknisi') return null;

  const isAdmin = user.role === 'admin';
  const employeeCanControl =
    user.role === 'admin' ? true : settings.employeeControlAllowed;

  // Karyawan hanya boleh kontrol jika ruangan mode manual & employeeCanControl
  const canControlRoom = (mode: 'auto' | 'manual') => {
    if (isAdmin) return true;
    return employeeCanControl && mode === 'manual';
  };

  const handleToggle = (id: string, isOn: boolean) => {
    setRoomOn(id, isOn);
    const room = rooms.find((r) => r.id === id);
    toast.success(
      `${room?.name}: lampu ${isOn ? 'dinyalakan' : 'dimatikan'}`
    );
  };

  const handleBrightness = (id: string, value: number) => {
    setRoomBrightness(id, value);
  };

  const handleMode = (id: string, mode: 'auto' | 'manual') => {
    setRoomMode(id, mode);
    const room = rooms.find((r) => r.id === id);
    toast.success(`${room?.name}: mode ${mode === 'auto' ? 'Otomatis' : 'Manual'}`);
  };

  return (
    <div>
      <PageHeader
        title="Monitoring & Kontrol"
        description={
          isAdmin
            ? 'Kendalikan lampu, kecerahan, dan mode setiap ruangan.'
            : 'Pantau dan kendalikan lampu ruangan yang diizinkan.'
        }
        icon={Lightbulb}
        actions={
          isAdmin && (
            <Card className="flex items-center gap-3 px-4 py-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <Label htmlFor="emp-ctrl" className="text-xs text-muted-foreground">
                  Kontrol Karyawan
                </Label>
                <span className="text-xs font-medium">
                  {settings.employeeControlAllowed ? 'Diizinkan' : 'Dinonaktifkan'}
                </span>
              </div>
              <Switch
                id="emp-ctrl"
                checked={settings.employeeControlAllowed}
                onCheckedChange={(v) => {
                  setEmployeeControl(v);
                  toast.success(
                    v
                      ? 'Kontrol manual Karyawan diizinkan.'
                      : 'Kontrol manual Karyawan dinonaktifkan.'
                  );
                }}
              />
            </Card>
          )
        }
      />

      {/* Karyawan info banner */}
      {!isAdmin && (
        <Card className="mb-6 flex items-start gap-3 p-4">
          <SlidersHorizontal className="mt-0.5 h-5 w-5 text-accent" />
          <div className="flex-1 text-sm">
            <p className="font-medium">
              Kontrol lampu{' '}
              {employeeCanControl
                ? 'diizinkan oleh Admin.'
                : 'sedang dinonaktifkan oleh Admin.'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {employeeCanControl
                ? 'Anda dapat mengontrol ruangan yang berada pada mode Manual.'
                : 'Hubungi Admin untuk mengaktifkan kembali kontrol manual.'}
            </p>
          </div>
          <Badge variant={employeeCanControl ? 'default' : 'secondary'}>
            {employeeCanControl ? 'AKTIF' : 'NONAKTIF'}
          </Badge>
        </Card>
      )}

      {settings.override !== 'normal' && (
        <Card className="mb-6 flex items-center gap-3 border-warning/40 bg-warning/10 p-4">
          <ShieldAlert className="h-5 w-5 text-warning" />
          <p className="text-sm font-medium text-warning">
            Kontrol dinonaktifkan sementara karena Quick Override Teknisi aktif.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => {
          const roomControl = canControlRoom(room.mode);
          const locked =
            !roomControl ||
            (user.role === 'karyawan' && room.mode === 'auto');
          return (
            <RoomCard
              key={room.id}
              room={room}
              controlEnabled={!locked && settings.override === 'normal'}
              showMode={isAdmin}
              onToggle={handleToggle}
              onBrightness={handleBrightness}
              onMode={handleMode}
              lockedMessage={
                user.role === 'karyawan'
                  ? room.mode === 'auto'
                    ? 'Ruangan mode Otomatis. Kontrol tidak tersedia.'
                    : 'Kontrol lampu sedang dinonaktifkan oleh Admin.'
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
