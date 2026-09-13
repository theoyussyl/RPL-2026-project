# RPL 2026 Project
 
Repository ini berisi dokumentasi dan pengembangan tugas mata kuliah **Rekayasa Perangkat Lunak (RPL)**. Terdapat 3 usulan ide produk digital solutif yang didokumentasikan di bawah ini.
 
## Daftar Isi
 
- [1. Pelacak Jejak Karbon Aktivitas Harian](#1-pelacak-jejak-karbon-aktivitas-harian)
- [2. Aplikasi Manajemen Tanaman/Kebun Rumahan](#2-aplikasi-manajemen-tanamankebun-rumahan)
- [3. Chatbot Edukasi Kabut Asap](#3-chatbot-edukasi-kabut-asap)
- [Tech Stack Ringkasan](#tech-stack-ringkasan)
- [Metodologi Pengembangan](#metodologi-pengembangan)
---
 
## 1. Pelacak Jejak Karbon Aktivitas Harian
 
Aplikasi yang menghitung estimasi emisi karbon dari aktivitas harian (transportasi, listrik, makanan) berdasarkan input manual pengguna, lalu menampilkan visualisasi/skor.
 
### Deskripsi Masalah
Banyak orang tidak menyadari seberapa besar kontribusi aktivitas harian mereka (transportasi, penggunaan listrik, konsumsi makanan) terhadap emisi karbon. Minimnya kesadaran ini membuat perubahan perilaku menuju gaya hidup rendah karbon sulit terjadi, karena tidak ada alat ukur sederhana yang bisa dipakai orang awam sehari-hari.
 
### Profil Target Pengguna
- Mahasiswa/pekerja muda usia 18–35 tahun yang melek teknologi
- Individu yang peduli isu lingkungan tapi belum tahu cara mengukur dampak pribadinya
- Pengguna yang terbiasa dengan aplikasi tracking (seperti aplikasi fitness/kalori)
### Manfaat Aplikasi
- Membantu pengguna memahami sumber emisi karbon terbesar dari aktivitas hariannya
- Mendorong perubahan kebiasaan kecil (misal pilih transportasi umum) lewat data konkret
- Memberi gambaran progres jangka panjang lewat visualisasi skor/tren
### Daftar Fitur Inti
- [ ] Input aktivitas harian (transportasi, listrik, makanan) via form sederhana
- [ ] Kalkulasi estimasi emisi karbon berdasarkan faktor emisi standar
- [ ] Dashboard visualisasi (grafik harian/mingguan/bulanan)
- [ ] Skor/rating jejak karbon harian (rendah/sedang/tinggi)
- [ ] Riwayat aktivitas yang bisa dilihat kembali
### Fitur yang Tidak Dikerjakan
- Integrasi otomatis dengan GPS/sensor kendaraan
- Perbandingan data dengan pengguna lain (leaderboard/sosial)
- Rekomendasi AI yang dipersonalisasi secara kompleks
- Integrasi pembayaran carbon offset
### Kriteria Aplikasi Dinyatakan Berhasil
- Pengguna dapat menginput data aktivitas dan melihat hasil estimasi emisi dengan benar
- Visualisasi data tampil sesuai input tanpa error
- Sistem dapat menyimpan dan menampilkan riwayat data minimal 30 hari
- Diuji ke minimal 5–10 pengguna dan mereka bisa menggunakan tanpa kebingungan
---
 
## 2. Aplikasi Manajemen Tanaman/Kebun Rumahan
 
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
---
 
## 3. Chatbot Edukasi Kabut Asap
 
Chatbot sederhana (rule-based) yang menjawab pertanyaan warga soal status kabut asap, tips kesehatan, dan info darurat — diintegrasikan ke WhatsApp/Telegram.
 
### Deskripsi Masalah
Saat kabut asap lintas batas terjadi, masyarakat sering kesulitan mendapat informasi cepat dan mudah dipahami soal status kualitas udara, tips kesehatan, dan langkah darurat — terutama masyarakat awam dengan literasi digital terbatas yang tidak terbiasa mengakses dashboard/website kompleks.
 
### Profil Target Pengguna
- Masyarakat umum di daerah rawan kabut asap (Sumatra, Kalimantan, dan sekitarnya)
- Kelompok rentan (lansia, orang tua dengan anak kecil, penderita ISPA/asma)
- Pengguna yang lebih familiar dengan aplikasi chat (WhatsApp/Telegram) dibanding aplikasi/web baru
### Manfaat Aplikasi
- Memberi akses cepat ke informasi status kabut asap dan kualitas udara tanpa perlu install aplikasi baru
- Edukasi langkah pencegahan dan penanganan dampak kesehatan akibat asap
- Menjangkau masyarakat awam lewat platform yang sudah mereka pakai sehari-hari
### Daftar Fitur Inti
- [ ] Menjawab pertanyaan umum seputar kabut asap (rule-based/skenario tanya-jawab)
- [ ] Informasi tips kesehatan (cara pakai masker, kapan harus ke faskes, dll.)
- [ ] Info kontak darurat (rumah sakit, posko bantuan)
- [ ] Perintah/command sederhana (misal `/status` untuk cek info kualitas udara terbaru)
- [ ] Menu pilihan cepat (quick reply) agar user tidak perlu mengetik manual
### Fitur yang Tidak Dikerjakan
- Integrasi otomatis real-time ke data AQI/hotspot API (data awal statis/manual update)
- Natural Language Understanding (NLU) kompleks berbasis AI/LLM
- Dukungan multi-bahasa/dialek daerah
- Fitur pelaporan kondisi darurat dua arah (user lapor ke petugas)
### Kriteria Aplikasi Dinyatakan Berhasil
- Chatbot mampu merespons minimal 80% pertanyaan dalam skenario yang sudah disiapkan dengan jawaban relevan
- Bot dapat diakses dan digunakan melalui platform (Telegram/WhatsApp) tanpa error koneksi
- Waktu respons chatbot cepat (di bawah beberapa detik)
- Diuji ke beberapa pengguna dan mereka merasa terbantu memahami informasi dasar
---
 
## Tech Stack Ringkasan
 
| Proyek | Frontend | Backend | Database | Tools Pendukung |
|---|---|---|---|---|
| Jejak Karbon | React/Vue.js + Chart.js | Node.js (Express) / Python (Flask) | MySQL/PostgreSQL / SQLite | Figma, Draw.io, Git, Postman |
| Manajemen Tanaman | Flutter / React Native | Firebase / Node.js + Express | Firestore / MySQL | Figma, Draw.io, Android Studio |
| Chatbot Edukasi | Telegram/WhatsApp Bot | Python (rule-based) | JSON / SQLite | Telegram BotFather, Draw.io, Postman |
 
## Metodologi Pengembangan
 
Ketiga proyek dikembangkan menggunakan pendekatan **Agile/Scrum sederhana**, dengan tahapan:
 
1. **Requirement Analysis** — menyusun SRS (Software Requirement Specification)
2. **Design** — Use Case Diagram, ERD, Activity Diagram
3. **Implementation** — pengembangan fitur per sprint
4. **Testing** — pengujian fungsional (black-box testing)
5. **Deployment & Evaluation** — evaluasi berdasarkan kriteria keberhasilan masing-masing proyek
---
 
## Kontributor
 
- theoyussyl
## Lisensi
 
Proyek ini dibuat untuk keperluan tugas mata kuliah Rekayasa Perangkat Lunak.
