import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-16 text-center">
      <AlertTriangle className="mb-4 h-8 w-8 text-red-400" />
      <h3 className="mb-1 text-base font-semibold text-white">
        Something went wrong
      </h3>
      <p className="mb-5 max-w-xs text-sm text-white/50">
        {message ??
          "Couldn't load your tasks. Check your connection and try again."}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
