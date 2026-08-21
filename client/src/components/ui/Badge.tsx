import { cn } from '../../lib/utils';
import type { TaskPriority, TaskStatus } from '../../types/task';

const statusStyles: Record<TaskStatus, string> = {
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  IN_PROGRESS: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  DONE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const priorityStyles: Record<TaskPriority, string> = {
  LOW: 'bg-white/5 text-white/50 border-white/10',
  MEDIUM: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  HIGH: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusLabels: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        priorityStyles[priority],
      )}
    >
      {priority}
    </span>
  );
}
