"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { CartItem } from "@/lib/types";

export function AddToCartButton({ item }: { item: CartItem }) {
  const add = useCart((state) => state.add);
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={`rounded-full px-5 py-2.5 text-sm font-bold transition hover:scale-105 ${added ? "bg-mint text-ink" : "bg-fiesta glow-brand text-white"}`}
    >
      {added ? "¡Agregado! ✓" : "Agregar"}
    </button>
  );
}
