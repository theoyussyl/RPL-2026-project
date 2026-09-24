# Product Requirements Document (PRD)
## Plant Garden Tracker (Aplikasi Manajemen Tanaman/Kebun Rumahan)

**Versi:** 1.0
**Status:** Draft

---

## 1. Latar Belakang & Masalah

Tren berkebun di rumah (urban farming, hidroponik, tanaman hias) terus meningkat, terutama di kalangan masyarakat perkotaan yang ingin mengisi waktu luang sekaligus menghadirkan ruang hijau di rumah. Namun, banyak pemula yang kesulitan menjaga konsistensi perawatan tanaman karena beberapa alasan:

- **Lupa jadwal perawatan**: tidak ada pengingat kapan harus menyiram atau memupuk tanaman, sehingga tanaman sering terlambat dirawat.
- **Tidak ada riwayat perkembangan**: pemilik tanaman tidak punya catatan visual untuk memantau apakah tanaman tumbuh sehat dari waktu ke waktu.
- **Sulit evaluasi pola perawatan**: tanpa data historis, sulit menilai apakah jadwal siram/pupuk yang diterapkan sudah tepat atau perlu disesuaikan.
- **Solusi yang ada belum spesifik**: aplikasi pengingat umum (to-do list, kalender) tidak dirancang khusus untuk kebutuhan berkebun (tidak ada dokumentasi foto per tanaman, tidak ada pengelompokan berdasarkan kebun).

Masalah ini relevan terutama bagi individu yang punya kesibukan tinggi namun tetap ingin menjadikan berkebun sebagai kegiatan yang berkelanjutan, bukan sekadar tren sesaat.

---

## 2. Tujuan Produk

1. Membantu pengguna **disiplin merawat tanaman** melalui jadwal dan pengingat yang jelas.
2. Menyediakan **dokumentasi visual pertumbuhan tanaman** dari waktu ke waktu.
3. Memberi **gambaran status perawatan** semua tanaman dalam satu dashboard, sehingga pengguna tahu tanaman mana yang butuh perhatian segera.
4. Menjadi fondasi produk yang bisa dikembangkan lebih lanjut (notifikasi push, multi-user, integrasi sensor IoT) di versi berikutnya.

---

## 3. Target Pengguna & Persona

### Target Pengguna
- Pemula berkebun rumahan (urban farming, hidroponik, tanaman hias)
- Individu dengan kesibukan tinggi yang mudah lupa jadwal perawatan tanaman
- Pengguna usia 20–45 tahun yang menjadikan berkebun sebagai hobi/self-care

---

## 4. Manfaat Produk

- **Bagi pengguna:** tanaman lebih terawat konsisten, ada bukti visual perkembangan, mudah mengevaluasi pola perawatan.
- **Bagi kebiasaan berkebun:** mendorong keberlanjutan hobi berkebun karena mengurangi risiko tanaman mati akibat lupa dirawat.
- **Bagi pengembang (nilai tugas RPL):** proyek mencakup siklus penuh CRUD, reminder/scheduling logic, dan file upload cukup representatif untuk menunjukkan kompetensi rekayasa perangkat lunak dalam satu aplikasi web sederhana.

---

## 5. Ruang Lingkup

### Termasuk dalam Ruang Lingkup (In Scope)
- CRUD Kebun (Garden)
- CRUD Tanaman (Plant) di dalam sebuah kebun
- CRUD Jadwal Perawatan (CareSchedule): penyiraman & pemupukan
- Aksi "Tandai Sudah Dilakukan" yang mencatat riwayat (CareLog) dan menghitung ulang jadwal berikutnya
- Catatan Pertumbuhan (GrowthLog): upload foto + catatan kondisi tanaman
- Dashboard ringkasan status perawatan seluruh tanaman

