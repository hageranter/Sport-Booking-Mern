'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNavigation from '@/components/layout/TopNavigation';

const courts = [
  { id: '1', name: 'El Ahly Club', location: 'Alexandria', price: '300 EGP', sport: '5 A Side', image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800', isLiked: false },
  { id: '2', name: 'El Ahly Club Stadium', location: 'Alexandria', price: '300 EGP', sport: '5 A Side', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800', isLiked: true },
  { id: '3', name: 'El Ahly Training Ground', location: 'Alexandria', price: '300 EGP', sport: '5 A Side', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800', isLiked: false },
  { id: '4', name: 'Cairo Stadium', location: 'Cairo', price: '250 EGP', sport: '7 A Side', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', isLiked: false },
  { id: '5', name: 'Sporting Club', location: 'Alexandria', price: '350 EGP', sport: '5 A Side', image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800', isLiked: false },
  { id: '6', name: 'Zamalek Sports Club', location: 'Cairo', price: '400 EGP', sport: '11 A Side', image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800', isLiked: false },
];

export default function FieldsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'courts' | 'tournaments'>('courts');

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopNavigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8 text-center">Explore</h1>

        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-xl shadow-sm p-1 border border-neutral-200">
            <button
              type="button"
              onClick={() => setActiveTab('courts')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'courts' ? 'bg-primary-600 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Courts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tournaments')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'tournaments' ? 'bg-primary-600 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tournaments
            </button>
          </div>
        </div>

        {activeTab === 'courts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courts.map((court) => (
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
                  <div className="absolute top-4 left-4 flex items-center space-x-1.5 bg-neutral-900/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>{court.location}</span>
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
                <div className="p-5">
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">{court.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-neutral-900">{court.price}</span>
                    <span className="text-sm text-neutral-600">{court.sport}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 fill-primary-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Tournaments Coming Soon</h3>
            <p className="text-neutral-600">Check back later for exciting tournaments!</p>
          </div>
        )}
      </div>
    </div>
  );
}
