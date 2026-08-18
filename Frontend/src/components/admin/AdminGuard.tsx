'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, openAuth } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Access Denied if not logged in or not ADMIN
  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '2.5rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 1.5rem auto'
          }}>
            🔒
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
            Truy Cập Bị Từ Chối (403)
          </h2>

          <p style={{ fontSize: '0.938rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
            {isLoggedIn ? (
              <>Tài khoản <strong>{user?.name}</strong> của bạn là tài khoản Khách hàng (USER) và không có quyền truy cập vào trang Quản trị.</>
            ) : (
              <>Bạn cần đăng nhập bằng tài khoản <strong>Quản trị viên (ADMIN)</strong> để truy cập vào hệ thống này.</>
            )}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => {
                openAuth('login');
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.938rem'
              }}
            >
              🔑 Đăng Nhập Tài Khoản Admin
            </button>

            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                fontWeight: 500,
                borderRadius: '8px',
                border: '1px solid #334155',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ← Quay về Trang Chủ Cửa Hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
