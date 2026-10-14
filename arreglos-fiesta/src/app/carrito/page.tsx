import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Carrito | Arreglos de Fiesta" };

export default function CartPage() {
  return (
    <>
      <PageHero eyebrow="Tu pedido" title="Tu carrito" />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <CartView />
      </div>
    </>
  );
}
