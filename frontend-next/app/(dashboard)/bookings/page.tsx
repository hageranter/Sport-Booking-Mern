'use client';

import TopNavigation from '@/components/layout/TopNavigation';

const bookings = [
  { id: '1', court: 'El Ahly Club', date: 'Jan 25, 2026', time: '6:00 PM - 8:00 PM', status: 'Confirmed' as const, qrCode: 'QR123' },
  { id: '2', court: 'Cairo Stadium', date: 'Jan 26, 2026', time: '7:00 PM - 9:00 PM', status: 'Pending' as const, qrCode: 'QR124' },
  { id: '3', court: 'Sporting Club', date: 'Jan 20, 2026', time: '5:00 PM - 7:00 PM', status: 'Completed' as const, qrCode: 'QR122' },
];

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <TopNavigation />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8 text-center">My Bookings</h1>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-neutral-900">{booking.court}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-neutral-600">
                    <p>📅 {booking.date}</p>
                    <p>🕐 {booking.time}</p>
                  </div>
                </div>
                <div className="w-24 h-24 bg-neutral-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-neutral-500 mb-1">QR Code</div>
                    <div className="text-2xl">📱</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
