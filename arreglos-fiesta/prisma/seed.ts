import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Precios en centavos: 45000 = $450.00
const products = [
  {
    slug: "arco-cumple-pastel",
    name: "Arco de globos Pastel",
    description: "Arco orgánico de 3 m con globos en tonos rosa, lila y menta. Ideal para cumpleaños y baby showers.",
    occasion: "Cumpleaños",
    price: 189900,
    emoji: "🎈",
    gradient: "from-pink-400 via-fuchsia-500 to-violet-600",
    featured: true,
  },
  {
    slug: "centro-mesa-dorado",
    name: "Centro de mesa Dorado",
    description: "Centro de mesa con flores blancas, globo metálico dorado y base de madera.",
    occasion: "Boda",
    price: 64900,
    emoji: "💐",
    gradient: "from-amber-300 via-orange-400 to-rose-500",
    featured: true,
  },
  {
    slug: "bouquet-globos-numero",
    name: "Bouquet con número",
    description: "Bouquet de 7 globos con número metálico gigante a elegir y listones.",
    occasion: "Cumpleaños",
    price: 79900,
    emoji: "🎉",
    gradient: "from-sky-400 via-indigo-500 to-fuchsia-500",
    featured: true,
  },
  {
    slug: "columna-baby-shower",
    name: "Columnas Baby Shower",
    description: "Par de columnas de globos de 1.8 m con nube y estrellas.",
    occasion: "Baby shower",
    price: 129900,
    emoji: "🍼",
    gradient: "from-cyan-300 via-sky-400 to-indigo-500",
    featured: false,
  },
  {
    slug: "backdrop-graduacion",
    name: "Backdrop Graduación",
    description: "Fondo con cortina metálica, arco de globos negro y dorado y letrero de felicitación.",
    occasion: "Graduación",
    price: 249900,
    emoji: "🎓",
    gradient: "from-zinc-900 via-violet-900 to-amber-500",
    featured: false,
  },
  {
    slug: "caja-sorpresa-amor",
    name: "Caja sorpresa Amor",
    description: "Caja con rosas rojas, globo burbuja personalizado y chocolates.",
    occasion: "Aniversario",
    price: 89900,
    emoji: "❤️",
    gradient: "from-rose-400 via-red-500 to-pink-600",
    featured: false,
  },
];

