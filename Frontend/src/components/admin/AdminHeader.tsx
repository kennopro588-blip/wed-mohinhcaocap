'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './AdminHeader.module.css';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Hệ thống Quản trị Luxe Models</h1>
      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name || 'Administrator'}</span>
          <span className={styles.userRole}>SYSTEM ADMIN</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
