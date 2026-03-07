import { api } from '@/lib/axios';
import type { Booking, CreateBookingPayload, BookingsListParams } from '@/types';

interface BookingsResponse {
  data: {
    bookings?: Booking[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export const bookingService = {
  getAll: (params?: BookingsListParams) =>
    api.get<BookingsResponse>('/bookings', { params }),

  getById: (id: string) =>
    api.get<{ data: Booking }>(`/bookings/${id}`),

  create: (payload: CreateBookingPayload) =>
    api.post<{ data: Booking }>('/bookings', payload),

  update: (id: string, payload: Partial<CreateBookingPayload> & { status?: string }) =>
    api.put<{ data: Booking }>(`/bookings/${id}`, payload),

  delete: (id: string) =>
    api.delete(`/bookings/${id}`),
};
