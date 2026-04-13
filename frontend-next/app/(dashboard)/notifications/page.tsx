'use client';

import TopNavigation from '@/components/layout/TopNavigation';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <TopNavigation />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Notifications</h1>
        <p className="text-neutral-600">No new notifications.</p>
      </div>
    </div>
  );
}
