import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fieldService } from '@/services/field.service';
import type { Court, CourtsListParams } from '@/types';

interface FieldState {
  fields: Court[];
  currentField: Court | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: FieldState = {
  fields: [],
  currentField: null,
  total: 0,
  page: 1,
  totalPages: 0,
  loading: false,
  error: null,
};

export const fetchFields = createAsyncThunk<
  { fields: Court[]; total: number; page: number; totalPages: number },
  CourtsListParams | undefined,
  { rejectValue: string }
>(
  'fields/fetchFields',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await fieldService.getAll(params);
      const fields = data.data?.courts ?? [];
      const total = data.data?.total ?? fields.length;
      const page = data.data?.page ?? 1;
      const limit = data.data?.limit ?? 10;
      const totalPages = Math.ceil(total / limit) || 1;
      return { fields, total, page, totalPages };
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to load fields';
      return rejectWithValue(message || 'Failed to load fields');
    }
  }
);

export const fetchFieldById = createAsyncThunk<
  Court,
  string,
  { rejectValue: string }
>(
  'fields/fetchFieldById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await fieldService.getById(id);
      return data.data;
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to load field';
      return rejectWithValue(message || 'Failed to load field');
    }
  }
);

const fieldSlice = createSlice({
  name: 'fields',
  initialState,
  reducers: {
    clearCurrentField: (state) => {
      state.currentField = null;
    },
    setFields: (state, action: PayloadAction<Court[]>) => {
      state.fields = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFields.fulfilled, (state, action) => {
        state.loading = false;
        state.fields = action.payload.fields;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchFieldById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentField = action.payload;
        state.error = null;
      })
      .addCase(fetchFieldById.rejected, (state, action) => {
        state.loading = false;
        state.currentField = null;
        state.error = action.payload || null;
      });
  },
});

export const { clearCurrentField, setFields } = fieldSlice.actions;
export default fieldSlice.reducer;
