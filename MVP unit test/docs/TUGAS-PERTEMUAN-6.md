# Tugas Pertemuan 6 — Penyempurnaan MVP

**Proyek:** Plant Garden Tracker (Aplikasi Manajemen Tanaman/Kebun Rumahan)

---

## 1. MVP-nya Apa?

**Plant Garden Tracker** adalah aplikasi web untuk membantu pengguna mengelola tanaman di rumah: mencatat kebun dan tanaman, mengatur jadwal penyiraman/pemupukan dengan pengingat otomatis, mencatat riwayat perawatan, dan melihat ringkasan status seluruh tanaman dalam satu dashboard.

**Ruang lingkup MVP Version 1 yang sudah berjalan:**
- CRUD Kebun (Garden) dan Tanaman (Plant)
- CRUD Jadwal Perawatan (CareSchedule): penyiraman & pemupukan dengan frekuensi dalam hari
- Aksi "Tandai Sudah Dilakukan" yang mencatat riwayat (CareLog) dan menghitung ulang jadwal berikutnya otomatis
- Hapus jadwal (termasuk yang sudah punya riwayat — riwayatnya ikut terhapus sekalian)
- Dashboard ringkasan: total kebun/tanaman, jumlah jadwal yang perlu perawatan hari ini, jumlah yang terlambat, dan status tiap tanaman (`OK` / `DUE_SOON` / `OVERDUE` / `NO_SCHEDULE`)

**Di luar MVP ini** (belum dikerjakan): Catatan Pertumbuhan berbasis foto (GrowthLog), autentikasi multi-user, notifikasi push.

---

## 2. 5 User Story & Acceptance Criteria

### US-1: CRUD Kebun & Tanaman
**Sebagai** pengguna, **saya ingin** membuat kebun dan menambahkan tanaman ke dalamnya, **supaya** saya bisa mengelompokkan dan melacak tanaman saya.

**Acceptance Criteria:**
- AC1: Kebun baru dengan nama valid langsung tersimpan dan muncul di daftar.
- AC2: Nama kebun/tanaman yang kosong atau hanya berisi spasi **ditolak** dengan pesan error yang jelas.
- AC3: Tanaman yang ditambahkan selalu terkait ke kebun yang benar (`GardenId` sesuai).

**Dibuktikan oleh:** `src/lib/validation.test.ts` (4 test case).

---

### US-2: Membuat Jadwal Perawatan dengan Validasi yang Benar
**Sebagai** pengguna, **saya ingin** menambahkan jadwal penyiraman/pemupukan dengan frekuensi tertentu, **supaya** saya tidak lupa merawat tanaman, dan sistem menolak input yang tidak masuk akal.

**Acceptance Criteria:**
- AC1: Tipe jadwal **hanya boleh** `WATERING` atau `FERTILIZING` — tipe lain ditolak.
- AC2: Frekuensi (`FrequencyDays`) **harus** bilangan bulat positif — `0`, negatif, atau desimal (misal `2.5`) **ditolak**.
- AC3: Input valid (tipe benar + frekuensi bulat positif) **diterima** tanpa error.

**Dibuktikan oleh:** `src/lib/scheduleValidation.test.ts` (7 test case — termasuk edge case `0`, negatif, dan desimal yang sebelumnya bisa lolos karena bug validasi lama `!Type || !FrequencyDays`).

---

### US-3: Perhitungan Otomatis Jadwal Berikutnya & Status Perawatan
**Sebagai** pengguna, **saya ingin** sistem otomatis menghitung kapan tanaman harus dirawat lagi dan menunjukkan status urgensinya, **supaya** saya tidak perlu menghitung manual.

**Acceptance Criteria:**
- AC1: `NextDueAt` = tanggal acuan + `FrequencyDays`, dihitung otomatis saat jadwal dibuat.
- AC2: Status diklasifikasikan benar: `NO_SCHEDULE` (tanpa jadwal), `OVERDUE` (lewat tenggat), `DUE_SOON` (≤2 hari lagi), `OK` (>2 hari lagi).
- AC3: Saat "Tandai Sudah Dilakukan" ditekan, `NextDueAt` dihitung ulang dari tanggal selesai (bukan dari tanggal jadwal lama).

**Dibuktikan oleh:** `src/lib/careLogic.test.ts` (5 test case).

---

### US-4: Dashboard Ringkasan Status Seluruh Tanaman
**Sebagai** pengguna, **saya ingin** melihat satu halaman ringkasan status semua tanaman saya, **supaya** saya langsung tahu tanaman mana yang butuh perhatian segera tanpa membuka satu per satu.

**Acceptance Criteria:**
- AC1: `TotalGardens` dan `TotalPlants` terhitung benar lintas banyak kebun.
- AC2: Status tiap tanaman diambil dari jadwal **TERDEKAT** miliknya (bukan rata-rata atau jadwal pertama yang dibuat).
- AC3: `SchedulesDueToday` hanya menghitung jadwal yang jatuh tempo **hari ini**, bukan besok atau lusa.
- AC4: Tanaman tanpa jadwal apapun masuk hitungan `PlantsWithoutSchedule` dengan status `NO_SCHEDULE`.

**Dibuktikan oleh:** `src/lib/dashboardLogic.test.ts` (5 test case).

---

