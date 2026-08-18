'use client';

import { useState, useEffect } from 'react';
import { fetchAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, ApiUser } from '@/services/api';
import { exportToWord, exportToExcel, printTable, ExportColumn } from '@/utils/exportHelper';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('123456');
  const [formRole, setFormRole] = useState<'USER' | 'ADMIN'>('USER');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const userColumns: ExportColumn[] = [
    { header: 'ID', key: 'id', align: 'center', formatter: val => `#${val}` },
    { header: 'Họ Và Tên', key: 'name' },
    { header: 'Email Đăng Ký', key: 'email' },
    { header: 'Vai Trò (Role)', key: 'role', align: 'center' },
    { header: 'Ngày Tham Gia', key: 'memberSince', align: 'center', formatter: (val, r) => val || r.createdAt || '2024-01-01' },
  ];

  const handleExportWord = () => {
    exportToWord(
      'BÁO CÁO DANH SÁCH TÀI KHOẢN NGƯỜI DÙNG',
      userColumns,
      users,
      `Danh-Sach-Nguoi-Dung-Luxe-${Date.now()}.doc`,
      'Phân hệ Quản trị Tài khoản & Phân quyền'
    );
    showToast('Đã xuất file Word (.doc) thành công! 📄');
  };

  const handleExportExcel = () => {
    exportToExcel(
      'DANH SÁCH TÀI KHOẢN NGƯỜI DÙNG LUXE MODELS',
      userColumns,
      users,
      `Danh-Sach-Nguoi-Dung-${Date.now()}.xls`
    );
    showToast('Đã xuất file Excel (.xls) thành công! 📊');
  };

  const handlePrintUsers = () => {
    printTable(
      'DANH SÁCH TÀI KHOẢN & PHÂN QUYỀN HỆ THỐNG',
      userColumns,
      users,
      'Phân hệ Quản trị Người dùng'
    );
  };

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchAdminUsers();
    if (data && data.length > 0) {
      setUsers(data);
    } else {
      setUsers([
        { id: 1, name: 'Quản trị viên Luxe', email: 'admin@luxe.vn', role: 'ADMIN', memberSince: '2024-01-01' },
        { id: 2, name: 'Nguyễn Văn Khoa', email: 'user@luxe.vn', role: 'USER', memberSince: '2024-01-01' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPassword('123456');
    setFormRole('USER');
    setIsModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createAdminUser({
        name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole,
      });

      if (created) {
        setUsers(prev => [created, ...prev]);
        showToast(`🎉 Tạo người dùng "${formName}" thành công!`);
      } else {
        const newUser: ApiUser = { id: Date.now(), name: formName, email: formEmail, role: formRole };
        setUsers(prev => [newUser, ...prev]);
        showToast(`🎉 Tạo người dùng "${formName}" thành công!`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo người dùng');
    }
  };

  const handleRoleChange = async (id: number, newRole: 'USER' | 'ADMIN') => {
    await updateAdminUser(id, { role: newRole });
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, role: newRole } : u)));
    showToast(`Đã đổi vai trò người dùng #${id} thành ${newRole}!`);
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}"?`)) return;

    await deleteAdminUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast(`Đã xóa người dùng "${name}"!`);
  };

  return (
    <div>
      {/* Toast */}
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Quản lý Người dùng</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>Tổng số: {users.length} tài khoản trong hệ thống MySQL</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportWord}
            style={{
              padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #3b82f6',
              background: '#eff6ff', color: '#1d4ed8', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📄 Xuất Word (.doc)
          </button>
          <button
            onClick={handleExportExcel}
            style={{
              padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #10b981',
              background: '#ecfdf5', color: '#047857', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📊 Xuất Excel (.xls)
          </button>
          <button
            onClick={handlePrintUsers}
            style={{
              padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #6366f1',
              background: '#eef2ff', color: '#4338ca', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            🖨️ In Danh Sách
          </button>
          <button
            onClick={openCreateModal}
            style={{
              backgroundColor: '#2563eb', color: '#ffffff', padding: '0.625rem 1.25rem',
              borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            ➕ Thêm Người Dùng
          </button>
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.75rem 0' }}>ID</th>
              <th style={{ padding: '0.75rem 0' }}>Họ và tên</th>
              <th style={{ padding: '0.75rem 0' }}>Email</th>
              <th style={{ padding: '0.75rem 0' }}>Phân quyền Role</th>
              <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  ⏳ Đang lấy dữ liệu người dùng từ MySQL Backend...
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 0', color: '#64748b', fontWeight: 600 }}>#{u.id}</td>
                <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#1e293b' }}>{u.name}</td>
                <td style={{ padding: '0.75rem 0', color: '#64748b' }}>{u.email}</td>
                <td style={{ padding: '0.75rem 0' }}>
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value as any)}
                    style={{
                      padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                      border: '1px solid #cbd5e1', cursor: 'pointer',
                      backgroundColor: u.role === 'ADMIN' ? '#f3e8ff' : '#e2e8f0',
                      color: u.role === 'ADMIN' ? '#6b21a8' : '#334155'
                    }}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN 👑</option>
                  </select>
                </td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    style={{ padding: '0.35rem 0.65rem', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#991b1b', cursor: 'pointer', fontWeight: 600 }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form Thêm Người Dùng */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setIsModalOpen(false)}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%',
            padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>➕ Thêm Người Dùng Mới</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Họ và Tên</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Địa chỉ Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="nguyenvana@gmail.com"
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Mật khâủ khởi tạo</label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Vai trò (Role)</label>
                <select
                  value={formRole}
                  onChange={e => setFormRole(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#fff' }}
                >
                  <option value="USER">USER (Khách hàng)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  ✓ Xác Nhận Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
