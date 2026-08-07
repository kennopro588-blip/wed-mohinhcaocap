'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import styles from './about.module.css';

// Animated counter hook
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const STATS = [
  { value: 132, suffix: '+', label: 'Sản phẩm chính hãng', icon: '📦' },
  { value: 8, suffix: '+', label: 'Năm kinh nghiệm', icon: '🏆' },
  { value: 2500, suffix: '+', label: 'Collector tin tưởng', icon: '❤️' },
  { value: 99, suffix: '%', label: 'Đánh giá 5 sao', icon: '⭐' },
];

const TIMELINE = [
  { year: '2016', title: 'Khởi Nguồn', desc: 'LUXE Models ra đời từ niềm đam mê sưu tầm mô hình của những Collector kỳ cựu tại TP.HCM.' },
  { year: '2018', title: 'Mở Rộng Kho Hàng', desc: 'Ký kết nhập khẩu trực tiếp từ Bandai, Good Smile Company, Hot Toys — mở rộng danh mục lên 500+ SKU.' },
  { year: '2021', title: 'Showroom Đầu Tiên', desc: 'Khai trương không gian trưng bày mô hình đẳng cấp đầu tiên tại TP.HCM, thu hút hàng nghìn lượt tham quan.' },
  { year: '2024', title: 'Nền Tảng Online', desc: 'Ra mắt website thương mại điện tử hiện đại, phục vụ Collector toàn quốc với trải nghiệm mua sắm 5 sao.' },
];

const VALUES = [
  {
    icon: '🛡️',
    title: '100% Hàng Chính Hãng',
    desc: 'Nhập khẩu trực tiếp từ Bandai, Good Smile, Hot Toys & Autoart với đầy đủ tem nhãn và chứng nhận Auth.',
    color: '#d97706',
  },
  {
    icon: '📦',
    title: 'Đóng Gói Chuẩn Collector',
    desc: 'Đóng gói 3 lớp chống sốc bọc bóng khí, đảm bảo góc hộp nguyên vẹn 100% khi tới tay.',
    color: '#8b5cf6',
  },
  {
    icon: '🔄',
    title: 'Hậu Mãi Độc Quyền',
    desc: 'Hỗ trợ thay thế linh kiện lỗi từ nhà sản xuất, đổi trả miễn phí trong vòng 30 ngày.',
    color: '#10b981',
  },
  {
    icon: '🚀',
    title: 'Giao Hàng Nhanh',
    desc: 'Giao hàng toàn quốc 2–5 ngày, nội thành HCM trong ngày. Miễn phí ship đơn từ 500K.',
    color: '#3b82f6',
  },
  {
    icon: '💬',
    title: 'Tư Vấn Tận Tâm',
    desc: 'Đội ngũ am hiểu mô hình sâu sắc, sẵn sàng tư vấn 24/7 qua Hotline, Zalo và Facebook.',
    color: '#ef4444',
  },
  {
    icon: '🌟',
    title: 'Cộng Đồng Collector',
    desc: 'Kết nối 2500+ Collector Việt Nam qua các event, triển lãm và group sưu tầm mô hình độc quyền.',
    color: '#f59e0b',
  },
];

const BRANDS = ['Bandai', 'Good Smile', 'Hot Toys', 'Autoart', 'Tamiya', 'Prime 1 Studio', 'Trumpeter', 'Kotobukiya', 'Almost Real', 'Minichamps'];

