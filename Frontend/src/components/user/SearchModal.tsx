'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products as fallbackProducts, formatPrice } from '@/data/products';
import { fetchUserProducts, ApiProduct } from '@/services/api';
import { matchProductSearch, removeVietnameseAccents } from '@/utils/searchHelper';
import styles from './SearchModal.module.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES = ['Unicorn Gundam', 'Iron Man Hot Toys', 'Lamborghini Autoart', 'Batman Resin Statue'];
const TRENDING_KEYWORDS = ['Gundam PG 1/60', 'Metal Build', 'Diecast 1/18', 'Tượng Resin', 'Good Smile'];

/** Highlight matching part of text */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const normalQuery = removeVietnameseAccents(query);
  const normalText = removeVietnameseAccents(text);
  const idx = normalText.indexOf(normalQuery.split(' ')[0]);

  if (idx === -1) return <span>{text}</span>;

  // find actual char positions
  const keywords = query.trim().split(/\s+/).filter(Boolean);
  let parts: { text: string; highlight: boolean }[] = [{ text, highlight: false }];

  for (const kw of keywords) {
    const normalKw = removeVietnameseAccents(kw);
    const newParts: typeof parts = [];
    for (const part of parts) {
      if (part.highlight) { newParts.push(part); continue; }
      const normPart = removeVietnameseAccents(part.text);
      let lastIdx = 0;
      let searchIdx = normPart.indexOf(normalKw, lastIdx);
      if (searchIdx === -1) { newParts.push(part); continue; }
      while (searchIdx !== -1) {
        if (searchIdx > lastIdx) {
          newParts.push({ text: part.text.slice(lastIdx, searchIdx), highlight: false });
        }
        newParts.push({ text: part.text.slice(searchIdx, searchIdx + kw.length), highlight: true });
        lastIdx = searchIdx + kw.length;
        searchIdx = normPart.indexOf(normalKw, lastIdx);
      }
      if (lastIdx < part.text.length) {
        newParts.push({ text: part.text.slice(lastIdx), highlight: false });
      }
    }
    parts = newParts;
  }

  return (
    <span>
      {parts.map((p, i) =>
        p.highlight
          ? <mark key={i} style={{ background: 'rgba(212,175,55,0.35)', color: '#d4af37', borderRadius: 3, padding: '0 1px' }}>{p.text}</mark>
          : <span key={i}>{p.text}</span>
      )}
    </span>
  );
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [results, setResults] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 120);
    return () => clearTimeout(t);
  }, [query]);

  // Load products from MySQL API on open
  useEffect(() => {
    if (!isOpen) return;
    async function loadData() {
      setIsLoading(true);
      const data = await fetchUserProducts();
      if (data && data.length > 0) {
        setAllProducts(data);
      } else {
        setAllProducts(fallbackProducts as any);
      }
      setIsLoading(false);
    }
    loadData();
  }, [isOpen]);

  // Filter on debounced query change
  useEffect(() => {
    if (debouncedQuery.trim().length >= 1) {
      const matched = allProducts.filter(p => matchProductSearch(p, debouncedQuery));
      setResults(matched);
      setSelectedIdx(-1);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, allProducts]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setDebouncedQuery('');
      setResults([]);
      setSelectedIdx(-1);
    } else {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (!results.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx(i => Math.min(i + 1, Math.min(results.length - 1, 7)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx(i => Math.max(i - 1, -1));
      } else if (e.key === 'Enter' && selectedIdx >= 0) {
        e.preventDefault();
        const p = results[selectedIdx];
        onClose();
        router.push(`/products/${p.id}`);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, results, selectedIdx]);

  if (!isOpen) return null;

  const displayResults = results.slice(0, 8);

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        {/* Search Input Form */}
        <form onSubmit={handleSubmitSearch} className={styles.inputWrap}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="Nhập tên mô hình, thương hiệu, tỷ lệ... (ví dụ: Gundam, Hot Toys, 1/18)"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            autoComplete="off"
          />
          {isLoading && (
            <div className={styles.spinner}>
              <div className={styles.spinnerInner} />
            </div>
          )}
          {query && !isLoading && (
            <button type="button" className={styles.clearBtn} onClick={() => handleSearch('')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
          <button type="button" className={styles.closeBtn} onClick={onClose}>ESC</button>
        </form>

        {/* Content */}
        <div className={styles.content}>
          {/* No query - show suggestions */}
          {!query && (
            <>
              <div className={styles.section}>
                <p className={styles.sectionLabel}>Tìm kiếm phổ biến</p>
                <div className={styles.tags}>
                  {RECENT_SEARCHES.map(s => (
                    <button key={s} type="button" className={styles.tag} onClick={() => handleSearch(s)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionLabel}>Xu hướng Mô Hình Hot 🔥</p>
                <div className={styles.tags}>
                  {TRENDING_KEYWORDS.map(t => (
                    <button key={t} type="button" className={`${styles.tag} ${styles.tagTrending}`} onClick={() => handleSearch(t)}>
                      <span className={styles.fire}>🔥</span> {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.hintRow}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                Gõ từng chữ để lọc sản phẩm ngay lập tức — hỗ trợ tìm không dấu
              </div>
            </>
          )}

          {/* Live results */}
          {query && (
            <div className={styles.results}>
              {results.length === 0 && !isLoading ? (
                <div className={styles.noResult}>
                  <div className={styles.noResultIcon}>🔍</div>
                  <p>Không tìm thấy mô hình nào phù hợp với <strong>&quot;{query}&quot;</strong></p>
                  <p className={styles.noResultSub}>Gợi ý: Thử tìm không dấu (ví dụ: &quot;tuong resin&quot;, &quot;sieu xe&quot;, &quot;gundam&quot;)</p>
                </div>
              ) : (
                <>
                  <div className={styles.resultHeader}>
                    <p className={styles.resultCount}>
                      Tìm thấy <strong>{results.length}</strong> sản phẩm
                      {debouncedQuery !== query && <span className={styles.typing}> · đang lọc…</span>}
                    </p>
                    <div className={styles.navHint}>
                      <kbd>↑↓</kbd> di chuyển · <kbd>↵</kbd> mở · <kbd>Esc</kbd> đóng
                    </div>
                  </div>

                  <div className={styles.resultList}>
                    {displayResults.map((product, idx) => {
                      const imgSrc = (product as any).images?.[0] || product.imageUrl || '/images/gundam.png';
                      const isSelected = idx === selectedIdx;
                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className={`${styles.resultItem} ${isSelected ? styles.resultItemSelected : ''}`}
                          onClick={onClose}
                          onMouseEnter={() => setSelectedIdx(idx)}
                        >
                          <div className={styles.resultImage}>
                            <img src={imgSrc} alt={product.name} className={styles.resultImg} />
                          </div>
                          <div className={styles.resultInfo}>
                            <div className={styles.resultMeta}>
                              <span className={styles.resultBrand}>{product.brand}</span>
                              <span className={styles.resultScale}>Tỷ lệ: {product.scaleRatio || (product as any).scale || 'N/A'}</span>
                            </div>
                            <p className={styles.resultName}>
                              <HighlightText text={product.name} query={query} />
                            </p>
                            <div className={styles.resultBottom}>
                              <span className={styles.resultPrice}>{formatPrice(product.price)}</span>
                              {product.isNew && <span className={styles.badgeNew}>Mới</span>}
                              {product.isSale && <span className={styles.badgeSale}>Sale</span>}
                              {product.inStock === false && <span className={styles.badgeOut}>Hết hàng</span>}
                            </div>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.resultArrow}>
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </Link>
                      );
                    })}
                  </div>

                  {results.length > 8 && (
                    <Link href={`/products?search=${encodeURIComponent(query)}`} className={styles.viewAll} onClick={onClose}>
                      Xem tất cả <strong>{results.length}</strong> kết quả cho &quot;{query}&quot; →
                    </Link>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
