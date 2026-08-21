"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskGrid } from "../../../components/tasks/TaskGrid";
import { TaskFilters } from "../../../components/tasks/TaskFilters";
import { TaskPagination } from "../../../components/tasks/TaskPagination";
import { TaskFormModal } from "../../../components/tasks/TaskFormModal";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { ErrorState } from "../../../components/shared/ErrorState";
import { Button } from "../../../components/ui/Button";
import { useTasks } from "../../../hooks/useTasks";
import { useDeleteTask } from "../../../hooks/useTaskMutations";
import type { Task, TaskFilters as TaskFiltersType } from "../../../types/task";

const defaultFilters: TaskFiltersType = {
  page: 1,
  limit: 9,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function DashboardPage() {
  const [filters, setFilters] = useState<TaskFiltersType>(defaultFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { data, isLoading, isError, refetch } = useTasks(filters);
  const deleteTask = useDeleteTask();

  function openCreateForm() {
    setEditingTask(null);
    setIsFormOpen(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deletingTask) return;
    await deleteTask.mutateAsync(deletingTask.id);
    setDeletingTask(null);
  }

  return (
    <>
      <main className="page-enter mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Your tasks</h1>
            <p className="text-sm text-white/50">
              Everything you need to get done, in one place.
            </p>
          </div>
          <Button onClick={openCreateForm} className="sm:w-auto">
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>

        <div className="mb-6">
          <TaskFilters
            filters={filters}
            onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
          />
        </div>

        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <>
            <TaskGrid
              tasks={data?.tasks ?? []}
              isLoading={isLoading}
              onEdit={openEditForm}
              onDelete={setDeletingTask}
              onCreateClick={openCreateForm}
            />
            {data?.meta && (
              <TaskPagination
                meta={data.meta}
                onPageChange={(page) =>
                  setFilters((prev) => ({ ...prev, page }))
                }
              />
            )}
          </>
        )}
      </main>

      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingTask={editingTask}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete task"
        message={`Delete "${deletingTask?.title}"? This can't be undone.`}
        confirmLabel="Delete"
        isLoading={deleteTask.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingTask(null)}
      />
    </>
  );
}
