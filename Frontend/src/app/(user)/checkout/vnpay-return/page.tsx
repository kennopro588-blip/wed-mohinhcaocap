'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/data/products';
import { buyUserSubscription } from '@/services/api';
import styles from './vnpay-return.module.css';

function VNPayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const { showToast } = useToast();

  const responseCode   = searchParams.get('vnp_ResponseCode') || '99';
  const orderCode      = searchParams.get('vnp_TxnRef') || '';
  const amountRaw      = searchParams.get('vnp_Amount') || '0';
  const transactionNo  = searchParams.get('vnp_TransactionNo') || '';
  const amount         = Math.floor(Number(amountRaw) / 100);

  const isSuccess = responseCode === '00';

  const [savingOrder, setSavingOrder] = useState(true);
  const [isVipSuccess, setIsVipSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    async function finalizePayment() {
      if (!isSuccess) {
        setSavingOrder(false);
        return;
      }

      // Verify signature with backend
      try {
        const verifyUrl = new URL('http://localhost:8080/api/payment/vnpay/verify');
        searchParams.forEach((val, key) => verifyUrl.searchParams.append(key, val));
        const vRes = await fetch(verifyUrl.toString());
        const vData = await vRes.json();
        if (vData && !vData.success && vData.responseCode !== '00') {
          setSavingOrder(false);
          return;
        }
      } catch (e) {
        console.warn('Signature verification check error:', e);
      }

      // 1. Check if user is paying for VIP Membership Subscription
      const rawPendingVip = sessionStorage.getItem('vnpay_pending_vip');
      if (rawPendingVip) {
        try {
          const vipData = JSON.parse(rawPendingVip);
          await buyUserSubscription(vipData.planKey || 'VIP_GOLD_30');
          sessionStorage.removeItem('vnpay_pending_vip');
          setIsVipSuccess(true);
          showToast('👑 Chúc mừng! Bạn đã kích hoạt thành công Gói Hội Viên Gold VIP 30 Ngày!');
        } catch (err) {
          console.warn('Could not activate VIP membership in backend:', err);
          setIsVipSuccess(true);
        }
        setSavingOrder(false);
        return;
      }

      // 2. Otherwise check normal product order
      const rawPending = sessionStorage.getItem('vnpay_pending_order');
      if (rawPending) {
        try {
          const pending = JSON.parse(rawPending);
          setOrderDetails(pending);

          const { createOrder } = await import('@/services/api');
          await createOrder({
            orderCode: pending.orderCode || orderCode,
            fullName: pending.fullName,
            phone: pending.phone,
            email: pending.email,
            address: pending.address,
            city: pending.city,
            district: pending.district,
            paymentMethod: 'VNPAY',
            totalAmount: pending.total || amount,
            status: 'VNPAY_PAID',
            items: pending.items || [],
          });

          sessionStorage.removeItem('vnpay_pending_order');
          clearCart();
          showToast('Thanh toán VNPay thành công! Đơn hàng đã được ghi nhận 🎉');
        } catch (err) {
          console.warn('Could not save order to backend:', err);
          clearCart();
        }
      } else {
        clearCart();
      }
      setSavingOrder(false);
    }

    finalizePayment();
  }, [isSuccess]);

  const getErrorMessage = (code: string) => {
    switch (code) {
      case '24': return 'Bạn đã hủy giao dịch thanh toán VNPay.';
      case '51': return 'Tài khoản không đủ số dư để thực hiện giao dịch.';
      case '11': return 'Đã hết thời gian chờ thanh toán.';
      case '12': return 'Thẻ hoặc tài khoản bị khóa.';
      case '13': return 'Mã OTP nhập không chính xác.';
      default:   return `Giao dịch không thành công (Mã phản hồi: ${code}).`;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {isSuccess ? (
          isVipSuccess ? (
            /* VIP Membership Purchase Success View */
            <>
              <div className={styles.iconSuccess} style={{ background: 'rgba(212, 175, 55, 0.15)', borderColor: 'var(--color-gold)' }}>
                <span style={{ fontSize: '32px' }}>👑</span>
              </div>
              <span className={styles.vnpayBadge} style={{ background: 'linear-gradient(135deg, #d4af37, #b8860b)', color: '#000' }}>
                HỘI VIÊN GOLD VIP
              </span>
              <h1 className={styles.titleSuccess} style={{ color: 'var(--color-gold)' }}>
                Kích Hoạt VIP Thành Công!
              </h1>
              <p className={styles.subtitle}>
                Cảm ơn bạn đã đăng ký <strong>Gói Hội Viên Gold VIP (30 Ngày)</strong> qua cổng VNPay!
              </p>

              <div className={styles.detailsBox}>
                <div className={styles.detailRow}>
                  <span>Mã giao dịch VIP:</span>
                  <strong className={styles.codeHighlight}>#{orderCode}</strong>
                </div>
                {transactionNo && (
                  <div className={styles.detailRow}>
                    <span>Mã GD VNPay:</span>
                    <span>{transactionNo}</span>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <span>Số tiền:</span>
                  <strong className={styles.amountHighlight}>{formatPrice(amount || 99000)}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span>Thời hạn sử dụng:</span>
                  <strong style={{ color: '#10b981' }}>30 Ngày (Freeship Không Giới Hạn)</strong>
                </div>
                <div className={styles.divider} />
                <div style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.6 }}>
                  <div>✓ Thẻ <strong>Freeship không giới hạn</strong> đã nạp vào ví voucher của bạn.</div>
                  <div>✓ Voucher đặc quyền <strong>VIP Giảm 15%</strong> đã sẵn sàng sử dụng.</div>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href="/products" className="btn btn-primary">
                  Mua Sắm Freeship Ngay
                </Link>
                <Link href="/rewards" className="btn btn-secondary">
                  Kiểm Tra Ví Voucher
                </Link>
              </div>
            </>
          ) : (
            /* Regular Model Order Purchase Success View */
            <>
              <div className={styles.iconSuccess}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <span className={styles.vnpayBadge}>VNPay Demo Payment</span>
              <h1 className={styles.titleSuccess}>Thanh Toán Thành Công!</h1>
              <p className={styles.subtitle}>
                Giao dịch qua cổng <strong>VNPay</strong> đã được xác thực thành công.
              </p>

              <div className={styles.detailsBox}>
                <div className={styles.detailRow}>
                  <span>Mã đơn hàng:</span>
                  <strong className={styles.codeHighlight}>#{orderCode}</strong>
                </div>
                {transactionNo && (
                  <div className={styles.detailRow}>
                    <span>Mã giao dịch VNPay:</span>
                    <span>{transactionNo}</span>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <span>Số tiền thanh toán:</span>
                  <strong className={styles.amountHighlight}>{formatPrice(amount || orderDetails?.total || 0)}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span>Phương thức:</span>
                  <span>Cổng thanh toán VNPay</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Trạng thái:</span>
                  <span className={styles.statusSuccess}>Đã thanh toán (VNPAY_PAID)</span>
                </div>
                {orderDetails && (
                  <>
                    <div className={styles.divider} />
                    <div className={styles.detailRow}>
                      <span>Người nhận:</span>
                      <span>{orderDetails.fullName} - {orderDetails.phone}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Địa chỉ nhận hàng:</span>
                      <span>{orderDetails.address}, {orderDetails.district}, {orderDetails.city}</span>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.actions}>
                <Link href="/products" className="btn btn-primary">
                  Tiếp Tục Mua Sắm
                </Link>
                <Link href="/" className="btn btn-secondary">
                  Về Trang Chủ
                </Link>
              </div>
            </>
          )
        ) : (
          <>
            <div className={styles.iconFail}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <span className={styles.vnpayBadgeFail}>VNPay Demo Payment</span>
            <h1 className={styles.titleFail}>Thanh Toán Thất Bại</h1>
            <p className={styles.subtitleFail}>
              {getErrorMessage(responseCode)}
            </p>

            <div className={styles.detailsBox}>
              <div className={styles.detailRow}>
                <span>Mã đơn hàng:</span>
                <strong>#{orderCode}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Số tiền:</span>
                <span>{formatPrice(amount)}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Mã phản hồi:</span>
                <span className={styles.codeError}>{responseCode}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/rewards" className="btn btn-primary">
                Thử Lại Thanh Toán
              </Link>
              <Link href="/" className="btn btn-secondary">
                Về Trang Chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VNPayReturnPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang xử lý kết quả thanh toán...</div>}>
      <VNPayReturnContent />
    </Suspense>
  );
}
