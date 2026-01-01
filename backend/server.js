const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './server.env' }); // Mengambil konfigurasi dari server.env

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Konfigurasi Koneksi MySQL menggunakan variabel dari server.env
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'company_db'
});

// Cek Koneksi Database
db.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
        return;
    }
    console.log(`Terhubung ke database MySQL: ${process.env.DB_NAME || 'company_db'}`);
});

// --- HELPER VALIDATION ---
const validateEmployee = (data) => {
    const { Name, Position, Salary, DepartmentID } = data;
    if (!Name || Name.trim().length === 0) return "Nama tidak boleh kosong.";
    if (!Position || Position.trim().length === 0) return "Jabatan tidak boleh kosong.";
    if (Salary === undefined || Salary === null || isNaN(parseFloat(Salary))) return "Gaji harus berupa angka.";
    if (parseFloat(Salary) <= 0) return "Gaji harus lebih besar dari 0.";
    if (!DepartmentID) return "Departemen wajib dipilih.";
    return null;
};

/**
 * Root Route
 */
app.get('/', (req, res) => {
    res.json({
        message: "Selamat datang di API Manajemen Karyawan (Relasi Departments)",
        status: "Server Aktif",
        endpoints: {
            tampilkanSemua: "GET /api/employees",
            tampilkanDepartemen: "GET /api/departments",
            tampilkanBerdasarkanID: "GET /api/employees/:id"
        }
    });
});

// --- REST API ENDPOINTS ---

/**
 * 0. GET /api/departments
 * Mengambil daftar semua departemen untuk dropdown di frontend
 */
app.get('/api/departments', (req, res) => {
    const query = 'SELECT * FROM Departments ORDER BY DepartmentName ASC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err.message);
            return res.status(500).json({ status: 'Error', message: 'Gagal mengambil data departemen.' });
        }
        res.json(results);
    });
});

/**
 * 1. GET /api/employees
 * Mengambil daftar karyawan dengan JOIN ke tabel Departments
 */
app.get('/api/employees', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';
    let offset = (page - 1) * limit;

    let countSql = 'SELECT COUNT(*) as total FROM Employees WHERE Name LIKE ?';
    let searchParam = `%${search}%`;

    db.query(countSql, [searchParam], (err, countResult) => {
        if (err) {
            console.error('Error counting employees:', err.message);
            return res.status(500).json({ status: 'Error', message: 'Gagal menghitung data.' });
        }

        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // Update SQL dengan LEFT JOIN untuk mendapatkan nama departemen
        let dataSql = `
            SELECT e.*, d.DepartmentName 
            FROM Employees e 
            LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID 
            WHERE e.Name LIKE ? 
            ORDER BY e.CreatedAt DESC 
            LIMIT ? OFFSET ?
        `;

        db.query(dataSql, [searchParam, limit, offset], (err, results) => {
            if (err) {
                console.error('Error GET All with JOIN:', err.message);
                return res.status(500).json({ status: 'Error', message: 'Gagal mengambil data.' });
            }

            res.json({
                data: results,
                pagination: { totalItems, totalPages, currentPage: page, limit }
            });
        });
    });
});

/**
 * 2. GET /api/employees/:id
 */
app.get('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT e.*, d.DepartmentName 
        FROM Employees e 
        LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID 
        WHERE e.EmployeeID = ?
    `;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ status: 'Error', message: 'Database error.' });
        if (result.length === 0) return res.status(404).json({ message: 'Karyawan tidak ditemukan.' });
        res.json(result[0]);
    });
});

/**
 * 3. POST /api/employees
 * Menyertakan DepartmentID dalam input data baru
 */
app.post('/api/employees', (req, res) => {
    const error = validateEmployee(req.body);
    if (error) return res.status(400).json({ status: 'Validation Error', message: error });

    const { Name, Position, Salary, DepartmentID } = req.body;
    const sql = 'INSERT INTO Employees (Name, Position, Salary, DepartmentID) VALUES (?, ?, ?, ?)';
    db.query(sql, [Name, Position, Salary, DepartmentID], (err, result) => {
        if (err) {
            console.error('Error POST:', err.message);
            return res.status(500).json({ status: 'Error', message: 'Gagal menyimpan ke database.' });
        }
        res.status(201).json({ message: 'Data karyawan berhasil ditambahkan.', id: result.insertId });
    });
});

/**
 * 4. PUT /api/employees/:id
 * Memperbarui DepartmentID
 */
app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const error = validateEmployee(req.body);
    if (error) return res.status(400).json({ status: 'Validation Error', message: error });

    const { Name, Position, Salary, DepartmentID } = req.body;
    const sql = 'UPDATE Employees SET Name = ?, Position = ?, Salary = ?, DepartmentID = ? WHERE EmployeeID = ?';
    db.query(sql, [Name, Position, Salary, DepartmentID, id], (err, result) => {
        if (err) return res.status(500).json({ status: 'Error', message: 'Gagal memperbarui database.' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Karyawan tidak ditemukan.' });
        res.json({ message: 'Data karyawan berhasil diperbarui.' });
    });
});

/**
 * 5. DELETE /api/employees/:id
 */
app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Employees WHERE EmployeeID = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus data.' });
        res.json({ message: 'Karyawan berhasil dihapus.' });
    });
});

// Menjalankan Server
app.listen(port, () => {
    console.log(`Server REST API berjalan di http://localhost:${port}`);
});