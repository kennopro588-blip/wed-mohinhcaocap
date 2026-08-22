'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { fetchMyUserVouchers, ApiUserVoucher } from '@/services/api';
import { formatPrice } from '@/data/products';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const shippingFee = subtotal >= 500000 ? 0 : 50000;

  // Voucher state
  const [myVouchers, setMyVouchers] = useState<ApiUserVoucher[]>([]);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<ApiUserVoucher | null>(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  // Load user vouchers from MySQL database
  useEffect(() => {
    async function loadVouchers() {
      const data = await fetchMyUserVouchers();
      if (data && data.length > 0) {
        setMyVouchers(data);
      } else {
        // Fallback default welcome voucher for new users
        setMyVouchers([
          {
            id: 1,
            userId: 1,
            code: 'TANTHU100K',
            title: 'Gói Chào Bạn Mới - Giảm 100K',
            discountType: 'FIXED',
            discountValue: 100000,
            minOrder: 1000000,
            tag: 'TÂN THỦ 🎁',
          },
        ]);
      }
    }
    loadVouchers();
  }, []);

  // Calculate discount amount
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'PERCENT') {
      const rawDiscount = (subtotal * appliedVoucher.discountValue) / 100;
      discountAmount = appliedVoucher.maxDiscount
        ? Math.min(rawDiscount, appliedVoucher.maxDiscount)
        : rawDiscount;
    } else if (appliedVoucher.discountType === 'FIXED') {
      discountAmount = appliedVoucher.discountValue;
    } else if (appliedVoucher.discountType === 'SHIPPING') {
      discountAmount = shippingFee;
    }
  }
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  // Apply voucher by code string
  const handleApplyVoucher = (rawCode?: string) => {
    const code = (rawCode || voucherInput).trim().toUpperCase();
    if (!code) {
      showToast('Vui lòng nhập mã giảm giá', 'error');
      return;
    }

    const found = myVouchers.find(v => v.code.toUpperCase() === code);
    if (!found) {
      showToast(`Mã "${code}" chưa có trong ví của bạn! Hãy hoàn thành nhiệm vụ tại mục Săn Voucher để nhận mã nhé.`, 'error');
      return;
    }

    if (subtotal < (found.minOrder || 0)) {
      showToast(
        `Đơn hàng chưa đạt mức tối thiểu ${(found.minOrder || 0).toLocaleString('vi-VN')} ₫ để áp dụng mã ${found.code}!`,
        'error'
      );
      return;
    }

    setAppliedVoucher(found);
    setVoucherInput('');
    setIsVoucherModalOpen(false);

    showToast(`🎉 Đã áp dụng mã giảm giá ${found.code} thành công!`, 'success');
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    showToast('Đã gỡ bỏ mã giảm giá', 'info');
  };

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'momo' | 'zalopay' | 'vnpay'>('cod');
  const [note, setNote] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'error');
      return;
    }

    setIsSubmitting(true);
    const generatedCode = 'LX-' + Math.floor(100000 + Math.random() * 900000);

    // ── VNPay flow: redirect to simulated VNPay gateway ──────────────────
    if (paymentMethod === 'vnpay') {
      try {
        // Save order info to sessionStorage so vnpay-return can finalize it
        sessionStorage.setItem('vnpay_pending_order', JSON.stringify({
          orderCode: generatedCode,
          fullName, phone, email, address, city, district,
          total,
          discountAmount,
          voucherCode: appliedVoucher?.code || '',
          items: items.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            imageUrl: i.product.images[0] || '',
          })),
        }));

        const res = await fetch('http://localhost:8080/api/payment/vnpay/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderCode: generatedCode,
            amount: total,
            orderInfo: `Thanh toan don hang LUXE ${generatedCode}`,
          }),
        });
        const data = await res.json();
        if (data.paymentUrl) {
          router.push(data.paymentUrl);
          return;
        }
      } catch (err) {
        console.warn('VNPay API error, using fallback redirect:', err);
        // Fallback: redirect directly with params
        const params = new URLSearchParams({
          vnp_TxnRef: generatedCode,
          vnp_Amount: String(total * 100),
          vnp_OrderInfo: `Thanh toan don hang LUXE ${generatedCode}`,
          vnp_SecureHash: 'mock_hash_' + generatedCode,
        });
        router.push('/vnpay-payment?' + params.toString());
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    // ── Other payment methods (COD, MoMo, ZaloPay, Card) ─────────────────
    try {
      const orderItems = items.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        imageUrl: i.product.images[0] || '',
      }));

      const { createOrder } = await import('@/services/api');
      await createOrder({
        orderCode: generatedCode,
        userId: user ? Number(user.id) : undefined,
        fullName,
        phone,
        email,
        address,
        city,
        district,
        paymentMethod: paymentMethod.toUpperCase(),
        totalAmount: total,
        status: 'Pending',
        items: orderItems,
      });
    } catch (err) {
      console.warn('Backend API connection warning, fallback to client order complete:', err);
    } finally {
      setIsSubmitting(false);
      setOrderCode(generatedCode);
      setOrderComplete(true);
      clearCart();
    }
  };

  if (orderComplete) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>🎉</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', marginBottom: '12px' }}>
            Đặt Hàng Thành Công!
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Cảm ơn bạn đã mua sắm tại LUXE MODELS. Mã đơn hàng của bạn là:
          </p>
          <div style={{
            background: 'var(--color-gold-muted)',
            border: '1px dashed var(--color-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--color-gold)',
            letterSpacing: '2px',
            marginBottom: '32px',
            display: 'inline-block'
          }}>
            {orderCode}
          </div>

          <div className={styles.orderSummaryCard}>
            <h3>Thông Tin Đơn Hàng</h3>
            <p><strong>Người nhận:</strong> {fullName}</p>
            <p><strong>Số điện thoại:</strong> {phone}</p>
            <p><strong>Địa chỉ nhận hàng:</strong> {address}, {district}, {city}</p>
            <p><strong>Phương thức thanh toán:</strong> {
              paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :
              paymentMethod === 'vnpay' ? 'VNPay (Đã thanh toán)' :
              paymentMethod === 'momo' ? 'Ví MoMo' :
              paymentMethod === 'zalopay' ? 'Ví ZaloPay' : 'Thẻ Tín dụng / Ghi nợ'
            }</p>
            {appliedVoucher && (
              <p style={{ color: '#10b981' }}>
                <strong>Mã voucher áp dụng:</strong> {appliedVoucher.code} (-{formatPrice(discountAmount)})
              </p>
            )}
            <p><strong>Tổng thanh toán:</strong> <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>{formatPrice(total)}</span></p>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
            <Link href="/" className="btn btn-primary">
              Tiếp Tục Mua Sắm
            </Link>
            <Link href="/models" className="btn btn-outline">
              Xem Bộ Sưu Tập Khác
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Giỏ Hàng Trống</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Bạn chưa có sản phẩm nào trong giỏ hàng để thực hiện thanh toán.
        </p>
        <Link href="/models" className="btn btn-primary">
          Khám Phá Mô Hình Ngay
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Thanh Toán Đơn Hàng</h1>

        <form onSubmit={handleSubmitOrder} className={styles.grid}>
          {/* Form left */}
          <div className={styles.formContainer}>
            <h2 className={styles.sectionTitle}>1. Thông Tin Giao Hàng</h2>
            <div className={styles.formGrid}>
              <div className="input-group">
                <label className="input-label">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Số Điện Thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0901234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Email (Nhận mã đơn hàng)</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Địa Chỉ Nhận Hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên đường..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Tỉnh / Thành phố</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="input"
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Quận / Huyện</label>
                <input
                  type="text"
                  placeholder="Quận 1, Quận 3..."
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú về thời gian giao hàng, giao tận tay..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: '32px' }}>2. Phương Thức Thanh Toán</h2>
            <div className={styles.paymentMethods}>
              {[
                { id: 'cod',     label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi shipper giao hàng', icon: '💵' },
                { id: 'vnpay',  label: 'VNPay',                           desc: 'Thẻ ATM nội địa, Visa, Mastercard, QR Code qua VNPay', icon: '🏦', highlight: true },
                { id: 'momo',    label: 'Ví MoMo',                        desc: 'Quét mã QR qua ứng dụng MoMo', icon: '💜' },
                { id: 'zalopay', label: 'Ví ZaloPay',                     desc: 'Thanh toán nhanh qua ví ZaloPay', icon: '🔵' },
                { id: 'card',    label: 'Thẻ ATM / Visa / Mastercard',    desc: 'Cổng thanh toán bảo mật 256-bit', icon: '💳' },
              ].map((m: any) => (
                <label key={m.id} className={`${styles.paymentCard} ${paymentMethod === m.id ? styles.activePayment : ''} ${m.highlight ? styles.paymentHighlight : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id as any)}
                  />
                  <span className={styles.paymentIcon}>{m.icon}</span>
                  <div>
                    <p className={styles.paymentLabel}>
                      {m.label}
                      {m.highlight && <span className={styles.paymentBadge}>Khuyến nghị</span>}
                    </p>
                    <p className={styles.paymentDesc}>{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Summary right */}
          <div className={styles.summarySidebar}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Đơn Hàng Của Bạn ({items.length})</h3>

              <div className={styles.itemList}>
                {items.map(item => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className={styles.itemRow}>
                    <div className={styles.itemImage} style={{ background: item.product.images[0] }}>
                      <span className={styles.itemQtyBadge}>{item.quantity}</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.product.name}</p>
                      <p className={styles.itemMeta}>{item.selectedColor} / {item.selectedSize}</p>
                    </div>
                    <span className={styles.itemPrice}>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.divider} />

              {/* 🏷️ Voucher / Coupon section */}
              <div className={styles.voucherSection}>
                <div className={styles.voucherHeader}>
                  <span className={styles.voucherTitle}>🏷️ Mã Khuyến Mãi / Voucher</span>
                  <Link href="/rewards" style={{ fontSize: '11.5px', color: 'var(--color-gold)', textDecoration: 'none', fontWeight: 600 }}>
                    🎁 Săn thêm mã →
                  </Link>
                </div>

                {appliedVoucher ? (
                  <div className={styles.appliedVoucherBox}>
                    <div className={styles.appliedVoucherInfo}>
                      <span style={{ fontSize: '18px' }}>🎟️</span>
                      <div>
                        <div className={styles.appliedCode}>{appliedVoucher.code}</div>
                        <div className={styles.appliedDesc}>{appliedVoucher.title}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className={styles.removeVoucherBtn}
                      title="Gỡ bỏ mã giảm giá"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.voucherInputRow}>
                      <input
                        type="text"
                        placeholder="Nhập mã bạn sở hữu..."
                        value={voucherInput}
                        onChange={e => setVoucherInput(e.target.value)}
                        className={styles.voucherInput}
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyVoucher()}
                        className={styles.voucherApplyBtn}
                      >
                        Áp Dụng
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsVoucherModalOpen(true)}
                      className={styles.voucherBrowseBtn}
                    >
                      ✨ Chọn từ ví voucher của bạn ({myVouchers.length} mã đã nhận)
                    </button>
                  </>
                )}
              </div>

              <div className={styles.divider} />

              <div className={styles.calcRow}>
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.calcRow}>
                <span>Phí vận chuyển</span>
                <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
              </div>

              {discountAmount > 0 && (
                <div className={styles.discountRow}>
                  <span>Giảm giá Voucher ({appliedVoucher?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <span>Tổng cộng</span>
                <span className={styles.totalVal}>{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${styles.submitOrderBtn}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
              </button>

              <p className={styles.secureText}>🔒 Thông tin thanh toán được bảo mật an toàn</p>
            </div>
          </div>
        </form>
      </div>

      {/* 🎟️ My Owned Vouchers Modal */}
      {isVoucherModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsVoucherModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span>🏷️</span> Ví Voucher Của Bạn
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsVoucherModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.voucherListModal}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 6px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Đơn hiện tại: <strong style={{ color: 'var(--color-gold)' }}>{formatPrice(subtotal)}</strong>
                </span>
                <Link
                  href="/rewards"
                  onClick={() => setIsVoucherModalOpen(false)}
                  style={{ fontSize: '11.5px', color: 'var(--color-gold)', fontWeight: 700, textDecoration: 'underline' }}
                >
                  + Kiếm thêm voucher
                </Link>
              </div>

              {myVouchers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8' }}>
                  <p style={{ margin: 0, fontSize: '13px' }}>Ví của bạn chưa có mã nào khả dụng.</p>
                  <Link href="/rewards" className="btn btn-primary" style={{ marginTop: '12px', display: 'inline-block', fontSize: '12px', padding: '8px 16px' }}>
                    Săn Voucher Ngay 🎁
                  </Link>
                </div>
              ) : (
                myVouchers.map(v => {
                  const isSelected = appliedVoucher?.code === v.code;
                  const isEligible = subtotal >= (v.minOrder || 0);

                  return (
                    <div
                      key={v.id}
                      className={`${styles.voucherCardItem} ${isSelected ? styles.voucherCardSelected : ''}`}
                      style={{ opacity: isEligible ? 1 : 0.6 }}
                    >
                      <div className={styles.voucherCardLeft}>
                        <div className={styles.voucherCardCodeBadge}>
                          <span className={styles.voucherCodeText}>{v.code}</span>
                          <span className={styles.voucherTagBadge}>{v.tag || 'SỞ HỮU'}</span>
                        </div>
                        <div className={styles.voucherCardDesc}>{v.title}</div>
                        <div className={styles.voucherCardCondition}>
                          {v.discountType === 'PERCENT'
                            ? `Giảm ${v.discountValue}% (Tối đa ${(v.maxDiscount || 0).toLocaleString('vi-VN')} ₫)`
                            : v.discountType === 'SHIPPING'
                            ? 'Miễn phí vận chuyển toàn quốc'
                            : `Giảm trực tiếp ${v.discountValue.toLocaleString('vi-VN')} ₫`}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span className={styles.voucherCardExpiry}>
                            Đơn tối thiểu: {(v.minOrder || 0).toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      </div>

                      <div>
                        {isSelected ? (
                          <button
                            type="button"
                            className={`${styles.voucherSelectCardBtn} ${styles.voucherSelectCardBtnActive}`}
                            onClick={handleRemoveVoucher}
                          >
                            ✓ Đang Dùng
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={styles.voucherSelectCardBtn}
                            disabled={!isEligible}
                            onClick={() => handleApplyVoucher(v.code)}
                            style={{
                              background: isEligible ? '#2563eb' : '#475569',
                              cursor: isEligible ? 'pointer' : 'not-allowed'
                            }}
                          >
                            {isEligible ? 'Áp Dụng' : 'Chưa Đủ ĐK'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
