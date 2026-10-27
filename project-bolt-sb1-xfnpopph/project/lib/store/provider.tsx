'use client';

import * as React from 'react';
import type {
  AppState,
  AuthUser,
  LightMode,
  OvertimeRequest,
  OverrideState,
  PresenceStatus,
  Room,
  SystemSettings,
} from '../types';
import { DEMO_ACCOUNTS, INITIAL_ROOMS } from '../constants';

const STORAGE_KEY = 'alpenlight:state:v1';

const INITIAL_SETTINGS: SystemSettings = {
  employeeControlAllowed: true,
  override: 'normal',
};

const INITIAL_STATE: AppState = {
  rooms: INITIAL_ROOMS,
  overtimeRequests: [],
  settings: INITIAL_SETTINGS,
  user: null,
};

function loadState(): AppState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      rooms: parsed.rooms ?? INITIAL_ROOMS,
      overtimeRequests: parsed.overtimeRequests ?? [],
      settings: { ...INITIAL_SETTINGS, ...parsed.settings },
      user: parsed.user ?? null,
    };
  } catch {
    return INITIAL_STATE;
  }
}

interface StoreContextValue {
  state: AppState;
  // auth
  login: (username: string, password: string) => AuthUser | null;
  loginAsEmployee: () => void;
  logout: () => void;
  // rooms
  setRoomOn: (roomId: string, isOn: boolean) => void;
  setRoomBrightness: (roomId: string, brightness: number) => void;
  setRoomMode: (roomId: string, mode: LightMode) => void;
  setRoomPresence: (roomId: string, presence: PresenceStatus) => void;
  setRoomLightCondition: (
    roomId: string,
    condition: Room['lightCondition']
  ) => void;
  applyOverride: (override: OverrideState) => void;
  resetOverride: () => void;
  // settings
  setEmployeeControl: (allowed: boolean) => void;
  // overtime
  addOvertimeRequest: (
    req: Omit<OvertimeRequest, 'id' | 'status' | 'createdAt'>
  ) => void;
  setOvertimeStatus: (id: string, status: 'approved' | 'rejected') => void;
  resetAll: () => void;
}

const StoreContext = React.createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(INITIAL_STATE);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const update = React.useCallback(
    (fn: (prev: AppState) => AppState) => setState((prev) => fn(prev)),
    []
  );

  const login = React.useCallback(
    (username: string, password: string): AuthUser | null => {
      const acc = DEMO_ACCOUNTS.find(
        (a) => a.username === username && a.password === password
      );
      if (!acc) return null;
      const user: AuthUser = {
        role: acc.role,
        username: acc.username,
        name: acc.name,
      };
      update((prev) => ({ ...prev, user }));
      return user;
    },
    [update]
  );

  const loginAsEmployee = React.useCallback(() => {
    const user: AuthUser = {
      role: 'karyawan',
      username: 'karyawan',
      name: 'Karyawan Tamu',
    };
    update((prev) => ({ ...prev, user }));
  }, [update]);

  const logout = React.useCallback(() => {
    update((prev) => ({ ...prev, user: null }));
  }, [update]);

  const mutateRoom = React.useCallback(
    (roomId: string, mut: (r: Room) => Room) => {
      update((prev) => ({
        ...prev,
        rooms: prev.rooms.map((r) => (r.id === roomId ? mut(r) : r)),
      }));
    },
    [update]
  );

  const setRoomOn = React.useCallback(
    (roomId: string, isOn: boolean) => {
      mutateRoom(roomId, (r) => ({
        ...r,
        isOn,
        brightness: isOn && r.brightness === 0 ? 100 : r.brightness,
      }));
    },
    [mutateRoom]
  );

  const setRoomBrightness = React.useCallback(
    (roomId: string, brightness: number) => {
      mutateRoom(roomId, (r) => ({
        ...r,
        brightness,
        isOn: brightness > 0 ? true : false,
      }));
    },
    [mutateRoom]
  );

  const setRoomMode = React.useCallback(
    (roomId: string, mode: LightMode) => {
      mutateRoom(roomId, (r) => ({ ...r, mode }));
    },
    [mutateRoom]
  );

  const setRoomPresence = React.useCallback(
    (roomId: string, presence: PresenceStatus) => {
      mutateRoom(roomId, (r) => ({ ...r, presence }));
    },
    [mutateRoom]
  );

  const setRoomLightCondition = React.useCallback(
    (roomId: string, condition: Room['lightCondition']) => {
      mutateRoom(roomId, (r) => ({ ...r, lightCondition: condition }));
    },
    [mutateRoom]
  );

  const applyOverride = React.useCallback(
    (override: OverrideState) => {
      update((prev) => ({
        ...prev,
        settings: { ...prev.settings, override },
        rooms:
          override === 'normal'
            ? prev.rooms
            : prev.rooms.map((r) => ({
                ...r,
                isOn: override === 'all_on',
                brightness:
                  override === 'all_on' ? Math.max(r.brightness, 100) : 0,
              })),
      }));
    },
    [update]
  );

  const resetOverride = React.useCallback(
    () => applyOverride('normal'),
    [applyOverride]
  );

  const setEmployeeControl = React.useCallback(
    (allowed: boolean) => {
      update((prev) => ({
        ...prev,
        settings: { ...prev.settings, employeeControlAllowed: allowed },
      }));
    },
    [update]
  );

  const addOvertimeRequest = React.useCallback(
    (req: Omit<OvertimeRequest, 'id' | 'status' | 'createdAt'>) => {
      const newReq: OvertimeRequest = {
        ...req,
        id: `ot-${Date.now()}`,
        status: 'pending',
        createdAt: Date.now(),
      };
      update((prev) => ({
        ...prev,
        overtimeRequests: [newReq, ...prev.overtimeRequests],
      }));
    },
    [update]
  );

  const setOvertimeStatus = React.useCallback(
    (id: string, status: 'approved' | 'rejected') => {
      update((prev) => ({
        ...prev,
        overtimeRequests: prev.overtimeRequests.map((r) =>
          r.id === id ? { ...r, status } : r
        ),
      }));
    },
    [update]
  );

  const resetAll = React.useCallback(() => {
    setState({
      rooms: INITIAL_ROOMS,
      overtimeRequests: [],
      settings: INITIAL_SETTINGS,
      user: null,
    });
  }, []);

  const value: StoreContextValue = {
    state,
    login,
    loginAsEmployee,
    logout,
    setRoomOn,
    setRoomBrightness,
    setRoomMode,
    setRoomPresence,
    setRoomLightCondition,
    applyOverride,
    resetOverride,
    setEmployeeControl,
    addOvertimeRequest,
    setOvertimeStatus,
    resetAll,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function useHydrated() {
  const [, setTick] = React.useState(0);
  React.useEffect(() => setTick(1), []);
}
