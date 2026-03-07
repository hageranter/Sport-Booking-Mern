import { api } from '@/lib/axios';
import type { Court, CourtsListParams } from '@/types';

interface CourtsResponse {
  data: { courts?: Court[]; total?: number; page?: number; limit?: number; totalPages?: number };
}

export const fieldService = {
  getAll: (params?: CourtsListParams) =>
    api.get<CourtsResponse>('/courts', { params }),

  getById: (id: string) =>
    api.get<{ data: Court }>(`/courts/${id}`),

  search: (q: string, params?: { page?: number; limit?: number }) =>
    api.get<CourtsResponse>('/courts/search/query', { params: { q, ...params } }),

  getMyCourts: () =>
    api.get<CourtsResponse>('/courts/owner/my-courts'),
};
