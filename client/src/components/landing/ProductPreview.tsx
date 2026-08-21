import { CloudSun, Paperclip } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../ui/Badge';

// A static, hand-built preview of the dashboard - not a real screenshot,
// so it never goes stale as the actual UI evolves, and it renders
// instantly (no image to load) while still giving the hero something
// concrete to look at instead of just text.
const previewTasks = [
  { title: 'Inspect roof after storm', status: 'PENDING' as const, priority: 'HIGH' as const, weather: '31°C, overcast' },
  { title: 'Client walkthrough call', status: 'IN_PROGRESS' as const, priority: 'MEDIUM' as const, weather: null },
  { title: 'Submit site survey report', status: 'DONE' as const, priority: 'LOW' as const, weather: '24°C, clear' },
];

export function ProductPreview() {
  return (
    <div className="card relative w-full max-w-md overflow-hidden">
      {/* Window chrome - just enough to read as "an app", not a real browser */}
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-xs text-white/30">Your tasks</span>
      </div>

      <div className="flex flex-col gap-2.5 p-4">
        {previewTasks.map((task) => (
          <div key={task.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-white">{task.title}</p>
              <StatusBadge status={task.status} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <PriorityBadge priority={task.priority} />
              {task.weather && (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-300">
                  <CloudSun className="h-3 w-3" />
                  {task.weather}
                </span>
              )}
              {task.status === 'DONE' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-accent-500/20 bg-accent-500/10 px-2 py-0.5 text-[11px] font-medium text-accent-300">
                  <Paperclip className="h-3 w-3" />
                  report.pdf
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating chip - the one deliberately "alive" element on the page,
          a slow vertical drift rather than anything looping fast or hard. */}
      <div className="animate-float absolute -right-4 -top-4 hidden rounded-xl border border-white/10 bg-ink-800 px-3 py-2 text-xs font-medium text-white shadow-card sm:flex sm:items-center sm:gap-1.5">
        <CloudSun className="h-3.5 w-3.5 text-sky-400" />
        Live weather synced
      </div>
    </div>
  );
}
