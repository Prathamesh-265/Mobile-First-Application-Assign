"use client";

import Link from "next/link";
import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { WeatherBadge } from "./WeatherBadge";
import { AttachmentPreview } from "./AttachmentPreview";
import { cn, formatDueDate, isOverdue } from "../../lib/utils";
import type { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="task-card group relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <Link href={`/tasks/${task.id}`} className="min-w-0">
          <h3 className="truncate font-semibold text-white hover:text-accent-300">
            {task.title}
          </h3>
        </Link>
        <StatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="mb-4 line-clamp-2 text-sm text-white/50">
          {task.description}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <PriorityBadge priority={task.priority} />

        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60",
            overdue && "border-red-500/30 bg-red-500/10 text-red-400",
          )}
        >
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

      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="rounded-lg p-2 text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
