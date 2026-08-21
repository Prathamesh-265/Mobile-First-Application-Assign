const stack = ['NestJS', 'PostgreSQL', 'Next.js', 'Cloudinary', 'OpenWeatherMap'];

// Honest, factual - the real stack this app is built on, not fabricated
// social proof (fake user counts, fake company logos).
export function TechStack() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-6 sm:px-6">
      <p className="mb-4 text-center text-xs uppercase tracking-wider text-white/30">Built with</p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {stack.map((name) => (
          <span key={name} className="text-sm font-medium text-white/40">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
