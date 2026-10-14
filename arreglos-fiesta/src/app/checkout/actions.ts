"use server";

import { db } from "@/lib/db";
import { loadBuilderGroups } from "@/lib/catalog";
import { describeLines, quoteCustomArrangement } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";

export type CheckoutState = { error?: string; orderId?: string };

type Line = { kind: string; name: string; quantity: number; unitPrice: number; details: string };

const MAX_ITEMS = 30;

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const field = (name: string) => String(formData.get(name) ?? "").trim();
  const customer = {
    customerName: field("customerName"),
    email: field("email"),
    phone: field("phone"),
    address: field("address"),
    eventDate: field("eventDate"),
    notes: field("notes").slice(0, 500),
  };

  if (!customer.customerName || !customer.phone || !customer.address || !customer.eventDate) {
    return { error: "Completa nombre, teléfono, dirección y fecha del evento." };
  }
  if (!/^\S+@\S+\.\S+$/.test(customer.email)) return { error: "Escribe un correo válido." };

  let items: CartItem[];
  try {
    items = JSON.parse(field("cart"));
  } catch {
    return { error: "No pudimos leer tu carrito. Intenta de nuevo." };
  }
  if (!Array.isArray(items) || items.length === 0) return { error: "Tu carrito está vacío." };
  if (items.length > MAX_ITEMS) return { error: "Tu carrito tiene demasiados artículos." };

  // Recalcula todos los precios con los datos actuales de la base; nunca usa los del navegador.
  const products = await db.product.findMany({ where: { active: true } });
  const groups = await loadBuilderGroups();
  const lines: Line[] = [];

  for (const item of items) {
    const quantity = Math.floor(Number(item.quantity));
    if (!(quantity >= 1 && quantity <= 20)) return { error: "Cantidad inválida en el carrito." };

    if (item.kind === "producto") {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return { error: `"${item.name}" ya no está disponible.` };
      lines.push({ kind: "producto", name: product.name, quantity, unitPrice: product.price, details: "" });
    } else if (item.kind === "personalizado") {
      const quote = quoteCustomArrangement(groups, item.selections ?? {});
      if (!quote.ok) return { error: quote.error };
      const text = String(item.customText ?? "").slice(0, 40);
      const details = [...describeLines(quote.lines), ...(text ? [`Texto del letrero: "${text}"`] : [])].join("\n");
      lines.push({ kind: "personalizado", name: item.name.slice(0, 80), quantity, unitPrice: quote.total, details });
    } else {
      return { error: "Artículo desconocido en el carrito." };
    }
  }

  const total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  const order = await db.order.create({
    data: { ...customer, total, items: { create: lines } },
  });

  // Aquí se conectaría la pasarela de pago (Mercado Pago, Stripe…) usando order.id y total.
  return { orderId: order.id };
}
