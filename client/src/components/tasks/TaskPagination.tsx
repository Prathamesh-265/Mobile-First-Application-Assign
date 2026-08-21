import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "../../types/task";

interface TaskPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function TaskPagination({ meta, onPageChange }: TaskPaginationProps) {
  if (meta.lastPage <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-white/40">
        Page {meta.page} of {meta.lastPage} - {meta.total} task
        {meta.total === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.lastPage}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
