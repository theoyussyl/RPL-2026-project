# Plant Garden Tracker

Aplikasi manajemen tanaman/kebun rumahan — MVP Version 1.
Dibangun secara iteratif per fitur: Brief → Plan → Build → Verify → Commit.

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + TypeScript + Express
- Database: MySQL via Prisma ORM
- Monorepo: npm workspaces (apps/web, apps/api, packages/shared)

## Menjalankan Proyek
```bash
npm install
docker compose up -d
cp .env.example apps/api/.env
cd apps/api && npx prisma generate && npx prisma migrate dev --name init && npx prisma db seed && cd ../..
npm run dev:api
npm run dev:web
```

## Menjalankan Unit Test
```bash
npm run test:api
```

Lihat `docs/TUGAS-PERTEMUAN-5.md` untuk dokumentasi proses pengembangan MVP (Brief/Plan/Build/Verify/Commit) dan penjelasan peran AI Agent vs mahasiswa.
