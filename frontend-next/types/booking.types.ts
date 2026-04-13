export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface Booking {
  _id: string;
  userId: string;
  courtId: string;
  startTime: string;
  endTime: string;
  duration?: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  paymentId?: string | null;
  qrCode?: string | null;
  notes?: string | null;
  court?: { name: string; location?: { address: string; city: string } };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingPayload {
  courtId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  currency?: string;
  notes?: string;
}

export interface BookingsListParams {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  courtId?: string;
  userId?: string;
}

export interface BookingsListResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
