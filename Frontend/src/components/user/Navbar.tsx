'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { fetchUserProducts, ApiProduct } from '@/services/api';
import { matchProductSearch, removeVietnameseAccents } from '@/utils/searchHelper';
import { formatPrice } from '@/data/products';
import styles from './Navbar.module.css';

interface NavbarProps {
  onSearchOpen?: () => void;
}

/** Highlight matching text in product name */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const normalQ = removeVietnameseAccents(query);
  const firstKw = normalQ.split(/\s+/)[0];
  if (!firstKw) return <>{text}</>;
  const normalT = removeVietnameseAccents(text);
  const idx = normalT.indexOf(firstKw);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'rgba(212,175,55,0.35)', color: '#d4af37', borderRadius: 2, padding: '0 1px' }}>
        {text.slice(idx, idx + firstKw.length)}
      </mark>
      {text.slice(idx + firstKw.length)}
    </>
  );
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const router = useRouter();
  const { totalItems, toggleCart } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { user, isLoggedIn, openAuth, logout } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ── Inline Search State ──────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [searchResults, setSearchResults] = useState<ApiProduct[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number>();

  // Load products once
  useEffect(() => {
    fetchUserProducts().then(data => {
      if (data && data.length) setAllProducts(data);
    });
  }, []);

  // Debounced search filter
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        setSearchResults(allProducts.filter(p => matchProductSearch(p, searchQuery)));
        setSelectedIdx(-1);
      } else {
        setSearchResults([]);
      }
    }, 180);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, allProducts]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); return; }
    if (!searchResults.length) return;
    const maxIdx = Math.min(searchResults.length - 1, 5);
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, maxIdx)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && selectedIdx >= 0) {
      e.preventDefault();
      setSearchOpen(false);
      router.push(`/products/${searchResults[selectedIdx].id}`);
      setSearchQuery('');
    }
  };

  // ── Scroll ───────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // User menu close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = () => { logout(); setUserMenuOpen(false); };

  const navLinks = [
    { href: '/', label: 'Trang Chủ' },
    { href: '/products', label: 'Mô Hình' },
    { href: '/products?category=gundam', label: 'Gundam' },
    { href: '/products?category=figure', label: 'Figures' },
    { href: '/products?category=diecast', label: 'Siêu Xe' },
    { href: '/products?category=resin', label: 'Resin' },
    { href: '/rewards', label: 'Săn Voucher' },
    { href: '/about', label: 'Giới Thiệu' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/products') return pathname === '/products' && !currentCategory;
    if (href.includes('category=')) {
      const cat = href.split('category=')[1];
      return pathname === '/products' && currentCategory === cat;
    }
    return pathname === href;
  };

  const displayResults = searchResults.slice(0, 6);

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>◆</span>
            <span className={styles.logoText}>LUXE</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className={styles.navLinks}>
            {navLinks.map(link => {
              const active = isLinkActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className={styles.actions}>

            {/* ── Inline Search Bar ── */}
            <div className={styles.inlineSearch} ref={searchRef}>
              <form
                className={`${styles.inlineSearchForm} ${searchOpen ? styles.inlineSearchFormFocused : ''}`}
                onSubmit={handleSearchSubmit}
                role="search"
              >
                <button type="submit" className={styles.inlineSearchIcon} aria-label="Tìm kiếm" tabIndex={-1}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
                <input
                  ref={searchInputRef}
                  className={styles.inlineSearchInput}
                  type="text"
                  placeholder="Tìm mô hình..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={handleSearchKeyDown}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.inlineSearchClear}
                    onClick={() => { setSearchQuery(''); setSearchResults([]); searchInputRef.current?.focus(); }}
                    tabIndex={-1}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </form>

              {/* Autocomplete Dropdown */}
              {searchOpen && (searchQuery.trim().length >= 1) && (
                <div className={styles.searchDropdown}>
                  {displayResults.length === 0 ? (
                    <div className={styles.searchNoResult}>
                      <span>🔍</span>
                      <span>Không tìm thấy &quot;{searchQuery}&quot;</span>
                    </div>
                  ) : (
                    <>
                      <div className={styles.searchDropdownHeader}>
                        <span>Tìm thấy <strong>{searchResults.length}</strong> sản phẩm</span>
                      </div>
                      {displayResults.map((p, idx) => {
                        const img = (p as any).images?.[0] || p.imageUrl || '/images/gundam.png';
                        return (
                          <Link
                            key={p.id}
                            href={`/products/${p.id}`}
                            className={`${styles.searchDropdownItem} ${idx === selectedIdx ? styles.searchDropdownItemActive : ''}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                            onMouseEnter={() => setSelectedIdx(idx)}
                          >
                            <div className={styles.searchDropdownImg}>
                              <img src={img} alt={p.name} />
                            </div>
                            <div className={styles.searchDropdownInfo}>
                              <span className={styles.searchDropdownBrand}>{p.brand}</span>
                              <span className={styles.searchDropdownName}>
                                <Highlight text={p.name} query={searchQuery} />
                              </span>
                              <span className={styles.searchDropdownPrice}>{formatPrice(p.price)}</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchDropdownArrow}>
                              <polyline points="9 18 15 12 9 6"/>
                            </svg>
                          </Link>
                        );
                      })}
                      {searchResults.length > 6 && (
                        <Link
                          href={`/products?search=${encodeURIComponent(searchQuery)}`}
                          className={styles.searchDropdownViewAll}
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                        >
                          Xem tất cả <strong>{searchResults.length}</strong> kết quả →
                        </Link>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/wishlist" className={styles.iconBtn} title="Yêu thích">
              <HeartIcon />
              {wishlistItems > 0 && (
                <span className={styles.badge}>{wishlistItems}</span>
              )}
            </Link>

            <button
              className={styles.iconBtn}
              onClick={toggleCart}
              aria-label="Giỏ hàng"
              title="Giỏ hàng"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className={styles.badge}>{totalItems}</span>
              )}
            </button>

            {/* User menu */}
            <div className={styles.userMenu} ref={userMenuRef}>
              <button
                className={styles.iconBtn}
                onClick={() => isLoggedIn ? setUserMenuOpen(!userMenuOpen) : openAuth('login')}
                aria-label="Tài khoản"
              >
                {isLoggedIn ? (
                  <div className={styles.avatar}>
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <UserIcon />
                )}
              </button>
              {userMenuOpen && isLoggedIn && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{user?.name}</p>
                    <p className={styles.dropdownEmail}>{user?.email}</p>
                  </div>
                  <div className={styles.dropdownDivider} />
                  {user?.role === 'ADMIN' && (
                    <Link href="/admin" className={styles.dropdownItem} style={{ color: '#3b82f6', fontWeight: 700 }} onClick={() => setUserMenuOpen(false)}>
                      👑 Trang Quản Trị Admin
                    </Link>
                  )}
                  <Link href="/account" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    <UserIcon size={14} /> Tài khoản
                  </Link>
                  <Link href="/orders" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    <PackageIcon /> Đơn hàng
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                    onClick={handleLogout}
                  >
                    <LogoutIcon /> Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className={mobileOpen ? styles.hamOpen : ''}></span>
              <span className={mobileOpen ? styles.hamOpen : ''}></span>
              <span className={mobileOpen ? styles.hamOpen : ''}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <div className={styles.mobileMenu} onClick={e => e.stopPropagation()}>
            <div className={styles.mobileHeader}>
              <span className={styles.logo}>
                <span className={styles.logoIcon}>◆</span>
                <span className={styles.logoText}>LUXE</span>
              </span>
              <button className={styles.closeBtn} onClick={() => setMobileOpen(false)}>✕</button>
            </div>
            {/* Mobile search */}
            <form className={styles.mobileSearchForm} onSubmit={e => { e.preventDefault(); if (searchQuery.trim()) { setMobileOpen(false); router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`); } }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--color-text-muted)' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className={styles.mobileSearchInput}
                type="text"
                placeholder="Tìm mô hình..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form>
            <ul className={styles.mobileLinks}>
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.mobileDivider} />
            {isLoggedIn ? (
              <div className={styles.mobileUser}>
                <div className={styles.avatar}>{user?.name.charAt(0)}</div>
                <div>
                  <p className={styles.dropdownName}>{user?.name}</p>
                  <button className={styles.mobileLogout} onClick={() => { logout(); setMobileOpen(false); }}>
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.mobileAuthBtns}>
                <button className="btn btn-secondary" style={{flex:1}} onClick={() => { openAuth('login'); setMobileOpen(false); }}>
                  Đăng nhập
                </button>
                <button className="btn btn-primary" style={{flex:1}} onClick={() => { openAuth('register'); setMobileOpen(false); }}>
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// SVG Icons
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function UserIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
