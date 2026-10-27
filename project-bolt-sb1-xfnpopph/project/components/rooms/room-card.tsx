'use client';

import type { Room } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  Power,
  Users,
  Sun,
  Moon,
  Cloud,
  Lock,
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
  /** Apakah kontrol (slider + switch) dapat diubah. */
  controlEnabled?: boolean;
  /** Tampilkan info mode (auto/manual). */
  showMode?: boolean;
  /** Tampilkan kontrol presence/light condition (teknisi). */
  showSensorControls?: boolean;
  onToggle?: (id: string, isOn: boolean) => void;
  onBrightness?: (id: string, value: number) => void;
  onPresence?: (id: string, value: Room['presence']) => void;
  onLightCondition?: (id: string, value: Room['lightCondition']) => void;
  onMode?: (id: string, mode: Room['mode']) => void;
  lockedMessage?: string;
  className?: string;
}

const lightConditionMeta: Record<
  Room['lightCondition'],
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  terang: { label: 'Terang', icon: Sun, color: 'text-warning' },
  redup: { label: 'Redup', icon: Cloud, color: 'text-accent' },
  gelap: { label: 'Gelap', icon: Moon, color: 'text-muted-foreground' },
};

export function RoomCard({
  room,
  controlEnabled = true,
  showMode = false,
  showSensorControls = false,
  onToggle,
  onBrightness,
  onPresence,
  onLightCondition,
  onMode,
  lockedMessage,
  className,
}: RoomCardProps) {
  const cond = lightConditionMeta[room.lightCondition];
  const CondIcon = cond.icon;

  return (
    <Card
      className={cn(
        'group flex flex-col gap-4 p-5 transition-shadow hover:shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all',
              room.isOn
                ? 'bg-primary/20 text-primary glow-lamp'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Lightbulb
              className={cn('h-5 w-5', room.isOn && 'fill-primary/40')}
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold leading-tight">
              {room.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {room.watt} Watt
            </p>
          </div>
        </div>
        <Badge
          variant={room.isOn ? 'default' : 'secondary'}
          className={
            room.isOn
              ? 'border-transparent bg-primary text-primary-foreground'
              : ''
          }
        >
          {room.isOn ? 'ON' : 'OFF'}
        </Badge>
      </div>

      {/* Sensor info */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border bg-card px-2 py-2">
          <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <Users className="h-3 w-3" /> Orang
          </div>
          <p className="mt-0.5 text-xs font-semibold">
            {room.presence === 'terdeteksi' ? 'Ada' : 'Kosong'}
          </p>
        </div>
        <div className="rounded-lg border bg-card px-2 py-2">
          <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <CondIcon className={cn('h-3 w-3', cond.color)} /> Cahaya
          </div>
          <p className="mt-0.5 text-xs font-semibold">{cond.label}</p>
        </div>
        <div className="rounded-lg border bg-card px-2 py-2">
          <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <Sun className="h-3 w-3" /> Kecerahan
          </div>
          <p className="mt-0.5 text-xs font-semibold tabular-nums">
            {room.brightness}%
          </p>
        </div>
      </div>

      {/* Mode toggle (admin) */}
      {showMode && onMode && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
          <span className="text-xs font-medium">Mode Lampu</span>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={room.mode === 'auto' ? 'default' : 'outline'}
              className="h-7 px-2.5 text-xs"
              disabled={!controlEnabled}
              onClick={() => onMode(room.id, 'auto')}
            >
              Otomatis
            </Button>
            <Button
              size="sm"
              variant={room.mode === 'manual' ? 'default' : 'outline'}
              className="h-7 px-2.5 text-xs"
              disabled={!controlEnabled}
              onClick={() => onMode(room.id, 'manual')}
            >
              Manual
            </Button>
          </div>
        </div>
      )}

      {/* Sensor controls (teknisi) */}
      {showSensorControls && onPresence && onLightCondition && (
        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Sensor Kehadiran</span>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant={room.presence === 'terdeteksi' ? 'default' : 'outline'}
                className="h-7 px-2.5 text-xs"
                onClick={() => onPresence(room.id, 'terdeteksi')}
              >
                Ada Orang
              </Button>
              <Button
                size="sm"
                variant={room.presence === 'kosong' ? 'default' : 'outline'}
                className="h-7 px-2.5 text-xs"
                onClick={() => onPresence(room.id, 'kosong')}
              >
                Kosong
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Kondisi Cahaya</span>
            <div className="flex gap-1.5">
              {(['terang', 'redup', 'gelap'] as const).map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={room.lightCondition === c ? 'default' : 'outline'}
                  className="h-7 px-2.5 text-xs capitalize"
                  onClick={() => onLightCondition(room.id, c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Brightness slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Kecerahan</span>
          <span className="font-semibold tabular-nums">
            {room.brightness}%
          </span>
        </div>
        <Slider
          value={[room.brightness]}
          min={0}
          max={100}
          step={5}
          disabled={!controlEnabled}
          onValueChange={(v) => onBrightness?.(room.id, v[0])}
        />
      </div>

      {/* Power toggle */}
      {controlEnabled ? (
        <Button
          variant={room.isOn ? 'destructive' : 'default'}
          className="w-full"
          onClick={() => onToggle?.(room.id, !room.isOn)}
        >
          <Power className="h-4 w-4" />
          {room.isOn ? 'Matikan Lampu' : 'Nyalakan Lampu'}
        </Button>
      ) : lockedMessage ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 px-3 py-2.5 text-center text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span>{lockedMessage}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 px-3 py-2.5 text-center text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span>Kontrol dinonaktifkan</span>
        </div>
      )}
    </Card>
  );
}
