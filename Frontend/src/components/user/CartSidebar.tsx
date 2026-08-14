'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import styles from './CartSidebar.module.css';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  const shipping = subtotal >= 500000 ? 0 : 50000;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={closeCart} />

      {/* Sidebar */}
      <div className={styles.sidebar} ref={sidebarRef}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Giỏ Hàng</h2>
            {totalItems > 0 && (
              <span className={styles.count}>{totalItems} sản phẩm</span>
            )}
          </div>
          <div className={styles.headerRight}>
            {items.length > 0 && (
              <button className={styles.clearBtn} onClick={clearCart}>Xóa tất cả</button>
            )}
            <button className={styles.closeBtn} onClick={closeCart} aria-label="Đóng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className={styles.emptyTitle}>Giỏ hàng trống</p>
              <p className={styles.emptyText}>Hãy khám phá bộ sưu tập của chúng tôi</p>
              <Link href="/products" className="btn btn-primary" onClick={closeCart} style={{marginTop: '16px'}}>
                Mua Sắm Ngay
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className={styles.item}>
                {/* Product visual */}
                <Link href={`/products/${item.product.id}`} onClick={closeCart}>
                  <div className={styles.itemImage}>
                    <img src={item.product.images[0]} alt={item.product.name} className={styles.itemImg} />
                  </div>
                </Link>

                {/* Info */}
                <div className={styles.itemInfo}>
                  <Link href={`/products/${item.product.id}`} onClick={closeCart}>
                    <p className={styles.itemBrand}>{item.product.brand}</p>
                    <p className={styles.itemName}>{item.product.name}</p>
                  </Link>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemVariant}>
                      {item.selectedColor} · {item.selectedSize}
                    </span>
                  </div>
                  <div className={styles.itemFooter}>
                    {/* Quantity controls */}
                    <div className={styles.qty}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                        aria-label="Giảm"
                      >–</button>
                      <span className={styles.qtyNum}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                        aria-label="Tăng"
                      >+</button>
                    </div>
                    <span className={styles.itemPrice}>{formatPrice(item.product.price * item.quantity)}</span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                      aria-label="Xóa"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - only when items exist */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.divider} />
            {/* Shipping notice */}
            {shipping === 0 ? (
              <div className={styles.freeShipping}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Bạn được miễn phí vận chuyển!
              </div>
            ) : (
              <div className={styles.shippingBar}>
                <p className={styles.shippingText}>
                  Mua thêm <strong>{formatPrice(500000 - subtotal)}</strong> để được miễn phí ship
                </p>
                <div className={styles.shippingProgress}>
                  <div
                    className={styles.shippingFill}
                    style={{ width: `${Math.min((subtotal / 500000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            <div className={styles.divider} />
            {/* Summary */}
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Vận chuyển</span>
                <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Tổng cộng</span>
                <span className={styles.totalPrice}>{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`} onClick={closeCart}>
              Tiến hành thanh toán
            </Link>
            <Link href="/products" className={`btn btn-secondary ${styles.continueBtn}`} onClick={closeCart}>
              Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