### Tidak Termasuk dalam Ruang Lingkup (Out of Scope versi ini)
- Autentikasi & multi-user (diasumsikan satu pengguna)
- Notifikasi push/email otomatis
- Deteksi otomatis penyakit tanaman berbasis AI/image recognition
- Integrasi sensor IoT (kelembaban tanah, suhu)
- Aplikasi mobile native (versi ini web-based, responsif)
- Fitur sosial/berbagi progres ke komunitas publik

---

## 6. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + TypeScript + Express |
| Database | MySQL |
| ORM | Prisma |
| File Upload | Multer (foto disimpan lokal) |
| Arsitektur Proyek | Monorepo (npm workspaces): `apps/web`, `apps/api`, `packages/shared` |
| Containerization | Docker Compose (MySQL) |

---

## 7. Rincian Fitur & Functional Requirements

### FR-1: Manajemen Kebun (Garden)
- FR-1.1: Pengguna dapat membuat kebun baru dengan Nama dan Lokasi (opsional).
- FR-1.2: Pengguna dapat melihat daftar seluruh kebun.
- FR-1.3: Pengguna dapat mengubah data kebun.
- FR-1.4: Pengguna dapat menghapus kebun beserta seluruh data tanaman di dalamnya (dengan konfirmasi).

### FR-2: Manajemen Tanaman (Plant)
- FR-2.1: Pengguna dapat menambahkan tanaman ke dalam kebun tertentu (Nama, Spesies, Tanggal Tanam).
- FR-2.2: Pengguna dapat melihat daftar tanaman per kebun.
- FR-2.3: Pengguna dapat mengubah dan menghapus data tanaman.

### FR-3: Jadwal Perawatan (CareSchedule)
- FR-3.1: Pengguna dapat menambahkan jadwal perawatan (tipe: Penyiraman/Pemupukan, frekuensi dalam hari) untuk satu tanaman.
- FR-3.2: Sistem otomatis menghitung `NextDueAt` saat jadwal dibuat.
- FR-3.3: Pengguna dapat menandai jadwal sebagai "Sudah Dilakukan"; sistem mencatat `CareLog` dan menghitung ulang `NextDueAt`.
- FR-3.4: Pengguna dapat mengubah frekuensi atau menghapus jadwal.

### FR-4: Catatan Pertumbuhan (GrowthLog)
- FR-4.1: Pengguna dapat mengunggah foto tanaman beserta catatan dan kondisi (Sehat/Layu/Berbunga/Berbuah/Sakit).
- FR-4.2: Sistem menampilkan riwayat foto sebagai timeline, terbaru di atas.
- FR-4.3: Pengguna dapat menghapus entri catatan pertumbuhan tertentu.

### FR-5: Dashboard
- FR-5.1: Sistem menampilkan ringkasan: Total Kebun, Total Tanaman, Jadwal Perlu Perawatan Hari Ini, Jadwal Terlambat, Tanaman Tanpa Jadwal.
- FR-5.2: Sistem menampilkan tabel status perawatan per tanaman dengan badge status: `OK`, `DUE_SOON`, `OVERDUE`, `NO_SCHEDULE`.
- FR-5.3: Dashboard hanya membaca data dari database (tidak memanggil layanan eksternal).

---

## 8. Non-Functional Requirements

| Kategori | Kebutuhan |
|---|---|
| **Usability** | Antarmuka berbahasa Indonesia, responsif untuk layar mobile dan desktop |
| **Performance** | Waktu muat halaman dashboard di bawah 2 detik untuk data hingga ±100 tanaman |
| **Reliability** | Data `CareLog` dan `GrowthLog` tidak pernah terhapus otomatis oleh sistem |
| **Maintainability** | Tipe data dibagikan lewat `packages/shared` agar frontend & backend tidak duplikasi model |
| **Portability** | Backend & database dapat dijalankan via Docker Compose agar mudah direplikasi di lingkungan lain |
| **Data Integrity** | Setiap `Plant` wajib terkait ke satu `Garden`; setiap `CareSchedule`/`GrowthLog` wajib terkait ke satu `Plant` |
| **Security (baseline)** | Validasi input pada seluruh form (field wajib tidak boleh kosong) |

