'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { products as fallbackProducts } from '@/data/products';
import { categories } from '@/data/categories';
import { fetchAdminProducts, updateAdminProduct, ApiProduct } from '@/services/api';
import { exportToWord, exportToExcel, printTable, ExportColumn } from '@/utils/exportHelper';

export default function AdminInventoryPage() {
  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'instock'>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<ApiProduct | null>(null);
  const [importQty, setImportQty] = useState<number>(10);
  const [importNote, setImportNote] = useState<string>('Nhập hàng định kỳ từ nhà cung cấp');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const inventoryColumns: ExportColumn[] = [
    { header: 'Mã SP', key: 'id', align: 'center', formatter: val => `#${val}` },
    { header: 'Tên Mô Hình', key: 'name' },
    { header: 'Hãng Sản Xuất', key: 'brand' },
    { header: 'Danh Mục', key: 'categoryId', align: 'center' },
    { header: 'Tỷ Lệ', key: 'scaleRatio', align: 'center' },
    { header: 'Đơn Giá (VNĐ)', key: 'price', align: 'right', formatter: val => (val || 0).toLocaleString('vi-VN') + ' ₫' },
    { header: 'Số Lượng Tồn', key: 'stockCount', align: 'center', formatter: (val, r) => `${val ?? (r.inStock ? 5 : 0)} chiếc` },
    { header: 'Tổng Giá Trị Tồn (VNĐ)', key: 'price', align: 'right', formatter: (val, r) => ((val || 0) * (r.stockCount ?? (r.inStock ? 5 : 0))).toLocaleString('vi-VN') + ' ₫' },
    { header: 'Tình Trạng Kho', key: 'inStock', align: 'center', formatter: (val, r) => ((r.stockCount ?? 0) <= 0 ? 'Hết hàng' : (r.stockCount ?? 0) <= 3 ? 'Sắp hết' : 'Đầy đủ') },
  ];

  const handleExportWord = () => {
    exportToWord(
      'BÁO CÁO KIỂM KÊ TỒN KHO & NHẬP HÀNG',
      inventoryColumns,
      productList,
      `Bao-Cao-Ton-Kho-Luxe-${Date.now()}.doc`,
      'Phân hệ Quản lý Nhập hàng & Tồn kho'
    );
    showToast('Đã xuất file Word (.doc) thành công! 📄');
  };

  const handleExportExcel = () => {
    exportToExcel(
      'BÁO CÁO TỒN KHO & GIÁ TRỊ TỒN KHO LUXE MODELS',
      inventoryColumns,
      productList,
      `Bao-Cao-Ton-Kho-${Date.now()}.xls`
    );
    showToast('Đã xuất file Excel (.xls) thành công! 📊');
  };

  const handlePrintInventory = () => {
    printTable(
      'PHIẾU KIỂM KÊ & BÁO CÁO TỒN KHO MÔ HÌNH',
      inventoryColumns,
      productList,
      'Phân hệ Quản trị Kho Hàng'
    );
  };

  const loadInventory = async () => {
    setLoading(true);
    const data = await fetchAdminProducts();
    if (data && data.length > 0) {
      setProductList(data);
    } else {
      setProductList(fallbackProducts as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Quick stock update
  const handleUpdateStock = async (productId: string, delta: number) => {
    const existing = productList.find(p => p.id === productId);
    if (!existing) return;

    const currentStock = existing.stockCount ?? 0;
    const newStock = Math.max(0, currentStock + delta);
    const newInStock = newStock > 0;

    // Optimistic UI update
    setProductList(prev =>
      prev.map(p => (p.id === productId ? { ...p, stockCount: newStock, inStock: newInStock } : p))
    );

    // Call API to save to MySQL
    await updateAdminProduct(productId, {
      ...existing,
      stockCount: newStock,
      inStock: newInStock,
    });

    showToast(`Đã ${delta > 0 ? 'cộng' : 'trừ'} ${Math.abs(delta)} mô hình cho "${existing.name}" trong MySQL!`);
  };

  // Open import modal
  const openImportModal = (product?: ApiProduct) => {
    setTargetProduct(product || productList[0] || null);
    setImportQty(10);
    setImportNote('Nhập bổ sung đợt mới chính hãng');
    setIsModalOpen(true);
  };

  // Submit stock import form
  const handleConfirmImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProduct) return;

    const currentStock = targetProduct.stockCount ?? 0;
    const newStock = currentStock + Number(importQty);
    const newInStock = newStock > 0;

    // Optimistic UI update
    setProductList(prev =>
      prev.map(p => (p.id === targetProduct.id ? { ...p, stockCount: newStock, inStock: newInStock } : p))
    );

    // Persist to DB
    await updateAdminProduct(targetProduct.id, {
      ...targetProduct,
      stockCount: newStock,
      inStock: newInStock,
    });

    showToast(`🎉 Nhập kho thành công +${importQty} sản phẩm "${targetProduct.name}" vào MySQL Database!`);
    setIsModalOpen(false);
  };

  // KPIs
  const stats = useMemo(() => {
    const totalUnits = productList.reduce((acc, p) => acc + (p.stockCount || 0), 0);
    const lowStockCount = productList.filter(p => (p.stockCount || 0) > 0 && (p.stockCount || 0) <= 5).length;
    const outOfStockCount = productList.filter(p => (p.stockCount || 0) === 0).length;
    const totalInventoryValue = productList.reduce((acc, p) => acc + ((p.price || 0) * (p.stockCount || 0)), 0);

    return { totalUnits, lowStockCount, outOfStockCount, totalInventoryValue };
  }, [productList]);

  // Filtered List
  const filteredProducts = useMemo(() => {
    return productList.filter(p => {
      // Search
      const matchSearch =
        !searchQuery.trim() ||
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.id && p.id.includes(searchQuery));

      // Category
      const cat = p.categoryId || (p as any).category || '';
      const matchCat = selectedCategory === 'all' || cat === selectedCategory;

      // Stock status
      const stock = p.stockCount || 0;
      let matchStock = true;
      if (stockFilter === 'low') matchStock = stock > 0 && stock <= 5;
      else if (stockFilter === 'out') matchStock = stock === 0;
      else if (stockFilter === 'instock') matchStock = stock > 5;

      return matchSearch && matchCat && matchStock;
    });
  }, [productList, searchQuery, selectedCategory, stockFilter]);

  return (
    <div style={{ fontFamily: 'var(--font-sans, system-ui, sans-serif)', color: '#0f172a' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            fontWeight: 700,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            🏭 Quản Lý Nhập Hàng & Tồn Kho Mô Hình
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
            Kiểm soát chi tiết số lượng tồn kho & thực hiện nhập kho lưu trực tiếp vào MySQL
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportWord}
            style={{
              padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #3b82f6',
              background: '#eff6ff', color: '#1d4ed8', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📄 Xuất Word (.doc)
          </button>
          <button
            onClick={handleExportExcel}
            style={{
              padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #10b981',
              background: '#ecfdf5', color: '#047857', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📊 Xuất Excel (.xls)
          </button>
          <button
            onClick={handlePrintInventory}
            style={{
              padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #6366f1',
              background: '#eef2ff', color: '#4338ca', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            🖨️ In Phiếu Kiểm Kê
          </button>
          <button
            onClick={() => openImportModal()}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
            }}
          >
            <span>➕</span>
            <span>Nhập Hàng Vào Kho</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📦 Tổng Số Mô Hình Trong Kho
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {stats.totalUnits.toLocaleString('vi-VN')} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>sản phẩm</span>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fef3c7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚠️ Sắp Hết Hàng (&le; 5 SP)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', marginTop: '8px' }}>
            {stats.lowStockCount} <span style={{ fontSize: '0.9rem', color: '#d97706', fontWeight: 500 }}>mặt hàng</span>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fee2e2', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🚫 Mô Hình Hết Hàng (0 SP)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#991b1b', marginTop: '8px' }}>
            {stats.outOfStockCount} <span style={{ fontSize: '0.9rem', color: '#dc2626', fontWeight: 500 }}>mặt hàng</span>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💰 Tổng Giá Trị Kho Hàng
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', marginTop: '8px' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalInventoryValue)}
          </div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: '1 1 260px' }}>
          <input
            type="text"
            placeholder="🔍 Tìm theo mã SP, tên mô hình, thương hiệu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Category dropdown */}
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.625rem 0.875rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="all">Tất cả danh mục ({productList.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Stock Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `Tất cả (${productList.length})` },
            { id: 'instock', label: `Dồi dào (>5)` },
            { id: 'low', label: `⚠️ Sắp hết (≤5)` },
            { id: 'out', label: `🚫 Hết hàng (0)` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStockFilter(f.id as any)}
              style={{
                padding: '0.5rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: stockFilter === f.id ? '#2563eb' : '#cbd5e1',
                backgroundColor: stockFilter === f.id ? '#eff6ff' : '#ffffff',
                color: stockFilter === f.id ? '#1d4ed8' : '#64748b',
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '0.875rem 1rem' }}>Mã SP</th>
                <th style={{ padding: '0.875rem 1rem' }}>Mô Hình</th>
                <th style={{ padding: '0.875rem 1rem' }}>Danh Mục</th>
                <th style={{ padding: '0.875rem 1rem' }}>Đơn Giá</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>Số Lượng Tồn Kho</th>
                <th style={{ padding: '0.875rem 1rem' }}>Trạng Thái Kho</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Thao Tác Nhập Hàng</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                    ⏳ Đang nạp dữ liệu tồn kho từ MySQL...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                    🔍 Không tìm thấy mô hình nào phù hợp với điều kiện lọc
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stock = p.stockCount || 0;
                  const isLow = stock > 0 && stock <= 5;
                  const isOut = stock === 0;
                  const imgSrc = (p as any).images?.[0] || p.imageUrl || '/images/gundam.png';
                  const catName = p.categoryId || (p as any).category || 'N/A';

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                      <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontWeight: 600 }}>#{p.id}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={imgSrc}
                            alt={p.name}
                            style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hãng: {p.brand} | Tỷ lệ: {p.scaleRatio || (p as any).scale || '1/100'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', textTransform: 'capitalize', color: '#475569', fontWeight: 600 }}>
                        {catName}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#2563eb' }}>
                        {p.price ? p.price.toLocaleString('vi-VN') : 0} ₫
                      </td>
                      {/* Interactive Stock Controls */}
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <button
                            onClick={() => handleUpdateStock(p.id, -1)}
                            disabled={stock === 0}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              fontWeight: 700,
                              cursor: stock === 0 ? 'not-allowed' : 'pointer',
                              opacity: stock === 0 ? 0.4 : 1,
                            }}
                            title="Giảm 1"
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', minWidth: '36px', textAlign: 'center', color: isOut ? '#dc2626' : isLow ? '#d97706' : '#0f172a' }}>
                            {stock}
                          </span>
                          <button
                            onClick={() => handleUpdateStock(p.id, +1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                            title="Cộng 1"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      {/* Status badge */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: isOut ? '#fee2e2' : isLow ? '#fef3c7' : '#dcfce7',
                            color: isOut ? '#991b1b' : isLow ? '#b45309' : '#166534',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isOut ? '🔴 Hết hàng (0)' : isLow ? `⚡ Sắp hết (${stock})` : `🟢 Còn hàng (${stock})`}
                        </span>
                      </td>
                      {/* Action buttons */}
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => handleUpdateStock(p.id, +5)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              borderRadius: '6px',
                              border: '1px solid #bfdbfe',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              cursor: 'pointer',
                            }}
                            title="Nhập nhanh +5 sản phẩm"
                          >
                            +5 SP
                          </button>
                          <button
                            onClick={() => openImportModal(p)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              borderRadius: '6px',
                              border: 'none',
                              background: '#2563eb',
                              color: '#ffffff',
                              cursor: 'pointer',
                            }}
                          >
                            📥 Nhập Kho
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Import Modal */}
      {isModalOpen && targetProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                📥 Phiếu Nhập Hàng Mô Hình Vào Kho
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmImport}>
              {/* Product selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Chọn Sản Phẩm Nhập Kho
                </label>
                <select
                  value={targetProduct.id}
                  onChange={e => {
                    const found = productList.find(p => p.id === e.target.value);
                    if (found) setTargetProduct(found);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {productList.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.id} - {p.name} (Tồn hiện tại: {p.stockCount || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected product card preview */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img
                  src={(targetProduct as any).images?.[0] || targetProduct.imageUrl || '/images/gundam.png'}
                  alt={targetProduct.name}
                  style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{targetProduct.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Tồn kho hiện tại: <strong style={{ color: '#2563eb' }}>{targetProduct.stockCount || 0} mô hình</strong>
                  </div>
                </div>
              </div>

              {/* Quantity to add */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Số Lượng Nhập Bổ Sung (Mô hình)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={importQty}
                  onChange={e => setImportQty(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                  required
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {[+5, +10, +20, +50].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setImportQty(q)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: importQty === q ? '#2563eb' : '#ffffff',
                        color: importQty === q ? '#ffffff' : '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      +{q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Import Note */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Ghi Chú Đợt Nhập Hàng
                </label>
                <input
                  type="text"
                  value={importNote}
                  onChange={e => setImportNote(e.target.value)}
                  placeholder="Ví dụ: Lô hàng mới về từ Bandai Japan..."
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#475569',
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                  }}
                >
                  ✓ Xác Nhận Nhập Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
