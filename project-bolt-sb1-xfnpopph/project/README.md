# AlpenLight — Sistem Smart Lighting Kantor Alpen

Website simulasi **Smart Lighting** untuk membantu mengurangi pemborosan listrik akibat lampu kantor yang tetap menyala meskipun ruangan sedang kosong.

AlpenLight **bukan sistem IoT sungguhan**. Seluruh lampu dan sensor disimulasikan melalui website. Cocok untuk proyek kuliah (tingkat kesulitan ~4/10).

---

## Teknologi

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (ikon)
- **localStorage** (penyimpanan data lokal di browser)
- **shadcn/ui** (komponen UI)

Tidak menggunakan Supabase, database eksternal, atau backend kompleks.

---

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Untuk build produksi:

```bash
npm run build
npm start
```

---

## Akun Demo

| Role     | Username  | Password      |
| -------- | --------- | ------------- |
| Admin    | `admin`   | `admin123`    |
| Teknisi  | `teknisi` | `teknisi123`  |

Karyawan **tidak perlu login** — cukup klik **"Masuk sebagai Karyawan"** di halaman login.

> Login hanya untuk simulasi lokal, bukan autentikasi aman untuk produksi.

---

## Hak Akses

### Admin

- **Dashboard**: total ruangan, lampu ON/OFF, estimasi energi (kWh), biaya listrik (Rp), penghematan (Rp).
- **Monitoring & Kontrol**: menyalakan/mematikan lampu, slider kecerahan 0–100%, mode Otomatis/Manual, mengizinkan/menonaktifkan kontrol Karyawan.
- **Kalkulator Listrik**: estimasi konsumsi, biaya, dan penghematan dengan tarif tetap Rp1.444/kWh, durasi 1–24 jam.
- **Persetujuan Lembur**: menyetujui/menolak permintaan lembur karyawan.

### Teknisi

- **Dashboard**: total ruangan, lampu ON/OFF, status sensor.
- **Monitoring Sensor**: melihat & mengubah kondisi sensor virtual (kehadiran, cahaya) untuk demonstrasi.
- **Quick Override**: Nyalakan Semua / Matikan Semua / Kembali ke Mode Normal.
- **Tidak dapat melihat biaya listrik atau penghematan.**

### Karyawan (tanpa login)

- **Dashboard**: total ruangan, lampu ON/OFF, status operasional kantor.
- **Monitoring & Kontrol**: melihat status lampu, sensor gerak, kondisi cahaya, kecerahan. Kontrol lampu hanya tersedia jika Admin mengizinkan dan ruangan berada pada mode Manual.
- **Ajukan Lembur**: formulir pengajuan lembur (nama, ruangan, tanggal, jam, alasan).

---

## Ruangan Tersimulasi

6 ruangan bawaan: Ruang Rapat Utama, Ruang Kerja Lantai 1 & 2, Lobi Depan, Pantry, dan Ruang Server — masing-masing dengan daya, kecerahan, mode, dan status sensor sendiri.

---

## Rumus Kalkulator Listrik

```
Energi (kWh) = Daya (Watt) × Durasi (Jam) ÷ 1000
Biaya (Rp)   = Energi (kWh) × 1.444
Penghematan  = Biaya Baseline − Biaya Simulasi
```

- **Baseline**: semua lampu menyala 100% selama durasi yang sama.
- **Simulasi**: berdasarkan kondisi lampu ON/OFF dan kecerahan saat ini.
- Asumsi linear: kecerahan 50% = 50% daya.

> Hasil merupakan estimasi simulasi, bukan tagihan listrik sebenarnya.

---

## Penyimpanan Data

Seluruh data (status lampu, pengaturan, permintaan lembur, sesi login) disimpan di **localStorage** browser. Klik tombol **Reset** (jika tersedia) atau hapus data situs untuk mengembalikan kondisi awal.

---

## Struktur Singkat

```
app/
  login/              Halaman login
  (app)/              Halaman terproteksi (butuh login)
    page.tsx          Dashboard (per role)
    monitoring/       Monitoring & Kontrol (admin, karyawan)
    sensor/           Monitoring Sensor (teknisi)
    override/         Quick Override (teknisi)
    kalkulator/       Kalkulator Listrik (admin)
    lembur/           Persetujuan Lembur (admin)
    lembur/ajukan/    Ajukan Lembur (karyawan)
lib/
  types.ts            Tipe data
  constants.ts        Akun demo, ruangan awal, tarif
  energy.ts           Perhitungan energi & biaya
  store/              State global (React Context + localStorage)
components/
  layout/             Sidebar, header, kartu statistik
  rooms/              Kartu ruangan
  ui/                 Komponen shadcn/ui
```
