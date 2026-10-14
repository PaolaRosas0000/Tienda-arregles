"use client";

import Link from "next/link";
import { cartTotal, useCart, useCartReady } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, setQuantity, remove } = useCart();
  const ready = useCartReady();

  if (!ready) return <p className="mt-8 text-ink/50">Cargando carrito…</p>;

  if (items.length === 0) {
    return (
      <div className="mt-2 rounded-[2rem] border-2 border-dashed border-ink/15 bg-white p-12 text-center">
        <p className="text-ink/60">Tu carrito está vacío.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/catalogo" className="rounded-full bg-ink px-6 py-3 font-bold text-white">
            Ver catálogo
          </Link>
          <Link href="/arma-tu-arreglo" className="bg-fiesta rounded-full px-6 py-3 font-bold text-white">
            Arma tu arreglo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-ink/5 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-ink/5">
        {items.map((item) => (
          <li key={item.key} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <span className="bg-fiesta grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl shadow-md">{item.emoji}</span>
            <div className="flex-1">
              <p className="font-bold">{item.name}</p>
              {item.kind === "personalizado" && (
                <ul className="mt-1 text-xs text-ink/50">
                  {item.summary.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
              <p className="mt-1 text-sm text-ink/60">{formatPrice(item.unitPrice)} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(item.key, item.quantity - 1)}
                className="h-9 w-9 rounded-full bg-ink/5 font-bold transition hover:bg-ink hover:text-white"
                aria-label="Quitar uno"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.key, item.quantity + 1)}
                className="h-9 w-9 rounded-full bg-ink/5 font-bold transition hover:bg-ink hover:text-white"
                aria-label="Agregar uno"
              >
                +
              </button>
            </div>
            <p className="w-28 text-right font-bold">{formatPrice(item.unitPrice * item.quantity)}</p>
            <button type="button" onClick={() => remove(item.key)} className="text-sm font-semibold text-ink/40 transition hover:text-brand">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col items-end gap-3">
        <p className="text-lg">
          Total: <span className="font-display text-3xl font-extrabold">{formatPrice(cartTotal(items))}</span>
        </p>
        <Link href="/checkout" className="bg-fiesta glow-brand rounded-full px-9 py-4 font-bold text-white transition hover:scale-[1.03]">
          Continuar al pago
        </Link>
      </div>
    </div>
  );
}
