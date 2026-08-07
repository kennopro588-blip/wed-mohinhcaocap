'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HeroSection.module.css';

const slides = [
  {
    label: 'Siêu Phẩm Gundam Bandai 2026',
    title: 'Thế Giới\nMô Hình',
    subtitle: 'Gunpla & Mecha',
    desc: 'Khám phá những bộ Gunpla PG, MG, Metal Build đúc kim loại cao cấp chính hãng Bandai Nhật Bản dành cho các collector đích thực.',
    href: '/products?category=gundam',
    cta: 'Khám Phá Gunpla',
    image: '/images/hero_gundam_epic.png',
    gradient: 'radial-gradient(ellipse at 30% 70%, rgba(212,175,55,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%), linear-gradient(135deg, #0A0A0B 0%, #06101E 100%)',
  },
  {
    label: 'Figures & Tượng Resin Cao Cấp',
    title: 'Đỉnh Cao\nChế Tác',
    subtitle: 'Limited Edition',
    desc: 'Các tác phẩm tượng Resin & Figure 1/6, 1/3 từ Prime 1 Studio, Hot Toys, Alter – được đúc số lượng giới hạn mang lại giá trị sưu tầm vượt thời gian.',
    href: '/products?category=figure',
    cta: 'Xem Figures VIP',
    image: '/images/hero_statue_epic.png',
    gradient: 'radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(212,175,55,0.1) 0%, transparent 50%), linear-gradient(135deg, #0A0A0B 0%, #150A21 100%)',
  },
  {
    label: 'Mô Hình Siêu Xe 1/18 Diecast',
    title: 'Đam Mê\nTốc Độ',
    subtitle: 'Diecast Supercars',
    desc: 'Bộ sưu tập mô hình siêu xe Lamborghini, Pagani, Ferrari tỉ lệ 1/18 tỉ mỉ từng chi tiết động cơ V12 từ Autoart & Almost Real.',
    href: '/products?category=diecast',
    cta: 'Xem Mô Hình Xe',
    image: '/images/hero_supercar_epic.png',
    gradient: 'radial-gradient(ellipse at 60% 40%, rgba(239,68,68,0.15) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(212,175,55,0.12) 0%, transparent 50%), linear-gradient(135deg, #0A0A0B 0%, #1A0909 100%)',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fixed particles to avoid hydration mismatch
  const particles = [
    { left: '5%', delay: '0s', duration: '8s', w: '2px', h: '2px' },
    { left: '15%', delay: '1.2s', duration: '10s', w: '3px', h: '1px' },
    { left: '25%', delay: '0.4s', duration: '7s', w: '1px', h: '3px' },
    { left: '35%', delay: '2.5s', duration: '9s', w: '2px', h: '2px' },
    { left: '45%', delay: '0.8s', duration: '11s', w: '3px', h: '1px' },
    { left: '55%', delay: '3.1s', duration: '6s', w: '1px', h: '2px' },
    { left: '62%', delay: '1.7s', duration: '9s', w: '2px', h: '3px' },
    { left: '70%', delay: '4.0s', duration: '8s', w: '1px', h: '1px' },
    { left: '78%', delay: '2.2s', duration: '7s', w: '3px', h: '2px' },
    { left: '88%', delay: '0.6s', duration: '10s', w: '2px', h: '3px' },
    { left: '10%', delay: '5.0s', duration: '9s', w: '1px', h: '2px' },
    { left: '20%', delay: '3.5s', duration: '11s', w: '2px', h: '1px' },
    { left: '30%', delay: '1.0s', duration: '8s', w: '3px', h: '3px' },
    { left: '42%', delay: '6.0s', duration: '7s', w: '1px', h: '1px' },
    { left: '52%', delay: '2.8s', duration: '9s', w: '2px', h: '2px' },
    { left: '66%', delay: '4.5s', duration: '6s', w: '3px', h: '1px' },
    { left: '74%', delay: '1.5s', duration: '11s', w: '1px', h: '3px' },
    { left: '82%', delay: '7.0s', duration: '8s', w: '2px', h: '2px' },
    { left: '92%', delay: '3.3s', duration: '10s', w: '1px', h: '1px' },
    { left: '97%', delay: '0.2s', duration: '7s', w: '2px', h: '2px' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  };

  const slide = slides[current];

  return (
    <section className={styles.hero} style={{ background: slide.gradient }}>
      {/* Full-width AI Store Background */}
      <div
        className={styles.heroBgImage}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10,10,11,0.92) 30%, rgba(10,10,11,0.6) 65%, rgba(10,10,11,0.15) 100%), url('/images/hero_store_bg.png')`,
        }}
      />

      {/* Animated particles */}
      {mounted && (
        <div className={styles.particles}>
          {particles.map((p, i) => (
            <div key={i} className={styles.particle} style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.w,
              height: p.h,
            }} />
          ))}
        </div>
      )}

      {/* Grid lines */}
      <div className={styles.gridLines} />

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <div className={`${styles.textBlock} ${animating ? styles.animating : ''}`}>
          <div className={styles.labelWrap}>
            <div className={styles.labelDot} />
            <span className={styles.label}>{slide.label}</span>
          </div>

          <h1 className={styles.title}>
            {slide.title.split('\n').map((line, i) => (
              <span key={i} className={styles.titleLine}>{line}<br /></span>
            ))}
            <em className={styles.titleAccent}>{slide.subtitle}</em>
          </h1>

          <p className={styles.desc}>{slide.desc}</p>

          <div className={styles.ctaGroup}>
            <Link href={slide.href} className={`btn btn-primary ${styles.ctaBtn}`}>
              {slide.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
            <Link href="/about" className={`btn btn-ghost ${styles.ctaSecondary}`}>
              Về LUXE Models
            </Link>
          </div>

          {/* Trust indicators */}
          <div className={styles.trust}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>✓</span>
              <span>100% Chính hãng Nhật/Mỹ</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>✓</span>
              <span>Bảo hành gãy hỏng lỡ tay</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>✓</span>
              <span>Đóng hộp 3 lớp chống móp</span>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className={styles.visual}>
          <div className={styles.mainCard}>
            {/* Background ambient light */}
            <div className={styles.imgAmbient} />
            <img src={slide.image} alt={slide.label} className={styles.heroImg} />
            <div className={styles.cardGlow} />
            {/* Corner accent bottom-right (CSS handles top-left) */}
            <div className={styles.cornerBR} />
            <div className={styles.productBadgeFloat}>
              <span>★ 5.0 Collector</span>
              <span>Chính Hãng 100%</span>
            </div>
          </div>

          {/* Floating cards */}
          <div className={styles.floatCard1}>
            <span className={styles.floatIcon}>🤖</span>
            <div>
              <p className={styles.floatTitle}>Official Partner</p>
              <p className={styles.floatSub}>Bandai & Hot Toys Authorized</p>
            </div>
          </div>
          <div className={styles.floatCard2}>
            <div className={styles.miniAvatars}>
              {['A', 'B', 'C'].map(l => (
                <div key={l} className={styles.miniAvatar}>{l}</div>
              ))}
            </div>
            <div>
              <p className={styles.floatTitle}>15,000+</p>
              <p className={styles.floatSub}>Collectors đã mua</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div className={styles.controls}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === current ? styles.dotActive : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span className={styles.scrollText}>Cuộn xuống</span>
      </div>
    </section>
  );
}
