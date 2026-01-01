**Manajemen Data Karyawan & Departemen - CRUD**

Proyek ini adalah aplikasi management data karyawan yang terintegrasi dengan tabel departemen (Relasi One-to-Many). Dibangun menggunakan Angular (Frontend), Node.js/Express (Backend), dan MySQL (Database).

🚀 Fitur Utama

Arsitektur Relasional Data: Mengelola keterhubungan dinamis antara entitas karyawan dan departemen melalui skema relasi One-to-Many.

Mekanisme Pencarian dan Navigasi Data: Menyediakan fungsionalitas pencarian nama yang dioptimalkan serta implementasi pagination untuk menjamin efisiensi pengambilan data berskala besar.

Panel Dasbor Analitik: Menyajikan ringkasan statistik secara real-time, mencakup akumulasi jumlah personel, total pengeluaran kompensasi, serta nilai rata-rata remunerasi.

Validasi Integritas Data: Memastikan keamanan dan validitas informasi melalui prosedur validasi ketat pada lapisan backend sebelum proses persistensi data dilakukan.

🛠️ Cara Setup Database (MySQL)

**Ikuti langkah simpel ini buat bikin database dan tabel-tabelnya di MySQL kamu ya:**

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


📦 Installasi Backend!

1. Setup Backend (Node.js)

Masuk/buat dulu ke folder backend/.

Jangan lupa cek folder backend pada file .env, pastikan settingan databasenya sesuai dengan mysql nya.

Install setup backend node express js:

npm install


Jalankan servernya:

npm start


Nanti API-nya bakal aktif di http://localhost:3000

2. Installasi Frontend (Angular)

Sekarang masuk ke folder client/.

Install juga bahan-bahannya di sini:

npm install


Jalankan aplikasinya:

ng serve


Langsung buka browser dan cek di http://localhost:4200

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


📝 Catatan Teknis

Link Database : https://drive.google.com/file/d/1qdoeXbwPyyDK3Xr16TeQ1pyx428WjoWJ/view?usp=sharing
CORS: Diaktifkan di backend untuk mengizinkan komunikasi antar port (4200 ke 3000).
Validation: Backend akan menolak permintaan jika data Name, Position, Salary, atau DepartmentID tidak valid atau kosong.

Author : M. Faisal
