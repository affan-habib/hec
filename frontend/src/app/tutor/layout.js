'use client';

import CommonLayout from '@/components/layout/CommonLayout';
import RouteGuard from '@/components/auth/RouteGuard';

export default function TutorLayout({ children }) {
  return (
    <RouteGuard requiredRoles="tutor">
      <CommonLayout>{children}</CommonLayout>
    </RouteGuard>
  );
}
