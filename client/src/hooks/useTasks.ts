import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/api';
import type { TaskFilters, TaskListResponse } from '../types/task';

function buildParams(filters: TaskFilters) {
  const params: Record<string, string | number> = { page: filters.page, limit: filters.limit };

  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.search) params.search = filters.search;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  return params;
}

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const { data } = await api.get<{ data: TaskListResponse }>('/tasks', {
        params: buildParams(filters),
      });
      return data.data;
    },
    // Keeps the previous page's tasks on screen while the next page loads
    // instead of flashing an empty grid on every filter/page change.
    placeholderData: keepPreviousData,
  });
}
