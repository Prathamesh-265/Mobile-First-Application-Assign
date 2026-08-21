import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Task, TaskFormValues } from '../types/task';

function toFormData(values: Partial<TaskFormValues>, file?: File | null) {
  const formData = new FormData();
  if (values.title) formData.append('title', values.title);
  if (values.description) formData.append('description', values.description);
  if (values.status) formData.append('status', values.status);
  if (values.priority) formData.append('priority', values.priority);
  if (values.dueDate) formData.append('dueDate', values.dueDate);
  if (values.location) formData.append('location', values.location);
  if (file) formData.append('attachment', file);
  return formData;
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ values, file }: { values: TaskFormValues; file?: File | null }) => {
      const { data } = await api.post<{ data: Task }>('/tasks', toFormData(values, file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created');
    },
    onError: () => toast.error('Could not create the task - try again'),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
      file,
    }: {
      id: string;
      values: Partial<TaskFormValues>;
      file?: File | null;
    }) => {
      const { data } = await api.patch<{ data: Task }>(
        `/tasks/${id}`,
        toFormData(values, file),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated');
    },
    onError: () => toast.error('Could not update the task - try again'),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
    onError: () => toast.error('Could not delete the task - try again'),
  });
}
