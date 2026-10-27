import type { Room, Role } from './types';

export const TARIF_PER_KWH = 1444;

export interface DemoAccount {
  username: string;
  password: string;
  role: Role;
  name: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
  { username: 'teknisi', password: 'teknisi123', role: 'teknisi', name: 'Teknisi Lapangan' },
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'r1', name: 'Ruang Rapat Utama', watt: 60, isOn: true, brightness: 80, mode: 'auto', presence: 'terdeteksi', lightCondition: 'redup' },
  { id: 'r2', name: 'Ruang Kerja Lantai 1', watt: 80, isOn: true, brightness: 100, mode: 'auto', presence: 'terdeteksi', lightCondition: 'terang' },
  { id: 'r3', name: 'Ruang Kerja Lantai 2', watt: 80, isOn: false, brightness: 0, mode: 'auto', presence: 'kosong', lightCondition: 'terang' },
  { id: 'r4', name: 'Lobi Depan', watt: 45, isOn: true, brightness: 50, mode: 'manual', presence: 'kosong', lightCondition: 'redup' },
  { id: 'r5', name: 'Pantry', watt: 30, isOn: false, brightness: 0, mode: 'auto', presence: 'kosong', lightCondition: 'gelap' },
  { id: 'r6', name: 'Ruang Server', watt: 50, isOn: true, brightness: 60, mode: 'manual', presence: 'kosong', lightCondition: 'gelap' },
];

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  teknisi: 'Teknisi',
  karyawan: 'Karyawan',
};
