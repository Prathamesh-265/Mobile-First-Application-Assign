"use client";

import { useRef } from "react";
import { ListTodo } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TaskCardSkeleton } from "../ui/Skeleton";
import { EmptyState } from "../shared/EmptyState";
import { useGSAP, gsap } from "../../lib/gsap";
import type { Task } from "../../types/task";

interface TaskGridProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreateClick: () => void;
}

export function TaskGrid({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onCreateClick,
}: TaskGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  
  useGSAP(
    () => {
      if (!gridRef.current) return;
      gsap.fromTo(
        gridRef.current.querySelectorAll(".task-card"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
      );
    },
    { dependencies: [tasks.map((t) => t.id).join(",")], scope: gridRef },
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ListTodo}
        title="No tasks yet"
        description="Create your first task to get started - add a location and we'll show live weather for it."
        action={
          <button
            onClick={onCreateClick}
            className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600"
          >
            New task
          </button>
        }
      />
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
