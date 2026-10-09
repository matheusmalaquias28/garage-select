import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { StockBrowser } from "@/components/stock/StockBrowser";
import { CarCard } from "@/components/cars/CarCard";
import { brands, cars, filterCars } from "@/lib/stock";
import { PageMotion } from "@/components/motion/MotionProvider";

export const metadata: Metadata = {
  title: "Estoque de veículos",
  description: `${cars.length} veículos novos e seminovos de ${brands.length} marcas em Vila Velha/ES. Filtre por marca, modelo, preço, ano e quilometragem.`,
  alternates: { canonical: "/estoque" },
};

function StaticGrid() {
  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:gap-16">
      <div className="hidden lg:block" />
      <div>
        <p className="mb-8 border-b border-line pb-5 font-semiwide text-lg">
          {cars.length} <span className="text-mute">veículos encontrados</span>
        </p>
        <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {filterCars({}).map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EstoquePage() {
  return (
    <>
      <PageHero
        eyebrow={`${cars.length} veículos · ${brands.length} marcas`}
        title="Nosso estoque"
        text="Novos e seminovos, nacionais e importados. Use os filtros para encontrar o carro certo e fale direto com um consultor."
        crumbs={[{ label: "Estoque" }]}
      />
      <section className="wrap py-12 md:py-16">
        <Suspense fallback={<StaticGrid />}>
          <StockBrowser />
        </Suspense>
      </section>
      <PageMotion />
    </>
  );
}
