import { Component, OnInit, signal, computed } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Department {
  DepartmentID: number;
  DepartmentName: string;
}

interface Employee {
  EmployeeID?: number;
  Name: string;
  Position: string;
  Salary: number | string;
  DepartmentID: number | null;
  DepartmentName?: string;
  CreatedAt?: string;
}

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div class="max-w-6xl mx-auto">
        
        <!-- Header -->
        <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Management Data Karyawan</h1>
            <p class="text-gray-400 flex items-center gap-2 mt-1">
              <span class="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Terhubung ke Database MySQL (Relasi Departments)
            </p>
          </div>
        </header>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <p class="text-gray-400 text-sm">Total Karyawan</p>
            <h3 class="text-3xl font-bold">{{ pagination().totalItems }}</h3>
          </div>
          <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <p class="text-gray-400 text-sm">Total Pengeluaran Gaji</p>
            <h3 class="text-3xl font-bold text-green-400">Rp {{ totalSalary().toLocaleString() }}</h3>
          </div>
          <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <p class="text-gray-400 text-sm">Rata-rata Gaji</p>
            <h3 class="text-3xl font-bold text-blue-400">Rp {{ avgSalary().toLocaleString() }}</h3>
          </div>
        </div>

        <!-- Toolbar: Search & Add Button -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div class="relative w-full md:w-96">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="onSearchChange()"
              placeholder="Cari nama karyawan..." 
              class="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white cursor-text"
            />
          </div>
          <button 
            (click)="openModal()" 
            style="cursor: pointer;"
            class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer">
            <span>+</span> Tambah Karyawan
          </button>
        </div>

        <!-- Table -->
        <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-750 border-b border-gray-700">
                  <th class="px-6 py-4 text-sm font-semibold text-gray-400">ID</th>
                  <th class="px-6 py-4 text-sm font-semibold text-gray-400">Nama</th>
                  <th class="px-6 py-4 text-sm font-semibold text-gray-400">Departemen</th>
                  <th class="px-6 py-4 text-sm font-semibold text-gray-400">Jabatan</th>
                  <th class="px-6 py-4 text-sm font-semibold text-gray-400">Gaji</th>
                  <th class="px-6 py-4 text-sm font-semibold text-gray-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr *ngFor="let emp of employees(); trackBy: trackByEmp" class="hover:bg-gray-750 transition-colors">
                  <td class="px-6 py-4 text-sm font-mono text-gray-500">#{{ emp.EmployeeID }}</td>
                  <td class="px-6 py-4 font-medium">{{ emp.Name }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-gray-700 rounded text-xs text-blue-300 font-semibold">
                      {{ emp.DepartmentName || 'N/A' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-400">{{ emp.Position }}</td>
                  <td class="px-6 py-4 text-green-400 font-medium">Rp {{ (+emp.Salary).toLocaleString() }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button (click)="editEmployee(emp)" style="cursor: pointer;" class="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all cursor-pointer">Edit</button>
                      <button (click)="deleteEmployee(emp.EmployeeID!)" style="cursor: pointer;" class="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all cursor-pointer">Hapus</button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="employees().length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-gray-500 italic">Data tidak ditemukan...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <p class="text-sm text-gray-400">
            Menampilkan halaman {{ pagination().currentPage }} dari {{ pagination().totalPages }}
          </p>
          <div class="flex gap-2">
            <button 
              [disabled]="pagination().currentPage <= 1"
              (click)="changePage(pagination().currentPage - 1)"
              style="cursor: pointer;"
              class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 enabled:hover:bg-gray-700 transition-all font-semibold cursor-pointer disabled:cursor-not-allowed">
              Sebelumnya
            </button>
            <button 
              [disabled]="pagination().currentPage >= pagination().totalPages"
              (click)="changePage(pagination().currentPage + 1)"
              style="cursor: pointer;"
              class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 enabled:hover:bg-gray-700 transition-all font-semibold cursor-pointer disabled:cursor-not-allowed">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Form -->
      <div *ngIf="isModalOpen" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-gray-800 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-8 transform transition-all scale-100">
          <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
            {{ isEditMode ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru' }}
          </h2>
          
          <!-- Alert Pesan Error Dinamis -->
          <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm flex items-start gap-2 shadow-lg animate-bounce">
            <span class="text-lg">⚠️</span>
            <span class="font-medium">{{ errorMessage }}</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1 font-medium">Nama Lengkap</label>
              <input type="text" [(ngModel)]="currentEmployee.Name" name="name" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white cursor-text" placeholder="Masukkan nama...">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1 font-medium">Departemen</label>
              <select [(ngModel)]="currentEmployee.DepartmentID" name="dept" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white cursor-pointer">
                <option [ngValue]="null" disabled>Pilih Departemen</option>
                <option *ngFor="let dept of departments()" [ngValue]="dept.DepartmentID">
                  {{ dept.DepartmentName }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1 font-medium">Jabatan</label>
              <input type="text" [(ngModel)]="currentEmployee.Position" name="pos" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white cursor-text" placeholder="Masukkan jabatan...">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1 font-medium">Gaji (IDR)</label>
              <input type="number" [(ngModel)]="currentEmployee.Salary" name="sal" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white cursor-text" placeholder="0">
            </div>
          </div>
          <div class="flex gap-3 mt-8">
            <button type="button" (click)="closeModal()" style="cursor: pointer;" class="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all active:scale-95 cursor-pointer">Batal</button>
            <button 
              type="button" 
              (mousedown)="saveEmployee()"
              [disabled]="isSaving"
              style="cursor: pointer;"
              class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all active:bg-blue-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer">
              {{ isSaving ? 'Memproses...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .bg-gray-750 { background-color: #262f3f; }
    
    button {
      cursor: pointer !important;
    }

    button:disabled {
      cursor: not-allowed !important;
    }

    .cursor-pointer { 
      cursor: pointer !important; 
    }
    
    .cursor-text { 
      cursor: text !important; 
    }
  `]
})
export class App implements OnInit {
  private apiUrl = 'http://localhost:3000/api/employees';
  private deptUrl = 'http://localhost:3000/api/departments';
  
  employees = signal<Employee[]>([]);
  departments = signal<Department[]>([]);
  pagination = signal<PaginationInfo>({ totalItems: 0, totalPages: 1, currentPage: 1, limit: 5 });
  searchQuery = '';
  
  isModalOpen = false;
  isEditMode = false;
  isSaving = false;
  errorMessage = '';
  currentEmployee: Employee = { Name: '', Position: '', Salary: 0, DepartmentID: null };

  totalSalary = computed(() => this.employees().reduce((acc, curr) => acc + (+curr.Salary), 0));
  avgSalary = computed(() => this.employees().length ? this.totalSalary() / this.employees().length : 0);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDepartments();
    this.fetchEmployees();
  }

  fetchDepartments() {
    this.http.get<Department[]>(this.deptUrl).subscribe({
      next: (res) => this.departments.set(res),
      error: (err) => console.error('Gagal mengambil data departemen', err)
    });
  }

  fetchEmployees() {
    const params = {
      page: this.pagination().currentPage.toString(),
      limit: this.pagination().limit.toString(),
      search: this.searchQuery
    };

    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: (res) => {
        this.employees.set(res.data);
        this.pagination.set(res.pagination);
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err);
      }
    });
  }

  onSearchChange() {
    this.pagination.update(p => ({ ...p, currentPage: 1 }));
    this.fetchEmployees();
  }

  changePage(newPage: number) {
    this.pagination.update(p => ({ ...p, currentPage: newPage }));
    this.fetchEmployees();
  }

  saveEmployee() {
    if (this.isSaving) return;
    
    this.errorMessage = ''; 
    this.isSaving = true;

    const salaryValue = Number(this.currentEmployee.Salary);

    if (!this.currentEmployee.Name?.trim()) {
      this.errorMessage = 'Nama wajib diisi.';
      this.isSaving = false;
      return;
    }
    if (!this.currentEmployee.DepartmentID) {
      this.errorMessage = 'Harap pilih departemen.';
      this.isSaving = false;
      return;
    }
    if (!this.currentEmployee.Position?.trim()) {
      this.errorMessage = 'Jabatan wajib diisi.';
      this.isSaving = false;
      return;
    }
    if (isNaN(salaryValue) || salaryValue <= 0) {
      this.errorMessage = 'Gaji tidak valid!';
      this.isSaving = false;
      return;
    }

    const payload = {
      ...this.currentEmployee,
      Salary: salaryValue
    };

    const obs = this.isEditMode 
      ? this.http.put(`${this.apiUrl}/${this.currentEmployee.EmployeeID}`, payload)
      : this.http.post(this.apiUrl, payload);

    obs.subscribe({
      next: () => {
        this.fetchEmployees();
        this.closeModal();
        this.isSaving = false;
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err);
        this.isSaving = false;
      }
    });
  }

  deleteEmployee(id: number) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.fetchEmployees(),
        error: (err: HttpErrorResponse) => this.handleError(err)
      });
    }
  }

  private handleError(err: HttpErrorResponse) {
    console.error('Frontend Error:', err);
    let msg = 'Terjadi kesalahan sistem.';
    if (err.status === 0) {
      msg = 'Backend tidak merespons.';
    } else if (err.error?.message) {
      msg = err.error.message;
    }
    this.errorMessage = msg;
    if (!this.isModalOpen) alert(`Peringatan: ${this.errorMessage}`);
  }

  openModal() {
    this.isEditMode = false;
    this.errorMessage = '';
    this.isSaving = false;
    this.currentEmployee = { Name: '', Position: '', Salary: 0, DepartmentID: null }; 
    this.isModalOpen = true;
  }

  editEmployee(emp: Employee) {
    this.isEditMode = true;
    this.errorMessage = '';
    this.isSaving = false;
    this.currentEmployee = { ...emp };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  trackByEmp(index: number, emp: Employee) {
    return emp.EmployeeID;
  }
}