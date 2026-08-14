'use client';

import Link from 'next/link';
import ProductCard from '@/components/user/ProductCard';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { items, totalItems } = useWishlist();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-fg, #ffffff)', marginBottom: '0.5rem' }}>
          ♥ Danh Sách Yêu Thích Của Bạn
        </h1>
        <p style={{ color: 'var(--color-fg-muted, #94a3b8)', fontSize: '0.95rem' }}>
          {totalItems > 0
            ? `Bạn đang lưu ${totalItems} mô hình cao cấp trong danh sách yêu thích.`
            : 'Danh sách yêu thích của bạn đang trống. Hãy thả tim các mô hình bạn yêu thích để lưu tại đây!'}
        </p>
      </div>

      {/* Grid sản phẩm */}
      {totalItems > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💖</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
            Chưa có sản phẩm nào
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Khám phá bộ sưu tập Gundam, Anime Figure, Diecast và Tượng Resin cực đỉnh của LUXE Models ngay!
          </p>
          <Link
            href="/products"
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 700 }}
          >
            Khám Phá Mô Hình Ngay →
          </Link>
        </div>
      )}
    </div>
  );
}
