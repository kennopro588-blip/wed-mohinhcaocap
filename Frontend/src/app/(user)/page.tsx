import Link from 'next/link';
import { getFeaturedProducts, getSaleProducts, getBestSellers, getNewProducts, products } from '@/data/products';
import { categories } from '@/data/categories';
import HeroSection from '@/components/user/HeroSection';
import ProductCard from '@/components/user/ProductCard';
import CountdownTimer from '@/components/user/CountdownTimer';
import EventsSection from '@/components/user/EventsSection';
import Newsletter from '@/components/user/Newsletter';
import styles from './page.module.css';

export default function HomePage() {
  // Data for each distinct section (12 products = 3 rows x 4 items)
  const bestSellersList = getBestSellers();
  const bestSellers = (bestSellersList.length >= 12 ? bestSellersList : products).slice(0, 12);

  const saleList = getSaleProducts();
  const saleProducts = (saleList.length >= 12 ? saleList : products).slice(0, 12);

  const newList = getNewProducts();
  const newArrivals = (newList.length >= 12 ? newList : products).slice(0, 12);

  const featuredList = getFeaturedProducts();
  const featured = (featuredList.length >= 12 ? featuredList : products).slice(0, 12);

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Stats strip */}
      <div className={styles.statsStrip}>
        <div className="container">
          <div className={styles.stats}>
            {[
              { num: '10K+', label: 'Tín đồ mô hình tin tưởng' },
              { num: '132+', label: 'Mô hình cao cấp có sẵn' },
              { num: '15+', label: 'Năm uy tín hàng chính hãng' },
              { num: '99.8%', label: 'Đánh giá 5 sao tích cực' },
            ].map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Danh Mục Chi Tiết</span>
            <h2 className="section-title">Khám Phá Theo Thể Loại Mô Hình</h2>
            <p className="section-subtitle">
              Đa dạng các chủng loại từ Gunpla Bandai, Anime Figure, Siêu xe Diecast 1/18 đến Tượng Resin giới hạn
            </p>
            <div className="divider" />
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={styles.categoryCard}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <img src={cat.image} alt={cat.name} className={styles.categoryBg} />
                <div className={styles.categoryContent}>
                  <span className={styles.categoryCount}>{cat.itemCount} sản phẩm</span>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <p className={styles.categoryDesc}>{cat.description}</p>
                  <span className={styles.categoryArrow}>Khám phá →</span>
                </div>
                <div className={styles.categoryOverlay} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: BÁN CHẠY NHẤT (BEST SELLING) */}
      <section className={`section ${styles.darkSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">🔥 HOT TRENDING</span>
            <h2 className="section-title">Sản Phẩm Bán Chạy (Best Selling)</h2>
            <p className="section-subtitle">
              Top 12 mẫu mô hình Gundam, Figure & Siêu xe được các tín đồ sưu tầm săn đón và đặt mua nhiều nhất
            </p>
            <div className="divider" />
          </div>
          <div className="grid-products">
            {bestSellers.map((product, idx) => (
              <ProductCard key={`bs-${product.id}`} product={product} index={idx} />
            ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Link href="/products" className="btn btn-secondary">
              Xem Toàn Bộ Sản Phẩm Bán Chạy →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: ĐANG GIẢM GIÁ (ON SALE) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">🏷️ ƯU ĐÃI HẤP DẪN</span>
            <h2 className="section-title">Sản Phẩm Đang Giảm Giá (ON SALE)</h2>
            <p className="section-subtitle">
              Săn ngay các mẫu mô hình chính hãng với mức giá ưu đãi hấp dẫn nhất cùng nhiều quà tặng kèm
            </p>
            <div className="divider" />
          </div>
          <div className="grid-products">
            {saleProducts.map((product, idx) => (
              <ProductCard key={`sale-${product.id}`} product={product} index={idx} />
            ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Link href="/products?filter=sale" className="btn btn-primary">
              Xem Tất Cả Sản Phẩm Giảm Giá (ON SALE) →
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner with Countdown Timer */}
      <section className={styles.promoBanner}>
        <div className={styles.bannerBg} />
        <div className="container">
          <div className={styles.bannerContent}>
            <span className="section-label">FLASH SALE ĐẶC BIỆT</span>
            <h2 className={styles.bannerTitle}>
              Tuần Lễ Mô Hình Sale<br />
              <span style={{ color: 'var(--color-gold)' }}>Lên Đến 30%</span>
            </h2>
            <p className={styles.bannerText}>
              Áp dụng cho toàn bộ mô hình PG Gunpla, Diecast Supercar & Anime Figure.<br />Số lượng giới hạn – Đừng bỏ lỡ!
            </p>
            <div className={styles.bannerBtns}>
              <Link href="/products?filter=sale" className="btn btn-primary">
                Săn Deal Ngay
              </Link>
              <Link href="/products" className="btn btn-ghost">
                Xem Tất Cả Sản Phẩm
              </Link>
            </div>
            {/* Live Countdown Timer */}
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* SECTION 3: HÀNG MỚI VỀ (NEW ARRIVALS) */}
      <section className={`section ${styles.darkSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">✨ MỚI NHẤT</span>
            <h2 className="section-title">Hàng Mới Về (New Arrivals)</h2>
            <p className="section-subtitle">
              Cập nhật những mẫu mô hình Gunpla Bandai, Figure Nendoroid & Xe đúc 1/18 mới nhất vừa về kho
            </p>
            <div className="divider" />
          </div>
          <div className="grid-products">
            {newArrivals.map((product, idx) => (
              <ProductCard key={`new-${product.id}`} product={product} index={idx} />
            ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Link href="/products?filter=new" className="btn btn-secondary">
              Xem Tất Cả Hàng Mới Về →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: SẢN PHẨM NỔI BẬT (FEATURED SELECTION) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">⭐ NỔI BẬT</span>
            <h2 className="section-title">Sản Phẩm Được Yêu Thích</h2>
            <p className="section-subtitle">
              Những siêu phẩm mô hình được đánh giá xuất sắc từ Bandai, Autoart, Good Smile & Prime 1 Studio
            </p>
            <div className="divider" />
          </div>
          <div className="grid-products">
            {featured.map((product, idx) => (
              <ProductCard key={`ft-${product.id}`} product={product} index={idx} />
            ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Link href="/products" className="btn btn-secondary">
              Xem Toàn Bộ Bộ Sưu Tập →
            </Link>
          </div>
        </div>
      </section>

      {/* Special Events & Promotions */}
      <EventsSection />

      {/* Features */}
      <section className={`section ${styles.featuresSection}`}>
        <div className="container">
          <div className={styles.features}>
            {[
              {
                icon: <TruckIcon />,
                title: 'Miễn Phí Vận Chuyển',
                desc: 'Cho đơn hàng từ 500.000đ. Giao hàng chống sốc bọc bóng khí an toàn toàn quốc.',
              },
              {
                icon: <ShieldIcon />,
                title: 'Hàng Chính Hãng 100%',
                desc: 'Cam kết mô hình chính hãng Bandai, Good Smile, Autoart, đền x10 nếu phát hiện hàng giả.',
              },
              {
                icon: <RefreshIcon />,
                title: 'Đổi Trả 30 Ngày',
                desc: 'Đổi trả miễn phí 30 ngày nếu mô hình bị lỗi sản xuất hoặc hỏng hóc do vận chuyển.',
              },
              {
                icon: <HeadphonesIcon />,
                title: 'Hỗ Trợ Tín Đồ 24/7',
                desc: 'Đội ngũ tư vấn viên am hiểu mô hình luôn sẵn sàng hỗ trợ bạn chọn sản phẩm ưng ý.',
              },
            ].map((f, idx) => (
              <div key={f.title} className={styles.featureCard} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">ĐÁNH GIÁ THỰC TẾ</span>
            <h2 className="section-title">Cảm Nhận Từ Collector</h2>
            <div className="divider" />
          </div>
          <div className={styles.testimonials}>
            {[
              {
                name: 'Nguyễn Minh Anh',
                role: 'Gundam Collector',
                text: 'Chất lượng mô hình của LUXE thực sự vượt mọi kỳ vọng. Mẫu PG 1/60 Unicorn Gundam LED mua ở đây khớp rất khít, hộp nguyên vẹn 100% không một vết móp.',
                rating: 5,
              },
              {
                name: 'Trần Bảo Châu',
                role: 'Figure Enthusiast',
                text: 'LUXE là địa chỉ tin cậy cho ai sưu tầm Figure Nhật Bản. Bản Good Smile Nendoroid chuẩn Auth, chi tiết sắc nét và giao hàng hỏa tốc rất ưng ý.',
                rating: 5,
              },
              {
                name: 'Lê Hoàng Nam',
                role: 'Diecast Car Collector',
                text: 'Đã mua nhiều siêu xe 1/18 Autoart từ LUXE và chưa bao giờ thất vọng. Đóng gói 3 lớp bóng khí cực chuẩn, dịch vụ tư vấn nhiệt tình.',
                rating: 5,
              },
            ].map((t, idx) => (
              <div key={t.name} className={styles.testimonialCard} style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className={styles.testimonialStars}>
                  {'★'.repeat(t.rating)}
                </div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}

// Icons
function TruckIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
}
function ShieldIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function RefreshIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>;
}
function HeadphonesIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
}

