# RPL 2026 Project
 
Repository ini berisi dokumentasi dan pengembangan tugas mata kuliah **Rekayasa Perangkat Lunak (RPL)**. Terdapat 3 usulan ide produk digital solutif yang didokumentasikan di bawah ini.
 
## Daftar Isi
 
- [1. Aplikasi Manajemen Tanaman/Kebun Rumahan](#1-aplikasi-manajemen-tanamankebun-rumahan)
- [2. Pelacak Jejak Karbon Aktivitas Harian](#2-pelacak-jejak-karbon-aktivitas-harian)
- [3. Chatbot Edukasi Kabut Asap](#3-chatbot-edukasi-kabut-asap)
---
 
## 1. Aplikasi Manajemen Tanaman/Kebun Rumahan

Aplikasi untuk mencatat jenis tanaman, jadwal siram/pupuk, dan riwayat pertumbuhan (dengan foto per minggu).
 
### Deskripsi Masalah
Banyak orang yang mulai berkebun di rumah (terutama pemula) kesulitan konsisten merawat tanaman karena lupa jadwal siram atau pemupukan, serta tidak memiliki catatan riwayat pertumbuhan untuk memantau apakah perawatan yang dilakukan sudah tepat.
 
### Profil Target Pengguna
- Pemula berkebun rumahan (urban farming/hidroponik/tanaman hias)
- Individu dengan kesibukan tinggi yang mudah lupa jadwal perawatan tanaman
- Pengguna usia 20–45 tahun yang punya minat hobi berkebun sebagai self-care
### Manfaat Aplikasi
- Membantu pengguna disiplin merawat tanaman lewat pengingat otomatis
- Memberi gambaran perkembangan tanaman dari waktu ke waktu lewat dokumentasi foto
- Memudahkan evaluasi apakah pola perawatan sudah efektif
### Daftar Fitur Inti
- [ ] CRUD data tanaman (nama, jenis, tanggal mulai tanam)
- [ ] Pengaturan jadwal siram/pupuk dengan reminder/notifikasi
- [ ] Upload foto perkembangan tanaman secara berkala (mingguan)
- [ ] Galeri riwayat foto per tanaman (timeline pertumbuhan)
- [ ] Catatan/log kondisi tanaman (sehat, layu, berbunga, dll.)
### Fitur yang Tidak Dikerjakan
- Deteksi otomatis penyakit tanaman berbasis AI/image recognition
- Integrasi sensor IoT (kelembaban tanah, suhu otomatis)
- Marketplace jual-beli tanaman/bibit
- Fitur sosial (berbagi progres ke komunitas publik)
### Kriteria Aplikasi Dinyatakan Berhasil
- Reminder jadwal siram/pupuk terkirim tepat waktu sesuai pengaturan pengguna
- Data tanaman dan foto tersimpan dengan baik tanpa kehilangan data
- Pengguna dapat melihat timeline pertumbuhan tanaman secara berurutan sesuai tanggal upload
- Sistem mampu menangani pencatatan beberapa tanaman sekaligus tanpa error

 
## 2. Pelacak Jejak Karbon Aktivitas Harian


## 3. Chatbot Edukasi Kabut Asap
---

Build a full-stack web application named **Plant Garden Tracker**.

Purpose:
Help home gardeners manage their plants: track watering/fertilizing schedules, get reminders when care is due, and keep a weekly photo-based growth log for each plant.

Use this stack:

* Frontend: React + TypeScript + Vite + Tailwind CSS
* Backend: Node.js + TypeScript + Express
* Database: MySQL
* ORM: Prisma
* API style: REST API
* File upload: Multer (store growth-log photos locally under `apps/api/uploads`)
* Use Docker Compose for MySQL
* Use `.env.example` for database URL and upload directory path

Code rules:

* Do not add comments unless truly necessary.
* Use PascalCase for all classes, types, interfaces, enums, React components, database models, API DTOs, and JSON property names.
* Local variables may use camelCase.
* Keep code lines below 150 characters where practical.
* Use a clean and simple folder structure.
* Do not add authentication in this first version. Assume one user manages the application.

Main entities:

1. Garden

   * Id
   * Name
   * Location
   * CreatedAt

2. Plant

   * Id
   * GardenId
   * Name
   * Species
   * PlantedDate
   * CreatedAt

3. CareSchedule

   * Id
   * PlantId
   * Type
   * FrequencyDays
   * LastDoneAt
   * NextDueAt
   * CreatedAt

4. CareLog

   * Id
   * PlantId
   * ScheduleId
   * Type
   * DoneAt
   * CreatedAt

5. GrowthLog

   * Id
   * PlantId
   * PhotoUrl
   * Note
   * Condition
   * LoggedAt
   * CreatedAt

Database rules:

* A Plant must belong to exactly one Garden.
* A CareSchedule belongs to exactly one Plant and has a `Type` of `WATERING` or `FERTILIZING`.
* When a care action is marked as done, create one `CareLog` entry and update the related `CareSchedule.LastDoneAt` and `NextDueAt` (`NextDueAt = DoneAt + FrequencyDays`).
* Never delete existing `CareLog` or `GrowthLog` records automatically; only explicit user delete removes them.
* A `GrowthLog` entry is created manually by the user (upload photo + note), not fetched automatically.
* Use Prisma migrations and seed one example garden, three plants, one care schedule per plant, and one growth log entry per plant.

Backend features:

1. CRUD Garden

   * Create, list, detail, update, delete garden.

2. CRUD Plant

   * Create, list, detail, update, delete plant inside a garden.

3. CRUD CareSchedule

   * Add, edit, delete a watering/fertilizing schedule for a plant.
   * Validate `FrequencyDays` is a positive integer.

4. Mark Care As Done

   * Endpoint to mark one schedule as done.
   * Insert a new `CareLog` entry.
   * Recalculate and update `NextDueAt` on the related `CareSchedule`.
   * Return a result containing:

     * ScheduleId
     * PlantId
     * Type
     * DoneAt
     * NextDueAt
     * Message

5. CRUD GrowthLog

   * Add a growth log entry with photo upload, note, and condition.
   * List growth log entries for a plant ordered by `LoggedAt`.
   * Delete a growth log entry.

6. Dashboard API

   * Return an overview summary:

     * TotalGardens
     * TotalPlants
     * SchedulesDueToday
     * OverdueSchedules
     * PlantsWithoutSchedule
   * Return plant care status data:

     * PlantId
     * PlantName
     * GardenName
     * NextDueAt
     * DaysUntilDue
     * CareStatus
   * CareStatus rules:

     * `NO_SCHEDULE`: plant has no active care schedule
     * `OVERDUE`: `NextDueAt` is in the past
     * `DUE_SOON`: `NextDueAt` is within the next 2 days
     * `OK`: `NextDueAt` is more than 2 days away

Frontend pages:

1. Dashboard

   * Summary cards: total gardens, total plants, schedules due today, overdue schedules, plants without schedule.
   * Table showing each plant, garden name, next due date, and care status.
   * Button per row: `Tandai Sudah Dilakukan`.
   * Show loading state, success message, and error message.
   * Dashboard reads only from the MySQL database when opened.

2. Garden Management

   * List gardens.
   * Form to create and edit gardens.
   * Button to open garden's plant list.

3. Plant Management

   * List plants in a selected garden.
   * Form to add and edit plant information.
   * Show planted date and species.

4. Care Schedule Management

   * List schedules for a selected plant.
   * Form to add and edit watering/fertilizing schedules.
   * Button: `Tandai Sudah Dilakukan`.
   * Show last done date and next due date.

5. Plant Detail & Growth Timeline

   * Show plant information.
   * Show active care schedules and care status badge.
   * Show growth log timeline (photo, note, condition, date) ordered from newest to oldest.
   * Form to add a new growth log entry (upload photo, note, condition).

UI requirements:

* Use Indonesian language for all labels, buttons, messages, and validation.
* Create a clean, responsive gardener dashboard.
* Use simple tables, cards, badges, forms, confirmation dialog before delete, and empty states.
* Use status badge colors:

  * OK: green
  * Due Soon: orange
  * Overdue: red
  * No Schedule: gray
* Do not add charts in the first version.

Required API routes:

* `GET /api/gardens`
* `POST /api/gardens`
* `GET /api/gardens/:Id`
* `PUT /api/gardens/:Id`
* `DELETE /api/gardens/:Id`
* `GET /api/gardens/:GardenId/plants`
* `POST /api/gardens/:GardenId/plants`
* `PUT /api/plants/:Id`
* `DELETE /api/plants/:Id`
* `GET /api/plants/:Id/schedules`
* `POST /api/plants/:Id/schedules`
* `PUT /api/schedules/:Id`
* `DELETE /api/schedules/:Id`
* `POST /api/schedules/:Id/done`
* `GET /api/plants/:Id/growth-logs`
* `POST /api/plants/:Id/growth-logs`
* `DELETE /api/growth-logs/:Id`
* `GET /api/dashboard`

Deliverables:

* Complete frontend and backend source code.
* Prisma schema, migration, and seed data.
* Docker Compose file for MySQL.
* `.env.example`.
* README with installation, database migration, seed, frontend/backend startup, Docker usage, and upload folder configuration.
* Ensure the application builds successfully and all basic CRUD plus mark-as-done and growth log upload work.

Project structure:

* Use a TypeScript monorepo with npm workspaces.
* Structure:

```text
plant-garden-tracker/
  apps/
    web/
    api/
  packages/
    shared/
```

Shared package requirements:

* Create `packages/shared` as `@plant-garden-tracker/shared`.
* Store all shared domain models, enums, API response types, and shared constants here.
* Both `apps/web` and `apps/api` must import shared types from this package.
* Do not duplicate domain model definitions between frontend and backend.

Example shared files:

```text
packages/shared/src/
  models/
    Garden.ts
    Plant.ts
    CareSchedule.ts
    CareLog.ts
    GrowthLog.ts
  enums/
    CareType.ts
    CareStatus.ts
    PlantCondition.ts
  dto/
    DashboardResponse.ts
    MarkCareDoneResult.ts
  index.ts
```

Model rules:

* Define shared TypeScript interfaces or types only once in `packages/shared`.
* Example: `Plant`, `CareSchedule`, `GrowthLog`, and `CareStatus` must be imported by both frontend and backend from `@plant-garden-tracker/shared`.
* Prisma models remain in the backend because they are database-specific.
* The backend maps Prisma entities to shared API models before returning responses.
* The frontend must not import Prisma types.
* Configure TypeScript paths, workspace dependencies, build scripts, and development scripts correctly so all packages compile successfully.
