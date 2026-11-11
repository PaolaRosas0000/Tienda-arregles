export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-fiesta-hero relative overflow-hidden text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-16">
        <p className="font-bold uppercase tracking-widest text-sun">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg font-medium text-white/90">{subtitle}</p>}
      </div>
    </section>
  );
}
