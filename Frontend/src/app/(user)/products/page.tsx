'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { products, Product } from '@/data/products';
import { categories } from '@/data/categories';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/user/ProductCard';
import styles from './products.module.css';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';
  const initialFilter = searchParams.get('filter') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const isWishlistOnly = searchParams.get('wishlist') === 'true';

  const { items: wishlistItems } = useWishlist();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(20000000);

  // Sync state instantly whenever URL searchParams change (e.g. clicking Navbar links)
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSelectedFilter(filter);
    setSearchQuery(search);
  }, [searchParams]);

  // Dynamic Page Header according to active category
  const categoryHeaderInfo = useMemo(() => {
    if (isWishlistOnly) {
      return {
        label: 'Danh Sách Yêu Thích',
        title: 'Sản Phẩm Đã Lưu',
        desc: `Bạn đang có ${wishlistItems.length} sản phẩm mô hình trong danh sách yêu thích`,
      };
    }
    switch (selectedCategory) {
      case 'gundam':
        return {
          label: 'Danh Mục Gundam',
          title: 'Gundam & Mecha Store',
          desc: 'Bộ sưu tập mô hình Gunpla Bandai chính hãng: PG 1/60, MG 1/100, RG 1/144 & Metal Build cao cấp',
        };
      case 'figure':
        return {
          label: 'Danh Mục Figure',
          title: 'Anime & Game Figures',
          desc: 'Figure Nendoroid, Scale Figure 1/4, 1/7 chính hãng từ Good Smile Company, Alter, Kotobukiya & Hot Toys',
        };
      case 'diecast':
        return {
          label: 'Danh Mục Diecast',
          title: 'Siêu Xe Diecast 1/18 & 1/24',
          desc: 'Mô hình siêu xe kim loại đúc chi tiết sắc nét từ Autoart, Almost Real, Minichamps & Bburago',
        };
      case 'resin':
        return {
          label: 'Danh Mục Statue Resin',
          title: 'Tượng Polystone Resin Giới Hạn',
          desc: 'Tuyệt tác tượng nghệ thuật Resin có đánh số Serial sản xuất thế giới từ Prime 1 Studio & Tsume Art',
        };
      default:
        return {
          label: 'Bộ Sưu Tập LUXE',
          title: 'Tất Cả Sản Phẩm Mô Hình',
          desc: 'Khám phá đầy đủ 132+ mẫu mô hình cao cấp chính hãng từ các thương hiệu đỉnh cao thế giới',
        };
    }
  }, [selectedCategory, isWishlistOnly, wishlistItems]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result: Product[] = [...products];

    // Wishlist filter
    if (isWishlistOnly) {
      const wishlistIds = new Set(wishlistItems.map(item => item.id));
      result = result.filter(p => wishlistIds.has(p.id));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Special tag/filter
    if (selectedFilter === 'new') {
      result = result.filter(p => p.isNew);
    } else if (selectedFilter === 'sale') {
      result = result.filter(p => p.isSale);
    }

    // Search query
    if (searchQuery.trim()) {
      const { matchProductSearch } = require('@/utils/searchHelper');
      result = result.filter(p => matchProductSearch(p, searchQuery));
    }

    // Price range
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [selectedCategory, selectedFilter, searchQuery, sortBy, priceRange, isWishlistOnly, wishlistItems]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFilter('all');
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange(20000000);
    router.push('/products');
  };

  const handleSelectCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    if (catSlug === 'all') {
      router.push('/products');
    } else {
      router.push(`/products?category=${catSlug}`);
    }
  };

  return (
    <div className={styles.page}>

      <div className="container section-sm">
        <div className={styles.layout}>
          {/* Sidebar Filter */}
          <aside className={styles.sidebar}>
            <div className={styles.filterHeader}>
              <h3 className={styles.filterTitle}>Bộ Lọc Tìm Kiếm</h3>
              {(selectedCategory !== 'all' || selectedFilter !== 'all' || searchQuery || priceRange < 20000000) && (
                <button className={styles.resetBtn} onClick={clearAllFilters}>
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Từ khóa</label>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Tìm tên, thương hiệu..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Danh mục</label>
              <ul className={styles.categoryList}>
                <li>
                  <button
                    className={`${styles.categoryBtn} ${selectedCategory === 'all' ? styles.activeCategory : ''}`}
                    onClick={() => handleSelectCategory('all')}
                  >
                    <span>Tất cả</span>
                    <span className={styles.catCount}>{products.length}</span>
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={`${styles.categoryBtn} ${selectedCategory === cat.slug ? styles.activeCategory : ''}`}
                      onClick={() => handleSelectCategory(cat.slug)}
                    >
                      <span>{cat.name}</span>
                      <span className={styles.catCount}>{cat.itemCount}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className={styles.filterGroup}>
              <div className={styles.filterLabelRow}>
                <label className={styles.filterLabel}>Mức giá tối đa</label>
                <span className={styles.priceVal}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange)}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={20000000}
                step={500000}
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className={styles.rangeInput}
              />
            </div>

            {/* Special Filter Badges */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Khuyến mãi & Mới</label>
              <div className={styles.tagFilters}>
                <button
                  className={`${styles.tagBtn} ${selectedFilter === 'all' ? styles.tagActive : ''}`}
                  onClick={() => setSelectedFilter('all')}
                >
                  Tất cả
                </button>
                <button
                  className={`${styles.tagBtn} ${selectedFilter === 'new' ? styles.tagActive : ''}`}
                  onClick={() => setSelectedFilter('new')}
                >
                  🔥 Hàng Mới
                </button>
                <button
                  className={`${styles.tagBtn} ${selectedFilter === 'sale' ? styles.tagActive : ''}`}
                  onClick={() => setSelectedFilter('sale')}
                >
                  🏷️ Đang Sale
                </button>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <main className={styles.mainContent}>
            {/* Top Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.resultCount}>
                Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
              </div>
              <div className={styles.sortWrap}>
                <label className={styles.sortLabel}>Sắp xếp:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="featured">Nổi bật nhất</option>
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>Không tìm thấy sản phẩm nào</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn</p>
                <button className="btn btn-primary" onClick={clearAllFilters} style={{ marginTop: '16px' }}>
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid-products">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container section text-center">
        <p className="text-gold">Đang tải sản phẩm...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
