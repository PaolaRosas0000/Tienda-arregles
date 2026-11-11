import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { CartHydrator } from "@/components/cart-hydrator";
import { Header } from "@/components/header";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });
const body = Plus_Jakarta_Sans({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arreglos de Fiesta | Globos, flores y decoración",
  description: "Compra arreglos para tu fiesta o arma el tuyo a tu gusto: globos, flores, colores y extras.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <CartHydrator />
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-ink text-white/85">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
            <div>
              <p className="font-display text-2xl font-extrabold text-white">
                Arreglos<span className="text-sun">.</span>
              </p>
              <p className="mt-2 text-sm">Globos, flores y decoración para que tu fiesta se vea increíble.</p>
            </div>
            <nav className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-white">Tienda</span>
              <Link href="/catalogo" className="hover:text-sun">
                Catálogo
              </Link>
              <Link href="/arma-tu-arreglo" className="hover:text-sun">
                Arma tu arreglo
              </Link>
              <Link href="/carrito" className="hover:text-sun">
                Carrito
              </Link>
            </nav>
            <div className="text-sm">
              <span className="font-semibold text-white">Contacto</span>
              <p className="mt-2">Escríbenos por WhatsApp para pedidos especiales.</p>
            </div>
          </div>
          <p className="border-t border-white/20 py-5 text-center text-xs">© Arreglos de Fiesta</p>
        </footer>
      </body>
    </html>
  );
}
