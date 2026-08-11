// src/components/user/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchUserProducts, ApiProduct } from '@/services/api';
import { matchProductSearch } from '@/utils/searchHelper';
import { formatPrice } from '@/data/products';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [results, setResults] = useState<ApiProduct[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<number>();

  // Load products once on mount
  useEffect(() => {
    async function load() {
      const data = await fetchUserProducts();
      if (data && data.length) setAllProducts(data);
    }
    load();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (query.trim().length >= 1) {
        const matched = allProducts.filter(p => matchProductSearch(p, query));
        setResults(matched);
      } else {
        setResults([]);
      }
    }, 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, allProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const highlight = (text: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-bg)' }}>{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className={styles.searchBarWrap}>
      <form
        className={`${styles.searchBarForm} ${open ? styles.searchBarFormOpen : ''}`}
        onSubmit={handleSubmit}
        role="search"
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        <input
          className={styles.searchBarInput}
          type="text"
          placeholder="Tìm mô hình, thương hiệu, tỷ lệ..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <button type="submit" className={styles.searchBarSubmit} aria-label="Tìm kiếm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {open && (
        <div className={styles.autocomplete} onMouseLeave={() => setOpen(false)}>
          <div className={styles.autocompleteHeader}>
            <span>Kết quả tìm kiếm</span>
            <span className={styles.autocompleteCount}>Có <strong>{results.length}</strong> kết quả</span>
          </div>
          {results.length === 0 ? (
            <div className={styles.autocompleteNoResult}>Không có sản phẩm nào phù hợp.</div>
          ) : (
            <>
              <div className={styles.autocompleteList}>
                {results.slice(0, 6).map(p => {
                  const img = (p as any).images?.[0] || p.imageUrl || '/images/gundam.png';
                  return (
                    <Link key={p.id} href={`/products/${p.id}`} className={styles.autocompleteItem} onClick={() => setOpen(false)}>
                      <div className={styles.autocompleteThumb}>
                        <img src={img} alt={p.name} />
                      </div>
                      <div className={styles.autocompleteInfo}>
                        <p className={styles.autocompleteBrand}>{p.brand} | {p.scaleRatio || (p as any).scale || 'N/A'}</p>
                        <p className={styles.autocompleteName}>{highlight(p.name)}</p>
                        <p className={styles.autocompletePrice}>{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {results.length > 6 && (
                <div className={styles.autocompleteFooter}>
                  <Link href={`/products?search=${encodeURIComponent(query)}`} className={styles.autocompleteViewAll} onClick={() => setOpen(false)}>
                    Xem tất cả {results.length} kết quả →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
