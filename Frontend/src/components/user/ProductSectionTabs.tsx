'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';
import ProductCard from './ProductCard';
import styles from '@/app/(user)/page.module.css';

interface ProductSectionTabsProps {
  products: Product[];
}

type TabType = 'bestseller' | 'sale' | 'new' | 'featured' | 'all';

export default function ProductSectionTabs({ products }: ProductSectionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('bestseller');

  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'bestseller':
        return [...products]
          .filter(p => p.reviewCount >= 15 || p.rating >= 4.8)
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 12);
      case 'sale':
        return products.filter(p => p.isSale).slice(0, 12);
      case 'new':
        return products.filter(p => p.isNew).slice(0, 12);
      case 'featured':
        return products.filter(p => p.isFeatured).slice(0, 12);
      case 'all':
      default:
        return products.slice(0, 12);
    }
  }, [activeTab, products]);

  const tabs: { id: TabType; label: string; icon: string; count: number }[] = [
    {
      id: 'bestseller',
      label: '🔥 Best Selling (Bán Chạy)',
      icon: '🔥',
      count: products.filter(p => p.reviewCount >= 15 || p.rating >= 4.8).length,
    },
    {
      id: 'sale',
      label: '🏷️ ON SALE (Giảm Giá)',
      icon: '🏷️',
      count: products.filter(p => p.isSale).length,
    },
    {
      id: 'new',
      label: '✨ Hàng Mới Về',
      icon: '✨',
      count: products.filter(p => p.isNew).length,
    },
    {
      id: 'featured',
      label: '⭐ Được Yêu Thích',
      icon: '⭐',
      count: products.filter(p => p.isFeatured).length,
    },
    {
      id: 'all',
      label: '📦 Tất Cả (132 Mô Hình)',
      icon: '📦',
      count: products.length,
    },
  ];

  return (
    <section className={`section ${styles.darkSection}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Bộ Sưu Tập Đa Dạng</span>
          <h2 className="section-title">Khám Phá Sản Phẩm Theo Xu Hướng & Ưu Đãi</h2>
          <p className="section-subtitle">
            Bấm chọn các tab dưới đây để chuyển đổi nhanh giữa các sản phẩm Bán chạy nhất, Đang giảm giá sốc và Hàng mới về
          </p>
          <div className="divider" />
        </div>

        {/* Tab navigation pills */}
        <div className={styles.filterTabsWrap}>
          <div className={styles.filterTabs}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '11px',
                    opacity: 0.85,
                    background: activeTab === tab.id ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.12)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid-products">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        <div className={styles.viewAllWrap}>
          <Link
            href={
              activeTab === 'sale'
                ? '/products?filter=sale'
                : activeTab === 'new'
                ? '/products?filter=new'
                : '/products'
            }
            className="btn btn-secondary"
          >
            Xem Thêm Toàn Bộ Sản Phẩm Danh Mục Này →
          </Link>
        </div>
      </div>
    </section>
  );
}