export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const c0 = useCounter(STATS[0].value, 1800, statsVisible);
  const c1 = useCounter(STATS[1].value, 1500, statsVisible);
  const c2 = useCounter(STATS[2].value, 2000, statsVisible);
  const c3 = useCounter(STATS[3].value, 1600, statsVisible);
  const counts = [c0, c1, c2, c3];

  return (
    <div className={styles.page}>

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroParticles}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.particle} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span>◆</span> VỀ CHÚNG TÔI <span>◆</span>
            </div>
            <h1 className={styles.heroTitle}>
              Thánh Địa<br />
              <span className={styles.heroGradient}>Mô Hình Cao Cấp</span>
            </h1>
            <p className={styles.heroSub}>
              LUXE Models — điểm đến uy tín số 1 Việt Nam dành cho các Collector trân trọng nghệ thuật chế tác mô hình Gunpla, Figure Anime, Siêu xe Diecast & Tượng Resin độc bản chính hãng.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/products" className="btn btn-primary">Khám Phá Bộ Sưu Tập</Link>
              <a href="tel:0909123456" className={styles.heroCall}>
                <span>📞</span> 0909 123 456
              </a>
            </div>
          </div>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#0d1117"/></svg>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className={styles.statsSection} ref={statsRef}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statNumber}>
                  {counts[i]}{stat.suffix}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STORY / TIMELINE ===== */}
      <section className={`section ${styles.timelineSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Câu Chuyện LUXE</span>
            <h2 className="section-title">Hành Trình Kết Nối Đam Mê</h2>
            <div className="divider" />
            <p className="section-sub">Từ một nhóm Collector đam mê, LUXE Models đã lớn mạnh thành cộng đồng mô hình cao cấp hàng đầu Việt Nam.</p>
          </div>

          <div className={styles.timeline}>
            {TIMELINE.map((item, i) => (
              <div key={item.year} className={`${styles.timelineItem} ${i % 2 === 0 ? styles.left : styles.right}`}>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineYear}>{item.year}</div>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDesc}>{item.desc}</p>
                </div>
                <div className={styles.timelineDot} />
              </div>
            ))}
            <div className={styles.timelineLine} />
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className={`section ${styles.valuesSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Giá Trị Cốt Lõi</span>
            <h2 className="section-title">Tại Sao Chọn LUXE Models?</h2>
            <div className="divider" />
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIconWrap} style={{ '--accent': v.color } as React.CSSProperties}>
                  <span className={styles.valueIcon}>{v.icon}</span>
                </div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section className={styles.brandsSection}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Đối Tác Thương Hiệu</span>
            <h2 className="section-title">Đối Tác Chính Hãng Toàn Cầu</h2>
            <div className="divider" />
          </div>
          <div className={styles.brandsTrack}>
            <div className={styles.brandsInner}>
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <div key={i} className={styles.brandChip}>{brand}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT / CTA ===== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Sẵn Sàng Bắt Đầu Bộ Sưu Tập Của Bạn?</h2>
            <p className={styles.ctaSub}>Ghé thăm showroom hoặc liên hệ ngay để được tư vấn bởi đội ngũ Collector chuyên nghiệp của LUXE Models.</p>
            <div className={styles.ctaContacts}>
              <a href="tel:0909123456" className={styles.ctaContact}>
                <span>📞</span>
                <div>
                  <div className={styles.ctaContactLabel}>Hotline</div>
                  <div className={styles.ctaContactValue}>0909 123 456</div>
                </div>
              </a>
              <a href="mailto:bengao513@gmail.com" className={styles.ctaContact}>
                <span>📧</span>
                <div>
                  <div className={styles.ctaContactLabel}>Email</div>
                  <div className={styles.ctaContactValue}>bengao513@gmail.com</div>
                </div>
              </a>
              <a href="https://zalo.me/0909123456" target="_blank" rel="noreferrer" className={styles.ctaContact}>
                <span>💬</span>
                <div>
                  <div className={styles.ctaContactLabel}>Zalo</div>
                  <div className={styles.ctaContactValue}>0909 123 456</div>
                </div>
              </a>
            </div>
            <div className={styles.ctaBtns}>
              <Link href="/products" className="btn btn-primary">Mua Sắm Ngay</Link>
              <a href="https://facebook.com/luxemodels" target="_blank" rel="noreferrer" className={styles.ctaBtnSecondary}>
                📘 Facebook LUXE Models
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
