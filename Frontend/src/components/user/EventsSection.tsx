'use client';

import { useState } from 'react';
import Link from 'next/link';
import EventModal, { EventItem } from './EventModal';
import styles from '@/app/(user)/page.module.css';

const EVENTS_DATA: EventItem[] = [
  {
    id: 'e1',
    title: 'Bandai Gunpla Expo 2026 - Pre-Order PG & Metal Build',
    date: '15/08 - 30/08/2026',
    badge: 'HOT EVENT',
    discount: 'Giảm 15% Pre-Order',
    desc: 'Đặt trước các siêu phẩm PG Unicorn LED & Metal Build 2026 chính hãng Bandai. Tặng kèm bộ quà tặng kỉ niệm độc quyền.',
    detailText: 'Chương trình Đặt trước (Pre-Order) Bandai Gunpla Expo 2026 mang tới cho bộ sưu tập của bạn những siêu phẩm hot nhất năm: PG 1/60 Unicorn Gundam Perfect Grade LED, Metal Build Destiny Soul Red & Nu Gundam. Mọi đơn đặt trước trong thời gian diễn ra sự kiện đều được tặng kèm 01 Bộ Decal Nước Premium & Chân Đế Trưng Bày Chuyên Dụng trị giá 450.000đ!',
    img: '/images/gundam_unicorn.png',
    link: '/products?category=gundam',
    code: 'GUNPLA15OFF',
  },
  {
    id: 'e2',
    title: 'Diecast Supercar Festival - Lễ Hội Siêu Xe 1/18',
    date: '10/08 - 20/08/2026',
    badge: 'SIÊU ƯU ĐÃI',
    discount: 'Tặng Tủ Mica 500K',
    desc: 'Tặng ngay tủ trưng bày Acrylic đúc nguyên khối trị giá 500.000đ khi mua bất kỳ mô hình Autoart hoặc Almost Real 1/18.',
    detailText: 'Tuần lễ Siêu xe đúc kim loại Diecast Supercar Festival dành cho những tín đồ đam mê tốc độ! Khi sở hữu bất kỳ chiếc mô hình siêu xe 1/18 từ các thương hiệu Autoart, Almost Real hay Minichamps (như Ferrari SF90, Bugatti Chiron, Lamborghini Huracan STO...), bạn sẽ được nhận ngay 01 Tủ Trưng Bày Acrylic Chống Bụi Khớp Kính Đúc Chuyên Dụng!',
    img: '/images/supercar.png',
    link: '/products?category=diecast',
    code: 'DIECAST500K',
  },
  {
    id: 'e3',
    title: 'Anime Figure Fair - Tuần Lễ Good Smile & Alter',
    date: 'Áp dụng cả tháng 8',
    badge: 'DEAL ĐỘC QUYỀN',
    discount: 'Mua 2 Tặng Standee',
    desc: 'Mua 2 mô hình Nendoroid hoặc Scale Figure tặng ngay 1 Standee Acrylic Anime bản quyền. Miễn phí giao hàng toàn quốc.',
    detailText: 'Lễ hội Anime Figure Fair quy tụ hàng nghìn sản phẩm chính hãng từ Good Smile Company, Alter, Kotobukiya. Áp dụng ưu đãi Mua 2 Tặng 1: tặng ngay 01 Standee Acrylic nhân vật Anime bản quyền sắc nét và miễn phí vận chuyển hỏa tốc toàn quốc cho đơn hàng đạt hạn mức!',
    img: '/images/figure.png',
    link: '/products?category=figure',
    code: 'FIGURE2IN1',
  },
  {
    id: 'e4',
    title: 'Triển Lãm & Mua Tượng Resin Giới Hạn (Statue Showcase)',
    date: 'Chỉ còn 3 ngày',
    badge: 'BẢN GIỚI HẠN',
    discount: 'Voucher 2.000.000đ',
    desc: 'Mở bán 10 mẫu tượng Resin Prime 1 Studio & Tsume Art có đánh số Serial sản xuất thế giới kèm chứng nhận Auth.',
    detailText: 'Showcase triển lãm và mở bán số lượng giới hạn các tác phẩm tượng nghệ thuật Polystone Resin đỉnh cao từ Prime 1 Studio & Tsume Art (Goku Ultra Instinct 1/6, Superman Deluxe 1/3, Batman Dark Knight...). Mỗi tượng đều có chứng nhận Authenticity Card và số Serial cá nhân hóa!',
    img: '/images/statue.png',
    link: '/products?category=resin',
    code: 'RESIN2M',
  },
  {
    id: 'e5',
    title: 'Luxe Club Membership - Tích Điểm X2 Đổi Quà VIP',
    date: 'Thường niên 2026',
    badge: 'HỘI VIÊN VIP',
    discount: 'X2 Điểm Thưởng',
    desc: 'Tích lũy X2 điểm thưởng cho mọi đơn hàng mô hình trong tháng 8. Đổi ngay voucher giảm giá 20% và phần quà đặc quyền.',
    detailText: 'Chương trình tri ân khách hàng thân thiết Luxe Club: Với mỗi giao dịch mua mô hình trong tháng 8, tài khoản của bạn sẽ nhận x2 điểm tích lũy thưởng. Điểm thưởng có thể dùng để đổi các phần quà mô hình độc quyền hoặc nâng hạng thẻ VIP giảm đến 20% trên toàn hệ thống!',
    img: '/images/hero_gundam_epic.png',
    link: '/products',
    code: 'VIPCLUB20',
  },
  {
    id: 'e6',
    title: 'Khung Giờ Vàng Flash Sale (Golden Hours Off)',
    date: '12:00 & 20:00 Hàng Ngày',
    badge: 'FLASH SALE',
    discount: 'Giảm Sốc 40%',
    desc: 'Săn deal giảm sốc tới 40% cho 50 mẫu mô hình HG, RG & Diecast hot nhất theo khung giờ vàng cố định mỗi ngày.',
    detailText: 'Đừng bỏ lỡ 2 khung giờ vàng 12:00 trưa và 20:00 tối mỗi ngày! Hơn 50 mô hình Gunpla HG/RG, Figure Nendoroid và Xe Diecast 1/24 sẽ được xả kho giảm giá đến 40%. Số lượng có hạn theo từng khung giờ!',
    img: '/images/hero_supercar_epic.png',
    link: '/products?filter=sale',
    code: 'FLASH40OFF',
  },
];

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <>
      <section className={`section ${styles.darkSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Sự Kiện & Ưu Đãi</span>
            <h2 className="section-title">Chương Trình & Sự Kiện Nổi Bật</h2>
            <p className="section-subtitle">
              Tham gia ngay các sự kiện độc quyền, chương trình đặt trước và nhận voucher ưu đãi dành riêng cho tín đồ mô hình
            </p>
            <div className="divider" />
          </div>

          <div className={styles.eventsGrid}>
            {EVENTS_DATA.map((event) => (
              <div
                key={event.id}
                className={styles.eventCard}
                onClick={() => setSelectedEvent(event)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.eventImgWrap}>
                  <img src={event.img} alt={event.title} className={styles.eventImg} />
                  <span className={styles.eventBadge}>{event.badge}</span>
                  <span className={styles.eventDiscount}>{event.discount}</span>
                </div>
                <div className={styles.eventBody}>
                  <span className={styles.eventDate}>📅 {event.date}</span>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDesc}>{event.desc}</p>
                  <button
                    type="button"
                    className={styles.eventBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    Xem Chi Tiết & Nhận Mã →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}
