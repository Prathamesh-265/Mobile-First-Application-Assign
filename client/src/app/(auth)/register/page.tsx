import type { Metadata } from "next";
import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { RegisterForm } from "../../../components/auth/RegisterForm";

export const metadata: Metadata = { title: "Sign up - Task Manager" };

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="page-enter card w-full max-w-md p-8 sm:p-10">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500">
            <CheckSquare className="h-4.5 w-4.5" />
          </span>
          Task Manager
        </Link>

        <h1 className="mb-1 text-center text-xl font-semibold text-white">
          Create your account
        </h1>
        <p className="mb-7 text-center text-sm text-white/50">
          Takes about ten seconds.
        </p>

        <RegisterForm />
      </div>
    </main>
  );
}
