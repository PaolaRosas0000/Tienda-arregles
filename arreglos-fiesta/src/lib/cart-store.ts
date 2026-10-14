"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

// El carrito vive en el navegador (localStorage); el pedido se valida en el servidor.
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const existing = state.items.find((current) => current.key === item.key);
          if (existing) {
            return {
              items: state.items.map((current) =>
                current.key === item.key ? { ...current, quantity: Math.min(current.quantity + item.quantity, 20) } : current,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.key === key ? { ...item, quantity: Math.max(1, Math.min(quantity, 20)) } : item)),
        })),
      remove: (key) => set((state) => ({ items: state.items.filter((item) => item.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    // skipHydration evita diferencias entre el HTML del servidor y el navegador;
    // <CartHydrator /> carga el carrito guardado al montar la página.
    { name: "carrito-arreglos", skipHydration: true },
  ),
);

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** true cuando el carrito guardado ya se cargó desde localStorage. */
export function useCartReady() {
  return useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}
