import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/catalog";

const OCCASIONS = ["🎂 Cumpleaños", "💍 Bodas", "🍼 Baby shower", "🎓 Graduaciones", "❤️ Aniversarios", "👑 XV años", "🏢 Eventos de empresa", "🎃 Fiestas temáticas"];

const FLOATING = [
  { emoji: "🎈", className: "left-[6%] top-[14%] text-6xl hidden md:block", r: "-12deg", delay: "0s" },
  { emoji: "✨", className: "right-[8%] top-[10%] text-5xl hidden md:block", r: "10deg", delay: "1s" },
  { emoji: "🎉", className: "right-[4%] bottom-[18%] text-6xl hidden md:block", r: "8deg", delay: "2s" },
  { emoji: "🌸", className: "left-[3%] bottom-[12%] text-5xl hidden md:block", r: "-6deg", delay: "1.5s" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* HERO */}
      <section className="bg-fiesta-hero relative overflow-hidden text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          
          {FLOATING.map((item) => (
            <span
              key={item.emoji}
              className={`animate-float absolute ${item.className}`}
              style={{ "--r": item.r, animationDelay: item.delay } as React.CSSProperties}
            >
              {item.emoji}
            </span>
          ))}
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-mint" /> Globos · Flores · Decoración
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
              Decora tu fiesta <span className="text-sun drop-shadow-[0_4px_0_rgba(26,11,46,0.25)]">a tu gusto</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg font-medium text-white/90">
              Elige un arreglo listo o ármalo pieza por pieza: tipo, tamaño, colores, globos, flores y extras. Ves el
              precio al instante y te lo llevamos a tu evento.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/arma-tu-arreglo"
                className="rounded-full bg-sun px-7 py-4 text-base font-extrabold text-ink shadow-[0_8px_0_rgba(26,11,46,0.25)] transition hover:scale-[1.03]"
              >
                Arma tu arreglo →
              </Link>
              <Link
                href="/catalogo"
                className="rounded-full border-2 border-white px-7 py-4 text-base font-bold text-white transition hover:bg-white hover:text-brand"
              >
                Ver catálogo
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              {[
                ["6", "pasos para armarlo"],
                ["+30", "opciones"],
                ["100%", "personalizable"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-3xl font-extrabold text-sun">{value}</dt>
                  <dd className="text-sm font-medium text-white/85">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Vista previa del armador */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-sun" aria-hidden />
            <div className="relative rounded-[2rem] bg-white p-6 text-ink shadow-2xl">
              <div className="grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-cyan via-brand to-violet text-7xl">
                <div className="flex flex-wrap justify-center gap-2">
                  <span>🌈</span>
                  <span>🎈</span>
                  <span>🌹</span>
                  <span>⭐</span>
                  <span>💡</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                {["Arco de globos", "Grande", "Pastel", "Rosas ×6", "Luces LED"].map((chip) => (
                  <span key={chip} className="rounded-full bg-brand/10 px-3 py-1 text-brand">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs text-ink/60">Tu arreglo</p>
                  <p className="font-display text-3xl font-extrabold">$2,150</p>
                </div>
                <span className="bg-fiesta rounded-full px-4 py-2 text-sm font-bold text-white">Agregar 🛒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ocasiones */}
        <div className="relative overflow-hidden bg-sun py-4">
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-display text-lg font-extrabold text-ink">
            {[...OCCASIONS, ...OCCASIONS].map((occasion, index) => (
              <span key={index}>{occasion}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIANZA: ajusta estos compromisos a lo que tu negocio ofrece */}
      <section className="border-b border-ink/5 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["💬", "Te confirmamos por WhatsApp", "Revisamos cada pedido contigo antes de prepararlo."],
            ["🧾", "Precio claro", "Ves el total desde el inicio, sin cobros sorpresa."],
            ["🚚", "Entrega en tu evento", "Llegamos a la hora acordada y, si quieres, lo montamos."],
            ["⭐", "Hecho a mano", "Materiales de calidad y acabados cuidados."],
          ].map(([icon, title, text]) => (
            <div key={title} className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet/10 text-2xl">{icon}</span>
              <div>
                <h3 className="font-bold text-ink">{title}</h3>
                <p className="text-sm text-ink/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-widest text-brand">Favoritos</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight">Los más pedidos</h2>
          </div>
          <Link href="/catalogo" className="rounded-full border-2 border-ink px-5 py-2 font-bold transition hover:bg-ink hover:text-white">
            Ver todo el catálogo
          </Link>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="px-4 pb-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-trust p-8 text-white md:p-14">
          <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sun/30 blur-3xl" />
          <h2 className="relative font-display text-4xl font-extrabold tracking-tight">Así de fácil</h2>
          <div className="relative mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["01", "Elige", "Un arreglo del catálogo o ármalo paso a paso con tus colores."],
              ["02", "Personaliza", "Globos, flores, letrero con tu mensaje, luces y montaje."],
              ["03", "Celebra", "Lo preparamos y lo entregamos el día de tu evento."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur">
                <p className="font-display text-5xl font-extrabold text-sun">{number}</p>
                <h3 className="mt-3 text-xl font-bold">{title}</h3>
                <p className="mt-1 font-medium text-white/90">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[2.5rem] bg-sun p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">¿Tienes una idea en mente?</h2>
            <p className="mt-2 text-ink/75">Ármala en minutos y recibe tu arreglo listo para la foto.</p>
          </div>
          <Link
            href="/arma-tu-arreglo"
            className="bg-fiesta glow-brand rounded-full px-8 py-4 font-bold text-white transition hover:scale-[1.03]"
          >
            Empezar ahora →
          </Link>
        </div>
      </section>
    </>
  );
}
