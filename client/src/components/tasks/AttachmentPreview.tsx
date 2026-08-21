import { Paperclip } from "lucide-react";

export function AttachmentPreview({
  url,
  name,
}: {
  url?: string | null;
  name?: string | null;
}) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/20 bg-accent-500/10 px-2.5 py-1 text-xs font-medium text-accent-300 transition-colors hover:bg-accent-500/20"
    >
      <Paperclip className="h-3.5 w-3.5" />
      <span className="max-w-[140px] truncate">{name ?? "Attachment"}</span>
    </a>
  );
}
