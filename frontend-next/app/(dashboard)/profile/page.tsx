'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import TopNavigation from '@/components/layout/TopNavigation';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    language: user?.language || 'en',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopNavigation />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8 text-center">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center mb-4 overflow-hidden">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold text-primary-600">{user.fullName?.charAt(0)}</span>
              )}
            </div>
            <button
              type="button"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Upload Photo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as 'ar' | 'en' })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-md"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
