import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_2px_0_rgba(26,11,46,0.04),0_20px_40px_-24px_rgba(26,11,46,0.35)] ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(123,47,247,0.45)]">
      <div className={`relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br ${product.gradient}`}>
        <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/25 blur-2xl" />
        <span aria-hidden className="text-8xl drop-shadow-xl transition duration-300 group-hover:scale-110 group-hover:-rotate-6">
          {product.emoji}
        </span>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
          {product.occasion}
        </span>
        {product.featured && (
          <span className="absolute right-4 top-4 rounded-full bg-sun px-3 py-1 text-xs font-extrabold text-ink">★ Top</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="font-display text-xl font-extrabold tracking-tight">{product.name}</h3>
        <p className="flex-1 text-sm leading-relaxed text-ink/65">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-2xl font-extrabold">{formatPrice(product.price)}</span>
          <AddToCartButton
            item={{
              key: `producto:${product.id}`,
              kind: "producto",
              productId: product.id,
              name: product.name,
              emoji: product.emoji,
              unitPrice: product.price,
              quantity: 1,
            }}
          />
        </div>
      </div>
    </article>
  );
}
