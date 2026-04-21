# 🚀 HUBEKS HIMSI
**Sistem Manajemen Hubungan Eksternal HIMSI**

---

## 📌 Deskripsi
HUBEKS HIMSI adalah sistem berbasis web yang dirancang untuk membantu pengurus HIMSI (khususnya divisi Hubungan Eksternal) dalam mengelola data anggota dan mitra kerja sama secara terpusat, aman, dan efisien.

Sistem ini menggantikan proses manual seperti spreadsheet dan penyimpanan file yang tidak terorganisir menjadi satu platform digital yang rapi dan mudah digunakan.

---

## 🎯 Tujuan
- Memusatkan data anggota dan mitra dalam satu sistem
- Mempermudah pengelolaan kerja sama (MoU)
- Menghindari kehilangan data penting
- Memberikan pengingat otomatis (ulang tahun anggota)

---

## ⚙️ Fitur Utama

### 🔐 Authentication
- Login berbasis Supabase Auth
- Proteksi halaman menggunakan middleware
- Session berbasis HTTP Cookies (SSR)

### 👥 Manajemen Anggota
- Tambah, edit, hapus data anggota
- Menyimpan data penting (nama, divisi, kontak, tanggal lahir)
- Digunakan untuk fitur pengingat ulang tahun

### 🤝 Manajemen Media Partner
- CRUD data mitra
- Menyimpan informasi kerja sama
- Upload & akses dokumen MoU

### 🎂 Birthday Reminder
- Deteksi otomatis anggota yang ulang tahun
- Ditampilkan di dashboard

### 📊 Dashboard
- Ringkasan data anggota & mitra
- Highlight ulang tahun hari ini
- Tampilan clean dan informatif

---

## 🧭 Alur Penggunaan

1. User membuka website
2. Login menggunakan akun yang terdaftar
3. Masuk ke Dashboard
4. Mengelola data:
   - Anggota → tambah/edit data
   - Mitra → tambah + upload MoU
5. Sistem otomatis menampilkan reminder ulang tahun

---

## 🏗️ Arsitektur Sistem

### Frontend
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS

### Backend (BaaS)
- Supabase
  - Database (PostgreSQL)
  - Authentication
  - Storage (MoU files)

### Middleware
- Route protection menggunakan `@supabase/ssr`
- Validasi user dengan `getUser()`

---

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|----------|--------|
| Next.js 14 | Framework utama |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Supabase | Backend (DB, Auth, Storage) |

---

## 🗄️ Struktur Database

### `members`
- name
- division
- birth_date
- contact

### `media_partners`
- name
- type
- contact_person
- status
- mou_url

### Storage
- Bucket: `mou-files`
- Menyimpan file MoU (PDF/JPG/PNG)

---

## 🔐 Keamanan
- Row Level Security (RLS) pada database
- Protected routes via middleware
- Auth berbasis Supabase session

---

## 🌟 Keunggulan
- UI clean & modern
- Real case (digunakan organisasi)
- Data-driven system
- Automation (birthday reminder)
- Production-ready architecture

---

## 🚀 Pengembangan Selanjutnya
- Email otomatis untuk ulang tahun
- Analytics dashboard
- Role-based access (Admin / Viewer)
- Notifikasi real-time

---

## 👨‍💻 Author
Eriel Budiman  
Mahasiswa Sistem Informasi – UIN Raden Fatah Palembang