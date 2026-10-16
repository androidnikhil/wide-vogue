import AdminShell from '@/components/admin/admin-shell';
import UserButton from '@/components/shared/header/user-button';

export const dynamic = 'force-dynamic';

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