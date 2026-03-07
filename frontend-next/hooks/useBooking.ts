'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBookings, createBooking } from '@/store/slices/bookingSlice';
import type { CreateBookingPayload, BookingsListParams } from '@/types';

export function useBooking() {
  const dispatch = useAppDispatch();
  const { bookings, currentBooking, loading, error } = useAppSelector(
    (state) => state.bookings
  );

  const loadBookings = (params?: BookingsListParams) =>
    dispatch(fetchBookings(params));

  const book = (payload: CreateBookingPayload) =>
    dispatch(createBooking(payload));

  return {
    bookings,
    currentBooking,
    loading,
    error,
    loadBookings,
    book,
  };
}
