"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "../../lib/gsap";

const steps = [
  {
    number: "01",
    title: "Create a task",
    description:
      "Give it a title, priority, and a due date. Add a location if it happens somewhere specific.",
  },
  {
    number: "02",
    title: "Attach what it needs",
    description:
      "Drop in a reference doc or screenshot. It stays linked to the task, ready when you need it.",
  },
  {
    number: "03",
    title: "Get context automatically",
    description:
      "Live weather shows up on location-tagged tasks. Email confirms creation and completion, no setup.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".step-item").forEach((step, i) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: step, start: "top 88%" },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <h2 className="mb-12 text-center font-display text-2xl font-semibold text-white sm:text-3xl">
        How it works
      </h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="step-item">
            <span className="mb-3 block font-display text-3xl font-semibold text-accent-400/60">
              {step.number}
            </span>
            <h3 className="mb-2 font-semibold text-white">{step.title}</h3>
            <p className="text-sm text-white/50">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
