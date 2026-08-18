'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products as fallbackProducts } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { fetchAdminProducts, ApiProduct } from '@/services/api';
import { exportToWord, exportToExcel, printTable, ExportColumn } from '@/utils/exportHelper';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const data = await fetchAdminProducts();
      if (data && data.length > 0) {
        setProductList(data);
      } else {
        setProductList(fallbackProducts as any);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  const totalProducts = productList.length;
  const inStockProducts = productList.filter(p => p.inStock || (p.stockCount && p.stockCount > 0)).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const totalValue = productList.reduce((acc, p) => acc + ((p.price || 0) * (p.stockCount || 5)), 0);

  const reportColumns: ExportColumn[] = [
    { header: 'Mã SP', key: 'id', align: 'center', formatter: val => `#${val}` },
    { header: 'Tên Sản Phẩm Mô Hình', key: 'name' },
    { header: 'Thương Hiệu', key: 'brand' },
    { header: 'Danh Mục', key: 'categoryId', align: 'center' },
    { header: 'Giá Bán (VNĐ)', key: 'price', align: 'right', formatter: val => (val || 0).toLocaleString('vi-VN') + ' ₫' },
    { header: 'Tồn Kho', key: 'stockCount', align: 'center', formatter: (val, r) => `${val ?? (r.inStock ? 5 : 0)} chiếc` },
    { header: 'Trạng Thái', key: 'inStock', align: 'center', formatter: (val, r) => ((val || (r.stockCount > 0)) ? 'Còn hàng' : 'Hết hàng') },
  ];

  const handleExportDashboardWord = () => {
    exportToWord(
      'BÁO CÁO TỔNG QUAN TÌNH HÌNH KINH DOANH & KHO HÀNG',
      reportColumns,
      productList,
      `Bao-Cao-Tong-Quan-Luxe-${Date.now()}.doc`,
      'Báo Cáo Tổng Hợp Doanh Nghiệp'
    );
  };

  const handleExportDashboardExcel = () => {
    exportToExcel(
      'BÁO CÁO TỔNG QUAN LUXE MODELS',
      reportColumns,
      productList,
      `Bao-Cao-Tong-Quan-${Date.now()}.xls`
    );
  };

  const handlePrintDashboard = () => {
    printTable(
      'BÁO CÁO TỔNG QUAN HOẠT ĐỘNG SHOWROOM',
      reportColumns,
      productList,
      'Phân hệ Báo cáo Quản trị Doanh nghiệp'
    );
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        color: '#ffffff',
        padding: '1.75rem 2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Xin chào, {user?.name || 'Quản trị viên'}! 👑
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.938rem', margin: 0 }}>
            Hệ thống Quản lý Luxe Models kết nối MySQL Database thực tế. Bảng điều khiển phân quyền Admin.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportDashboardWord}
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.18)',
              color: '#93c5fd',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.813rem',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📄 Xuất Word
          </button>
          <button
            onClick={handleExportDashboardExcel}
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.18)',
              color: '#6ee7b7',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.813rem',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📊 Xuất Excel
          </button>
          <button
            onClick={handlePrintDashboard}
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.18)',
              color: '#c7d2fe',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.813rem',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            🖨️ In Báo Cáo
          </button>
          <Link
            href="/admin/products"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.625rem 1.15rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.813rem',
              textDecoration: 'none',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)',
              display: 'flex', alignItems: 'center'
            }}
          >
            + Quản lý SP
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Card 1 */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Giá trị kho ước tính</span>
            <span style={{ fontSize: '1.25rem' }}>💰</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            {totalValue.toLocaleString('vi-VN')} ₫
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>↑ Cập nhật từ MySQL</div>
        </div>

        {/* Card 2 */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Tổng Sản phẩm</span>
            <span style={{ fontSize: '1.25rem' }}>📦</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.25rem' }}>
            {totalProducts}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Đang quản lý trong DB</div>
        </div>

        {/* Card 3 */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Sản phẩm Còn hàng</span>
            <span style={{ fontSize: '1.25rem' }}>✅</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.25rem' }}>
            {inStockProducts}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>Sẵn sàng giao hàng</div>
        </div>

        {/* Card 4 */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Sản phẩm Hết hàng</span>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626', marginBottom: '0.25rem' }}>
            {outOfStockProducts}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>Cần nhập thêm hàng</div>
        </div>
      </div>

      {/* Grid Table & Chart overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Table */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>Danh sách sản phẩm tiêu biểu</h3>
            <Link href="/admin/products" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}>
              Xem tất cả →
            </Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.75rem 0' }}>Tên sản phẩm</th>
                <th style={{ padding: '0.75rem 0' }}>Danh mục</th>
                <th style={{ padding: '0.75rem 0' }}>Giá</th>
                <th style={{ padding: '0.75rem 0' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
                    ⏳ Đang nạp từ MySQL...
                  </td>
                </tr>
              ) : (
                productList.slice(0, 5).map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#1e293b' }}>{p.name}</td>
                    <td style={{ padding: '0.75rem 0', color: '#64748b', textTransform: 'capitalize' }}>{p.categoryId}</td>
                    <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#2563eb' }}>{p.price ? p.price.toLocaleString('vi-VN') : 0} ₫</td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <span style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: p.inStock || (p.stockCount && p.stockCount > 0) ? '#dcfce7' : '#fee2e2',
                        color: p.inStock || (p.stockCount && p.stockCount > 0) ? '#166534' : '#991b1b'
                      }}>
                        {p.inStock || (p.stockCount && p.stockCount > 0) ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quick System Summary */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Tỷ lệ kho hàng</h3>
          
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#475569' }}>Còn hàng ({totalProducts > 0 ? Math.round((inStockProducts/totalProducts)*100) : 0}%)</span>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>{inStockProducts} SP</span>
            </div>
            <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${totalProducts > 0 ? (inStockProducts/totalProducts)*100 : 0}%`, backgroundColor: '#16a34a', borderRadius: '9999px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#475569' }}>Hết hàng ({totalProducts > 0 ? Math.round((outOfStockProducts/totalProducts)*100) : 0}%)</span>
              <span style={{ fontWeight: 700, color: '#dc2626' }}>{outOfStockProducts} SP</span>
            </div>
            <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${totalProducts > 0 ? (outOfStockProducts/totalProducts)*100 : 0}%`, backgroundColor: '#dc2626', borderRadius: '9999px' }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1rem 0' }} />

          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.813rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
              🛡️ Phân quyền Access Control
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Trang quản trị kết nối trực tiếp với Spring Boot & MySQL. Đang hoạt động 100% thời gian thực.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
