import Link from "next/link";
import { CheckSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-medium text-white/50">
          <CheckSquare className="h-4 w-4" />
          Task Manager
        </div>
        <div className="flex gap-6 text-sm text-white/40">
          <Link href="/login" className="hover:text-white/70">
            Log in
          </Link>
          <Link href="/register" className="hover:text-white/70">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
