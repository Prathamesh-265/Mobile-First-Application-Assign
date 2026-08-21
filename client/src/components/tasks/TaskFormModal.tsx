"use client";

import { FormEvent, useEffect, useState } from "react";
import { Paperclip } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { useCreateTask, useUpdateTask } from "../../hooks/useTaskMutations";
import type { Task, TaskFormValues } from "../../types/task";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask: Task | null;
}

const emptyValues: TaskFormValues = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "",
  location: "",
};

function toDateInputValue(dueDate?: string | null) {
  if (!dueDate) return "";
  return new Date(dueDate).toISOString().slice(0, 10);
}

export function TaskFormModal({
  isOpen,
  onClose,
  editingTask,
}: TaskFormModalProps) {
  const [values, setValues] = useState<TaskFormValues>(emptyValues);
  const [file, setFile] = useState<File | null>(null);
  const [titleError, setTitleError] = useState("");

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isSaving = createTask.isPending || updateTask.isPending;

  // Re-seed the form whenever we switch between "create" and editing a
  // different task, or the modal re-opens after being closed.
  useEffect(() => {
    if (!isOpen) return;
    setFile(null);
    setTitleError("");
    setValues(
      editingTask
        ? {
            title: editingTask.title,
            description: editingTask.description ?? "",
            status: editingTask.status,
            priority: editingTask.priority,
            dueDate: toDateInputValue(editingTask.dueDate),
            location: editingTask.location ?? "",
          }
        : emptyValues,
    );
  }, [isOpen, editingTask]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (values.title.trim().length === 0) {
      setTitleError("Give the task a title");
      return;
    }

    if (editingTask) {
      await updateTask.mutateAsync({ id: editingTask.id, values, file });
    } else {
      await createTask.mutateAsync({ values, file });
    }
    onClose();
  }

  function update<K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTask ? "Edit task" : "New task"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          error={titleError}
          placeholder="e.g. Inspect roof after storm"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">
            Description
          </label>
          <textarea
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            placeholder="Optional details"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent-500 focus:bg-white/[0.07]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            value={values.status}
            onChange={(e) => update("status", e.target.value as any)}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </Select>

          <Select
            label="Priority"
            value={values.priority}
            onChange={(e) => update("priority", e.target.value as any)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Due date"
            type="date"
            value={values.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
          />
          <Input
            label="Location"
            placeholder="City or place"
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">
            Attachment
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-white/50 transition-colors hover:border-accent-500/40 hover:bg-accent-500/[0.04] hover:text-white/80">
            <Paperclip className="h-4 w-4" />
            {file?.name ??
              editingTask?.attachmentName ??
              "Attach a file or image"}
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {editingTask ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
