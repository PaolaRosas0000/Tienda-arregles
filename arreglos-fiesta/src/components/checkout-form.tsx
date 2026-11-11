"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { placeOrder, type CheckoutState } from "@/app/checkout/actions";
import { cartTotal, useCart, useCartReady } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

const inputClass = "mt-2 w-full rounded-2xl border-2 border-ink/10 bg-cream px-4 py-3 font-normal outline-none transition focus:border-brand";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCart();
  const ready = useCartReady();
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});

  useEffect(() => {
    if (state.orderId) {
      clear();
      router.push(`/pedido/${state.orderId}`);
    }
  }, [state.orderId, clear, router]);

  if (!ready) return <p className="mt-8 text-ink/50">Cargando…</p>;
  if (items.length === 0 && !state.orderId) {
    return (
      <p className="mt-8 text-ink/60">
        Tu carrito está vacío.{" "}
        <Link href="/catalogo" className="font-bold text-brand underline">
          Ver catálogo
        </Link>
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <input type="hidden" name="cart" value={JSON.stringify(items)} />
      <fieldset className="grid h-fit gap-5 rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-ink/5 sm:grid-cols-2">
        <label className="text-sm font-bold sm:col-span-2">
          Nombre completo
          <input name="customerName" required autoComplete="name" className={inputClass} />
        </label>
        <label className="text-sm font-bold">
          Correo
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="text-sm font-bold">
          Teléfono / WhatsApp
          <input name="phone" type="tel" required autoComplete="tel" className={inputClass} />
        </label>
        <label className="text-sm font-bold sm:col-span-2">
          Dirección de entrega
          <input name="address" required autoComplete="street-address" className={inputClass} />
        </label>
        <label className="text-sm font-bold">
          Fecha del evento
          <input name="eventDate" type="date" required className={inputClass} />
        </label>
        <label className="text-sm font-bold sm:col-span-2">
          Notas (opcional)
          <textarea name="notes" rows={3} maxLength={500} className={inputClass} placeholder="Horario de entrega, referencias…" />
        </label>
      </fieldset>

      <aside className="relative h-fit overflow-hidden rounded-[2rem] bg-trust p-6 text-white shadow-[0_30px_60px_-20px_rgba(30,94,255,0.55)]">
        <h2 className="font-display text-2xl font-extrabold">Tu pedido</h2>
        <ul className="mt-4 space-y-3 text-sm text-white/85">
          {items.map((item) => (
            <li key={item.key} className="flex justify-between gap-2">
              <span>
                {item.emoji} {item.name} ×{item.quantity}
              </span>
              <span className="font-bold text-sun">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-end justify-between border-t border-current/10 pt-5 text-lg font-extrabold">
          <span>Total</span>
          <span>{formatPrice(cartTotal(items))}</span>
        </p>
        <div className="mt-4 mt-5 rounded-2xl bg-white/20 p-3 text-xs font-medium text-white">
          Pago en línea pendiente de conectar. Por ahora el pedido se registra y te contactamos para confirmar el pago.
        </div>
        {state.error && <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold text-brand">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full rounded-full bg-sun py-4 font-extrabold text-ink shadow-[0_6px_0_rgba(26,11,46,0.25)] transition hover:scale-[1.02] disabled:opacity-50"
        >
          {pending ? "Enviando…" : "Confirmar pedido"}
        </button>
      </aside>
    </form>
  );
}
