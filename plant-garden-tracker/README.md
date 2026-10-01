# Plant Garden Tracker

Aplikasi manajemen tanaman/kebun rumahan: catat tanaman, atur jadwal siram/pupuk dengan pengingat, dan simpan riwayat pertumbuhan berbasis foto.

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + TypeScript + Express
- **Database:** MySQL
- **ORM:** Prisma
- **Upload foto:** Multer (disimpan lokal di `apps/api/uploads`)
- **Monorepo:** npm workspaces (`apps/web`, `apps/api`, `packages/shared`)

## Struktur Folder

```text
plant-garden-tracker/
  apps/
    web/      -> frontend React
    api/      -> backend Express + Prisma
  packages/
    shared/   -> tipe data & enum yang dipakai bersama frontend-backend
```

## Prasyarat

- Node.js 18+
- Docker (untuk menjalankan MySQL) — atau MySQL lokal yang sudah terpasang

## 1. Install Dependencies

Dari root folder proyek:

```bash
npm install
```

## 2. Jalankan Database (MySQL via Docker)

```bash
docker compose up -d
```

Ini akan menjalankan MySQL di `localhost:3306` dengan database `plant_garden_tracker`.

## 3. Konfigurasi Environment

```bash
cp .env.example apps/api/.env
```

Sesuaikan `DATABASE_URL` di `apps/api/.env` bila perlu.

## 4. Build Package Shared

```bash
npm run build:shared
```

## 5. Migrasi & Seed Database

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ../..
```

Seed akan membuat 1 kebun contoh, 3 tanaman, 1 jadwal penyiraman per tanaman, dan 1 catatan pertumbuhan awal.

## 6. Jalankan Backend

```bash
npm run dev:api
```

Backend berjalan di `http://localhost:4000`.

## 7. Jalankan Frontend

Buka terminal baru:

```bash
npm run dev:web
```

Frontend berjalan di `http://localhost:5173`.

## Fitur Utama

- CRUD Kebun (Garden)
- CRUD Tanaman (Plant) per kebun
- CRUD Jadwal Perawatan (penyiraman/pemupukan) dengan tombol "Tandai Sudah Dilakukan"
- Upload foto & catatan kondisi tanaman (Growth Log) sebagai timeline pertumbuhan
- Dashboard ringkasan: total kebun, total tanaman, jadwal yang perlu perawatan hari ini, jadwal terlambat, tanaman tanpa jadwal

## Catatan

- Belum ada autentikasi pada versi ini — diasumsikan satu pengguna.
- Data commit/riwayat perawatan (`CareLog`) dan catatan pertumbuhan (`GrowthLog`) tidak pernah dihapus otomatis oleh sistem, hanya bisa dihapus manual oleh pengguna.
