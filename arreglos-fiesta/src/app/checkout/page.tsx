import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Checkout | Arreglos de Fiesta" };

export default function CheckoutPage() {
  return (
    <>
      <PageHero eyebrow="Último paso" title="Datos de entrega" subtitle="Dinos dónde y cuándo es tu evento." />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <CheckoutForm />
      </div>
    </>
  );
}
