"use client";

import { useRef } from "react";
import { Bell, CloudSun, Paperclip, ShieldCheck } from "lucide-react";
import { useGSAP, gsap } from "../../lib/gsap";

const features = [
  {
    icon: CloudSun,
    title: "Live weather per task",
    description:
      "Tag a task with a city and see current conditions right on the card - no separate app to check.",
  },
  {
    icon: Bell,
    title: "Email that matters",
    description:
      "A confirmation when you create a task, a nod when you finish it. Nothing more, nothing less.",
  },
  {
    icon: Paperclip,
    title: "Attach the reference",
    description:
      "Drop a screenshot, a doc, whatever the task needs - stored securely, one click away.",
  },
  {
    icon: ShieldCheck,
    title: "Actually private",
    description:
      "Every task is scoped to your account at the database level. No one else ever sees it.",
  },
];

export function FeatureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.05,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <h2 className="mb-12 text-center font-display text-2xl font-semibold text-white sm:text-3xl">
        Built around the things that actually help
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="feature-card card p-6 transition-colors hover:border-white/20"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10">
              <Icon className="h-5 w-5 text-accent-400" />
            </div>
            <h3 className="mb-2 font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/50">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
