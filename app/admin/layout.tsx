import AdminShell from '@/components/admin/admin-shell';
import UserButton from '@/components/shared/header/user-button';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminShell userButton={<UserButton />}>
      {children}
    </AdminShell>
  );
}