---

## 9. Alur Pengguna Utama (User Flow)

### Flow 1 Menambahkan Tanaman Baru
1. Pengguna membuka menu **Kebun Saya**.
2. Jika belum ada kebun, pengguna membuat kebun baru (Nama, Lokasi).
3. Pengguna membuka kebun tersebut → menekan **Tambah Tanaman**.
4. Pengguna mengisi Nama dan Spesies tanaman → simpan.
5. Tanaman muncul di daftar tanaman kebun tersebut.

### Flow 2 Mengatur & Menyelesaikan Jadwal Perawatan
1. Pengguna membuka **Detail Tanaman**.
2. Pengguna menambahkan jadwal (tipe: Penyiraman/Pemupukan, frekuensi hari).
3. Sistem menghitung `NextDueAt` dan menampilkannya.
4. Saat tanaman selesai disiram/dipupuk, pengguna menekan **Tandai Sudah Dilakukan**.
5. Sistem mencatat riwayat dan memperbarui jadwal berikutnya.

### Flow 3 Mendokumentasikan Pertumbuhan
1. Pengguna membuka **Detail Tanaman**.
2. Pengguna mengunggah foto terbaru, memilih kondisi tanaman, menambahkan catatan opsional.
3. Foto masuk ke timeline pertumbuhan, terbaru di paling atas.

### Flow 4 Memantau Semua Tanaman dari Dashboard
1. Pengguna membuka **Dashboard**.
2. Pengguna melihat ringkasan jumlah tanaman yang perlu perawatan hari ini/terlambat.
3. Pengguna menekan **Lihat Detail** pada tanaman berstatus `OVERDUE` untuk segera menindaklanjuti.

---

## 10. Model Data (Ringkas)

```
Garden
  Id, Name, Location, CreatedAt
  1 ──< Plant

Plant
  Id, GardenId, Name, Species, PlantedDate, CreatedAt
  1 ──< CareSchedule
  1 ──< CareLog
  1 ──< GrowthLog

CareSchedule
  Id, PlantId, Type (WATERING|FERTILIZING), FrequencyDays,
  LastDoneAt, NextDueAt, CreatedAt
  1 ──< CareLog

CareLog
  Id, PlantId, ScheduleId, Type, DoneAt, CreatedAt

GrowthLog
  Id, PlantId, PhotoUrl, Note, Condition
  (HEALTHY|WILTED|FLOWERING|FRUITING|DISEASED), LoggedAt, CreatedAt
```

**Relasi utama:**
- Satu `Garden` memiliki banyak `Plant`.
- Satu `Plant` memiliki banyak `CareSchedule` dan banyak `GrowthLog`.
- Setiap `CareLog` selalu mengacu ke satu `CareSchedule` yang menghasilkannya.

---

## 11. Contoh Endpoint API

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/gardens` | Daftar semua kebun |
| POST | `/api/gardens` | Buat kebun baru |
| GET | `/api/gardens/:GardenId/plants` | Daftar tanaman dalam satu kebun |
| POST | `/api/gardens/:GardenId/plants` | Tambah tanaman ke kebun |
| GET | `/api/plants/:Id` | Detail tanaman (termasuk jadwal & growth log) |
| PUT | `/api/plants/:Id` | Perbarui data tanaman |
| DELETE | `/api/plants/:Id` | Hapus tanaman |
| POST | `/api/plants/:Id/schedules` | Tambah jadwal perawatan |
| POST | `/api/schedules/:Id/done` | Tandai jadwal sudah dilakukan |
| POST | `/api/growth-logs/:PlantId` | Unggah catatan pertumbuhan (foto) |
| DELETE | `/api/growth-logs/:Id` | Hapus catatan pertumbuhan |
| GET | `/api/dashboard` | Ringkasan status seluruh tanaman |
