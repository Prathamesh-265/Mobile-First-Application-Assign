"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckSquare, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-display text-lg font-semibold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500">
            <CheckSquare className="h-4.5 w-4.5" />
          </span>
          Task Manager
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden text-sm text-white/50 sm:inline">
              Hi, {user.name.split(" ")[0]}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
