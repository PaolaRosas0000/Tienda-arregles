import Link from "next/link";
import { CartLink } from "./cart-link";

export function Header() {
  return (
    <header className="sticky top-0 z-30">
      <p className="bg-ink px-4 py-2 text-center text-xs font-semibold tracking-wide text-white sm:text-sm">
        🎉 Arma tu arreglo a tu gusto y ve el precio <span className="text-sun">al instante</span>
      </p>
      <div className="border-b border-ink/5 bg-cream/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
            <span className="bg-fiesta grid h-9 w-9 place-items-center rounded-xl text-lg shadow-md">🎈</span>
            <span className="font-display text-xl font-extrabold tracking-tight text-ink">
              Arreglos<span className="text-brand">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold sm:gap-6">
            <Link href="/catalogo" className="hidden text-ink/70 transition hover:text-brand sm:inline">
              Catálogo
            </Link>
            <Link href="/arma-tu-arreglo" className="whitespace-nowrap text-ink/70 transition hover:text-brand">
              Arma tu arreglo
            </Link>
            <CartLink />
          </div>
        </nav>
      </div>
    </header>
  );
}
