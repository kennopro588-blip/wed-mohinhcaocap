'use client';

import { useState, useEffect } from 'react';
import { fetchAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory, ApiCategory } from '@/services/api';
import { categories as fallbackCategories } from '@/data/categories';
import { exportToWord, exportToExcel, printTable, ExportColumn } from '@/utils/exportHelper';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formGradient, setFormGradient] = useState('linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categoryColumns: ExportColumn[] = [
    { header: 'Mã ID', key: 'id', align: 'center', formatter: val => `#${val}` },
    { header: 'Tên Danh Mục', key: 'name' },
    { header: 'Slug URL', key: 'slug' },
    { header: 'Mô Tả Danh Mục', key: 'description' },
    { header: 'Số Sản Phẩm', key: 'itemCount', align: 'center', formatter: val => `${val || 0} SP` },
  ];

  const handleExportWord = () => {
    exportToWord(
      'BÁO CÁO DANH SÁCH DANH MỤC SẢN PHẨM',
      categoryColumns,
      categories,
      `Danh-Sach-Danh-Muc-Luxe-${Date.now()}.doc`,
      'Phân hệ Quản lý Danh mục & Phân loại'
    );
    showToast('Đã xuất file Word (.doc) thành công! 📄');
  };

  const handleExportExcel = () => {
    exportToExcel(
      'DANH SÁCH DANH MỤC LUXE MODELS',
      categoryColumns,
      categories,
      `Danh-Sach-Danh-Muc-${Date.now()}.xls`
    );
    showToast('Đã xuất file Excel (.xls) thành công! 📊');
  };

  const handlePrintCategories = () => {
    printTable(
      'DANH SÁCH DANH MỤC SẢN PHẨM MÔ HÌNH',
      categoryColumns,
      categories,
      'Phân hệ Quản trị Danh mục'
    );
  };

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchAdminCategories();
    if (data && data.length > 0) {
      setCategories(data);
    } else {
      setCategories(fallbackCategories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        itemCount: c.itemCount,
        gradient: c.gradient,
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormId('');
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormGradient('linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ApiCategory) => {
    setEditingCategory(cat);
    setFormId(cat.id);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || '');
    setFormGradient(cat.gradient || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formName || !formSlug) {
      alert('Vui lòng điền mã ID, tên và slug danh mục');
      return;
    }

    const payload: Partial<ApiCategory> = {
      id: formId.trim().toLowerCase(),
      name: formName,
      slug: formSlug.trim().toLowerCase(),
      description: formDescription,
      gradient: formGradient,
    };

    if (editingCategory) {
      const updated = await updateAdminCategory(editingCategory.id, payload);
      setCategories(prev => prev.map(c => (c.id === editingCategory.id ? { ...c, ...payload } : c)));
      showToast(`🎉 Đã cập nhật danh mục "${formName}" thành công!`);
    } else {
      const created = await createAdminCategory(payload);
      if (created) {
        setCategories(prev => [created, ...prev]);
      } else {
        setCategories(prev => [{ ...payload, itemCount: 0 } as ApiCategory, ...prev]);
      }
      showToast(`🎉 Đã tạo danh mục mới "${formName}" thành công!`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) return;

    await deleteAdminCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast(`Đã xóa danh mục "${name}"!`);
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Quản lý Danh mục Sản phẩm</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>Tổng số: {categories.length} danh mục trong hệ thống MySQL</p>
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
            onClick={handlePrintCategories}
            style={{
              padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #6366f1',
              background: '#eef2ff', color: '#4338ca', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            🖨️ In Danh Mục
          </button>
          <button
            onClick={openCreateModal}
            style={{
              backgroundColor: '#2563eb', color: '#ffffff', padding: '0.625rem 1.25rem',
              borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            ➕ Thêm Danh Mục Mới
          </button>
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.75rem 0' }}>Mã ID</th>
              <th style={{ padding: '0.75rem 0' }}>Tên Danh Mục</th>
              <th style={{ padding: '0.75rem 0' }}>Slug</th>
              <th style={{ padding: '0.75rem 0' }}>Mô tả</th>
              <th style={{ padding: '0.75rem 0' }}>Số SP</th>
              <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  ⏳ Đang nạp danh mục sản phẩm từ MySQL...
                </td>
              </tr>
            ) : categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 0', color: '#2563eb', fontWeight: 700 }}>{c.id}</td>
                <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: c.gradient || '#3b82f6' }} />
                    {c.name}
                  </div>
                </td>
                <td style={{ padding: '0.75rem 0', color: '#64748b' }}>{c.slug}</td>
                <td style={{ padding: '0.75rem 0', color: '#64748b', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.description || 'Chưa có mô tả'}
                </td>
                <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#059669' }}>{c.itemCount || 0}</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                  <button
                    onClick={() => openEditModal(c)}
                    style={{ marginRight: '8px', padding: '0.35rem 0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc', color: '#1e293b', cursor: 'pointer', fontWeight: 600 }}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c.id, c.name)}
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

      {/* Modal Form thêm/sửa danh mục */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setIsModalOpen(false)}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '100%',
            padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingCategory ? '✏️ Chỉnh Sửa Danh Mục' : '➕ Thêm Danh Mục Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Mã ID Danh mục</label>
                  <input
                    type="text"
                    value={formId}
                    onChange={e => {
                      setFormId(e.target.value);
                      if (!editingCategory) setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    placeholder="vd: gundam"
                    disabled={!!editingCategory}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Slug URL</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={e => setFormSlug(e.target.value)}
                    placeholder="vd: gundam"
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tên Danh Mục</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Mô hình Gundam & Mecha"
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Mô tả chi tiết</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Mô tả về các dòng sản phẩm thuộc danh mục này..."
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>CSS Gradient Banner Card</label>
                <input
                  type="text"
                  value={formGradient}
                  onChange={e => setFormGradient(e.target.value)}
                  placeholder="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
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
                  ✓ {editingCategory ? 'Lưu Cập Nhật' : 'Xác Nhận Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
