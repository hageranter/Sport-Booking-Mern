'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import TopNavigation from '@/components/layout/TopNavigation';

const nearbyCourts = [
  {
    id: '1',
    name: 'El Ahly Club',
    location: 'New Cairo, Cairo',
    sport: 'Football_Outdoor',
    price: '15,000',
    priceUnit: 'EGP/Month',
    rating: 4.9,
    hours: '9:00-11:00 pm',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
    isLiked: false,
  },
  {
    id: '2',
    name: 'Zamalek Sports Club',
    location: 'Zamalek, Cairo',
    sport: 'Tennis_Indoor',
    price: '12,000',
    priceUnit: 'EGP/Month',
    rating: 4.8,
    hours: '8:00-10:00 am',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800',
    isLiked: false,
  },
  {
    id: '3',
    name: 'Sporting Club',
    location: 'Mohandessin, Giza',
    sport: 'Basketball_Indoor',
    price: '18,000',
    priceUnit: 'EGP/Month',
    rating: 4.7,
    hours: '6:00-8:00 pm',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    isLiked: true,
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return (
      <>
        <TopNavigation />
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
          <div className="text-center max-w-xl">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-primary-100 rounded-2xl flex items-center justify-center">
                <svg className="w-14 h-14 fill-primary-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">Welcome to CourtBooker</h1>
              <p className="text-xl text-neutral-600">Find and book sports courts, join tournaments, and connect with players!</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="px-8 py-3 text-neutral-700 font-semibold hover:text-primary-600 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-sm flex items-center space-x-2"
              >
                <span>Sign Up</span>
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />

      <div className="relative h-80 bg-primary-700 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1600')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-between py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-primary-600">{user.fullName.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Hello,</p>
                <p className="text-white font-bold text-xl">{user.fullName.split(' ')[0] || 'Guest'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/notifications')}
              className="relative p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-1 flex items-center">
              <div className="flex-1 flex items-center space-x-3 px-5">
                <svg className="w-5 h-5 fill-neutral-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search courts, sport or times"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-4 text-base text-neutral-900 placeholder-neutral-400 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') router.push(`/search?q=${searchQuery}`);
                  }}
                />
              </div>
              <button
                type="button"
                className="p-4 bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors"
                onClick={() => router.push('/search/filters')}
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">Nearby Courts</h2>
          <button
            type="button"
            onClick={() => router.push('/fields')}
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-1"
          >
            <span>See all</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyCourts.map((court) => (
            <div
              key={court.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/field/${court.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && router.push(`/field/${court.id}`)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-neutral-100"
            >
              <div className="relative h-56">
                <img src={court.image} alt={court.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white px-4 py-1.5 rounded-full shadow-md">
                  <span className="font-bold text-neutral-900">{court.price} {court.priceUnit}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors"
                >
                  <svg className={`w-5 h-5 ${court.isLiked ? 'fill-red-500' : 'fill-none stroke-neutral-400 stroke-2'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-neutral-900">{court.name}</h3>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 fill-neutral-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>{court.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-neutral-900">{court.rating}</span>
                    <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 fill-neutral-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
                    </svg>
                    <span>{court.sport.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 fill-neutral-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                    <span>{court.hours}</span>
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
