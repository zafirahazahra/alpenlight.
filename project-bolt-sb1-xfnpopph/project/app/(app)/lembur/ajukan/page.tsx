'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/provider';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Clock,
  Send,
  CalendarDays,
  DoorOpen,
  User,
  FileText,
  CheckCircle2,
  Hourglass,
  XCircle,
} from 'lucide-react';
import { useEffect } from 'react';

export default function AjukanLemburPage() {
  const { state, addOvertimeRequest } = useStore();
  const router = useRouter();
  const { rooms, user, overtimeRequests } = state;

  useEffect(() => {
    if (user && user.role !== 'karyawan') router.replace('/');
  }, [user, router]);

  const today = new Date().toISOString().split('T')[0];
  const [employeeName, setEmployeeName] = useState('');
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('20:00');
  const [reason, setReason] = useState('');

  if (!user || user.role !== 'karyawan') return null;

  const myRequests = overtimeRequests.slice(0, 5);
  const roomName = (id: string) =>
    rooms.find((r) => r.id === id)?.name ?? '-';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim()) {
      toast.error('Nama karyawan wajib diisi.');
      return;
    }
    if (!reason.trim()) {
      toast.error('Alasan lembur wajib diisi.');
      return;
    }
    if (endTime <= startTime) {
      toast.error('Jam selesai harus setelah jam mulai.');
      return;
    }
    addOvertimeRequest({
      employeeName: employeeName.trim(),
      roomId,
      date,
      startTime,
      endTime,
      reason: reason.trim(),
    });
    toast.success('Permintaan lembur berhasil diajukan.', {
      description: 'Admin akan meninjau permintaan Anda.',
    });
    setReason('');
    setEmployeeName('');
  };

  const statusBadge = (status: string) => {
    if (status === 'approved')
      return (
        <Badge className="border-transparent bg-success text-success-foreground">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Disetujui
        </Badge>
      );
    if (status === 'rejected')
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" /> Ditolak
        </Badge>
      );
    return (
      <Badge variant="secondary">
        <Hourglass className="mr-1 h-3 w-3" /> Menunggu
      </Badge>
    );
  };

  return (
    <div>
      <PageHeader
        title="Ajukan Lembur"
        description="Isi formulir untuk mengajukan permintaan lembur ke Admin."
        icon={Clock}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Form */}
        <Card className="p-6 lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Nama Karyawan
              </Label>
              <Input
                id="name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room" className="flex items-center gap-1.5">
                <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                Pilih Ruangan
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {rooms.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoomId(r.id)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                      roomId === r.id
                        ? 'border-primary font-medium'
                        : 'hover:bg-muted'
                    }`}
                    style={
                      roomId === r.id
                        ? { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }
                        : undefined
                    }
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  Tanggal Lembur
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Jam Mulai</Label>
                <Input
                  id="start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">Jam Selesai</Label>
                <Input
                  id="end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Alasan Lembur
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan alasan pengajuan lembur..."
                rows={4}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              <Send className="h-4 w-4" />
              Ajukan Lembur
            </Button>
          </form>
        </Card>

        {/* My recent requests */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Permintaan Terbaru</h3>
          {myRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-muted-foreground">
              <Clock className="h-8 w-8 text-muted-foreground/40" />
              <p>Belum ada permintaan lembur.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border bg-card p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{roomName(req.roomId)}</span>
                    {statusBadge(req.status)}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" /> {req.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {req.startTime}-{req.endTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
