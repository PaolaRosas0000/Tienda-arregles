# Arreglos de Fiesta 🎈

Tienda en línea de arreglos y decoraciones para fiestas. Los clientes pueden comprar
arreglos del catálogo o **armar el suyo** paso a paso (tipo, tamaño, colores, globos,
flores y extras) viendo el precio en vivo.

## Stack

| Pieza | Herramienta | Por qué |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router) + **React 19** | Frontend y backend en un solo proyecto; despliegue en Vercel con un clic. |
| Lenguaje | **TypeScript** | Menos errores al crecer el proyecto. |
| Estilos | **Tailwind CSS 4** | Diseño rápido y responsive sin escribir CSS a mano. |
| Base de datos | **Supabase** (PostgreSQL) + **Prisma 6** | Base administrada con plan gratuito, respaldos y panel web; Prisma da consultas con tipos y migraciones. |
| Carrito | **Zustand** (guardado en el navegador) | Simple, no requiere cuenta de usuario. |

## Cómo correrlo

Requisitos: Node.js 20.9 o superior.

### 1. Crea tu base en Supabase

1. Entra a [supabase.com](https://supabase.com), crea un proyecto y guarda la contraseña de la base.
2. En el proyecto, pulsa **Connect** (arriba) y copia las cadenas de conexión de **ORMs > Prisma**:
   - *Transaction pooler* (puerto **6543**) va en `DATABASE_URL`.
   - *Session pooler* o *Direct connection* (puerto **5432**) va en `DIRECT_URL`.

### 2. Arranca el proyecto

```bash
npm install
cp .env.example .env   # pega aquí tus dos cadenas de Supabase
npm run db:setup       # crea las tablas y carga productos de ejemplo (solo si la base está vacía)
npm run dev            # http://localhost:3000
```

Las tablas creadas tienen **RLS activado** sin políticas: así nadie puede leerlas ni cambiarlas
con la llave pública de Supabase. La app entra con Prisma usando la contraseña de la base, que
nunca llega al navegador. Guarda `.env` en secreto y no lo subas a GitHub (ya está en `.gitignore`).

Otros comandos:

- `npm run db:studio` abre Prisma Studio para ver pedidos y editar productos/opciones/precios
  (también puedes usar el **Table Editor** de Supabase).
- `npm run db:migrate` crea una migración nueva después de cambiar `prisma/schema.prisma`.
- `npm run build && npm start` versión de producción (el build necesita conexión a la base, porque genera el catálogo).

## Páginas

- `/` inicio con destacados
- `/catalogo` arreglos listos agrupados por ocasión
- `/arma-tu-arreglo` armador paso a paso con precio en vivo y vista previa
- `/carrito` carrito (se conserva al recargar)
- `/checkout` datos de entrega y confirmación
- `/pedido/[id]` confirmación del pedido

## Estructura

```
prisma/
  schema.prisma     modelos: Product, OptionGroup, Option, Order, OrderItem
  migrations/       SQL de las tablas (incluye RLS para Supabase)
  seed.ts           datos de ejemplo (edítalo para tus productos reales)
src/
  app/              páginas (App Router)
  app/checkout/actions.ts   crea el pedido; recalcula precios en el servidor
  components/       UI (armador, carrito, tarjetas, header)
  lib/catalog.ts    lecturas del catálogo con caché
  lib/pricing.ts    cálculo de precio del arreglo (compartido cliente/servidor)
  lib/cart-store.ts carrito
  lib/format.ts     moneda e idioma (MXN por defecto)
```

## Cómo personalizar

- **Productos y opciones del armador:** edítalos en el Table Editor de Supabase o con `npm run db:studio`.
  `prisma/seed.ts` solo carga el ejemplo inicial en una base vacía. Los precios están en **centavos** (`45000` = $450.00).
- **Moneda:** cambia `CURRENCY` y `LOCALE` en `src/lib/format.ts` (ej. `"COP"`/`"es-CO"`, `"USD"`/`"es-US"`).
- **Pasos del armador:** cada `OptionGroup` es un paso. `multiple: false` = elegir una; `allowQuantity` permite cantidades.
- Después de editar productos en la base, el catálogo se refresca solo cada hora.

## Siguientes pasos para producción

1. **Pagos:** conectar Mercado Pago o Stripe en `src/app/checkout/actions.ts` (ya hay un comentario donde va).
2. **Fotos:** sube las imágenes a **Supabase Storage** y guarda la URL en cada producto.
3. **Panel de administración** para ver y cambiar el estado de los pedidos (mientras tanto, el Table Editor de Supabase).
4. **Login de administrador** con **Supabase Auth** para el panel de pedidos.
5. **Avisos** por correo o WhatsApp al recibir un pedido.
6. Despliegue en **Vercel**: agrega `DATABASE_URL` y `DIRECT_URL` en *Settings > Environment Variables*.
