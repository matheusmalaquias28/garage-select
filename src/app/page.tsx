import { Hero } from "@/components/home/Hero";
import { BrandStrip } from "@/components/home/BrandStrip";
import { SectionHead } from "@/components/home/SectionHead";
import { Spotlight } from "@/components/home/Spotlight";
import { About } from "@/components/home/About";
import { Services } from "@/components/home/Services";
import { Reviews } from "@/components/home/Reviews";
import { Visit } from "@/components/home/Visit";
import { CarCard } from "@/components/cars/CarCard";
import { cars, featuredCars } from "@/lib/stock";
import { PageMotion } from "@/components/motion/MotionProvider";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStrip />

      <section aria-labelledby="novidades" className="py-24 md:py-36">
        <div className="wrap">
          <SectionHead
            id="novidades"
            eyebrow="Recém-chegados"
            title="Últimas novidades"
            link={{ href: "/estoque", label: `Ver estoque completo (${cars.length})` }}
          />
          <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredCars.map((car, i) => (
              <div key={car.id} data-reveal data-delay={(i % 4) * 0.08}>
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Spotlight />
      <About />
      <Reviews />
      <Services />
      <Visit />
      <PageMotion />
    </>
  );
}
