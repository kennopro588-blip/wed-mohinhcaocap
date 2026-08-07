'use client';

import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Vui lòng nhập email hợp lệ', 'error');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    showToast('Đăng ký nhận tin thành công! Cảm ơn bạn 🎉');
  };

  return (
    <section className={styles.section}>
      <div className={styles.bg} />
      <div className="container">
        <div className={styles.content}>
          {submitted ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Cảm ơn bạn!</h3>
              <p className={styles.successText}>
                Chúng tôi sẽ gửi những ưu đãi tốt nhất đến <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <>
              <div className={styles.text}>
                <span className="section-label">Bản Tin Collector</span>
                <h2 className={styles.title}>
                  Săn Mô Hình <span style={{ color: 'var(--color-gold)' }}>Pre-Order VIP</span>
                </h2>
                <p className={styles.desc}>
                  Đăng ký nhận bản tin để không bỏ lỡ các đợt mở bán Pre-Order mô hình số lượng giới hạn, thông báo hàng Bandai/Hot Toys mới về và ưu đãi độc quyền.
                </p>
                <div className={styles.perks}>
                  {[
                    'Thông báo Pre-Order suất sớm nhất',
                    'Voucher 100k cho đơn đầu tiên',
                    'Ưu đãi tích điểm Collector VIP',
                  ].map(p => (
                    <div key={p} className={styles.perk}>
                      <span className={styles.perkCheck}>✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="Nhập địa chỉ email của bạn..."
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                    {loading ? <span className={styles.spinner} /> : 'Đăng Ký'}
                  </button>
                </div>
                <p className={styles.privacy}>
                  🔒 Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất kỳ lúc nào.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
