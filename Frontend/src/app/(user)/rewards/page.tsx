'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  fetchMyUserVouchers,
  fetchUserQuests,
  claimQuestReward,
  spinLuckyWheel,
  fetchUserSubscriptions,
  buyUserSubscription,
  ApiUserVoucher,
  ApiUserQuest,
  ApiUserSubscription,
} from '@/services/api';
import { formatPrice } from '@/data/products';
import styles from './rewards.module.css';

export default function RewardsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'wallet' | 'quests' | 'wheel' | 'vip'>('wallet');

  // State
  const [myVouchers, setMyVouchers] = useState<ApiUserVoucher[]>([]);
  const [quests, setQuests] = useState<ApiUserQuest[]>([]);
  const [subscriptions, setSubscriptions] = useState<ApiUserSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Minigame spin state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    const [vouchersData, questsData, subsData] = await Promise.all([
      fetchMyUserVouchers(),
      fetchUserQuests(),
      fetchUserSubscriptions(),
    ]);

    setMyVouchers(vouchersData || []);
    setQuests(questsData || []);
    setSubscriptions(subsData || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Claim reward from quest
  const handleClaim = async (quest: ApiUserQuest) => {
    const res = await claimQuestReward(quest.id);
    if (res.success) {
      showToast(res.message);
      // Reload vouchers & quests
      loadData();
    } else {
      showToast(res.message);
    }
  };

  // Lucky wheel spin
  const handleSpinWheel = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const extraRounds = 5 * 360 + Math.floor(Math.random() * 360);
    setWheelRotation(prev => prev + extraRounds);

    setTimeout(async () => {
      const res = await spinLuckyWheel();
      setIsSpinning(false);
      showToast(res.message || '🎉 Chúc mừng bạn đã quay trúng voucher may mắn!');
      loadData();
    }, 3000);
  };

  // Buy VIP Pass via VNPay Payment Gateway
  const handleBuyVip = async () => {
    const generatedCode = 'VIP-' + Math.floor(100000 + Math.random() * 900000);
    const vipPrice = 99000;

    try {
      // Save pending VIP subscription data in sessionStorage
      sessionStorage.setItem('vnpay_pending_vip', JSON.stringify({
        planKey: 'VIP_GOLD_30',
        planName: 'Gói Hội Viên Gold VIP (30 Ngày)',
        price: vipPrice,
        orderCode: generatedCode,
      }));

      const res = await fetch('http://localhost:8080/api/payment/vnpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderCode: generatedCode,
          amount: vipPrice,
          orderInfo: `Thanh toan Goi Hoi Vien Gold VIP 30 Ngay Luxe ${generatedCode}`,
        }),
      });

      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
    } catch (err) {
      console.warn('VNPay API error, using fallback redirect:', err);
      const params = new URLSearchParams({
        vnp_TxnRef: generatedCode,
        vnp_Amount: String(vipPrice * 100),
        vnp_OrderInfo: `Thanh toan Goi Hoi Vien Gold VIP 30 Ngay Luxe ${generatedCode}`,
        vnp_SecureHash: 'mock_hash_' + generatedCode,
      });
      window.location.href = '/vnpay-payment?' + params.toString();
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Toast */}
        {toastMessage && (
          <div style={{
            position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
            backgroundColor: '#10b981', color: '#fff', padding: '14px 28px',
            borderRadius: '10px', boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
            fontWeight: 800, fontSize: '14.5px'
          }}>
            ✓ {toastMessage}
          </div>
        )}

        {/* Hero Banner */}
        <div className={styles.heroSection}>
          <h1 className={styles.pageTitle}>
            🎁 Trung Tâm Thưởng & <span className={styles.pageTitleHighlight}>Săn Voucher Luxe</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Làm nhiệm vụ, điểm danh hàng ngày, quay vòng quay may mắn hoặc đăng ký Gói Hội Viên VIP để nhận các mã giảm giá và thẻ Freeship độc quyền!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`${styles.tabBtn} ${activeTab === 'wallet' ? styles.tabBtnActive : ''}`}
          >
            🎟️ Ví Voucher Của Tôi ({myVouchers.length})
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`${styles.tabBtn} ${activeTab === 'quests' ? styles.tabBtnActive : ''}`}
          >
            🎯 Nhiệm Vụ Kiếm Mã ({quests.filter(q => q.isCompleted && !q.isClaimed).length} sẵn sàng nhận)
          </button>
          <button
            onClick={() => setActiveTab('wheel')}
            className={`${styles.tabBtn} ${activeTab === 'wheel' ? styles.tabBtnActive : ''}`}
          >
            🎲 Vòng Quay May Mắn
          </button>
          <button
            onClick={() => setActiveTab('vip')}
            className={`${styles.tabBtn} ${activeTab === 'vip' ? styles.tabBtnActive : ''}`}
          >
            👑 Gói Hội Viên VIP (Freeship 30 Ngày)
          </button>
        </div>

        {/* TAB 1: MY VOUCHER WALLET */}
        {activeTab === 'wallet' && (
          <div>
            {myVouchers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#181c24', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎟️</div>
                <h3 style={{ color: '#ffffff', marginBottom: '6px' }}>Ví Voucher Trống</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                  Bạn chưa có mã giảm giá nào. Hãy chuyển qua tab <strong>Nhiệm Vụ</strong> hoặc <strong>Vòng Quay May Mắn</strong> để kiếm mã nhé!
                </p>
                <button onClick={() => setActiveTab('quests')} className="btn btn-primary">
                  Xem Nhiệm Vụ Kiếm Mã Ngay
                </button>
              </div>
            ) : (
              <div className={styles.walletGrid}>
                {myVouchers.map(v => (
                  <div key={v.id} className={styles.voucherTicket}>
                    <div className={styles.voucherTicketHeader}>
                      <span className={styles.voucherTicketCode}>{v.code}</span>
                      <span className={styles.voucherBadge}>{v.tag || 'SỞ HỮU'}</span>
                    </div>

                    <div>
                      <div className={styles.voucherTicketTitle}>{v.title}</div>
                      <div className={styles.voucherTicketDesc}>
                        {v.discountType === 'PERCENT'
                          ? `Giảm ${v.discountValue}% (Tối đa ${(v.maxDiscount || 0).toLocaleString('vi-VN')} ₫)`
                          : v.discountType === 'SHIPPING'
                          ? 'Miễn phí giao hàng toàn quốc'
                          : `Giảm trực tiếp ${v.discountValue.toLocaleString('vi-VN')} ₫`}
                      </div>
                    </div>

                    <div className={styles.voucherTicketFooter}>
                      <span>Đơn tối thiểu: {v.minOrder.toLocaleString('vi-VN')} ₫</span>
                      <Link href="/checkout" className={styles.useVoucherBtn}>
                        Dùng Ngay →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USER QUESTS */}
        {activeTab === 'quests' && (
          <div className={styles.questList}>
            {quests.map(q => (
              <div key={q.id} className={styles.questCard}>
                <div className={styles.questIcon}>{q.icon || '🎯'}</div>
                <div className={styles.questContent}>
                  <div className={styles.questTitle}>{q.title}</div>
                  <div className={styles.questDesc}>{q.description}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={styles.questProgressBar}>
                      <div
                        className={styles.questProgressFill}
                        style={{ width: `${Math.min(100, ((q.progress || 0) / (q.maxProgress || 1)) * 100)}%` }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {q.progress}/{q.maxProgress}
                    </span>
                  </div>
                  <div className={styles.questRewardBadge}>
                    🎁 Phần thưởng: <strong>{q.rewardTitle}</strong> (Mã: {q.rewardVoucherCode})
                  </div>
                </div>

                <div>
                  {q.isClaimed ? (
                    <button className={styles.claimedBtn} disabled>
                      ✓ Đã Nhận
                    </button>
                  ) : q.isCompleted ? (
                    <button onClick={() => handleClaim(q)} className={styles.claimBtn}>
                      🎁 Nhận Thưởng
                    </button>
                  ) : (
                    <button className={styles.claimedBtn} style={{ background: '#1e293b' }} disabled>
                      Chưa Xong
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: LUCKY WHEEL */}
        {activeTab === 'wheel' && (
          <div className={styles.wheelContainer}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', marginBottom: '8px' }}>
              🎲 Vòng Quay May Mắn Mô Hình
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', marginBottom: '24px' }}>
              Mỗi lượt quay trúng 100% các Voucher giảm từ 50K đến 500K hoặc quà tặng mô hình độc quyền!
            </p>

            <div
              className={styles.wheelCircle}
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              🎡
            </div>

            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className={styles.spinBtn}
            >
              {isSpinning ? 'Đang Quay May Mắn...' : '⚡ QUAY NGAY MIỄN PHÍ'}
            </button>
          </div>
        )}

        {/* TAB 4: VIP SUBSCRIPTIONS */}
        {activeTab === 'vip' && (
          <div className={styles.vipGrid}>
            <div className={styles.vipCard}>
              <span className={styles.vipBadge}>PHỔ BIẾN NHẤT</span>
              <div>
                <div className={styles.vipTitle}>👑 Gói Hội Viên Gold VIP</div>
                <div className={styles.vipPrice}>
                  99.000 ₫ <span>/ 30 ngày</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                  Tiết kiệm hàng trăm nghìn đồng tiền vận chuyển và nhận voucher độc quyền mỗi tháng.
                </p>
              </div>

              <ul className={styles.vipFeatures}>
                <li>✓ <strong>Freeship không giới hạn</strong> tất cả đơn hàng trong 30 ngày</li>
                <li>✓ Tặng ngay <strong>Voucher Giảm 15%</strong> (Tối đa 1.500.000₫)</li>
                <li>✓ Ưu tiên đặt trước (Pre-order) các phiên bản <strong>Limited Edition & Resin</strong></li>
                <li>✓ Đóng gói xốp bóng khí 3 lớp + Hộp bảo vệ góc mô hình</li>
                <li>✓ Hỗ trợ CSKH 1-1 chuyên viên kỹ thuật mô hình 24/7</li>
              </ul>

              <button onClick={handleBuyVip} className={styles.buyVipBtn}>
                ⚡ ĐĂNG KÝ GÓI GOLD VIP (99K/30 NGÀY)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
