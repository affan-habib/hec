'use client';

import MainLayout from '@/components/layout/MainLayout';
import RouteGuard from '@/components/auth/RouteGuard';

export default function AdminLayout({ children }) {
  return (
    <RouteGuard requiredRoles="admin">
      <MainLayout>{children}</MainLayout>
    </RouteGuard>
  );
}
