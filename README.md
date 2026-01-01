Manajemen Data Karyawan & Departemen - CRUD

Proyek ini adalah aplikasi manajemen data karyawan yang terintegrasi dengan tabel departemen (Relasi One-to-Many). Dibangun menggunakan Angular (Frontend), Node.js/Express (Backend), dan MySQL (Database).

Aplikasi Kelola Karyawan & Departemen (Fullstack CRUD)

Halo! Dokumentasi ini bakal bantu kamu buat paham cara kerja sistem manajemen karyawan kita. Aplikasi ini sudah keren karena data karyawannya sudah nyambung langsung sama departemen masing-masing. Kita bikin aplikasi ini pakai Angular untuk tampilannya, Node.js/Express untuk otaknya, dan MySQL untuk simpan semua datanya dengan aman!

🚀 Fitur-Fitur Kece

Data Saling Nyambung: Karyawan dan departemen sudah otomatis terhubung. Jadi, nggak perlu ribet lagi deh!

Cari Data Nggak Pakai Lama: Ada fitur cari nama dan pembagian halaman (pagination). Biarpun datanya ribuan, tetap terasa enteng!

Dashboard Statistik Langsung: Kamu bisa lihat total karyawan, total gaji, sampai rata-rata gaji secara real-time. Mantap kan?

Aman & Terjaga: Kita sudah pasang validasi ketat di sisi server, jadi data yang masuk pasti benar dan rapi!

🛠️ Cara Setup Database (MySQL)

Ikuti langkah simpel ini buat bikin database dan tabel-tabelnya di MySQL kamu ya:

CREATE DATABASE IF NOT EXISTS company_db;
USE company_db;

-- 1. Bikin Tabel Departemen
CREATE TABLE Departments (
    DepartmentID INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL
);

-- 2. Bikin Tabel Karyawan
CREATE TABLE Employees (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    Salary DECIMAL(12,2) NOT NULL,
    DepartmentID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

-- 3. Isi Data Awal Departemen Biar Nggak Kosong
INSERT INTO Departments (DepartmentName) VALUES 
('IT Development'), 
('Human Resources'), 
('Finance'), 
('Marketing');


📦 Yuk, Mulai Jalankan!

1. Nyalakan Backend (Node.js)

Masuk dulu ke folder server/.

Jangan lupa cek file server.env, pastikan settingan databasenya sudah pas sama punya kamu ya.

Install dulu bahan-bahannya:

npm install


Jalankan servernya:

npm start


Nanti API-nya bakal aktif di http://localhost:3000 ya!

2. Nyalakan Frontend (Angular)

Sekarang masuk ke folder client/.

Install juga bahan-bahannya di sini:

npm install


Jalankan aplikasinya:

ng serve


Langsung buka browser dan cek di http://localhost:4200 ya!

📄 Daftar Alamat API (Endpoints)

Cara Kerja

Alamat (Endpoint)

Kegunaan

GET

/api/departments

Ambil semua daftar departemen yang ada.

GET

/api/employees

Lihat semua karyawan (bisa cari & ganti halaman juga).

POST

/api/employees

Tambah karyawan baru ke sistem.

PUT

/api/employees/:id

Edit data karyawan pakai ID mereka.

DELETE

/api/employees/:id

Hapus data karyawan dari sistem.

📁 Struktur Folder Kita

manajemen-karyawan/
├── client/ (Angular)
│   ├── src/app/app.ts       # Logika & Tampilan Utama
│   └── index.html           # Halaman Depan
├── server/ (Node.js)
│   ├── server.js            # Otak Backend
│   └── server.env           # Settingan Rahasia
└── README.md                # Catatan ini



📝 Catatan Teknis

Link Database : https://drive.google.com/file/d/1qdoeXbwPyyDK3Xr16TeQ1pyx428WjoWJ/view?usp=sharing
CORS: Diaktifkan di backend untuk mengizinkan komunikasi antar port (4200 ke 3000).
Validation: Backend akan menolak permintaan jika data Name, Position, Salary, atau DepartmentID tidak valid atau kosong.

Author : M. Faisal
