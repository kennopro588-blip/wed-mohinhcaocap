'use client';

import { useState, useEffect } from 'react';
import { fetchAdminOrders, updateAdminOrderStatus, deleteAdminOrder, ApiOrder } from '@/services/api';
import { exportToWord, exportToExcel, printTable, printOrderInvoice, ExportColumn } from '@/utils/exportHelper';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAdminOrders();
    if (data && data.length > 0) {
      setOrders(data);
    } else {
      // Fallback sample data if empty
      setOrders([
        { id: 1, orderCode: 'LX-109283', fullName: 'Nguyễn Văn Anh', phone: '0901234567', address: '123 Le Loi, Q1, HCM', paymentMethod: 'COD', totalAmount: 6850000, status: 'Đang xử lý', createdAt: '2026-08-13' },
        { id: 2, orderCode: 'LX-883920', fullName: 'Trần Minh Đức', phone: '0987654321', address: '456 Tran Hung Dao, Q5, HCM', paymentMethod: 'MOMO', totalAmount: 11500000, status: 'Đã giao hàng', createdAt: '2026-08-12' },
        { id: 3, orderCode: 'LX-772910', fullName: 'Lê Hoàng Cường', phone: '0912345678', address: '789 Nguyen Trai, Q5, HCM', paymentMethod: 'CARD', totalAmount: 32500000, status: 'Hoàn thành', createdAt: '2026-08-10' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    await updateAdminOrderStatus(id, newStatus);
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status: newStatus } : o))
    );
    showToast(`Đã cập nhật đơn hàng #${id} thành "${newStatus}"!`);
  };

  const handleDeleteOrder = async (id: number, orderCode: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderCode}?`)) return;

    await deleteAdminOrder(id);
    setOrders(prev => prev.filter(o => o.id !== id));
    showToast(`Đã xóa đơn hàng #${orderCode}!`);
  };

  // Export Columns definition
  const orderColumns: ExportColumn[] = [
    { header: 'Mã Đơn', key: 'orderCode', align: 'center', formatter: val => `#${val}` },
    { header: 'Khách Hàng', key: 'fullName' },
    { header: 'Số Điện Thoại', key: 'phone', align: 'center' },
    { header: 'Địa Chỉ Nhận Hàng', key: 'address', formatter: (val, r) => `${val || ''} ${r.district ? `, ${r.district}` : ''} ${r.city ? `, ${r.city}` : ''}` },
    { header: 'Phương Thức', key: 'paymentMethod', align: 'center' },
    { header: 'Tổng Tiền (VNĐ)', key: 'totalAmount', align: 'right', formatter: val => (val || 0).toLocaleString('vi-VN') + ' ₫' },
    { header: 'Trạng Thái', key: 'status', align: 'center' },
    { header: 'Ngày Tạo', key: 'createdAt', align: 'center' },
  ];

  const handleExportWord = () => {
    exportToWord(
      'BÁO CÁO DANH SÁCH ĐƠN HÀNG',
      orderColumns,
      orders,
      `Bao-Cao-Don-Hang-Luxe-${Date.now()}.doc`,
      'Quản lý Đơn hàng & Doanh thu'
    );
    showToast('Đã xuất file Word (.doc) thành công! 📄');
  };

  const handleExportExcel = () => {
    exportToExcel(
      'BÁO CÁO DANH SÁCH ĐƠN HÀNG LUXE MODELS',
      orderColumns,
      orders,
      `Danh-Sach-Don-Hang-${Date.now()}.xls`
    );
    showToast('Đã xuất file Excel (.xls) thành công! 📊');
  };

  const handlePrintReport = () => {
    printTable(
      'BÁO CÁO TỔNG HỢP ĐƠN HÀNG',
      orderColumns,
      orders,
      'Phân hệ Quản lý Đơn hàng'
    );
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

      {/* Header & Export Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Quản lý Đơn hàng</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>Tổng số: {orders.length} đơn hàng thực tế trong MySQL</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportWord}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #3b82f6',
              background: '#eff6ff', color: '#1d4ed8', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📄 Xuất Word (.doc)
          </button>
          <button
            onClick={handleExportExcel}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #10b981',
              background: '#ecfdf5', color: '#047857', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📊 Xuất Excel (.xls)
          </button>
          <button
            onClick={handlePrintReport}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #6366f1',
              background: '#eef2ff', color: '#4338ca', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            🖨️ In Báo Cáo A4
          </button>
          <button
            onClick={loadOrders}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1',
              background: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem'
            }}
          >
            🔄 Tải lại
          </button>
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.75rem 0' }}>Mã đơn</th>
              <th style={{ padding: '0.75rem 0' }}>Khách hàng & SĐT</th>
              <th style={{ padding: '0.75rem 0' }}>Địa chỉ</th>
              <th style={{ padding: '0.75rem 0' }}>Phương thức</th>
              <th style={{ padding: '0.75rem 0' }}>Tổng tiền</th>
              <th style={{ padding: '0.75rem 0' }}>Trạng thái</th>
              <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  ⏳ Đang lấy dữ liệu đơn hàng từ MySQL Backend...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord.id || ord.orderCode} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#2563eb' }}>
                    #{ord.orderCode}
                  </td>
                  <td style={{ padding: '0.75rem 0' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{ord.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.phone} {ord.email ? `| ${ord.email}` : ''}</div>
                  </td>
                  <td style={{ padding: '0.75rem 0', color: '#64748b', maxWidth: '180px' }}>
                    {ord.address} {ord.district ? `, ${ord.district}` : ''} {ord.city ? `, ${ord.city}` : ''}
                  </td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 600, color: '#475569' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                      background: ord.paymentMethod === 'VNPAY' ? 'rgba(0,91,170,0.12)' : '#f1f5f9',
                      color: ord.paymentMethod === 'VNPAY' ? '#005baa' : '#334155'
                    }}>
                      {ord.paymentMethod || 'COD'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#0f172a' }}>
                    {ord.totalAmount ? ord.totalAmount.toLocaleString('vi-VN') : 0} ₫
                  </td>
                  <td style={{ padding: '0.75rem 0' }}>
                    <select
                      value={ord.status || 'Đang xử lý'}
                      onChange={e => ord.id && handleStatusChange(ord.id, e.target.value)}
                      style={{
                        padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                        border: '1px solid #cbd5e1', cursor: 'pointer',
                        backgroundColor: (ord.status === 'Hoàn thành' || ord.status === 'VNPAY_PAID') ? '#dcfce7' : ord.status === 'Đã giao hàng' ? '#e0e7ff' : ord.status === 'Hủy' ? '#fee2e2' : '#fef3c7',
                        color: (ord.status === 'Hoàn thành' || ord.status === 'VNPAY_PAID') ? '#166534' : ord.status === 'Đã giao hàng' ? '#3730a3' : ord.status === 'Hủy' ? '#991b1b' : '#92400e'
                      }}
                    >
                      <option value="Đang xử lý">⏳ Đang xử lý</option>
                      <option value="VNPAY_PAID">💳 Đã trả VNPay</option>
                      <option value="Đã giao hàng">🚚 Đã giao hàng</option>
                      <option value="Hoàn thành">✅ Hoàn thành</option>
                      <option value="Hủy">❌ Hủy đơn</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => printOrderInvoice(ord)}
                        title="In Hóa đơn / Phiếu xuất kho"
                        style={{ padding: '0.35rem 0.65rem', border: '1px solid #93c5fd', borderRadius: '6px', background: '#eff6ff', color: '#1d4ed8', cursor: 'pointer', fontWeight: 700, fontSize: '11px' }}
                      >
                        🖨️ In Hóa Đơn
                      </button>
                      {ord.id && (
                        <button
                          onClick={() => handleDeleteOrder(ord.id!, ord.orderCode)}
                          title="Xóa đơn hàng"
                          style={{ padding: '0.35rem 0.65rem', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#991b1b', cursor: 'pointer', fontWeight: 600 }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
