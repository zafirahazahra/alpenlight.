export type Role = 'admin' | 'teknisi' | 'karyawan';

export type LightMode = 'auto' | 'manual';

export type PresenceStatus = 'terdeteksi' | 'kosong';

export type LightCondition = 'terang' | 'redup' | 'gelap';

export type OverrideState = 'normal' | 'all_on' | 'all_off';

export interface Room {
  id: string;
  name: string;
  /** Daya lampu dalam Watt (asumsi satu lampu per ruangan untuk simulasi). */
  watt: number;
  isOn: boolean;
  /** Kecerahan 0-100 (%) */
  brightness: number;
  mode: LightMode;
  presence: PresenceStatus;
  lightCondition: LightCondition;
}

export interface OvertimeRequest {
  id: string;
  employeeName: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface SystemSettings {
  /** Apakah Karyawan diperbolehkan mengontrol lampu secara manual. */
  employeeControlAllowed: boolean;
  /** Status override oleh Teknisi. */
  override: OverrideState;
}

export interface AuthUser {
  role: Role;
  username: string;
  name: string;
}

export interface AppState {
  rooms: Room[];
  overtimeRequests: OvertimeRequest[];
  settings: SystemSettings;
  user: AuthUser | null;
}
