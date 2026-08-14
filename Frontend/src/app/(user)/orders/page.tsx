'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchUserOrderByCode, fetchUserOrdersByUserId, ApiOrder } from '@/services/api';
import { formatPrice } from '@/data/products';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<ApiOrder | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function loadUserOrders() {
      if (user && user.id) {
        setLoading(true);
        const data = await fetchUserOrdersByUserId(Number(user.id));
        setOrders(data);
        setLoading(false);
      }
    }
    loadUserOrders();
  }, [user]);

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setLoading(true);
    setSearched(true);
    const order = await fetchUserOrderByCode(searchCode.trim().toUpperCase());
    setSearchResult(order);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return { bg: '#dcfce7', color: '#15803d' };
      case 'processing': return { bg: '#dbeafe', color: '#1d4ed8' };
      case 'cancelled': return { bg: '#fee2e2', color: '#b91c1c' };
      default: return { bg: '#fef3c7', color: '#b45309' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'Đã hoàn thành';
      case 'processing': return 'Đang xử lý';
      case 'cancelled': return 'Đã hủy';
      default: return 'Chờ xác nhận';
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-fg, #ffffff)', marginBottom: '0.5rem' }}>
          📦 Tra Cứu & Lịch Sử Đơn Hàng
        </h1>
        <p style={{ color: 'var(--color-fg-muted, #94a3b8)', fontSize: '0.95rem' }}>
          Theo dõi trạng thái đơn hàng của bạn nhanh chóng chỉ với Mã Đơn Hàng.
        </p>
      </div>

      {/* Tra cứu đơn hàng theo mã */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
          🔍 Tra cứu theo mã đơn hàng
        </h3>
        <form onSubmit={handleSearchOrder} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Nhập mã đơn hàng (Ví dụ: LX-849201)..."
            value={searchCode}
            onChange={e => setSearchCode(e.target.value)}
            style={{
              flex: 1, minWidth: '240px', padding: '0.75rem 1rem', borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)', background: '#0f172a',
              color: '#ffffff', fontSize: '0.95rem', fontWeight: 600
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700 }}
          >
            {loading ? 'Đang tìm...' : 'Tra Cứu Đơn'}
          </button>
        </form>

        {/* Kết quả tra cứu theo mã */}
        {searched && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {searchResult ? (
              <OrderItemCard order={searchResult} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
            ) : (
              <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem' }}>
                ❌ Không tìm thấy đơn hàng với mã: "{searchCode}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Danh sách đơn hàng đã đặt của User (nếu đã đăng nhập) */}
      {user ? (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            🛒 Lịch sử đơn hàng của tài khoản ({user.name})
          </h2>

          {loading ? (
            <p style={{ color: '#94a3b8' }}>⏳ Đang tải đơn hàng của bạn...</p>
          ) : orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(order => (
                <OrderItemCard key={order.id || order.orderCode} order={order} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8' }}>Bạn chưa có đơn hàng nào trong tài khoản.</p>
          )}
        </div>
      ) : (
        <div style={{
          background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)',
          borderRadius: '12px', padding: '1rem 1.25rem', color: '#fbbf24', fontSize: '0.9rem'
        }}>
          💡 <strong>Mẹo:</strong> Hãy Đăng Nhập để xem toàn bộ danh sách đơn hàng đã mua của bạn!
        </div>
      )}
    </div>
  );
}

function OrderItemCard({
  order,
  getStatusColor,
  getStatusLabel,
}: {
  order: ApiOrder;
  getStatusColor: (st: string) => { bg: string; color: string };
  getStatusLabel: (st: string) => string;
}) {
  const statusStyle = getStatusColor(order.status);

  return (
    <div style={{
      background: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
        <div>
          <span style={{ color: '#d97706', fontWeight: 800, fontSize: '1.1rem' }}>Mã: #{order.orderCode}</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '12px' }}>
            {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : ''}
          </span>
        </div>
        <span style={{
          backgroundColor: statusStyle.bg, color: statusStyle.color,
          padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800
        }}>
          ● {getStatusLabel(order.status)}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '2px' }}>Người nhận</p>
          <p style={{ color: '#ffffff', fontWeight: 700 }}>{order.fullName} - {order.phone}</p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '2px' }}>Địa chỉ giao hàng</p>
          <p style={{ color: '#cbd5e1' }}>{order.address}, {order.district}, {order.city}</p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '2px' }}>Phương thức & Tổng tiền</p>
          <p style={{ color: '#d97706', fontWeight: 800, fontSize: '1.05rem' }}>
            {formatPrice(order.totalAmount)} ({order.paymentMethod.toUpperCase()})
          </p>
        </div>
      </div>

      {/* Danh sách sản phẩm mua */}
      {order.items && order.items.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>SẢN PHẨM TRONG ĐƠN HÀNG:</p>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#e2e8f0', padding: '4px 0' }}>
              <span>• {item.productName} <strong style={{ color: '#94a3b8' }}>x{item.quantity}</strong></span>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
