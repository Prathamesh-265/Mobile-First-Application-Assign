export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface WeatherSnapshot {
  tempC: number;
  feelsLikeC: number;
  description: string;
  icon: string;
  cityName: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  location?: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  weather: WeatherSnapshot | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface TaskListResponse {
  tasks: Task[];
  meta: PaginationMeta;
}

export interface TaskFilters {
  page: number;
  limit: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Fields the create/edit form collects - file is handled separately since
// it goes into a FormData, not the JSON body.
export interface TaskFormValues {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  location?: string;
}
