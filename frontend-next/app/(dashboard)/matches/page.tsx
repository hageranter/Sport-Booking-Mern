'use client';

import { useState } from 'react';
import TopNavigation from '@/components/layout/TopNavigation';

const matches = [
  { id: 1, name: 'Quick Match', location: 'El Ahly Club', date: 'Today, 6:00 PM', players: '8/12', sport: 'Football' },
  { id: 2, name: 'Evening Game', location: 'Cairo Stadium', date: 'Tomorrow, 7:00 PM', players: '10/14', sport: 'Football' },
  { id: 3, name: 'Weekend Match', location: 'Sporting Club', date: 'Sat, 4:00 PM', players: '6/10', sport: 'Basketball' },
];

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'my-matches' | 'joined'>('all');

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopNavigation />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8 text-center">Matches</h1>

        <div className="flex justify-center mb-8 space-x-2">
          {(['all', 'my-matches', 'joined'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === tab
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'my-matches' ? 'My Matches' : 'Joined'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 fill-primary-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{match.name}</h3>
                    <p className="text-sm text-neutral-600">{match.location}</p>
                    <p className="text-sm text-neutral-500">{match.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-neutral-900 mb-2">{match.players}</div>
                  <button
                    type="button"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
