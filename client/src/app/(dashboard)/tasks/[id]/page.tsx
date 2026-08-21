"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { StatusBadge, PriorityBadge } from "../../../../components/ui/Badge";
import { WeatherBadge } from "../../../../components/tasks/WeatherBadge";
import { AttachmentPreview } from "../../../../components/tasks/AttachmentPreview";
import { TaskFormModal } from "../../../../components/tasks/TaskFormModal";
import { ConfirmDialog } from "../../../../components/shared/ConfirmDialog";
import { ErrorState } from "../../../../components/shared/ErrorState";
import { Button } from "../../../../components/ui/Button";
import { Skeleton } from "../../../../components/ui/Skeleton";
import api from "../../../../lib/api";
import { useDeleteTask } from "../../../../hooks/useTaskMutations";
import { formatDueDate } from "../../../../lib/utils";
import type { Task } from "../../../../types/task";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["task", params.id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Task }>(`/tasks/${params.id}`);
      return data.data;
    },
  });

  const deleteTask = useDeleteTask();

  async function handleDelete() {
    await deleteTask.mutateAsync(params.id);
    router.push("/dashboard");
  }

  return (
    <>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        {isLoading && (
          <div className="card p-6">
            <Skeleton className="mb-4 h-7 w-2/3" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {task && (
          <div className="card p-6 sm:p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold text-white">
                {task.title}
              </h1>
              <StatusBadge status={task.status} />
            </div>

            {task.description && (
              <p className="mb-6 text-white/60">{task.description}</p>
            )}

            <div className="mb-6 flex flex-wrap gap-2">
              <PriorityBadge priority={task.priority} />
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                <Calendar className="h-3.5 w-3.5" />
                {formatDueDate(task.dueDate)}
              </span>
              {task.location && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                  <MapPin className="h-3.5 w-3.5" />
                  {task.location}
                </span>
              )}
              <WeatherBadge weather={task.weather} />
              <AttachmentPreview
                url={task.attachmentUrl}
                name={task.attachmentName}
              />
            </div>

            <div className="flex gap-2 border-t border-white/10 pt-6">
              <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
                Edit task
              </Button>
              <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </main>

      {task && (
        <TaskFormModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          editingTask={task}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete task"
        message={`Delete "${task?.title}"? This can't be undone.`}
        confirmLabel="Delete"
        isLoading={deleteTask.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </>
  );
}