const groups = [
  {
    slug: "base",
    name: "Tipo de arreglo",
    description: "Elige la base de tu arreglo.",
    position: 1,
    multiple: false,
    required: true,
    options: [
      { name: "Bouquet de globos", description: "Ramo de globos con peso decorativo", price: 35000, emoji: "🎈" },
      { name: "Centro de mesa", description: "Base decorativa para mesa", price: 30000, emoji: "🕯️" },
      { name: "Arco de globos", description: "Arco orgánico para backdrop", price: 120000, emoji: "🌈" },
      { name: "Columna de globos", description: "Columna de pie para entrada", price: 60000, emoji: "🏛️" },
      { name: "Caja sorpresa", description: "Caja con globo burbuja", price: 45000, emoji: "🎁" },
    ],
  },
  {
    slug: "tamano",
    name: "Tamaño",
    description: "El tamaño ajusta materiales y mano de obra.",
    position: 2,
    multiple: false,
    required: true,
    options: [
      { name: "Chico", description: "Para espacios pequeños", price: 0, emoji: "S" },
      { name: "Mediano", description: "El más pedido", price: 20000, emoji: "M" },
      { name: "Grande", description: "Para salones y jardines", price: 50000, emoji: "L" },
    ],
  },
  {
    slug: "colores",
    name: "Paleta de colores",
    description: "La combinación de colores del arreglo.",
    position: 3,
    multiple: false,
    required: true,
    options: [
      // color: uno o dos tonos en hex separados por coma (se muestran como degradado)
      { name: "Rosa y dorado", description: "El más pedido para cumpleaños y XV años", price: 0, color: "#F7A1C4,#D4AF37" },
      { name: "Dorado y blanco", description: "Elegante, ideal para bodas", price: 0, color: "#D4AF37,#FFFFFF" },
      { name: "Plata y blanco", description: "Bodas, aniversarios y bautizos", price: 0, color: "#C0C0C0,#FFFFFF" },
      { name: "Azul y plata", description: "Baby shower de niño y graduaciones", price: 0, color: "#4A90E2,#C0C0C0" },
      { name: "Rojo y dorado", description: "Aniversarios, San Valentín y Navidad", price: 0, color: "#D7263D,#D4AF37" },
      { name: "Negro y dorado", description: "Graduaciones y fiestas de adultos", price: 0, color: "#1A1A1A,#D4AF37" },
      { name: "Pastel", description: "Rosa, lila, menta y celeste", price: 0, color: "#F9C6D3,#B8E6D3" },
      { name: "Lila y morado", description: "XV años y fiestas temáticas", price: 0, color: "#C8A2C8,#7B2FF7" },
      { name: "Verde menta y blanco", description: "Fresco, ideal para eventos de día", price: 0, color: "#98E2C6,#FFFFFF" },
      { name: "Azul marino y dorado", description: "Graduaciones y eventos formales", price: 0, color: "#1F2A5C,#D4AF37" },
      { name: "Fucsia y morado", description: "Colores vivos para fiestas infantiles", price: 0, color: "#FF1F8E,#8A2BFF" },
      { name: "Arcoíris", description: "Todos los colores, máxima alegría", price: 5000, color: "#FF3B3B,#FFD400,#2ECC71,#3498DB,#9B59B6" },
    ],
  },
  {
    slug: "globos",
    name: "Globos adicionales",
    description: "Agrega los globos que quieras (precio por unidad).",
    position: 4,
    multiple: true,
    required: false,
    options: [
      { name: "Globo de látex", price: 1500, emoji: "🎈", allowQuantity: true, maxQuantity: 50 },
      { name: "Globo metálico estrella", price: 6000, emoji: "⭐", allowQuantity: true, maxQuantity: 10 },
      { name: "Globo número gigante", price: 12000, emoji: "🔢", allowQuantity: true, maxQuantity: 4 },
      { name: "Globo burbuja con confeti", price: 9000, emoji: "🫧", allowQuantity: true, maxQuantity: 6 },
    ],
  },
  {
    slug: "flores",
    name: "Flores",
    description: "Flores naturales (precio por tallo).",
    position: 5,
    multiple: true,
    required: false,
    options: [
      { name: "Rosa", price: 4500, emoji: "🌹", allowQuantity: true, maxQuantity: 24 },
      { name: "Girasol", price: 5000, emoji: "🌻", allowQuantity: true, maxQuantity: 12 },
      { name: "Tulipán", price: 5500, emoji: "🌷", allowQuantity: true, maxQuantity: 12 },
      { name: "Hortensia", price: 8000, emoji: "💠", allowQuantity: true, maxQuantity: 6 },
      { name: "Follaje eucalipto", price: 2000, emoji: "🌿", allowQuantity: true, maxQuantity: 10 },
    ],
  },
  {
    slug: "extras",
    name: "Extras",
    description: "Detalles para completar tu arreglo.",
    position: 6,
    multiple: true,
    required: false,
    options: [
      { name: "Letrero personalizado", description: "Escribe el texto en el paso final", price: 15000, emoji: "🪧" },
      { name: "Luces LED", price: 8000, emoji: "💡" },
      { name: "Tarjeta de dedicatoria", price: 3000, emoji: "💌" },
      { name: "Chocolates", price: 12000, emoji: "🍫" },
      { name: "Montaje en el lugar", description: "Instalamos el arreglo en tu evento", price: 40000, emoji: "🛠️" },
    ],
  },
];

async function main() {
  // Nunca borra datos: si ya hay productos (por ejemplo en producción), no hace nada.
  if ((await prisma.product.count()) > 0 || (await prisma.optionGroup.count()) > 0) {
    console.log("La base ya tiene datos; no se cargó el ejemplo.");
    return;
  }

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  for (const { options, ...group } of groups) {
    await prisma.optionGroup.create({
      data: {
        ...group,
        options: {
          create: options.map((option, index) => ({ ...option, position: index + 1 })),
        },
      },
    });
  }

  console.log(`Seed listo: ${products.length} productos, ${groups.length} pasos del armador.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
