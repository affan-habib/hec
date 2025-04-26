'use client';

import CommonLayout from '@/components/layout/CommonLayout';
import RouteGuard from '@/components/auth/RouteGuard';

export default function StudentLayout({ children }) {
  return (
    <RouteGuard requiredRoles="student">
      <CommonLayout>{children}</CommonLayout>
    </RouteGuard>
  );
}
