'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { requestForgotPassword, resetUserPassword } from '@/services/api';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const router = useRouter();
  const { isAuthOpen, authMode, setAuthMode, closeAuth, login, register } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Forgot password flow state (3 steps)
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [simulatedEmailNotice, setSimulatedEmailNotice] = useState<string | null>(null);

  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    setError('');
    if (!isAuthOpen) {
      setLoginEmail('');
      setLoginPassword('');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirm('');
      setForgotStep(1);
      setForgotEmail('');
      setGeneratedOtp('');
      setOtpInput('');
      setNewPassword('');
      setConfirmNewPassword('');
      setSimulatedEmailNotice(null);
      setLoading(false);
    }
  }, [isAuthOpen, authMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setLoading(true);
    const loggedUser = await login(loginEmail, loginPassword);
    setLoading(false);
    if (loggedUser) {
      if (loggedUser.role === 'ADMIN') {
        showToast('Đăng nhập Quản trị thành công! 🚀 Chuyển đến trang Admin.');
        router.push('/admin');
      } else {
        showToast(`Đăng nhập thành công! Chào mừng ${loggedUser.name} 👋`);
      }
    } else {
      setError('Email hoặc mật khẩu không đúng. (Gợi ý: admin@luxe.vn / admin123 hoặc user@luxe.vn / 123456)');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName || !regEmail || !regPassword || !regConfirm) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (regPassword !== regConfirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (regPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    const registeredUser = await register(regName, regEmail, regPassword);
    setLoading(false);
    if (registeredUser) {
      showToast(`Chào mừng ${regName} đến với LUXE! 🎉`);
    }
  };

  /* Forgot Password Step 1: Send OTP to Email */
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ Gmail hợp lệ');
      return;
    }
    setLoading(true);
    const res = await requestForgotPassword(forgotEmail);
    setLoading(false);

    const otpCode = res.otp || String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otpCode);
    setSimulatedEmailNotice(`📧 HỘP THƯ GMAIL: Mã xác thực khôi phục mật khẩu của bạn là: [ ${otpCode} ]`);
    setForgotStep(2);
    showToast(`Mã OTP 6 chữ số đã được gửi tới ${forgotEmail}`);
  };

  /* Forgot Password Step 2: Verify OTP Code */
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otpInput) {
      setError('Vui lòng nhập mã OTP 6 chữ số');
      return;
    }
    if (otpInput.trim() !== generatedOtp.trim()) {
      setError('Mã OTP không chính xác. Vui lòng kiểm tra lại!');
      return;
    }
    setForgotStep(3);
    setError('');
    showToast('Xác thực OTP thành công! Vui lòng nhập mật khẩu mới.');
  };

  /* Forgot Password Step 3: Reset New Password */
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmNewPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    await resetUserPassword(forgotEmail, newPassword);
    setLoading(false);

    showToast('🎉 Đổi mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
    setLoginEmail(forgotEmail);
    setLoginPassword(newPassword);
    setAuthMode('login');
  };

  const fillDemoAdmin = () => {
    setLoginEmail('admin@luxe.vn');
    setLoginPassword('admin123');
  };

  const fillDemoUser = () => {
    setLoginEmail('user@luxe.vn');
    setLoginPassword('123456');
  };

  if (!isAuthOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={closeAuth} />
      <div className={styles.modal}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={closeAuth} aria-label="Đóng">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>LUXE</span>
        </div>

        {/* Tabs - Only 2 clean tabs (Login & Register) */}
        {authMode !== 'forgot' && (
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${authMode === 'login' ? styles.tabActive : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Đăng Nhập
            </button>
            <button
              className={`${styles.tab} ${authMode === 'register' ? styles.tabActive : ''}`}
              onClick={() => setAuthMode('register')}
            >
              Đăng Ký
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={styles.error}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* Login Form */}
        {authMode === 'login' && (
          <form className={styles.form} onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="input-group">
              <div className={styles.labelRow}>
                <label className="input-label">Mật khẩu</label>
                <button
                  type="button"
                  className={styles.forgot}
                  onClick={() => { setAuthMode('forgot'); setForgotStep(1); setForgotEmail(loginEmail); }}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className={styles.passWrap}>
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className={styles.showPass} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Quick Fill Demo buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={fillDemoAdmin}
                style={{
                  flex: 1,
                  padding: '0.4rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid #3b82f6',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  cursor: 'pointer'
                }}
              >
                👑 Thử tài khoản Admin
              </button>
              <button
                type="button"
                onClick={fillDemoUser}
                style={{
                  flex: 1,
                  padding: '0.4rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid #94a3b8',
                  backgroundColor: '#f8fafc',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                👤 Thử tài khoản Khách
              </button>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Đăng Nhập'}
            </button>

            <div className={styles.dividerLine}>
              <span>hoặc</span>
            </div>

            <button type="button" className={`btn btn-ghost ${styles.socialBtn}`}>
              <GoogleIcon /> Tiếp tục với Google
            </button>
          </form>
        )}

        {/* Register Form */}
        {authMode === 'register' && (
          <form className={styles.form} onSubmit={handleRegister}>
            <div className="input-group">
              <label className="input-label">Họ và tên</label>
              <input
                className="input"
                type="text"
                placeholder="Nguyễn Văn A"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="your@email.com"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Mật khẩu</label>
              <div className={styles.passWrap}>
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Ít nhất 6 ký tự"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className={styles.showPass} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Xác nhận mật khẩu</label>
              <input
                className="input"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={regConfirm}
                onChange={e => setRegConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <p className={styles.terms}>
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <a href="#">Điều khoản sử dụng</a> và{' '}
              <a href="#">Chính sách bảo mật</a> của chúng tôi.
            </p>

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Tạo Tài Khoản'}
            </button>
          </form>
        )}

        {/* Forgot Password View */}
        {authMode === 'forgot' && (
          <div className={styles.form}>
            {/* Header Title with Back button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--color-gold, #d97706)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                ← Quay lại Đăng Nhập
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-fg-muted, #94a3b8)' }}>
                Khôi Phục Mật Khẩu
              </span>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.625rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: forgotStep === 1 ? 'var(--color-gold, #d97706)' : '#64748b' }}>
                1. Nhập Gmail
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: forgotStep === 2 ? 'var(--color-gold, #d97706)' : '#64748b' }}>
                2. Nhập Mã OTP
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: forgotStep === 3 ? 'var(--color-gold, #d97706)' : '#64748b' }}>
                3. Đổi Mật Khẩu
              </span>
            </div>

            {/* STEP 1: Enter Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleRequestOtp}>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Nhập địa chỉ Gmail đã đăng ký để nhận mã xác minh OTP 6 chữ số khôi phục mật khẩu.
                </p>
                <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="input-label">Địa chỉ Gmail khôi phục</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="your@email.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : '📩 Gửi Mã OTP Xác Thực'}
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP Code */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Mã OTP 6 chữ số đã được gửi đến <strong style={{ color: '#ffffff' }}>{forgotEmail}</strong>. Nhập mã OTP bên dưới để xác minh.
                </p>
                <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="input-label">Mã xác thực OTP (6 chữ số)</label>
                  <input
                    className="input"
                    type="text"
                    maxLength={6}
                    placeholder="Nhập 6 chữ số..."
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                    style={{ fontSize: '1.25rem', letterSpacing: '4px', textAlign: 'center', fontWeight: 800 }}
                    required
                  />
                </div>
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                  ✓ Xác Nhận Mã OTP
                </button>
                <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                  <button type="button" className={styles.switchBtn} onClick={() => setForgotStep(1)}>
                    ← Gửi lại mã khác
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Reset New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPasswordSubmit}>
                <p style={{ fontSize: '0.85rem', color: '#166534', backgroundColor: '#dcfce7', padding: '8px 12px', borderRadius: '6px', marginBottom: '1rem', fontWeight: 600 }}>
                  ✓ Đã xác minh OTP cho {forgotEmail}. Vui lòng nhập mật khẩu mới!
                </p>
                <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Mật khẩu mới</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Ít nhất 6 ký tự"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="input-label">Xác nhận mật khẩu mới</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : '🔑 Xác Nhận Đổi Mật Khẩu'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Switch mode */}
        {authMode !== 'forgot' && (
          <p className={styles.switchMode}>
            {authMode === 'login' ? (
              <>Chưa có tài khoản? <button className={styles.switchBtn} onClick={() => setAuthMode('register')}>Đăng ký ngay</button></>
            ) : (
              <>Đã có tài khoản? <button className={styles.switchBtn} onClick={() => setAuthMode('login')}>Đăng nhập</button></>
            )}
          </p>
        )}
      </div>
    </>
  );
}

function EyeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
}
