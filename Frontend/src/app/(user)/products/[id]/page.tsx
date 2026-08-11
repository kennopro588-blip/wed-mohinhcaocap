'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { getProductById, products, formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/user/ProductCard';
import styles from './product-detail.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const product = getProductById(id);

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews'>('details');

  if (!product) {
    return (
      <div className="container section text-center" style={{ minHeight: '60vh' }}>
        <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Không tìm thấy sản phẩm</h2>
        <p className="text-muted" style={{ marginBottom: '24px' }}>
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link href="/products" className="btn btn-primary">
          Xem Tất Cả Sản Phẩm
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedColor, selectedSize);
    }
    showToast(`Đã thêm ${quantity}x "${product.name}" vào giỏ hàng!`);
  };

  const handleWishlist = () => {
    toggleItem(product);
    showToast(
      wishlisted ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích',
      wishlisted ? 'info' : 'success'
    );
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbBg}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <Link href="/products">Sản phẩm</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`}>{product.category}</Link>
            <span>/</span>
            <span className={styles.crumbActive}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Details */}
      <div className="container section-sm">
        <div className={styles.mainGrid}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className={styles.galleryImg}
              />
              <div className={styles.badgeOverlay}>
                {product.isNew && <span className="badge badge-new">Mới</span>}
                {product.isSale && discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
              </div>
            </div>
            {/* Thumbnails */}
            <div className={styles.thumbnails}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`${styles.thumbBtn} ${activeImageIdx === idx ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImageIdx(idx)}
                >
                  <img src={img} alt={`${product.name} - ${idx + 1}`} className={styles.thumbImg} />
                </button>
              ))}
            </div>
          </div>

          {/* Info & Purchase */}
          <div className={styles.infoSection}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={styles.productTitle}>{product.name}</h1>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className={i <= Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}>★</span>
                ))}
              </div>
              <span className={styles.ratingVal}>{product.rating}</span>
              <span className={styles.ratingCount}>({product.reviewCount} đánh giá)</span>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  backgroundColor: !product.inStock || product.stockCount === 0
                    ? 'rgba(239, 68, 68, 0.15)'
                    : (product.stockCount || 0) <= 5
                    ? 'rgba(245, 158, 11, 0.18)'
                    : 'rgba(16, 185, 129, 0.15)',
                  color: !product.inStock || product.stockCount === 0
                    ? '#f87171'
                    : (product.stockCount || 0) <= 5
                    ? '#fbbf24'
                    : '#34d399',
                  border: '1px solid currentColor',
                }}
              >
                {!product.inStock || product.stockCount === 0
                  ? '🔴 Hết hàng'
                  : (product.stockCount || 0) <= 5
                  ? `⚡ Sắp hết hàng: Chỉ còn ${product.stockCount} mô hình!`
                  : `📦 Tồn kho: Còn ${product.stockCount} sản phẩm có sẵn`}
              </span>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Specs Summary Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '12px', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Tỉ lệ</p>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-gold)' }}>{product.scale || 'Standard'}</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Hãng sản xuất</p>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)' }}>{product.manufacturer || product.brand}</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Chất liệu</p>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)' }}>{product.material || 'ABS/PVC'}</p>
              </div>
            </div>

            {/* Edition / Finish Selector */}
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>
                Phiên bản / Hoàn thiện: <strong>{selectedColor}</strong>
              </label>
              <div className={styles.colorSwatches}>
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    className={`${styles.colorSwatch} ${selectedColor === color.name ? styles.activeSwatch : ''}`}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  >
                    <span className={styles.colorDot} style={{ background: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Scale Selector */}
            <div className={styles.optionGroup}>
              <div className={styles.optionLabelRow}>
                <label className={styles.optionLabel}>
                  Tỉ lệ / Kích thước: <strong>{selectedSize}</strong>
                </label>
                <button className={styles.sizeGuideBtn}>📐 Tra cứu tỉ lệ mô hình</button>
              </div>
              <div className={styles.sizeGrid}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className={styles.actionRow}>
              <div className={styles.qtyBox}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >–</button>
                <span className={styles.qtyNum}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                >+</button>
              </div>

              <button
                className={`btn btn-primary ${styles.addCartBtn}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                🛒 Thêm Vào Giỏ Hàng
              </button>

              <button
                className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
                onClick={handleWishlist}
                title={wishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                ♥
              </button>
            </div>

            {/* Trust highlights */}
            <div className={styles.trustStrip}>
              <div className={styles.trustItem}>🚚 Giao hàng nhanh 2-4 ngày</div>
              <div className={styles.trustItem}>🛡️ Bảo hành chính hãng</div>
              <div className={styles.trustItem}>🔄 Đổi trả trong 30 ngày</div>
            </div>
          </div>
        </div>

        {/* Tabbed Info */}
        <div className={styles.tabSection}>
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'details' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Chi Tiết Sản Phẩm
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'shipping' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Vận Chuyển & Đổi Trả
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh Giá ({product.reviewCount})
            </button>
          </div>

          <div className={styles.tabBody}>
            {activeTab === 'details' && (
              <div className={styles.detailsTab}>
                <h4>Thông tin chi tiết:</h4>
                <ul>
                  {product.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className={styles.shippingTab}>
                <h4>Chính sách giao hàng:</h4>
                <p>• Miễn phí giao hàng cho tất cả các đơn hàng từ 500.000đ trở lên.</p>
                <p>• Thời gian giao hàng nội thành HCM/Hà Nội từ 1-2 ngày, các tỉnh thành khác từ 3-5 ngày.</p>
                <h4 style={{ marginTop: '16px' }}>Chính sách đổi trả:</h4>
                <p>• Đổi trả miễn phí trong vòng 30 ngày đối với sản phẩm còn nguyên tem mác.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.reviewsTab}>
                <div className={styles.reviewSummary}>
                  <div className={styles.bigScore}>{product.rating}</div>
                  <div>
                    <div className={styles.stars}>★★★★★</div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Dựa trên {product.reviewCount} đánh giá thực tế</p>
                  </div>
                </div>

                {/* Form gửi đánh giá mới */}
                <div style={{ background: 'var(--color-bg-tertiary, rgba(255,255,255,0.03))', border: '1px solid var(--color-border, rgba(255,255,255,0.1))', borderRadius: '12px', padding: '1.25rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>✍️ Viết đánh giá của bạn</h4>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const name = (form.elements.namedItem('userName') as HTMLInputElement).value;
                    const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;
                    const rating = Number((form.elements.namedItem('rating') as HTMLSelectElement).value);

                    if (!name || !comment) {
                      showToast('Vui lòng nhập tên và nội dung nhận xét', 'error');
                      return;
                    }

                    try {
                      const { createProductReview } = await import('@/services/api');
                      await createProductReview({
                        productId: product.id,
                        userName: name,
                        rating,
                        comment
                      });
                      showToast('Cảm ơn bạn đã gửi đánh giá cho sản phẩm này! 🎉');
                      form.reset();
                    } catch (err) {
                      showToast('Cảm ơn bạn đã đánh giá!', 'success');
                    }
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Họ và tên của bạn</label>
                        <input name="userName" type="text" placeholder="Nguyễn Văn A..." required style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: '#0f172a', color: '#fff', fontSize: '0.875rem' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Đánh giá sao</label>
                        <select name="rating" defaultValue={5} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: '#0f172a', color: '#fbbf24', fontSize: '0.875rem', fontWeight: 800 }}>
                          <option value={5}>★★★★★ (5/5 Cực kỳ hài lòng)</option>
                          <option value={4}>★★★★☆ (4/5 Rất tốt)</option>
                          <option value={3}>★★★☆☆ (3/5 Bình thường)</option>
                          <option value={2}>★★☆☆☆ (2/5 Chưa hài lòng)</option>
                          <option value={1}>★☆☆☆☆ (1/5 Rất tệ)</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Nội dung nhận xét</label>
                      <textarea name="comment" rows={3} placeholder="Chia sẻ cảm nhận thực tế của bạn về chất lượng mô hình, đóng gói, giao hàng..." required style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: '#0f172a', color: '#fff', fontSize: '0.875rem' }} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '6px', fontWeight: 700 }}>
                      Gửi Đánh Giá Ngay
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className="section-title text-center" style={{ marginBottom: '24px' }}>Sản Phẩm Tương Tự</h2>
            <div className="grid-products">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
