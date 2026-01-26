import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';

const CourtDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const court = {
    id,
    name: 'El Ahly Club Stadium',
    location: 'New Cairo, Cairo',
    price: '15,000 EGP/Month',
    sport: 'Football_Outdoor',
    rating: 4.9,
    capacity: '22 Players',
    hours: '9:00 AM - 11:00 PM',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600',
    amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Seating Area', 'Cafeteria', 'First Aid'],
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopNavigation />

      {/* Hero Image */}
      <div className="relative h-96 bg-neutral-900">
        <img src={court.image} alt={court.name} className="w-full h-full object-cover opacity-90" />
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white">
          <svg className="w-6 h-6 fill-neutral-900" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10 pb-32">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{court.name}</h1>
              <div className="flex items-center space-x-2 text-neutral-600">
                <svg className="w-5 h-5 fill-neutral-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{court.location}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 fill-yellow-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span className="text-2xl font-bold text-neutral-900">{court.rating}</span>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { icon: '💰', label: 'Price', value: court.price },
              { icon: '👥', label: 'Capacity', value: court.capacity },
              { icon: '⚽', label: 'Sport', value: court.sport.replace('_', ' ') },
              { icon: '🕐', label: 'Hours', value: court.hours },
            ].map((info, idx) => (
              <div key={idx} className="bg-neutral-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{info.icon}</div>
                <div className="text-xs text-neutral-600 mb-1">{info.label}</div>
                <div className="font-bold text-sm text-neutral-900">{info.value}</div>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {court.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-neutral-700">
                  <svg className="w-5 h-5 fill-primary-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-2xl z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-neutral-600">Starting from</div>
            <div className="text-2xl font-bold text-neutral-900">{court.price}</div>
          </div>
          <button className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtDetails;
