import Image from "next/image";
import Link from "next/link";
import { brl, carWhatsappText, kmFmt, spotlightCar as car } from "@/lib/stock";
import { site, whatsappLink } from "@/lib/site";
import { BrandBadge } from "@/components/cars/BrandBadge";
import { ArrowRight, Check, WhatsApp } from "@/components/Icons";

export function Spotlight() {
  const portraits = car.photos.filter((p) => p.framing === "portrait");
  const stats = [
    ["Potência", car.power],
    ["Torque", car.torque],
    ["Quilometragem", kmFmt(car.km)],
    ["Ano", car.year],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <section aria-labelledby="spotlight-title" className="relative overflow-hidden py-24 md:py-36">
      <p
        aria-hidden
        data-parallax="0.3"
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 font-wide text-[24vw] leading-none font-semibold whitespace-nowrap text-transparent uppercase [-webkit-text-stroke:1px_rgb(255_255_255/0.06)]"
      >
        {car.model}
      </p>

      <div className="wrap relative grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Imagens */}
        <div className="relative lg:col-span-6 lg:pr-10">
          <Link href={`/estoque/${car.slug}`} data-reveal="img" className="group relative block aspect-[3/4] overflow-hidden bg-ink-3">
            <div data-parallax="0.12" className="absolute -inset-y-[8%] inset-x-0">
              <Image
                src="/cars/cayenne-destaque.webp"
                alt={`${car.title} ${car.yearModel}`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                quality={90}
                className="object-cover transition-transform duration-[1.6s] ease-(--ease-expo) group-hover:scale-105"
              />
            </div>
          </Link>
          {portraits[3] && (
            <div data-reveal="img" data-delay="0.2" className="absolute -right-2 -bottom-10 hidden aspect-[3/4] w-[38%] overflow-hidden border-[6px] border-ink bg-ink-3 lg:block">
              <Image src={portraits[3].src} alt="" fill sizes="20vw" quality={80} className="object-cover" />
            </div>
          )}
        </div>

        {/* Texto */}
        <div className="flex flex-col justify-center lg:col-span-6 lg:pl-6">
          <p data-reveal className="eyebrow mb-8 flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-gold" /> Destaque da garagem
          </p>
          <div data-reveal className="mb-4 flex items-center gap-3">
            <BrandBadge logo={car.brandLogo} name={car.brand} size={40} />
            <span className="font-semiwide text-sm tracking-[0.2em] text-bone-2 uppercase">{car.brand}</span>
          </div>
          <h2 id="spotlight-title" data-split className="font-wide text-[clamp(3rem,8vw,7.5rem)] leading-[0.88] font-medium tracking-tight">
            {car.model}
          </h2>
          <p data-reveal className="mt-4 max-w-md text-sm tracking-wide text-mute uppercase">
            {car.version}
          </p>

          <dl data-reveal="stagger" className="mt-10 grid grid-cols-2 border-t border-line sm:grid-cols-4">
            {stats.map(([k, v]) => (
              <div key={k} className="border-b border-line py-5 pr-4">
                <dt className="text-[10px] tracking-[0.16em] text-mute uppercase">{k}</dt>
                <dd className="mt-1.5 font-semiwide text-lg font-medium tabular md:text-xl">{v}</dd>
              </div>
            ))}
          </dl>

          <ul data-reveal="stagger" className="mt-8 grid gap-x-6 gap-y-3 text-sm text-bone-2 sm:grid-cols-2">
            {car.highlights.slice(0, 6).map((h) => (
              <li key={h} className="flex gap-2.5">
                <Check width={16} height={16} className="mt-0.5 shrink-0 text-gold" />
                <span className="line-clamp-2">{h}</span>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs text-mute">Valor</p>
              <p className="font-wide text-3xl font-medium tabular md:text-4xl">{brl(car.price)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/estoque/${car.slug}`}
                className="group inline-flex h-13 items-center gap-3 rounded-full bg-bone px-6 font-medium text-ink transition hover:bg-gold"
              >
                Ver detalhes <ArrowRight width={18} height={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={whatsappLink(carWhatsappText(car, `${site.url}/estoque/${car.slug}`))}
                target="_blank"
                rel="noopener"
                aria-label="Falar sobre este carro no WhatsApp"
                className="inline-flex h-13 w-13 items-center justify-center rounded-full border border-line-strong transition hover:border-gold hover:text-gold"
              >
                <WhatsApp />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
