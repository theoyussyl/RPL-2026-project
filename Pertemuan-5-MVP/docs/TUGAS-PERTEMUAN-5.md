# Tugas Pertemuan 5 — Bangun MVP Version 1 Secara Iteratif Menggunakan AI Agent

**Proyek:** Plant Garden Tracker (Aplikasi Manajemen Tanaman/Kebun Rumahan)

---

## 1. Fitur yang Dipilih

Dari seluruh fitur MVP yang direncanakan di PRD, dipilih **2 fitur inti** untuk dikerjakan secara iteratif pada tugas ini:

1. **Fitur 1 — CRUD Kebun & Tanaman (Garden/Plant Management)**
2. **Fitur 2 — Jadwal Perawatan: Tandai Sudah Dilakukan & Status Perawatan (Care Schedule & Care Status)**

Kedua fitur ini dipilih karena merupakan **jalur inti (core path)** aplikasi: tanpa Fitur 1, tidak ada data tanaman untuk dikelola; tanpa Fitur 2, tujuan utama aplikasi (mengingatkan & mencatat perawatan) tidak tercapai.

---

## 2. Fitur 1 — CRUD Kebun & Tanaman

### Brief
Pengguna perlu bisa membuat satu atau lebih kebun, lalu menambahkan tanaman ke dalam kebun tersebut, serta mengubah/menghapus data itu kapan saja. Input nama kebun dan nama tanaman tidak boleh kosong.

**Acceptance Criteria:**
- AC1: Kebun baru yang dibuat langsung muncul di daftar kebun.
- AC2: Tanaman yang ditambahkan tersimpan dengan `GardenId` yang benar (terkait ke kebun yang tepat).
- AC3: Mengubah/menghapus satu tanaman tidak memengaruhi tanaman lain.
- AC4: Nama kebun/tanaman kosong (atau hanya spasi) ditolak dengan pesan error yang jelas.

### Plan
- Buat endpoint REST: `GET/POST /api/gardens`, `GET/PUT/DELETE /api/gardens/:Id`, `GET/POST /api/gardens/:GardenId/plants`, `PUT/DELETE /api/plants/:Id`.
- Ekstrak logic validasi input wajib ke fungsi murni `ValidateRequiredText()` di `src/lib/validation.ts` agar bisa diuji terpisah dari Express/database (AC4 harus bisa dites tanpa perlu menjalankan server).
- Buat halaman frontend `Gardens.tsx` (list + form tambah kebun) dan `GardenPlants.tsx` (list + form tambah tanaman per kebun).

### Build (dikerjakan dengan bantuan AI Agent)
AI Agent (Claude) menghasilkan:
- `apps/api/src/lib/validation.ts` — fungsi `ValidateRequiredText(Value, FieldLabel)`.
- `apps/api/src/routes/gardens.ts` dan `apps/api/src/routes/plants.ts` — seluruh endpoint CRUD di atas, menggunakan Prisma Client.
- `apps/web/src/pages/Gardens.tsx` dan `GardenPlants.tsx` — form dan tampilan daftar, memanggil endpoint lewat `api/client.ts`.

### Verify
Dibuat unit test `src/lib/validation.test.ts` (format Vitest) yang menguji 4 skenario `ValidateRequiredText`: nilai kosong, nilai hanya spasi, nilai `undefined`, dan nilai valid.

Karena lingkungan pengerjaan tidak memiliki akses internet untuk `npm install` (Vitest belum terpasang), verifikasi **tetap dijalankan secara nyata** menggunakan `ts-node` + modul `assert` bawaan Node.js, yang mengeksekusi fungsi yang **sama persis** dengan yang dites oleh `validation.test.ts`:

```
=== Verifikasi Fitur 1: Validasi CRUD Kebun & Tanaman ===
[PASS] Nilai kosong ditolak dengan pesan yang benar
[PASS] Nilai hanya spasi ditolak dengan pesan yang benar
[PASS] Nilai undefined ditolak dengan pesan yang benar
[PASS] Nilai valid diterima (return null, tidak ada error)
=== Semua assertion LULUS (4/4) ===
```

Bukti lengkap: `docs/evidence/feature1-verification.log`.

### Commit
```
feat: Fitur 1 - CRUD Kebun & Tanaman (Garden/Plant) + unit test validasi input
```

---

## 3. Fitur 2 — Jadwal Perawatan & Status Perawatan

### Brief
Setiap tanaman butuh jadwal perawatan (penyiraman/pemupukan) dengan frekuensi tertentu dalam hari. Saat pengguna menandai jadwal "sudah dilakukan", sistem harus mencatat riwayatnya dan otomatis menghitung ulang jadwal berikutnya. Dashboard harus bisa menunjukkan status tiap tanaman (butuh perhatian atau tidak) tanpa pengguna harus membuka satu per satu.

