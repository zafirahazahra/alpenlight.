'use client';

import { useStore } from '@/lib/store/provider';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/layout/stat-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  CalendarDays,
  User,
  DoorOpen,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const statusMeta = {
  pending: { label: 'Menunggu', variant: 'secondary' as const, icon: Hourglass, color: 'text-warning' },
  approved: { label: 'Disetujui', variant: 'default' as const, icon: CheckCircle2, color: 'text-success' },
  rejected: { label: 'Ditolak', variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' },
};

export default function LemburPage() {
  const { state, setOvertimeStatus } = useStore();
  const router = useRouter();
  const { overtimeRequests, rooms, user } = state;

  useEffect(() => {
    if (user && user.role !== 'admin') router.replace('/');
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  const roomName = (id: string) =>
    rooms.find((r) => r.id === id)?.name ?? 'Ruangan tidak ditemukan';

  const pending = overtimeRequests.filter((r) => r.status === 'pending');
  const approved = overtimeRequests.filter((r) => r.status === 'approved');
  const rejected = overtimeRequests.filter((r) => r.status === 'rejected');

  const handleApprove = (id: string, name: string) => {
    setOvertimeStatus(id, 'approved');
    toast.success(`Permintaan lembur ${name} disetujui.`);
  };
  const handleReject = (id: string, name: string) => {
    setOvertimeStatus(id, 'rejected');
    toast.error(`Permintaan lembur ${name} ditolak.`);
  };

  const renderCard = (req: (typeof overtimeRequests)[number]) => {
    const meta = statusMeta[req.status];
    return (
      <Card key={req.id} className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold leading-tight">{req.employeeName}</h3>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DoorOpen className="h-3 w-3" /> {roomName(req.roomId)}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> {req.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {req.startTime} - {req.endTime}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={meta.variant}>{meta.label}</Badge>
        </div>

        <div className="mt-3 rounded-lg bg-muted/40 p-3 text-sm">
          <p className="text-xs font-medium text-muted-foreground">Alasan</p>
          <p className="mt-1">{req.reason}</p>
        </div>

        {req.status === 'pending' && (
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleApprove(req.id, req.employeeName)}
            >
              <CheckCircle2 className="h-4 w-4" />
              Setujui
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={() => handleReject(req.id, req.employeeName)}
            >
              <XCircle className="h-4 w-4" />
              Tolak
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div>
      <PageHeader
        title="Persetujuan Lembur"
        description="Tinjau dan setujui permintaan lembur dari karyawan."
        icon={Clock}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Menunggu" value={pending.length} icon={Hourglass} tone="warning" />
        <StatCard label="Disetujui" value={approved.length} icon={CheckCircle2} tone="success" />
        <StatCard label="Ditolak" value={rejected.length} icon={XCircle} tone="destructive" />
      </div>

      {overtimeRequests.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
          <Clock className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="font-medium">Belum ada permintaan lembur</p>
            <p className="text-sm text-muted-foreground">
              Permintaan dari karyawan akan muncul di sini.
            </p>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Menunggu ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Disetujui ({approved.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Ditolak ({rejected.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {pending.length ? pending.map(renderCard) : <EmptyState />}
            </div>
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {approved.length ? approved.map(renderCard) : <EmptyState />}
            </div>
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {rejected.length ? rejected.map(renderCard) : <EmptyState />}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="col-span-full flex items-center justify-center p-8 text-sm text-muted-foreground">
      Tidak ada data pada tab ini.
    </Card>
  );
}
