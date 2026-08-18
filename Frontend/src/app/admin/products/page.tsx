'use client';

import { useState, useEffect } from 'react';
import { products as fallbackProducts } from '@/data/products';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  ApiProduct
} from '@/services/api';
import { exportToWord, exportToExcel, printTable, ExportColumn } from '@/utils/exportHelper';

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState<number>(1000000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(1200000);
  const [formCategoryId, setFormCategoryId] = useState('gundam');
  const [formScaleRatio, setFormScaleRatio] = useState('1/100');
  const [formMaterial, setFormMaterial] = useState('ABS / Diecast');
  const [formStockCount, setFormStockCount] = useState<number>(10);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('/images/gundam.png');
  const [imageInputMode, setImageInputMode] = useState<'url' | 'file'>('url');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng ảnh tối đa là 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
        showToast('Đã tải ảnh từ máy tính thành công! 🖼️');
      };
      reader.readAsDataURL(file);
    }
  };

  const productColumns: ExportColumn[] = [
    { header: 'Mã SP', key: 'id', align: 'center', formatter: val => `#${val}` },
    { header: 'Tên Mô Hình', key: 'name' },
    { header: 'Thương Hiệu', key: 'brand' },
    { header: 'Danh Mục', key: 'categoryId', align: 'center' },
    { header: 'Tỷ Lệ', key: 'scaleRatio', align: 'center' },
    { header: 'Chất Liệu', key: 'material' },
    { header: 'Giá Bán (VNĐ)', key: 'price', align: 'right', formatter: val => (val || 0).toLocaleString('vi-VN') + ' ₫' },
    { header: 'Tồn Kho', key: 'stockCount', align: 'center', formatter: (val, r) => `${val ?? (r.inStock ? 5 : 0)} chiếc` },
    { header: 'Trạng Thái', key: 'inStock', align: 'center', formatter: (val, r) => ((val || (r.stockCount > 0)) ? 'Còn hàng' : 'Hết hàng') },
  ];

  const handleExportWord = () => {
    exportToWord(
      'BÁO CÁO DANH SÁCH SẢN PHẨM MÔ HÌNH',
      productColumns,
      productList,
      `Danh-Sach-San-Pham-Luxe-${Date.now()}.doc`,
      'Quản lý Sản phẩm & Danh mục'
    );
    showToast('Đã xuất file Word (.doc) thành công! 📄');
  };

  const handleExportExcel = () => {
    exportToExcel(
      'DANH SÁCH SẢN PHẨM MÔ HÌNH LUXE MODELS',
      productColumns,
      productList,
      `Danh-Sach-San-Pham-${Date.now()}.xls`
    );
    showToast('Đã xuất file Excel (.xls) thành công! 📊');
  };

  const handlePrint = () => {
    printTable(
      'DANH SÁCH SẢN PHẨM MÔ HÌNH CAO CẤP',
      productColumns,
      productList,
      'Phân hệ Quản lý Sản phẩm'
    );
  };

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminProducts();
    if (data && data.length > 0) {
      setProductList(data);
    } else {
      // Fallback if offline
      setProductList(fallbackProducts as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormId('sp_' + Date.now().toString().slice(-4));
    setFormName('');
    setFormBrand('Bandai Spirits');
    setFormPrice(1500000);
    setFormOriginalPrice(1800000);
    setFormCategoryId('gundam');
    setFormScaleRatio('1/100');
    setFormMaterial('ABS / Plastic');
    setFormStockCount(10);
    setFormDescription('Mô hình chính hãng cao cấp');
    setFormImageUrl('/images/gundam.png');
    setImageInputMode('url');
    setIsModalOpen(true);
  };

  const openEditModal = (p: ApiProduct) => {
    setModalMode('edit');
    setEditingId(p.id);
    setFormId(p.id);
    setFormName(p.name || '');
    setFormBrand(p.brand || '');
    setFormPrice(p.price || 0);
    setFormOriginalPrice(p.originalPrice || 0);
    setFormCategoryId(p.categoryId || 'gundam');
    setFormScaleRatio(p.scaleRatio || '1/100');
    setFormMaterial(p.material || '');
    setFormStockCount(p.stockCount || 0);
    setFormDescription(p.description || '');
    setFormImageUrl(p.imageUrl || '/images/gundam.png');
    setImageInputMode('url');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" (Mã: #${id})?`)) return;

    const ok = await deleteAdminProduct(id);
    if (ok) {
      setProductList(prev => prev.filter(p => p.id !== id));
      showToast(`Đã xóa sản phẩm #${id} thành công!`);
    } else {
      setProductList(prev => prev.filter(p => p.id !== id));
      showToast(`Đã xóa sản phẩm #${id}!`);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<ApiProduct> = {
      id: formId,
      name: formName,
      brand: formBrand,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      categoryId: formCategoryId,
      scaleRatio: formScaleRatio,
      material: formMaterial,
      stockCount: Number(formStockCount),
      inStock: Number(formStockCount) > 0,
      description: formDescription,
      imageUrl: formImageUrl || '/images/gundam.png',
    };

    if (modalMode === 'create') {
      const created = await createAdminProduct(payload);
      if (created) {
        setProductList(prev => [created, ...prev]);
      } else {
        setProductList(prev => [payload as ApiProduct, ...prev]);
      }
      showToast(`🎉 Thêm mới sản phẩm "${formName}" thành công!`);
    } else if (modalMode === 'edit' && editingId) {
      const updated = await updateAdminProduct(editingId, payload);
      setProductList(prev =>
        prev.map(item => (item.id === editingId ? { ...item, ...payload } : item))
      );
      showToast(`✏️ Cập nhật sản phẩm #${editingId} thành công!`);
    }

    setIsModalOpen(false);
  };

  const filteredProducts = productList.filter(p =>
    !searchQuery ||
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id?.includes(searchQuery)
  );

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

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Quản lý Sản phẩm Mô Hình</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>Tổng số: {productList.length} mô hình trong hệ thống MySQL Database</p>
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
            onClick={handlePrint}
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
            ➕ Thêm Sản Phẩm Mới
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo mã SP, tên sản phẩm, thương hiệu..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%', maxWidth: '400px', padding: '0.625rem 1rem',
            borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none'
          }}
        />
      </div>

      {/* Products Table */}
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.75rem 0' }}>Mã SP</th>
              <th style={{ padding: '0.75rem 0' }}>Tên sản phẩm</th>
              <th style={{ padding: '0.75rem 0' }}>Tỷ lệ</th>
              <th style={{ padding: '0.75rem 0' }}>Giá bán</th>
              <th style={{ padding: '0.75rem 0' }}>Thương hiệu</th>
              <th style={{ padding: '0.75rem 0' }}>Kho</th>
              <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  ⏳ Đang tải danh sách sản phẩm từ MySQL Backend...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0', color: '#64748b', fontWeight: 600 }}>#{p.id}</td>
                  <td style={{ padding: '0.75rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                        <img
                          src={p.imageUrl || '/images/gundam.png'}
                          alt={p.name}
                          onError={(e) => { (e.target as any).src = '/images/gundam.png'; }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 0', color: '#64748b' }}>{p.scaleRatio || (p as any).scale || '1/100'}</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#2563eb' }}>
                    {p.price ? p.price.toLocaleString('vi-VN') : 0} ₫
                  </td>
                  <td style={{ padding: '0.75rem 0', color: '#64748b' }}>{p.brand}</td>
                  <td style={{ padding: '0.75rem 0' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                      backgroundColor: p.inStock || (p.stockCount && p.stockCount > 0) ? '#dcfce7' : '#fee2e2',
                      color: p.inStock || (p.stockCount && p.stockCount > 0) ? '#166534' : '#991b1b'
                    }}>
                      {p.stockCount !== undefined ? `${p.stockCount} SP` : p.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    <button
                      onClick={() => openEditModal(p)}
                      style={{ marginRight: '0.5rem', padding: '0.35rem 0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{ padding: '0.35rem 0.65rem', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#991b1b', cursor: 'pointer', fontWeight: 600 }}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form Thêm / Sửa Sản phẩm */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setIsModalOpen(false)}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', maxWidth: '600px', width: '100%',
            padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {modalMode === 'create' ? '➕ Thêm Sản Phẩm Mới' : `✏️ Chỉnh Sửa Sản Phẩm #${editingId}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Mã Sản Phẩm (ID)</label>
                  <input
                    type="text"
                    value={formId}
                    onChange={e => setFormId(e.target.value)}
                    disabled={modalMode === 'edit'}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Danh Mục</label>
                  <select
                    value={formCategoryId}
                    onChange={e => setFormCategoryId(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#fff' }}
                  >
                    <option value="gundam">Gundam & Mecha</option>
                    <option value="figure">Anime & Game Figures</option>
                    <option value="diecast">Siêu Xe Diecast</option>
                    <option value="resin">Tượng Resin & Diorama</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tên Sản Phẩm Mô Hình</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Ví dụ: PG 1/60 RX-0 Unicorn Gundam"
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Thương Hiệu</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    placeholder="Bandai / Hot Toys / Autoart..."
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tỷ Lệ Mô Hình</label>
                  <input
                    type="text"
                    value={formScaleRatio}
                    onChange={e => setFormScaleRatio(e.target.value)}
                    placeholder="1/60, 1/100, 1/18..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Giá Bán (VNĐ)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Giá Gốc (Nhiêm yết)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={e => setFormOriginalPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Số Lượng Tồn</label>
                  <input
                    type="number"
                    value={formStockCount}
                    onChange={e => setFormStockCount(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* Image Upload / URL Selector with Live Preview */}
              <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                    🖼️ Hình Ảnh Sản Phẩm Mô Hình
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      style={{
                        padding: '4px 10px', fontSize: '11.5px', fontWeight: 700, borderRadius: '4px',
                        border: imageInputMode === 'url' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                        background: imageInputMode === 'url' ? '#eff6ff' : '#ffffff',
                        color: imageInputMode === 'url' ? '#1d4ed8' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      🌐 Nhập Link URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('file')}
                      style={{
                        padding: '4px 10px', fontSize: '11.5px', fontWeight: 700, borderRadius: '4px',
                        border: imageInputMode === 'file' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                        background: imageInputMode === 'file' ? '#eff6ff' : '#ffffff',
                        color: imageInputMode === 'file' ? '#1d4ed8' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      📁 Tải Từ Thư Viện Máy
                    </button>
                  </div>
                </div>

                {imageInputMode === 'url' ? (
                  <div>
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={e => setFormImageUrl(e.target.value)}
                      placeholder="Dán link ảnh (https://... hoặc /images/gundam.png)"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#fff' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Gợi ý mẫu:</span>
                      {[
                        { label: 'Gundam PG', url: '/images/gundam.png' },
                        { label: 'Anime Figure', url: '/images/figure.png' },
                        { label: 'Siêu Xe Diecast', url: '/images/diecast.png' },
                        { label: 'Tượng Resin', url: '/images/resin.png' },
                      ].map(s => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => setFormImageUrl(s.url)}
                          style={{ fontSize: '11px', padding: '2px 8px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#334155' }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="product-file-upload"
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        border: '2px dashed #93c5fd', borderRadius: '8px', padding: '16px', background: '#eff6ff',
                        cursor: 'pointer', transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>📤</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1d4ed8' }}>
                        Nhấp vào đây để chọn ảnh từ máy tính / điện thoại
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Hỗ trợ PNG, JPG, JPEG, WEBP (Tối đa 5MB)
                      </div>
                    </label>
                    <input
                      id="product-file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}

                {/* Live Image Preview */}
                {formImageUrl && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0, border: '1px solid #cbd5e1' }}>
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        onError={(e) => { (e.target as any).src = '/images/gundam.png'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>✓ Ảnh xem trước hợp lệ</div>
                      <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formImageUrl.startsWith('data:') ? 'Ảnh từ máy tính (Base64 Data URI)' : formImageUrl}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('/images/gundam.png')}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Đặt lại
                    </button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Mô Tả Sản Phẩm</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={3}
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
                  {modalMode === 'create' ? '✓ Xác Nhận Thêm' : '✓ Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
