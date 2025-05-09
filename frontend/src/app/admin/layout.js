'use client';

import CommonLayout from '@/components/layout/CommonLayout';
import RouteGuard from '@/components/auth/RouteGuard';

export default function AdminLayout({ children }) {
  return (
    <RouteGuard requiredRoles="admin">
      <CommonLayout>{children}</CommonLayout>
    </RouteGuard>
  );
}
