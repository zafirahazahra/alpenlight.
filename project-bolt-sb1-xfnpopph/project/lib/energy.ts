import type { Room } from './types';
import { TARIF_PER_KWH } from './constants';

/**
 * Daya efektif (Watt) berdasarkan kecerahan (asumsi linear).
 * Lampu OFF = 0 Watt.
 */
export function effectiveWatt(room: Room): number {
  if (!room.isOn || room.brightness <= 0) return 0;
  return (room.watt * room.brightness) / 100;
}

/**
 * Energi (kWh) = Daya (Watt) x Durasi (jam) / 1000.
 */
export function energyKwh(watt: number, hours: number): number {
  return (watt * hours) / 1000;
}

export function costRp(kwh: number): number {
  return kwh * TARIF_PER_KWH;
}

export function formatRp(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatKwh(value: number): string {
  return `${value.toFixed(2)} kWh`;
}

/**
 * Estimasi total konsumsi untuk seluruh ruangan pada kondisi saat ini,
 * untuk durasi tertentu (jam).
 */
export function totalEnergy(rooms: Room[], hours: number): number {
  return rooms.reduce(
    (sum, r) => sum + energyKwh(effectiveWatt(r), hours),
    0
  );
}

/**
 * Estimasi biaya listrik untuk seluruh ruangan pada kondisi saat ini.
 */
export function totalCost(rooms: Room[], hours: number): number {
  return costRp(totalEnergy(rooms, hours));
}

/**
 * Baseline: semua lampu menyala 100% selama durasi yang sama.
 */
export function baselineCost(rooms: Room[], hours: number): number {
  const baselineEnergy = rooms.reduce(
    (sum, r) => sum + energyKwh(r.watt, hours),
    0
  );
  return costRp(baselineEnergy);
}

/**
 * Penghematan = Biaya Baseline - Biaya Simulasi.
 */
export function savings(rooms: Room[], hours: number): number {
  return Math.max(0, baselineCost(rooms, hours) - totalCost(rooms, hours));
}
