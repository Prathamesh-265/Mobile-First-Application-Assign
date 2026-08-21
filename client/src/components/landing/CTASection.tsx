import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-28 pt-8 text-center sm:px-6">
      <div className="card p-10 sm:p-14">
        <h2 className="mb-3 font-display text-2xl font-semibold text-white sm:text-3xl">
          Ready to get organized?
        </h2>
        <p className="mb-8 text-white/50">
          Free to use, takes ten seconds to set up.
        </p>
        <Link
          href="/register"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent-500 px-6 text-sm font-medium text-white transition-colors hover:bg-accent-600"
        >
          Create your account
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
