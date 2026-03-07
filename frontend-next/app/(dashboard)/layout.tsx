'use client';

import { DashboardGuard } from '@/components/auth/DashboardGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardGuard>{children}</DashboardGuard>;
}
