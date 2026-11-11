import type { BuilderGroup, Selections } from "./types";

// Lógica compartida entre el navegador (precio en vivo) y el servidor
// (precio final del pedido). El servidor nunca confía en el precio del cliente.

export type PricedLine = { group: string; name: string; quantity: number; subtotal: number };

export type CustomQuote =
  | { ok: true; total: number; lines: PricedLine[] }
  | { ok: false; error: string };

export function quoteCustomArrangement(groups: BuilderGroup[], selections: Selections): CustomQuote {
  const lines: PricedLine[] = [];
  const known = new Set<string>();

  for (const group of groups) {
    const chosen = group.options.filter((option) => (selections[option.id] ?? 0) > 0);
    group.options.forEach((option) => known.add(option.id));

    if (group.required && chosen.length === 0) {
      return { ok: false, error: `Falta elegir: ${group.name}` };
    }
    if (!group.multiple && chosen.length > 1) {
      return { ok: false, error: `Solo puedes elegir una opción en: ${group.name}` };
    }

    for (const option of chosen) {
      const requested = selections[option.id];
      if (!Number.isInteger(requested)) {
        return { ok: false, error: `Cantidad inválida para ${option.name}` };
      }
      const quantity = option.allowQuantity ? Math.min(requested, option.maxQuantity) : 1;
      lines.push({ group: group.name, name: option.name, quantity, subtotal: option.price * quantity });
    }
  }

  const unknown = Object.keys(selections).find((id) => selections[id] > 0 && !known.has(id));
  if (unknown) return { ok: false, error: "El arreglo tiene opciones que ya no están disponibles" };

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
  return { ok: true, total, lines };
}

export function describeLines(lines: PricedLine[]) {
  return lines.map((line) => (line.quantity > 1 ? `${line.group}: ${line.name} ×${line.quantity}` : `${line.group}: ${line.name}`));
}
