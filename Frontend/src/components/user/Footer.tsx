'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.topGlow} />
      <div className="container">
        {/* Main grid */}
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>◆</span>
              <span className={styles.logoText}>LUXE</span>
            </div>
            <p className={styles.tagline}>
              Thiên đường mô hình cao cấp dành cho Collector. Gunpla Bandai, Hot Toys, Diecast Supercars & Tượng Resin độc bản 100% chính hãng.
            </p>
            <div className={styles.socials}>
              {[
                { label: 'Instagram', icon: <InstagramIcon />, href: '#' },
                { label: 'Facebook', icon: <FacebookIcon />, href: '#' },
                { label: 'Pinterest', icon: <PinterestIcon />, href: '#' },
                { label: 'TikTok', icon: <TikTokIcon />, href: '#' },
              ].map(s => (
                <a key={s.label} href={s.href} className={styles.socialBtn} aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Danh Mục Mô Hình</h4>
            <ul className={styles.colLinks}>
              <li><Link href="/products?category=gundam">Gundam & Gunpla</Link></li>
              <li><Link href="/products?category=figure">Anime & Game Figures</Link></li>
              <li><Link href="/products?category=diecast">Siêu Xe Diecast 1/18</Link></li>
              <li><Link href="/products?category=resin">Tượng Resin & Statue</Link></li>
              <li><Link href="/products?filter=sale">Hàng Đang Khuyến Mãi</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Công Ty</h4>
            <ul className={styles.colLinks}>
              <li><Link href="/about">Về Chúng Tôi</Link></li>
              <li><Link href="/contact">Liên Hệ</Link></li>
              <li><Link href="#">Tuyển Dụng</Link></li>
              <li><Link href="#">Blog Thời Trang</Link></li>
              <li><Link href="#">Showroom</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Hỗ Trợ</h4>
            <ul className={styles.colLinks}>
              <li><Link href="#">Hướng Dẫn Mua Hàng</Link></li>
              <li><Link href="#">Chính Sách Đổi Trả</Link></li>
              <li><Link href="#">Hướng Dẫn Size</Link></li>
              <li><Link href="#">Chăm Sóc Sản Phẩm</Link></li>
              <li><Link href="#">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Liên Hệ</h4>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactIcon}><LocationIcon /></span>
                <span>123 Nguyễn Huệ, Q1, TP. HCM</span>
              </li>
              <li>
                <span className={styles.contactIcon}><PhoneIcon /></span>
                <a href="tel:+84901234567">+84 90 123 4567</a>
              </li>
              <li>
                <span className={styles.contactIcon}><EmailIcon /></span>
                <a href="mailto:hello@luxe.vn">hello@luxe.vn</a>
              </li>
              <li>
                <span className={styles.contactIcon}><ClockIcon /></span>
                <span>T2–T7: 9:00 – 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Trust badges */}
        <div className={styles.trust}>
          {[
            { icon: <ShieldIcon />, text: 'Bảo mật SSL 256-bit' },
            { icon: <TruckIcon />, text: 'Miễn phí ship đơn 500k' },
            { icon: <RefreshIcon />, text: 'Đổi trả 30 ngày' },
            { icon: <AwardIcon />, text: 'Hàng chính hãng 100%' },
          ].map(b => (
            <div key={b.text} className={styles.trustItem}>
              <span className={styles.trustIcon}>{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} LUXE Fashion. Tất cả quyền được bảo lưu.
          </p>
          <div className={styles.legalLinks}>
            <Link href="#">Chính Sách Bảo Mật</Link>
            <Link href="#">Điều Khoản Sử Dụng</Link>
            <Link href="#">Cookie</Link>
          </div>
          <div className={styles.payments}>
            <span className={styles.payBadge}>VISA</span>
            <span className={styles.payBadge}>MC</span>
            <span className={styles.payBadge}>MOMO</span>
            <span className={styles.payBadge}>ZP</span>
            <span className={styles.payBadge}>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Icons
function InstagramIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}
function FacebookIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
}
function PinterestIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>;
}
function TikTokIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.01a8.16 8.16 0 004.77 1.52V7.1a4.85 4.85 0 01-1-.41z"/></svg>;
}
function LocationIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function PhoneIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function EmailIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
function ClockIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function TruckIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
}
function RefreshIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>;
}
function AwardIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
}
