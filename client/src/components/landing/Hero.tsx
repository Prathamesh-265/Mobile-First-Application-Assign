"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckSquare } from "lucide-react";
import { useGSAP, gsap } from "../../lib/gsap";
import { ProductPreview } from "./ProductPreview";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useGSAP(
    () => {
      
      router.prefetch("/login");
      router.prefetch("/register");

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.4 },
      )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2",
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.35",
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.25",
        )
        .fromTo(
          ".hero-preview",
          { opacity: 0, x: 40, rotateY: -8 },
          { opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5",
        );
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 sm:pt-32"
    >
      <div
        className="bg-dot-grid pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div className="text-center lg:text-left">
          <span className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60">
            <CheckSquare className="h-3.5 w-3.5 text-accent-400" />
            Weather-aware task tracking
          </span>

          <h1 className="hero-title font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Tasks that know{" "}
            <span className="text-accent-400">where you&apos;re headed</span>
          </h1>

          <p className="hero-sub mx-auto mt-5 max-w-lg text-base text-white/50 sm:text-lg lg:mx-0">
            Add a location to any task and get live weather right on the card -
            built for field work, outdoor plans, or anything worth checking the
            sky for first.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/register"
              className="hero-cta inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 text-sm font-medium text-white transition-colors hover:bg-accent-600"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="hero-cta inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>

        <div
          className="hero-preview flex justify-center"
          style={{ perspective: "1200px" }}
        >
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
