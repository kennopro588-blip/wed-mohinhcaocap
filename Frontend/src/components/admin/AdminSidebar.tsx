'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminSidebar.module.css';

const menuItems = [
  { label: 'Tổng quan', path: '/admin', icon: '📊' },
  { label: 'Bán tại quầy (POS)', path: '/admin/pos', icon: '🖥️' },
  { label: 'Doanh thu & Lãi/Lỗ', path: '/admin/revenue', icon: '💰' },
  { label: 'Sản phẩm', path: '/admin/products', icon: '📦' },
  { label: 'Danh mục', path: '/admin/categories', icon: '🏷️' },
  { label: 'Nhập hàng & Tồn kho', path: '/admin/inventory', icon: '🏬' },
  { label: 'Đơn hàng', path: '/admin/orders', icon: '🛒' },
  { label: 'Nhân viên & Lương', path: '/admin/employees', icon: '👔' },
  { label: 'Người dùng', path: '/admin/users', icon: '👥' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <span className={styles.logoText}>LUXE</span>
        <span className={styles.logoBadge}>ADMIN</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Link href="/" className={styles.backHome}>
          <span>←</span> Quay lại Cửa hàng
        </Link>
      </div>
    </aside>
  );
}
