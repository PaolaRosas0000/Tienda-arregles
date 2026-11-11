import type { Metadata } from "next";
import { ArrangementBuilder } from "@/components/arrangement-builder";
import { PageHero } from "@/components/page-hero";
import { getBuilderGroups } from "@/lib/catalog";

export const metadata: Metadata = { title: "Arma tu arreglo | Arreglos de Fiesta" };

export default async function BuilderPage() {
  const groups = await getBuilderGroups();

  return (
    <>
      <PageHero
        eyebrow="Personalízalo"
        title="Arma tu arreglo"
        subtitle="Elige cada parte y mira el precio actualizarse al momento."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <ArrangementBuilder groups={groups} />
      </div>
    </>
  );
}
