import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";
import type { BuilderGroup } from "./types";

// Lecturas del catálogo en caché: las páginas se sirven estáticas y se
// refrescan cada hora (o al llamar revalidateTag("catalogo")).

export async function getProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogo");
  return db.product.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { createdAt: "asc" }] });
}

export async function getFeaturedProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogo");
  return db.product.findMany({ where: { active: true, featured: true }, take: 3 });
}

export async function getBuilderGroups(): Promise<BuilderGroup[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogo");
  return loadBuilderGroups();
}

/** Sin caché: lo usa el checkout para validar precios actuales. */
export async function loadBuilderGroups(): Promise<BuilderGroup[]> {
  const groups = await db.optionGroup.findMany({
    orderBy: { position: "asc" },
    include: { options: { where: { active: true }, orderBy: { position: "asc" } } },
  });
  return groups.map((group) => ({
    id: group.id,
    slug: group.slug,
    name: group.name,
    description: group.description,
    multiple: group.multiple,
    required: group.required,
    options: group.options.map((option) => ({
      id: option.id,
      name: option.name,
      description: option.description,
      price: option.price,
      emoji: option.emoji,
      color: option.color,
      allowQuantity: option.allowQuantity,
      maxQuantity: option.maxQuantity,
    })),
  }));
}
