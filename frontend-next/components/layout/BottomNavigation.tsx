'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    name: 'Home',
    path: '/',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'fill-primary-600' : 'fill-neutral-400'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    name: 'Join',
    path: '/matches',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'fill-primary-600' : 'fill-neutral-400'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    name: 'Explore',
    path: '/fields',
    isFAB: true,
  },
  {
    name: 'Booking',
    path: '/bookings',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'fill-primary-600' : 'fill-neutral-400'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 10v8h-2v-8h2zm0-2h-2V4h2v4zm-4 2v8h-2v-8h2zm0-2h-2V4h2v4zM8 18H6V8h2v10zm0 2H6v-2h2v2zm6-2h-2V8h2v10zm0 2h-2v-2h2v2zm-8-8H4V8h2v2zm0 4H4v-2h2v2z" />
      </svg>
    ),
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'fill-primary-600' : 'fill-neutral-400'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex items-center justify-around h-16 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            if ('isFAB' in item && item.isFAB) {
              return (
                <Link key={item.name} href={item.path} className="absolute left-1/2 -translate-x-1/2 -top-6">
                  <div className="w-14 h-14 bg-primary-600 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors">
                    <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.path}
                className="flex flex-col items-center justify-center flex-1 py-2 transition-colors"
              >
                {'icon' in item && item.icon ? item.icon(isActive) : null}
                <span className={`text-xs mt-1 ${isActive ? 'text-primary-600 font-medium' : 'text-neutral-400'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
