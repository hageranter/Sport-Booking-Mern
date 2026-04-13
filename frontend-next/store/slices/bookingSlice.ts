import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { bookingService } from '@/services/booking.service';
import type { Booking, CreateBookingPayload, BookingsListParams } from '@/types';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  total: 0,
  page: 1,
  totalPages: 0,
  loading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk<
  { bookings: Booking[]; total: number; page: number; totalPages: number },
  BookingsListParams | undefined,
  { rejectValue: string }
>(
  'bookings/fetchBookings',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.getAll(params);
      const bookings = data.data?.bookings ?? [];
      const total = data.data?.total ?? bookings.length;
      const page = data.data?.page ?? 1;
      const limit = data.data?.limit ?? 10;
      const totalPages = Math.ceil(total / limit) || 1;
      return { bookings, total, page, totalPages };
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to load bookings';
      return rejectWithValue(message || 'Failed to load bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk<
  Booking,
  string,
  { rejectValue: string }
>(
  'bookings/fetchBookingById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.getById(id);
      return data.data;
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to load booking';
      return rejectWithValue(message || 'Failed to load booking');
    }
  }
);

export const createBooking = createAsyncThunk<
  Booking,
  CreateBookingPayload,
  { rejectValue: string }
>(
  'bookings/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.create(payload);
      return data.data;
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to create booking';
      return rejectWithValue(message || 'Failed to create booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.currentBooking = null;
        state.error = action.payload || null;
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const { clearCurrentBooking, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
