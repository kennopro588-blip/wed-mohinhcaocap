import ClientLayout from '@/components/user/ClientLayout';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
