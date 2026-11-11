import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export default function OrderPage({ params }: PageProps<"/pedido/[id]">) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Suspense fallback={<p className="text-ink/50">Cargando pedido…</p>}>
        <OrderDetails params={params} />
      </Suspense>
    </div>
  );
}

async function OrderDetails({ params }: { params: PageProps<"/pedido/[id]">["params"] }) {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-ink/5 md:p-12">
      <p className="text-5xl">🎉</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">¡Gracias, {order.customerName}!</h1>
      <p className="mt-2 text-ink/60">
        Recibimos tu pedido <span className="font-mono font-semibold">#{order.id.slice(-8).toUpperCase()}</span> para el{" "}
        {order.eventDate}. Te contactaremos al {order.phone} para confirmar el pago y la entrega.
      </p>
      <ul className="mt-8 divide-y divide-ink/5">
        {order.items.map((item) => (
          <li key={item.id} className="py-3">
            <div className="flex justify-between font-medium">
              <span>
                {item.name} ×{item.quantity}
              </span>
              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
            </div>
            {item.details && <p className="mt-1 whitespace-pre-line text-xs text-ink/50">{item.details}</p>}
          </li>
        ))}
      </ul>
      <p className="mt-5 flex items-end justify-between border-t border-current/10 pt-5 text-lg font-extrabold">
        <span>Total</span>
        <span>{formatPrice(order.total)}</span>
      </p>
      <p className="mt-2 text-sm text-ink/50">Estado: {order.status}</p>
      <Link href="/" className="mt-6 inline-block bg-fiesta rounded-full px-6 py-3 font-bold text-white">
        ← Volver a la tienda
      </Link>
    </div>
  );
}