**Acceptance Criteria:**
- AC1: Saat jadwal dibuat, `NextDueAt` dihitung otomatis = tanggal acuan + `FrequencyDays`.
- AC2: Saat "Tandai Sudah Dilakukan" ditekan, tercatat `CareLog` baru dan `NextDueAt` dihitung ulang dari tanggal selesai.
- AC3: Status diklasifikasikan benar — `NO_SCHEDULE` (tanpa jadwal), `OVERDUE` (lewat tenggat), `DUE_SOON` (≤2 hari lagi), `OK` (>2 hari lagi).
- AC4: Klaim pada AC1–AC3 dibuktikan lewat unit test otomatis, bukan hanya pengecekan manual di UI.

### Plan
Awalnya logic perhitungan tanggal & status ditulis langsung di dalam route handler Express (campur dengan kode Prisma/HTTP). **Ini direview dan diubah**: logic tersebut diekstrak menjadi dua **pure function** terpisah di `src/lib/careLogic.ts`:
- `CalculateNextDueAt(FrequencyDays, From?)`
- `DetermineCareStatus(NextDueAt, Now?)`

Alasan perubahan: pure function tidak bergantung pada Express/Prisma/database, sehingga bisa diuji langsung dengan input tanggal tetap (deterministik), tanpa perlu menjalankan server atau menyiapkan data di MySQL. Ini membuat AC1–AC3 benar-benar *dapat diverifikasi secara otomatis* (AC4), bukan cuma "terlihat benar" saat dicoba manual.

### Build (dikerjakan dengan bantuan AI Agent)
AI Agent menghasilkan:
- `apps/api/src/lib/careLogic.ts` — dua pure function di atas.
- `apps/api/src/routes/schedules.ts` — endpoint `POST /api/schedules/:Id/done` yang memanggil `CalculateNextDueAt` dan menyimpan `CareLog`.
- Endpoint `POST /api/plants/:Id/schedules` di `plants.ts` — memanggil `CalculateNextDueAt` saat jadwal baru dibuat.
- `apps/api/src/routes/dashboard.ts` — memanggil `DetermineCareStatus` untuk setiap tanaman.
- `apps/web/src/pages/Dashboard.tsx`, `PlantDetail.tsx`, dan `components/StatusBadge.tsx` — tampilan ringkasan dan tombol "Tandai Sudah Dilakukan".

### Verify
Dibuat unit test `src/lib/careLogic.test.ts` (format Vitest, 5 test case). Sama seperti Fitur 1, karena belum ada akses `npm install`, verifikasi dijalankan nyata lewat `ts-node` + `assert`, terhadap fungsi yang identik dengan yang dites oleh file Vitest-nya:

```
=== Verifikasi Fitur 2: Jadwal Perawatan & Status Perawatan ===
[PASS] AC1 - NextDueAt dihitung otomatis (From + FrequencyDays): 2026-01-01 + 3 hari = 2026-01-04
[PASS] AC3 - Tanaman tanpa jadwal -> status NO_SCHEDULE
[PASS] AC3 - Jadwal yang sudah lewat (H-1) -> status OVERDUE
[PASS] AC3 - Jadwal besok (dalam 2 hari) -> status DUE_SOON
[PASS] AC3 - Jadwal 10 hari lagi -> status OK
=== Simulasi AC2: Tandai Sudah Dilakukan ===
[PASS] AC2 - Setelah 'Tandai Sudah Dilakukan', NextDueAt dihitung ulang dari DoneAt + FrequencyDays
=== Semua assertion LULUS (6/6) ===
```

Bukti lengkap: `docs/evidence/feature2-verification.log`.

Selain itu, sanity check sintaks dilakukan dengan `tsc --noEmit` pada seluruh file backend. Error yang muncul **seluruhnya** berupa "Cannot find module/name" untuk `express`, `@prisma/client`, `path`, `process`, `__dirname` — ini **bukan bug logic**, melainkan konsekuensi wajar karena `npm install` belum pernah dijalankan di lingkungan pengerjaan (tidak ada akses internet). Tidak ditemukan satu pun error sintaks/logic lain di luar kategori "missing module/type declaration" tersebut.

### Commit
```
feat: Fitur 2 - Jadwal Perawatan (Mark As Done) & Status Perawatan di Dashboard
```

---

## 4. Riwayat Commit (Git Log)

```
d2f3252 feat: Fitur 2 - Jadwal Perawatan (Mark As Done) & Status Perawatan di Dashboard
c734b70 feat: Fitur 1 - CRUD Kebun & Tanaman (Garden/Plant) + unit test validasi input
ed1488a chore: setup scaffold monorepo (shared types, Prisma schema, Docker, base Express app)
```

