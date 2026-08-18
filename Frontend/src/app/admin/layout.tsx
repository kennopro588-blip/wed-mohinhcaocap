import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <AdminSidebar />
        <AdminHeader />
        <main style={{ marginLeft: '260px', padding: '2rem' }}>
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
