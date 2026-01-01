Manajemen Data Karyawan & Departemen - CRUD

Proyek ini adalah aplikasi manajemen data karyawan yang terintegrasi dengan tabel departemen (Relasi One-to-Many). Dibangun menggunakan Angular (Frontend), Node.js/Express (Backend), dan MySQL (Database).

🚀 Fitur Utama

Manajemen Relasional: Data karyawan terhubung secara dinamis ke tabel departemen.
Pencarian & Pagination: Efisiensi pengambilan data dengan fitur pencarian nama dan pembatasan halaman.
Dashboard Statistik: Ringkasan total karyawan, total gaji, dan rata-rata gaji secara real-time.
Validasi Backend: Keamanan data di sisi server sebelum masuk ke database.

🛠️ Persiapan Database (MySQL)

Jalankan skrip SQL berikut untuk membuat database dan tabel yang diperlukan:
CREATE DATABASE IF NOT EXISTS company_db;
USE company_db;

-- 1. Tabel Departemen
CREATE TABLE Departments (
    DepartmentID INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL
);

-- 2. Tabel Karyawan
CREATE TABLE Employees (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    Salary DECIMAL(12,2) NOT NULL,
    DepartmentID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

-- 3. Data Awal Departemen
INSERT INTO Departments (DepartmentName) VALUES 
('IT Development'), 
('Human Resources'), 
('Finance'), 
('Marketing');


📦 Instalasi dan Menjalankan Proyek

1. Backend (Node.js)

Buka folder server/.

Pastikan file server.env sudah sesuai dengan konfigurasi database Anda.

#Instal dependensi:#
npm install

#Jalankan server:#
npm start

Server akan berjalan di http://localhost:3000

2. Frontend (Angular)

Buka folder client/.

*Instal dependensi:*

npm install


#Jalankan aplikasi:

ng serve


Akses aplikasi di http://localhost:4200

📄 Struktur API (Endpoints)

Method

Endpoint

Deskripsi

GET

/api/departments

Mengambil semua daftar departemen

GET

/api/employees

Mengambil data karyawan (Join, Search, Pagination)

POST

/api/employees

Menambahkan karyawan baru

PUT

/api/employees/:id

Memperbarui data karyawan berdasarkan ID

DELETE

/api/employees/:id

Menghapus data karyawan

📁 Struktur Folder Proyek

manajemen-karyawan/
├── client/ (Angular)
│   ├── src/app/app.ts       # Logika Frontend & UI
│   └── index.html           # File entry point
├── server/ (Node.js)
│   ├── server.js            # Main backend file
│   └── server.env           # Konfigurasi database
└── README.md                # Dokumentasi proyek


📝 Catatan Teknis

Link Database : https://drive.google.com/file/d/1qdoeXbwPyyDK3Xr16TeQ1pyx428WjoWJ/view?usp=sharing
CORS: Diaktifkan di backend untuk mengizinkan komunikasi antar port (4200 ke 3000).
Validation: Backend akan menolak permintaan jika data Name, Position, Salary, atau DepartmentID tidak valid atau kosong.

Author : M. Faisal