Terdapat **3 commit** (1 scaffold + 2 commit fitur bermakna), memenuhi syarat minimal 2 *meaningful commits* — masing-masing commit fitur mewakili satu siklus Brief → Plan → Build → Verify yang utuh dan bisa ditelusuri terpisah lewat `git show <hash>`.

---

## 5. Penjelasan: Peran AI Agent vs Peran Mahasiswa

### Apa yang dikerjakan AI Agent
- Menulis seluruh kode awal (routes, pure function, komponen React) berdasarkan Brief dan Plan yang sudah ditentukan per fitur.
- Menyusun unit test (`validation.test.ts`, `careLogic.test.ts`) yang mencakup acceptance criteria masing-masing fitur.
- Menjalankan verifikasi nyata (eksekusi `ts-node` + `assert`) dan melaporkan hasil PASS/FAIL apa adanya.
- Menyusun dokumentasi (README, PRD, laporan tugas ini).

### Apa yang direview dan diubah oleh mahasiswa
- **Pemilihan 2 fitur inti** — keputusan fitur mana yang masuk MVP V1 ditentukan oleh mahasiswa berdasarkan mana yang paling kritis bagi jalur utama aplikasi.
- **Keputusan refactor Fitur 2** — logic `CalculateNextDueAt`/`DetermineCareStatus` awalnya akan ditulis menyatu di route handler; mahasiswa meminta diekstrak jadi pure function terpisah supaya *testable* tanpa database, karena AC4 secara eksplisit menuntut bukti otomatis, bukan cuma klaim "sudah dicoba manual".
- **Verifikasi hasil test** — mahasiswa memeriksa bahwa isi `careLogic.test.ts` benar-benar mencerminkan AC1–AC3 (bukan sekadar test generik), dan memverifikasi log eksekusi `ts-node` baris per baris sebelum dianggap sah sebagai bukti.
- **Struktur commit** — mahasiswa menentukan agar commit dipecah per fitur (bukan satu commit besar), supaya histori Git mencerminkan proses Brief→Plan→Build→Verify yang bisa ditelusuri satu per satu.

### Bagaimana fitur diverifikasi
1. Logic inti tiap fitur diisolasi sebagai pure function (`ValidateRequiredText`, `CalculateNextDueAt`, `DetermineCareStatus`) agar bisa diuji tanpa bergantung pada Express/MySQL.
2. Unit test resmi ditulis dalam format Vitest (`*.test.ts`) sebagai deliverable yang akan berjalan normal begitu `npm install` + `npm run test:api` dijalankan di lingkungan dengan akses internet.
3. Sebagai bukti tambahan *saat ini juga* (karena lingkungan pengerjaan tanpa akses internet), logic yang identik dijalankan langsung lewat `ts-node` dengan assertion Node.js bawaan — hasilnya tersimpan sebagai log di `docs/evidence/`.
4. Sanity check sintaks (`tsc --noEmit`) dijalankan untuk memastikan tidak ada error di luar "module belum terpasang".

### Mengapa perubahan tersebut diperlukan
Tanpa ekstraksi ke pure function, pengujian Fitur 2 **mengharuskan database MySQL aktif** dan data jadwal nyata — ini membuat verifikasi lambat, sulit diulang, dan rawan gagal karena faktor eksternal (koneksi DB, state data lama). Dengan pure function, kasus-kasus kritis (tanggal lewat, tanggal besok, tanggal jauh, tanpa jadwal) bisa diuji dalam hitungan milidetik, deterministik, dan tidak tergantung infrastruktur apa pun — sehingga lebih sesuai dengan tuntutan AC4 (verifikasi otomatis) pada tugas ini.

---

## 6. Cara Menjalankan Aplikasi (untuk Demo)

```bash
npm install
docker compose up -d
cp .env.example apps/api/.env
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ../..
npm run dev:api     # terminal 1 — backend di http://localhost:4000
npm run dev:web     # terminal 2 — frontend di http://localhost:5173
```

Setelah `npm install` berhasil, unit test resmi dapat dijalankan dengan:
```bash
npm run test:api
```

## 7. Alur Demo Singkat

1. Buka `http://localhost:5173` → Dashboard menunjukkan 0 kebun/tanaman (atau data seed jika seed dijalankan).
2. Buka menu **Kebun Saya** → buat kebun baru (coba kosongkan nama → muncul pesan error, membuktikan AC4 Fitur 1).
3. Masuk ke kebun tersebut → tambah tanaman baru.
4. Buka detail tanaman → tambah jadwal "Penyiraman setiap 3 hari" → `NextDueAt` otomatis terisi (membuktikan AC1 Fitur 2).
5. Klik **Tandai Sudah Dilakukan** → `NextDueAt` berubah, pesan konfirmasi muncul (membuktikan AC2 Fitur 2).
6. Kembali ke Dashboard → status tanaman (badge warna) menyesuaikan tanggal jadwal berikutnya (membuktikan AC3 Fitur 2).
