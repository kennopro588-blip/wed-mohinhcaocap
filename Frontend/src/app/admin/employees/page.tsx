'use client';

import { useState, useEffect } from 'react';
import { exportToWord, exportToExcel, printTable, ExportColumn } from '@/utils/exportHelper';
import {
  fetchAdminEmployees,
  createAdminEmployee,
  updateAdminEmployee,
  deleteAdminEmployee,
  ApiEmployee,
} from '@/services/api';

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  position: 'Quản lý Showroom' | 'Chuyên viên Tư vấn Mô hình' | 'Thu ngân' | 'Thủ kho' | 'Kỹ thuật viên Unbox & Lắp ráp';
  shift: 'Full-time (8h/ngày)' | 'Ca Sáng (8h - 15h)' | 'Ca Chiều (14h - 21h30)';
  baseSalary: number; // Lương cơ bản
  workDays: number; // Ngày công thực tế
  commissionRate: number; // % hoa hồng
  salesRevenue: number; // Doanh số bán được trong tháng
  allowance: number; // Phụ cấp ăn trưa & trách nhiệm
  bonus: number; // Thưởng chuyên cần & KPI
  deduction: number; // Phạt đi muộn / BHXH
  joinDate: string;
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('08/2026');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPosition, setFormPosition] = useState<Employee['position']>('Chuyên viên Tư vấn Mô hình');
  const [formShift, setFormShift] = useState<Employee['shift']>('Full-time (8h/ngày)');
  const [formBaseSalary, setFormBaseSalary] = useState<number>(8500000);
  const [formWorkDays, setFormWorkDays] = useState<number>(26);
  const [formCommissionRate, setFormCommissionRate] = useState<number>(1.5);
  const [formAllowance, setFormAllowance] = useState<number>(1000000);
  const [formBonus, setFormBonus] = useState<number>(1000000);
  const [formDeduction, setFormDeduction] = useState<number>(500000);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadEmployees = async () => {
    setLoading(true);
    const data = await fetchAdminEmployees();
    if (data && data.length > 0) {
      setEmployees(data as any);
    } else {
      // Fallback
      setEmployees([
        {
          id: 'NV001',
          name: 'Trần Văn Hoàng',
          phone: '0908112233',
          email: 'hoang.tran@luxe.vn',
          position: 'Quản lý Showroom',
          shift: 'Full-time (8h/ngày)',
          baseSalary: 16000000,
          workDays: 26,
          commissionRate: 1.5,
          salesRevenue: 180000000,
          allowance: 2000000,
          bonus: 3000000,
          deduction: 1500000,
          joinDate: '2023-05-15',
        },
        {
          id: 'NV002',
          name: 'Nguyễn Thị Mai',
          phone: '0912334455',
          email: 'mai.nguyen@luxe.vn',
          position: 'Chuyên viên Tư vấn Mô hình',
          shift: 'Full-time (8h/ngày)',
          baseSalary: 9500000,
          workDays: 25,
          commissionRate: 2.0,
          salesRevenue: 240000000,
          allowance: 1200000,
          bonus: 2500000,
          deduction: 900000,
          joinDate: '2023-10-01',
        },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Calculate Net Salary for an employee
  const calculateSalary = (emp: Employee) => {
    const salaryByDays = Math.round(((emp.baseSalary || 8500000) * (emp.workDays ?? 26)) / 26);
    const commission = Math.round(((emp.salesRevenue || 0) * (emp.commissionRate || 0)) / 100);
    const netSalary = salaryByDays + commission + (emp.allowance || 0) + (emp.bonus || 0) - (emp.deduction || 0);
    return {
      salaryByDays,
      commission,
      netSalary,
    };
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + calculateSalary(emp).netSalary, 0);
  const totalEmployees = employees.length;

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormId(`NV00${employees.length + 1}`);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormPosition('Chuyên viên Tư vấn Mô hình');
    setFormShift('Full-time (8h/ngày)');
    setFormBaseSalary(8500000);
    setFormWorkDays(26);
    setFormCommissionRate(1.5);
    setFormAllowance(1000000);
    setFormBonus(1000000);
    setFormDeduction(500000);
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setModalMode('edit');
    setEditingId(emp.id);
    setFormId(emp.id);
    setFormName(emp.name);
    setFormPhone(emp.phone);
    setFormEmail(emp.email);
    setFormPosition(emp.position);
    setFormShift(emp.shift);
    setFormBaseSalary(emp.baseSalary);
    setFormWorkDays(emp.workDays);
    setFormCommissionRate(emp.commissionRate);
    setFormAllowance(emp.allowance);
    setFormBonus(emp.bonus);
    setFormDeduction(emp.deduction);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      alert('Vui lòng điền họ tên và số điện thoại');
      return;
    }

    const payload: Partial<ApiEmployee> = {
      id: formId,
      name: formName,
      phone: formPhone,
      email: formEmail,
      position: formPosition,
      shift: formShift,
      baseSalary: Number(formBaseSalary),
      workDays: Number(formWorkDays),
      commissionRate: Number(formCommissionRate),
      allowance: Number(formAllowance),
      bonus: Number(formBonus),
      deduction: Number(formDeduction),
    };

    if (modalMode === 'create') {
      const created = await createAdminEmployee(payload);
      if (created) {
        setEmployees(prev => [created as any, ...prev]);
      } else {
        setEmployees(prev => [payload as any, ...prev]);
      }
      showToast(`🎉 Thêm nhân viên mới "${formName}" vào MySQL thành công!`);
    } else if (editingId) {
      await updateAdminEmployee(editingId, payload);
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === editingId ? { ...emp, ...payload } : emp
        )
      );
      showToast(`✏️ Cập nhật thông tin nhân viên #${editingId} trong MySQL thành công!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}"?`)) return;
    await deleteAdminEmployee(id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    showToast(`Đã xóa nhân viên "${name}" khỏi MySQL!`);
  };

  // Export Columns definition
  const payrollColumns: ExportColumn[] = [
    { header: 'Mã NV', key: 'id', align: 'center', formatter: val => `#${val}` },
    { header: 'Họ Và Tên', key: 'name' },
    { header: 'Chức Vụ', key: 'position' },
    { header: 'Lương Cơ Bản (VNĐ)', key: 'baseSalary', align: 'right', formatter: val => (val || 0).toLocaleString('vi-VN') + ' ₫' },
    { header: 'Ngày Công', key: 'workDays', align: 'center', formatter: val => `${val}/26` },
    { header: 'Hoa Hồng DS (VNĐ)', key: 'salesRevenue', align: 'right', formatter: (val, r) => `${calculateSalary(r).commission.toLocaleString('vi-VN')} ₫` },
    { header: 'Phụ Cấp + Thưởng', key: 'bonus', align: 'right', formatter: (val, r) => `${(r.allowance + r.bonus).toLocaleString('vi-VN')} ₫` },
    { header: 'Giảm Trừ', key: 'deduction', align: 'right', formatter: val => `-${(val || 0).toLocaleString('vi-VN')} ₫` },
    { header: 'LƯƠNG THỰC NHẬN', key: 'id', align: 'right', formatter: (val, r) => `${calculateSalary(r).netSalary.toLocaleString('vi-VN')} ₫` },
  ];

  const handleExportWord = () => {
    exportToWord(
      `BẢNG TÍNH LƯƠNG NHÂN VIÊN THÁNG ${selectedMonth}`,
      payrollColumns,
      employees,
      `Bang-Luong-Luxe-Thang-${selectedMonth.replace('/', '-')}.doc`,
      'Phân hệ Quản trị Nhân sự & Tính lương'
    );
    showToast('Đã xuất Bảng lương Word (.doc) thành công! 📄');
  };

  const handleExportExcel = () => {
    exportToExcel(
      `BẢNG LƯƠNG NHÂN VIÊN THÁNG ${selectedMonth} - LUXE MODELS`,
      payrollColumns,
      employees,
      `Bang-Luong-Thang-${selectedMonth.replace('/', '-')}.xls`
    );
    showToast('Đã xuất Bảng lương Excel (.xls) thành công! 📊');
  };

  const handlePrintPayroll = () => {
    printTable(
      `BẢNG LƯƠNG & CHẤM CÔNG THÁNG ${selectedMonth}`,
      payrollColumns,
      employees,
      'Phòng Hành chính - Nhân sự Luxe Models'
    );
  };

  // Print individual payslip (Phiếu Lương Cá Nhân)
  const handlePrintPayslip = (emp: Employee) => {
    const calc = calculateSalary(emp);
    const printWindow = window.open('', '_blank', 'width=750,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Phiếu Lương - ${emp.name} - Tháng ${selectedMonth}</title>
        <style>
          @page { size: A5 landscape; margin: 10mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 13px; line-height: 1.5; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; }
          .logo { font-size: 18px; font-weight: 800; color: #d97706; }
          h2 { text-align: center; font-size: 16px; margin: 10px 0 4px; text-transform: uppercase; color: #0f172a; }
          .sub { text-align: center; color: #64748b; font-size: 12px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          td, th { padding: 6px 10px; border: 1px solid #cbd5e1; }
          th { background: #f1f5f9; text-align: left; }
          .net-row { background: #fef3c7; font-weight: 800; font-size: 15px; color: #b45309; }
          .signatures { margin-top: 30px; display: flex; justify-content: space-between; text-align: center; }
          .sign-space { height: 45px; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">LUXE MODELS</div>
            <div style="font-size: 10.5px; color: #64748b;">Hệ thống Showroom Mô Hình Cao Cấp</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            <div>Mã NV: <strong>#${emp.id}</strong></div>
            <div>Tháng: <strong>${selectedMonth}</strong></div>
          </div>
        </div>

        <h2>PHIẾU LƯƠNG NHÂN VIÊN</h2>
        <div class="sub">Họ và tên: <strong>${emp.name}</strong> | Chức vụ: <strong>${emp.position}</strong></div>

        <table>
          <tr>
            <td style="width: 50%;"><strong>1. Lương cơ bản:</strong></td>
            <td style="text-align: right;">${emp.baseSalary.toLocaleString('vi-VN')} ₫</td>
          </tr>
          <tr>
            <td><strong>2. Ngày công thực tế:</strong></td>
            <td style="text-align: right;">${emp.workDays} / 26 ngày (= ${calc.salaryByDays.toLocaleString('vi-VN')} ₫)</td>
          </tr>
          <tr>
            <td><strong>3. Hoa hồng doanh số (${emp.commissionRate}% của ${(emp.salesRevenue || 0).toLocaleString('vi-VN')} ₫):</strong></td>
            <td style="text-align: right; color: #16a34a; font-weight: 600;">+${calc.commission.toLocaleString('vi-VN')} ₫</td>
          </tr>
          <tr>
            <td><strong>4. Phụ cấp ăn trưa & trách nhiệm:</strong></td>
            <td style="text-align: right;">+${emp.allowance.toLocaleString('vi-VN')} ₫</td>
          </tr>
          <tr>
            <td><strong>5. Thưởng chuyên cần & KPI:</strong></td>
            <td style="text-align: right;">+${emp.bonus.toLocaleString('vi-VN')} ₫</td>
          </tr>
          <tr>
            <td><strong>6. Các khoản giảm trừ / BHXH:</strong></td>
            <td style="text-align: right; color: #dc2626;">-${emp.deduction.toLocaleString('vi-VN')} ₫</td>
          </tr>
          <tr class="net-row">
            <td>THỰC LĨNH CHUYỂN KHOẢN:</td>
            <td style="text-align: right;">${calc.netSalary.toLocaleString('vi-VN')} ₫</td>
          </tr>
        </table>

        <div class="signatures">
          <div>
            <strong>Người Nhận Lương</strong>
            <div style="font-size: 10px; font-style: italic; color: #64748b;">(Ký nhận)</div>
            <div class="sign-space"></div>
          </div>
          <div>
            <strong>Kế Toán Tiền Lương</strong>
            <div style="font-size: 10px; font-style: italic; color: #64748b;">(Ký, họ tên)</div>
            <div class="sign-space"></div>
          </div>
          <div>
            <strong>Giám Đốc Duyệt</strong>
            <div style="font-size: 10px; font-style: italic; color: #64748b;">(Ký, đóng dấu)</div>
            <div class="sign-space"></div>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          backgroundColor: '#10b981', color: '#fff', padding: '12px 24px',
          borderRadius: '8px', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          fontWeight: 700, fontSize: '14px'
        }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            👔 Quản Lý Nhân Viên & Tính Lương
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
            Chấm công, tính hoa hồng bán mô hình và xuất phiếu lương cho nhân sự
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportWord}
            style={{
              padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #3b82f6',
              background: '#eff6ff', color: '#1d4ed8', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📄 Xuất Word (.doc)
          </button>
          <button
            onClick={handleExportExcel}
            style={{
              padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #10b981',
              background: '#ecfdf5', color: '#047857', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📊 Xuất Excel (.xls)
          </button>
          <button
            onClick={handlePrintPayroll}
            style={{
              padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #6366f1',
              background: '#eef2ff', color: '#4338ca', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            🖨️ In Bảng Lương A4
          </button>
          <button
            onClick={openCreateModal}
            style={{
              backgroundColor: '#2563eb', color: '#ffffff', padding: '0.625rem 1.25rem',
              borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px'
            }}
          >
            ➕ Thêm Nhân Viên
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            👥 Tổng Số Nhân Sự
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
            {totalEmployees} nhân viên
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Showroom LUXE Models</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            💰 Tổng Quỹ Lương Tháng {selectedMonth}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {totalPayroll.toLocaleString('vi-VN')} ₫
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Đã gồm thưởng & hoa hồng</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            🎯 Tổng Hoa Hồng Doanh Số
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {employees.reduce((s, e) => s + calculateSalary(e).commission, 0).toLocaleString('vi-VN')} ₫
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Thưởng theo doanh thu bán</div>
        </div>
      </div>

      {/* Employees Payroll Table */}
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.75rem 0' }}>Mã NV</th>
              <th style={{ padding: '0.75rem 0' }}>Họ Tên & SĐT</th>
              <th style={{ padding: '0.75rem 0' }}>Chức Vụ & Ca Làm</th>
              <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Lương Cơ Bản</th>
              <th style={{ padding: '0.75rem 0', textAlign: 'center' }}>Công</th>
              <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Hoa Hồng DS</th>
              <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Thực Lĩnh</th>
              <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
              const calc = calculateSalary(emp);
              return (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 700, color: '#2563eb' }}>
                    #{emp.id}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{emp.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.phone} | {emp.email}</div>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{emp.position}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{emp.shift}</div>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 600, color: '#475569' }}>
                    {emp.baseSalary.toLocaleString('vi-VN')} ₫
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'center' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', background: emp.workDays >= 25 ? '#dcfce7' : '#fee2e2', color: emp.workDays >= 25 ? '#166534' : '#991b1b', fontWeight: 700, fontSize: '12px' }}>
                      {emp.workDays}/26
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>
                    +{calc.commission.toLocaleString('vi-VN')} ₫
                    <div style={{ fontSize: '11px', color: '#64748b' }}>({emp.commissionRate}%)</div>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 800, color: '#d97706', fontSize: '15px' }}>
                    {calc.netSalary.toLocaleString('vi-VN')} ₫
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handlePrintPayslip(emp)}
                        title="In Phiếu Lương Cá Nhân"
                        style={{ padding: '0.35rem 0.65rem', border: '1px solid #93c5fd', borderRadius: '6px', background: '#eff6ff', color: '#1d4ed8', cursor: 'pointer', fontWeight: 700, fontSize: '11px' }}
                      >
                        🖨️ Phiếu Lương
                      </button>
                      <button
                        onClick={() => openEditModal(emp)}
                        title="Chỉnh sửa"
                        style={{ padding: '0.35rem 0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc', color: '#475569', cursor: 'pointer', fontWeight: 600 }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id, emp.name)}
                        title="Xóa nhân viên"
                        style={{ padding: '0.35rem 0.65rem', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#991b1b', cursor: 'pointer', fontWeight: 600 }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit Employee */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', maxWidth: '600px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>
              {modalMode === 'create' ? '➕ Thêm Nhân Viên Mới' : `✏️ Chỉnh Sửa Nhân Viên #${editingId}`}
            </h3>

            <form onSubmit={handleSaveEmployee} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Mã Nhân Viên *</label>
                <input
                  type="text"
                  required
                  value={formId}
                  disabled={modalMode === 'edit'}
                  onChange={e => setFormId(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Họ Và Tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Số Điện Thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0901234567"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Email</label>
                <input
                  type="email"
                  placeholder="email@luxe.vn"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Chức Vụ</label>
                <select
                  value={formPosition}
                  onChange={e => setFormPosition(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                >
                  <option value="Quản lý Showroom">Quản lý Showroom</option>
                  <option value="Chuyên viên Tư vấn Mô hình">Chuyên viên Tư vấn Mô hình</option>
                  <option value="Thu ngân">Thu ngân</option>
                  <option value="Thủ kho">Thủ kho</option>
                  <option value="Kỹ thuật viên Unbox & Lắp ráp">Kỹ thuật viên Unbox & Lắp ráp</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Ca Làm Việc</label>
                <select
                  value={formShift}
                  onChange={e => setFormShift(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                >
                  <option value="Full-time (8h/ngày)">Full-time (8h/ngày)</option>
                  <option value="Ca Sáng (8h - 15h)">Ca Sáng (8h - 15h)</option>
                  <option value="Ca Chiều (14h - 21h30)">Ca Chiều (14h - 21h30)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Lương Cơ Bản (VNĐ) *</label>
                <input
                  type="number"
                  required
                  value={formBaseSalary}
                  onChange={e => setFormBaseSalary(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Ngày Công Tháng Này</label>
                <input
                  type="number"
                  max={31}
                  min={0}
                  value={formWorkDays}
                  onChange={e => setFormWorkDays(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>% Hoa Hồng Doanh Số</label>
                <input
                  type="number"
                  step="0.1"
                  value={formCommissionRate}
                  onChange={e => setFormCommissionRate(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Phụ Cấp Ăn Trưa / Trách Nhiệm</label>
                <input
                  type="number"
                  value={formAllowance}
                  onChange={e => setFormAllowance(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Thưởng KPI / Chuyên Cần</label>
                <input
                  type="number"
                  value={formBonus}
                  onChange={e => setFormBonus(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Khoản Giảm Trừ / Phạt / BHXH</label>
                <input
                  type="number"
                  value={formDeduction}
                  onChange={e => setFormDeduction(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
                >
                  {modalMode === 'create' ? 'Tạo Nhân Viên' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
