import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge conditional class names and dedupe conflicting Tailwind utilities -
// the standard cn() combo, avoids "which class wins" surprises when a
// component both hardcodes a class and accepts an override via props.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDueDate(dueDate?: string | null): string {
  if (!dueDate) return 'No due date';

  const date = new Date(dueDate);
  const today = new Date();
  const diffDays = Math.round((date.getTime() - today.setHours(0, 0, 0, 0)) / 86_400_000);

  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays === -1) return 'Due yesterday';
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function isOverdue(dueDate?: string | null, status?: string): boolean {
  if (!dueDate || status === 'DONE') return false;
  return new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
}
