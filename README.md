# ArgoTiket: Sistem Booking Tiket Bus (Tech Test)

ArgoTiket adalah aplikasi web *full-stack* untuk sistem pemesanan tiket bus. Proyek ini dibuat sebagai *technical test* untuk PT Four Best Synergy, mengimplementasikan alur booking lengkap dari pemesanan oleh customer, konfirmasi admin, hingga pengecekan di hari keberangkatan.

Proyek ini dibangun menggunakan **Laravel 10** (backend), **React.js** (frontend dengan Inertia.js), dan **PostgreSQL** (database).

## 🚀 Fitur Utama

- 🔐 **Autentikasi Multi-Role:** Tiga peran berbeda (Admin, Customer, Checker) dengan hak akses terpisah menggunakan Spatie Permissions.
- 👨‍💻 **Panel Admin:**
    -   CRUD lengkap untuk Master Data (Rute, Jadwal, Bus, & Driver).
    -   Halaman **Konfirmasi Pembayaran** untuk memverifikasi bukti transfer dan menyetujui pesanan (mengubah status `confirmed` -> `invoiced`).
    -   Halaman **Pembuatan Surat Jalan** untuk menetapkan bus/driver ke jadwal, yang otomatis mengunci jadwal tersebut dari pemesanan baru (Aturan #8).
    -   **Laporan Pemesanan** dengan rekapitulasi total pendapatan dan daftar semua transaksi.
- 🎟️ **Alur Customer:**
    -   Melihat jadwal yang tersedia (jadwal kedaluwarsa/terkunci otomatis disembunyikan).
    -   Proses *booking* dengan pemilihan kursi (*Seat Map*) interaktif (Aturan #2).
    -   Upload bukti pembayaran menggunakan *dropzone* Kibo UI (Aturan #3).
    -   Melihat riwayat booking dengan status *real-time*.
    -   Mencetak **Invoice** (halaman siap cetak).
- 🕵️‍♂️ **Panel Checker:**
    -   Dasbor khusus yang hanya menampilkan jadwal keberangkatan *hari ini* yang sudah memiliki penumpang.
    -   Fitur **Check-in** penumpang di hari keberangkatan (mengubah status `invoiced` -> `checked_in`).

## 🛠️ Teknologi yang Digunakan

- **Backend**: Laravel 10
- **Frontend**: React.js (dijalankan via Inertia.js)
- **Database**: PostgreSQL
- **Autentikasi**: Laravel Breeze (Scaffolding) & Spatie/laravel-permission
- **Styling**: Tailwind CSS
- **UI Components**: Kibo UI (shadcn/ui), Notiflix (Notifikasi), Phosphor Icons

## 1. Prasyarat (Persiapan Awal)

Pastikan perangkat lunak berikut sudah terinstal di sistem Anda:

- **PHP**: Versi 8.1+
- **Composer**: Manajer paket PHP.
- **Node.js**: Versi LTS (sudah termasuk `npm`).
- **PostgreSQL**: Server database yang sedang berjalan.

## 2. Instalasi & Menjalankan Proyek

Proyek ini adalah aplikasi *monolith* (backend dan frontend dalam satu repositori).

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/luckydxd/ticketing
    cd ticketing
    ```

2.  **Setup Backend (PHP/Laravel):**
    ```bash
    # Instal dependensi PHP
    composer install
    
    # Salin file environment
    cp .env.example .env
    
    # Buka file .env dan atur koneksi PostgreSQL Anda
    # Pastikan DB_DATABASE sudah Anda buat di DBeaver/pgAdmin
    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=ticketing
    DB_USERNAME=[USERNAME_ANDA]
    DB_PASSWORD=[PASSWORD_ANDA]
    
    # Generate kunci aplikasi Laravel
    php artisan key:generate
    
    # (PENTING) Jalankan migrasi dan seeder untuk membuat tabel + akun demo
    php artisan migrate:fresh --seed
    
    # (PENTING) Buat symlink untuk storage (agar bukti upload bisa diakses)
    php artisan storage:link
    ```

3.  **Setup Frontend (Node.js/React):**
    ```bash
    # Instal dependensi Node.js
    npm install
    
    # Instal komponen Kibo UI / shadcn (jika diminta)
    npx shadcn-ui@latest init
    ```

4.  **Menjalankan Aplikasi:**
    Anda perlu menjalankan **dua** perintah di **dua terminal** terpisah:

    -   **Terminal 1 (Backend Laravel):**
        ```bash
        php artisan serve
        ```
    -   **Terminal 2 (Frontend Vite):**
        ```bash
        npm run dev
        ```

5.  Buka browser dan kunjungi `http://127.0.0.1:8000`. Anda akan otomatis diarahkan ke halaman login.

## 👤 Akun Demo

Anda dapat menggunakan akun berikut yang telah dibuat oleh *seeder*:

| Role | Email | Password |
| :--- | :--- | :--- |
| 👨‍💻 **Admin** | `admin@test.com` | `password` |
| 🎟️ **Customer**| `customer@test.com` | `password` |
| 🕵️‍♂️ **Checker** | `checker@test.com` | `password` |

---
