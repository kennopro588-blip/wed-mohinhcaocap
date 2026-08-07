'use client';

import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import styles from './contact.module.css';

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tư vấn sản phẩm');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSubmitting(false);

    showToast('Gửi tin nhắn thành công! Đội ngũ tư vấn sẽ liên hệ bạn sớm nhất 💌');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <span className="section-label">Liên Hệ Với Chúng Tôi</span>
          <h1 className={styles.headerTitle}>Hỗ Trợ & Tư Vấn VIP</h1>
          <p className={styles.headerSub}>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7. Hãy gửi tin nhắn hoặc ghé thăm showroom gần nhất.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        <div className={styles.grid}>
          {/* Contact info */}
          <div className={styles.infoCol}>
            <h2 className={styles.colTitle}>Thông Tin Showroom</h2>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📍</span>
                <div>
                  <h4>Showroom Chính</h4>
                  <p>123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📞</span>
                <div>
                  <h4>Hotline VIP</h4>
                  <p><a href="tel:+84901234567">+84 90 123 4567</a> (24/7)</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>✉️</span>
                <div>
                  <h4>Email Khách Hàng</h4>
                  <p><a href="mailto:support@luxe.vn">support@luxe.vn</a></p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>⏰</span>
                <div>
                  <h4>Giờ Mở Cửa</h4>
                  <p>Thứ 2 – Thứ 7: 9:00 – 21:00</p>
                  <p>Chủ Nhật: 10:00 – 20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formCol}>
            <h2 className={styles.colTitle}>Gửi Tin Nhắn</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="input-group">
                <label className="input-label">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="0901234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Chủ đề</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="input"
                >
                  <option value="Tư vấn sản phẩm">Tư vấn sản phẩm</option>
                  <option value="Đặt lịch thử đồ VIP">Đặt lịch thử đồ VIP</option>
                  <option value="Hỗ trợ đơn hàng">Hỗ trợ đơn hàng</option>
                  <option value="Hợp tác kinh doanh">Hợp tác kinh doanh</option>
                </select>
              </div>

              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Nội dung tin nhắn *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập nội dung cần hỗ trợ..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="input"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
