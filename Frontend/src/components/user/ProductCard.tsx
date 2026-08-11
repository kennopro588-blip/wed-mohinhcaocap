'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Product, formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart) return;
    setAddingToCart(true);
    addItem(product, product.colors[0]?.name || 'Default', product.sizes[0] || 'M');
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
    await new Promise(r => setTimeout(r, 800));
    setAddingToCart(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    showToast(
      wishlisted ? `Đã xóa khỏi danh sách yêu thích` : `Đã thêm vào danh sách yêu thích`,
      wishlisted ? 'info' : 'success'
    );
  };

  const gradientStyle = { background: product.images[0] };
  const hoverGradientStyle = { background: product.images[1] || product.images[0] };

  return (
    <Link
      href={`/products/${product.id}`}
      className={styles.card}
      style={{ animationDelay: `${index * 0.08}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        <img
          src={product.images[0]}
          alt={product.name}
          className={`${styles.cardImg} ${isHovered && product.images[1] ? styles.imageHide : ''}`}
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className={`${styles.cardImgAlt} ${isHovered ? styles.imageShow : ''}`}
          />
        )}

        {/* Badges */}
        <div className={styles.badges}>
          {product.isNew && <span className="badge badge-new">Mới</span>}
          {product.isSale && discount > 0 && (
            <span className="badge badge-sale">-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {/* Quick add */}
        <div className={styles.quickAdd}>
          <button
            className={`${styles.addBtn} ${addingToCart ? styles.addBtnLoading : ''}`}
            onClick={handleAddToCart}
          >
            {addingToCart ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <CartIcon />
                <span>Thêm vào giỏ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.brand}>{product.brand}</div>
        <h3 className={styles.name}>{product.name}</h3>

        {/* Rating */}
        <div className={styles.rating}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map(i => (
              <StarIcon key={i} filled={i <= Math.floor(product.rating)} />
            ))}
          </div>
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>

        {/* Colors */}
        <div className={styles.colors}>
          {product.colors.slice(0, 4).map(color => (
            <div
              key={color.name}
              className={styles.colorDot}
              style={{ background: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className={styles.moreColors}>+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ProductIcon({ category }: { category: string }) {
  if (category === 'diecast') {
    return (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A2 2 0 0 0 2 11.7V16c0 .6.4 1 1 1h2"/>
        <circle cx="7" cy="17" r="2"/>
        <circle cx="17" cy="17" r="2"/>
      </svg>
    );
  }
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill={filled ? '#D4AF37' : 'none'} stroke={filled ? '#D4AF37' : '#404040'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
