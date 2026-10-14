"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { describeLines, quoteCustomArrangement } from "@/lib/pricing";
import type { BuilderGroup, BuilderOption, Selections } from "@/lib/types";

const SIGN_OPTION = "Letrero personalizado";

/** "#a,#b" -> degradado con los tonos de la paleta. */
function swatch(color: string) {
  const tones = color.split(",").map((tone) => tone.trim());
  return tones.length > 1 ? `linear-gradient(135deg, ${tones.join(", ")})` : tones[0];
}

export function ArrangementBuilder({ groups }: { groups: BuilderGroup[] }) {
  const router = useRouter();
  const addToCart = useCart((state) => state.add);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({});
  const [customText, setCustomText] = useState("");

  const quote = useMemo(() => quoteCustomArrangement(groups, selections), [groups, selections]);
  const runningTotal = groups
    .flatMap((group) => group.options)
    .reduce((sum, option) => sum + option.price * (selections[option.id] ?? 0), 0);

  const allOptions = groups.flatMap((group) => group.options);
  const signOption = allOptions.find((option) => option.name === SIGN_OPTION);
  const wantsSign = signOption ? (selections[signOption.id] ?? 0) > 0 : false;
  const palette = groups.find((group) => group.slug === "colores")?.options.find((option) => selections[option.id]);
  const base = groups.find((group) => group.slug === "base")?.options.find((option) => selections[option.id]);

  const isSummary = step === groups.length;
  const group = groups[step];
  const groupDone = (g: BuilderGroup) => !g.required || g.options.some((option) => selections[option.id]);

  function choose(g: BuilderGroup, option: BuilderOption, quantity: number) {
    setSelections((current) => {
      const next = { ...current };
      if (!g.multiple) g.options.forEach((o) => delete next[o.id]);
      if (quantity > 0) next[option.id] = Math.min(quantity, option.maxQuantity);
      else delete next[option.id];
      return next;
    });
  }

  function handleAdd() {
    if (!quote.ok) return;
    const text = wantsSign ? customText.trim() : "";
    const sortedSelections = Object.fromEntries(Object.entries(selections).sort(([a], [b]) => a.localeCompare(b)));
    addToCart({
      key: `personalizado:${JSON.stringify(sortedSelections)}:${text}`,
      kind: "personalizado",
      name: `${base?.name ?? "Arreglo"} personalizado`,
      emoji: base?.emoji ?? "🎈",
      selections: sortedSelections,
      customText: text,
      summary: [...describeLines(quote.lines), ...(text ? [`Texto del letrero: "${text}"`] : [])],
      unitPrice: quote.total,
      quantity: 1,
    });
    router.push("/carrito");
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <ol className="mb-6 flex flex-wrap gap-2">
          {[...groups.map((g) => g.name), "Resumen"].map((name, index) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => setStep(index)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  index === step
                    ? "bg-fiesta glow-brand text-white"
                    : index < groups.length && groups[index].options.some((o) => selections[o.id])
                      ? "bg-violet text-white"
                      : "bg-white text-ink/60 ring-1 ring-ink/10 hover:text-ink"
                }`}
              >
                {index + 1}. {name}
              </button>
            </li>
          ))}
        </ol>

        {!isSummary && group && (
          <section>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              {group.name}{" "}
              {group.required && (
                <span className="rounded-full bg-brand/10 px-2.5 py-1 align-middle font-sans text-xs font-bold text-brand">
                  Obligatorio
                </span>
              )}
            </h2>
            <p className="mt-1 text-ink/60">{group.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {group.options.map((option) => (
                <OptionCard
                  key={option.id}
                  group={group}
                  option={option}
                  quantity={selections[option.id] ?? 0}
                  onChange={(quantity) => choose(group, option, quantity)}
                />
              ))}
            </div>
          </section>
        )}

        {isSummary && (
          <section className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-ink/5">
            <h2 className="font-display text-3xl font-extrabold tracking-tight">Resumen de tu arreglo</h2>
            {quote.ok ? (
              <ul className="mt-5 divide-y divide-ink/5">
                {quote.lines.map((line) => (
                  <li key={line.group + line.name} className="flex justify-between py-2 text-sm">
                    <span>
                      <span className="text-ink/50">{line.group}:</span> {line.name}
                      {line.quantity > 1 && ` ×${line.quantity}`}
                    </span>
                    <span className="font-bold">{formatPrice(line.subtotal)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-2xl bg-sun/25 p-4 text-sm font-semibold text-ink">{quote.error}</p>
            )}
            {wantsSign && (
              <label className="mt-6 block text-sm font-bold">
                Texto del letrero
                <input
                  value={customText}
                  onChange={(event) => setCustomText(event.target.value)}
                  maxLength={40}
                  placeholder="Ej. ¡Feliz cumpleaños, Sofi!"
                  className="mt-2 w-full rounded-2xl border-2 border-ink/10 bg-cream px-4 py-3 outline-none transition focus:border-brand"
                />
              </label>
            )}
          </section>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="rounded-full px-6 py-3 font-bold text-ink/70 transition hover:bg-ink/5 disabled:opacity-30"
          >
            ← Anterior
          </button>
          {!isSummary && (
            <button
              type="button"
              disabled={group && !groupDone(group)}
              onClick={() => setStep(step + 1)}
              className="rounded-full bg-violet px-7 py-3 font-bold text-white transition hover:bg-brand disabled:opacity-30"
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>

      <aside className="relative h-fit overflow-hidden rounded-[2rem] bg-trust p-6 text-white shadow-[0_30px_60px_-20px_rgba(30,94,255,0.55)] lg:sticky lg:top-32">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/40 blur-3xl" />
        <div
          className="relative grid aspect-[2/1] place-items-center rounded-3xl text-5xl ring-1 ring-white/10 transition-colors lg:aspect-square"
          style={{
            background: palette?.color
              ? swatch(palette.color)
              : "rgba(255,255,255,0.15)",
          }}
          aria-hidden
        >
          <div className="flex max-w-[85%] flex-wrap justify-center gap-1">
            {groups
              .filter((g) => g.slug !== "tamano")
              .flatMap((g) => g.options)
              .filter((option) => selections[option.id] && option.emoji)
              .slice(0, 9)
              .map((option) => (
                <span key={option.id}>{option.emoji}</span>
              ))}
            {Object.keys(selections).length === 0 && <span className="text-base text-white/85">Tu arreglo aparecerá aquí ✨</span>}
          </div>
        </div>
        <p className="relative mt-5 text-sm font-medium text-white/85">Precio de tu arreglo</p>
        <p className="relative font-display text-4xl font-extrabold text-sun">{formatPrice(runningTotal)}</p>
        <button
          type="button"
          onClick={isSummary ? handleAdd : () => setStep(groups.length)}
          disabled={isSummary && (!quote.ok || (wantsSign && !customText.trim()))}
          className="relative mt-5 w-full rounded-full bg-sun py-4 font-extrabold text-ink shadow-[0_6px_0_rgba(26,11,46,0.25)] transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSummary ? "Agregar al carrito" : "Ver resumen"}
        </button>
        {isSummary && wantsSign && !customText.trim() && (
          <p className="relative mt-2 text-center text-xs text-white/85">Escribe el texto del letrero para continuar.</p>
        )}
      </aside>
    </div>
  );
}

function OptionCard({
  group,
  option,
  quantity,
  onChange,
}: {
  group: BuilderGroup;
  option: BuilderOption;
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  const selected = quantity > 0;
  const priceLabel = option.price === 0 ? "Incluido" : `${formatPrice(option.price)}${option.allowQuantity ? " c/u" : ""}`;

  return (
    <div
      className={`relative flex items-center gap-4 rounded-3xl border-2 bg-white p-4 transition ${
        selected ? "border-brand shadow-[0_12px_30px_-12px_rgba(255,46,136,0.5)]" : "border-transparent shadow-sm ring-1 ring-ink/5 hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(selected && group.multiple ? 0 : 1)}
        className="flex flex-1 items-center gap-4 text-left"
        aria-pressed={selected}
      >
        <span
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl font-extrabold ${selected ? "bg-fiesta text-white" : "bg-cream text-ink"}`}
          style={option.color ? { background: swatch(option.color), boxShadow: "inset 0 0 0 1px rgba(26,11,46,0.12)" } : undefined}
        >
          {option.color ? "" : option.emoji}
        </span>
        <span>
          <span className="block font-bold">{option.name}</span>
          {option.description && <span className="block text-xs text-ink/55">{option.description}</span>}
          <span className="mt-0.5 block text-sm font-bold text-brand">{priceLabel}</span>
        </span>
      </button>
      {selected && !option.allowQuantity && (
        <span className="bg-fiesta grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold text-white">✓</span>
      )}
      {option.allowQuantity && selected && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(quantity - 1)}
            className="h-9 w-9 rounded-full bg-ink/5 font-bold transition hover:bg-ink hover:text-white"
            aria-label={`Quitar ${option.name}`}
          >
            −
          </button>
          <span className="w-6 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => onChange(quantity + 1)}
            disabled={quantity >= option.maxQuantity}
            className="h-9 w-9 rounded-full bg-ink/5 font-bold transition hover:bg-ink hover:text-white disabled:opacity-30"
            aria-label={`Agregar ${option.name}`}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
