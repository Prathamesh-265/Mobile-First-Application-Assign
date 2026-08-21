"use client";

import { Search } from "lucide-react";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import type { TaskFilters as TaskFiltersType } from "../../types/task";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (next: Partial<TaskFiltersType>) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <Input
          placeholder="Search tasks..."
          className="pl-10"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
        />
      </div>

      <Select
        value={filters.status ?? ""}
        onChange={(e) =>
          onChange({ status: (e.target.value || undefined) as any, page: 1 })
        }
        className="sm:w-40"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="DONE">Done</option>
      </Select>

      <Select
        value={filters.priority ?? ""}
        onChange={(e) =>
          onChange({ priority: (e.target.value || undefined) as any, page: 1 })
        }
        className="sm:w-40"
      >
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </Select>

      <Select
        value={`${filters.sortBy}:${filters.sortOrder}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(":");
          onChange({
            sortBy: sortBy as any,
            sortOrder: sortOrder as any,
            page: 1,
          });
        }}
        className="sm:w-44"
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="dueDate:asc">Due date (soonest)</option>
        <option value="dueDate:desc">Due date (latest)</option>
        <option value="priority:desc">Priority</option>
        <option value="title:asc">Title (A-Z)</option>
      </Select>
    </div>
  );
}
