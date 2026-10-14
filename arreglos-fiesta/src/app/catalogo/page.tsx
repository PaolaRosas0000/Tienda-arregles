import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Catálogo | Arreglos de Fiesta" };

export default async function CatalogPage() {
  const products = await getProducts();
  const occasions = [...new Set(products.map((product) => product.occasion))];

  return (
    <>
      <PageHero
        eyebrow="Catálogo"
        title="Arreglos listos para tu evento"
        subtitle="¿No encuentras lo que buscas? Ármalo a tu gusto en minutos."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav className="mb-4 flex flex-wrap gap-2">
          {occasions.map((occasion) => (
            <a
              key={occasion}
              href={`#${occasion}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-ink/10 transition hover:bg-ink hover:text-white"
            >
              {occasion}
            </a>
          ))}
        </nav>
        {occasions.map((occasion) => (
          <section key={occasion} id={occasion} className="scroll-mt-32 pt-10">
            <h2 className="mb-6 font-display text-3xl font-extrabold tracking-tight">{occasion}</h2>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((product) => product.occasion === occasion)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
