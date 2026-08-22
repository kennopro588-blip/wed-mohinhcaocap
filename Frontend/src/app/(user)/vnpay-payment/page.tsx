'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './vnpay.module.css';

const TEST_CARDS = [
  { type: 'ATM Nội địa', number: '9704198526191432198', name: 'NGUYEN VAN A', expiry: '07/15', otp: '123456' },
  { type: 'ATM Nội địa', number: '9704195798459170488', name: 'NGUYEN VAN B', expiry: '07/15', otp: '123456' },
  { type: 'Visa Quốc tế', number: '4456530000001096',   name: 'NGUYEN VAN A', expiry: '10/26', otp: '—' },
  { type: 'Mastercard',  number: '5200000000001096',   name: 'NGUYEN VAN A', expiry: '01/26', otp: '—' },
];

function VNPayPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderCode = searchParams.get('vnp_TxnRef') || 'LX-000000';
  const amountRaw = searchParams.get('vnp_Amount') || '0';
  const amount    = Math.floor(Number(amountRaw) / 100);
  const orderInfo = searchParams.get('vnp_OrderInfo') || ('Thanh toán đơn hàng ' + orderCode);

  const [tab, setTab] = useState<'atm' | 'intl' | 'qr'>('atm');
  const [cardNumber, setCardNumber]     = useState('');
  const [cardName, setCardName]         = useState('');
  const [cardExpiry, setCardExpiry]     = useState('');
  const [otp, setOtp]                   = useState('');
  const [step, setStep]                 = useState<'form' | 'otp' | 'processing'>('form');
  const [countdown, setCountdown]       = useState(180);
  const [processingMsg, setProcessingMsg] = useState('Đang xác thực thông tin...');
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // OTP countdown
  useEffect(() => {
    if (step !== 'otp') return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  const formatAmount = (n: number) =>
    n.toLocaleString('vi-VN') + ' ₫';

  const handleFillTestCard = (idx: number) => {
    const card = TEST_CARDS[idx];
    setSelectedCard(idx);
    setCardNumber(card.number);
    setCardName(card.name);
    setCardExpiry(card.expiry);
    if (card.otp !== '—') setOtp(card.otp);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !cardExpiry) return;
    if (tab === 'atm') { setStep('otp'); setCountdown(180); }
    else { handleProcessPayment(true); }
  };

  const handleSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessPayment(true);
  };

  const handleProcessPayment = (success: boolean) => {
    setStep('processing');
    const msgs = success
      ? ['Đang xác thực thông tin...', 'Đang kết nối ngân hàng...', 'Đang xử lý giao dịch...', 'Hoàn tất!']
      : ['Đang xử lý...', 'Giao dịch bị từ chối...'];

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < msgs.length) setProcessingMsg(msgs[i]);
      else {
        clearInterval(interval);
        const params = new URLSearchParams({
          vnp_TxnRef:      orderCode,
          vnp_Amount:      amountRaw,
          vnp_ResponseCode: success ? '00' : '24',
          vnp_SecureHash:  'mock_verified_hash',
          vnp_TransactionNo: String(Math.floor(Math.random() * 999999999)),
        });
        router.push('/checkout/vnpay-return?' + params.toString());
      }
    }, 900);
  };

  const handleCancel = () => {
    const params = new URLSearchParams({
      vnp_TxnRef:       orderCode,
      vnp_Amount:       amountRaw,
      vnp_ResponseCode: '24',
      vnp_SecureHash:   'mock_cancelled',
    });
    router.push('/checkout/vnpay-return?' + params.toString());
  };

  // Processing screen
  if (step === 'processing') {
    return (
      <div className={styles.processingOverlay}>
        <div className={styles.processingBox}>
          <div className={styles.spinner}></div>
          <p className={styles.processingMsg}>{processingMsg}</p>
          <p className={styles.processingNote}>Vui lòng không đóng trang này</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* VNPay Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.vnpayLogo}>
            <div className={styles.logoBox}>
              <span className={styles.logoVN}>VN</span>
              <span className={styles.logoPay}>PAY</span>
            </div>
            <span className={styles.logoTagline}>Cổng thanh toán thử nghiệm</span>
          </div>
          <div className={styles.secureIcon}>
            🔒 Kết nối bảo mật SSL
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left: Payment form */}
          <div className={styles.formPanel}>
            {/* Tab selector */}
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${tab === 'atm' ? styles.tabActive : ''}`} onClick={() => setTab('atm')}>
                🏧 Thẻ ATM nội địa
              </button>
              <button className={`${styles.tab} ${tab === 'intl' ? styles.tabActive : ''}`} onClick={() => setTab('intl')}>
                💳 Visa / Mastercard
              </button>
              <button className={`${styles.tab} ${tab === 'qr' ? styles.tabActive : ''}`} onClick={() => setTab('qr')}>
                📱 QR Code
              </button>
            </div>

            {/* QR tab */}
            {tab === 'qr' && (
              <div className={styles.qrSection}>
                <div className={styles.qrBox}>
                  <div className={styles.qrCode}>
                    <div className={styles.qrPattern}></div>
                    <p className={styles.qrAmount}>{formatAmount(amount)}</p>
                  </div>
                  <p className={styles.qrInstr}>Mở app ngân hàng hoặc ví điện tử<br/>quét mã QR để thanh toán</p>
                  <div className={styles.qrBanks}>
                    {['VCB', 'TCB', 'MBB', 'ACB', 'BID'].map(b => (
                      <span key={b} className={styles.qrBank}>{b}</span>
                    ))}
                  </div>
                  <button className={`${styles.btnPrimary}`} onClick={() => handleProcessPayment(true)}>
                    ✓ Xác nhận đã quét QR (Demo)
                  </button>
                </div>
              </div>
            )}

            {/* ATM / Intl form */}
            {(tab === 'atm' || tab === 'intl') && step === 'form' && (
              <form onSubmit={handleSubmitForm} className={styles.form}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    {tab === 'atm' ? 'Số thẻ ATM' : 'Số thẻ Visa / Mastercard'}
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder={tab === 'atm' ? '970419XXXXXXXXXX' : '4456XXXXXXXXXXXX'}
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    required
                    maxLength={19}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tên chủ thẻ</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="NGUYEN VAN A"
                    value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Ngày hết hạn</label>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      required
                      maxLength={5}
                    />
                  </div>
                  {tab === 'intl' && (
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>CVV</label>
                      <input
                        className={styles.input}
                        type="text"
                        placeholder="XXX"
                        maxLength={4}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.btnPrimary}>
                    {tab === 'atm' ? 'Tiếp tục →' : 'Thanh toán ngay'}
                  </button>
                  <button type="button" className={styles.btnCancel} onClick={handleCancel}>
                    Hủy giao dịch
                  </button>
                </div>
              </form>
            )}

            {/* OTP step (ATM only) */}
            {tab === 'atm' && step === 'otp' && (
              <form onSubmit={handleSubmitOtp} className={styles.form}>
                <div className={styles.otpNotice}>
                  <div className={styles.otpIcon}>📲</div>
                  <p>Mã OTP đã được gửi đến số điện thoại đăng ký với ngân hàng</p>
                  <p className={styles.otpTimer}>
                    Hết hạn sau: <strong style={{ color: countdown < 30 ? '#ef4444' : 'var(--color-gold)' }}>
                      {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                    </strong>
                  </p>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Nhập mã OTP</label>
                  <input
                    className={`${styles.input} ${styles.otpInput}`}
                    type="text"
                    placeholder="Nhập 6 chữ số OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    autoFocus
                  />
                  <p className={styles.otpHint}>💡 Dùng OTP thử nghiệm: <strong>123456</strong></p>
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className={styles.btnPrimary}>Xác nhận thanh toán</button>
                  <button type="button" className={styles.btnCancel} onClick={handleCancel}>Hủy</button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Order summary + test cards */}
          <div className={styles.sidebar}>
            {/* Order info */}
            <div className={styles.orderCard}>
              <div className={styles.orderCardHeader}>
                <span>Thông tin đơn hàng</span>
              </div>
              <div className={styles.orderCardBody}>
                <div className={styles.orderRow}>
                  <span>Mã đơn hàng</span>
                  <span className={styles.orderCode}>{orderCode}</span>
                </div>
                <div className={styles.orderRow}>
                  <span>Nội dung</span>
                  <span className={styles.orderInfo}>{orderInfo}</span>
                </div>
                <div className={styles.orderDivider} />
                <div className={`${styles.orderRow} ${styles.orderTotal}`}>
                  <span>Số tiền thanh toán</span>
                  <span className={styles.orderAmount}>{formatAmount(amount)}</span>
                </div>
              </div>
            </div>

            {/* Test cards hint */}
            <div className={styles.testCardsBox}>
              <div className={styles.testCardsHeader}>
                🧪 Thẻ thử nghiệm (click để điền)
              </div>
              <div className={styles.testCardsList}>
                {TEST_CARDS.map((card, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.testCard} ${selectedCard === idx ? styles.testCardActive : ''}`}
                    onClick={() => { handleFillTestCard(idx); if (card.type.includes('Visa') || card.type.includes('Master')) setTab('intl'); else setTab('atm'); }}
                  >
                    <div className={styles.testCardType}>{card.type}</div>
                    <div className={styles.testCardNumber}>{card.number}</div>
                    <div className={styles.testCardMeta}>
                      <span>{card.name}</span>
                      <span>HH: {card.expiry}</span>
                      {card.otp !== '—' && <span>OTP: <strong>{card.otp}</strong></span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© VNPay – Cổng thanh toán thử nghiệm dành cho LUXE Models. Không có giao dịch thật nào được thực hiện.</p>
      </footer>
    </div>
  );
}

export default function VNPayPaymentPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>}>
      <VNPayPaymentContent />
    </Suspense>
  );
}
