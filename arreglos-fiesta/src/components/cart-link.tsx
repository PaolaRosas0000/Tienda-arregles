"use client";

import Link from "next/link";
import { cartCount, useCart, useCartReady } from "@/lib/cart-store";

export function CartLink() {
  const items = useCart((state) => state.items);
  const ready = useCartReady();
  const count = ready ? cartCount(items) : 0;

  return (
    <Link
      href="/carrito"
      className="relative whitespace-nowrap rounded-full bg-fiesta glow-brand px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
    >
      🛒 Carrito
      {count > 0 && (
        <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-sun px-1 text-xs font-extrabold text-ink ring-2 ring-cream">
          {count}
        </span>
      )}
    </Link>
  );
}