### US-5: Menghapus Jadwal yang Salah Input (Termasuk Riwayatnya)
**Sebagai** pengguna, **saya ingin** bisa menghapus jadwal perawatan kapan saja — termasuk yang sudah pernah ditandai selesai — **supaya** saya bisa memperbaiki kesalahan input tanpa terhalang data lama.

**Acceptance Criteria:**
- AC1: Jadwal yang belum punya riwayat bisa dihapus seperti biasa.
- AC2: Jadwal yang **sudah** punya riwayat (`CareLog`) tetap bisa dihapus — seluruh riwayat terkait ikut terhapus sekalian (bukan diblokir).
- AC3: Menghapus satu jadwal **tidak memengaruhi** jadwal/riwayat milik tanaman lain.
- AC4: Server tidak boleh crash (500/hang) jika penghapusan menyentuh data yang masih berelasi — harus ditangani dengan rapi.

**Dibuktikan oleh:** `src/lib/scheduleDeletion.test.ts` (4 test case).

> Catatan: US-5 ini awalnya diimplementasikan sebaliknya (memblokir penghapusan), lalu diubah berdasarkan masukan langsung dari pengujian aplikasi — lihat histori commit `4e7d56b` dan `bf9daff` untuk konteks lengkap perubahan keputusan ini.

---

## 3. Review: Apakah Sudah Dijalankan & Diverifikasi?

### Status Menjalankan Aplikasi (MVP)
Lingkungan tempat kode ini dikerjakan **tidak memiliki akses internet**, sehingga `npm install` (untuk memasang Express, Prisma, React, Vitest, dll ke `node_modules`) dan `docker compose up -d` (MySQL) **tidak bisa dijalankan dari sisi ini**. Oleh karena itu:
- Aplikasi **belum bisa dijalankan end-to-end** (browser + server + database) dari lingkungan pengerjaan ini.
- Yang **bisa dan sudah dilakukan** sebagai gantinya:
  1. **Sanity check sintaks** seluruh file backend dengan `tsc --noEmit` — tidak ditemukan error di luar kategori "modul/tipe belum terpasang" (wajar karena belum `npm install`).
  2. **Eksekusi nyata logic inti** (bukan cuma baca kode) lewat `ts-node`, dibuktikan oleh log-log di `docs/evidence/`.

**Mahasiswa WAJIB menjalankan aplikasi sungguhan di komputernya sendiri** mengikuti langkah di README (`npm install` → `docker compose up -d` → migrasi & seed Prisma → `npm run dev:api` + `npm run dev:web`), lalu mencoba sendiri kelima user story di atas lewat browser sebagai bukti tambahan untuk demo.

### Status Unit Test — Lokasi & Hasil

**Lokasi 5 file unit test:**
```
apps/api/src/lib/validation.test.ts
apps/api/src/lib/careLogic.test.ts
apps/api/src/lib/scheduleValidation.test.ts
apps/api/src/lib/dashboardLogic.test.ts
apps/api/src/lib/scheduleDeletion.test.ts
```

**Cara run resmi (begitu `npm install` sudah dilakukan di komputer mahasiswa):**
```bash
npm run test:api
```
Script ini menjalankan `vitest run` di workspace `apps/api`, akan mengeksekusi kelima file di atas otomatis (Vitest mendeteksi semua file `*.test.ts`).

**Hasil run yang SUDAH dibuktikan di lingkungan ini** (via `ts-node` + `assert`, karena `vitest` belum ter-install akibat tanpa akses internet — isi assertion identik 1:1 dengan kelima file `.test.ts` di atas):

```
Test Files: 5 passed (5)
Tests:      25 passed, 0 failed (25 total)

ALL TESTS PASSED ✅
```

Log lengkap (25 baris centang ✓, satu per test case): `docs/evidence/pertemuan6-all-unit-tests.log`

---

## 4. Riwayat Commit

```
56b0052 test(mvp): tambah 5 file unit test untuk business rule inti (Pertemuan 6)
8c67c4c refactor(mvp): ekstrak business logic jadi pure function testable (Pertemuan 6)
4e7d56b feat: izinkan hapus jadwal perawatan meski sudah punya riwayat (hapus sekalian riwayatnya)
bf9daff fix: cegah server crash saat hapus jadwal/kebun/tanaman yang masih punya data terkait
3ef36d1 docs: laporan Tugas Pertemuan 5
d2f3252 feat: Fitur 2 - Jadwal Perawatan & Status Perawatan di Dashboard
c734b70 feat: Fitur 1 - CRUD Kebun & Tanaman + unit test validasi input
ed1488a chore: setup scaffold monorepo
```

Dua commit teratas (`56b0052` dan `8c67c4c`) adalah commit yang disyaratkan untuk tugas ini:
- **`8c67c4c`** — MVP production code (refactor logic jadi pure function + perbaikan bug validasi frekuensi 0/negatif/desimal yang sebelumnya lolos).
- **`56b0052`** — MVP unit test (5 file baru, 25 test case, mencakup US-1 s/d US-5).

---

## 5. Cara Mahasiswa Menjalankan & Memverifikasi Sendiri

```bash
# 1. Install dependency
npm install

# 2. Nyalakan MySQL
docker compose up -d

# 3. Siapkan .env
cp .env.example apps/api/.env

# 4. Migrasi & seed database
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ../..

# 5. Jalankan unit test — WAJIB semua PASSED
npm run test:api

# 6. Jalankan aplikasi untuk demo manual
npm run dev:api    # terminal 1
npm run dev:web    # terminal 2
```
