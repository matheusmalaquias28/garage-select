import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { brl, carWhatsappText, cars, fuelShort, getCar, kmFmt, similarCars } from "@/lib/stock";
import { site, whatsappLink } from "@/lib/site";
import { Gallery } from "@/components/car/Gallery";
import { CarCard } from "@/components/cars/CarCard";
import { BrandBadge } from "@/components/cars/BrandBadge";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageMotion } from "@/components/motion/MotionProvider";
import { SectionHead } from "@/components/home/SectionHead";
import { Bolt, Calendar, Check, Door, Fuel, Gauge, Gear, Palette, Phone, WhatsApp } from "@/components/Icons";

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/estoque/[slug]">): Promise<Metadata> {
  const car = getCar((await params).slug);
  if (!car) return {};
  const title = `${car.title} ${car.version} ${car.yearModel}`;
  return {
    title,
    description: `${title}, ${kmFmt(car.km)}, ${car.color}, ${car.transmission}. ${brl(car.price)} na Garage Select em Vila Velha/ES.`,
    alternates: { canonical: `/estoque/${car.slug}` },
    openGraph: { title: `${title} | ${brl(car.price)}`, images: [car.photos[0].src] },
  };
}

export default function CarPage({ params }: PageProps<"/estoque/[slug]">) {
  return (
    <Suspense fallback={<CarSkeleton />}>
      <CarContent params={params} />
    </Suspense>
  );
}

function CarSkeleton() {
  return (
    <div aria-busy="true" className="wrap animate-pulse pt-[calc(var(--header-h)+4rem)] pb-24">
      <div className="h-3 w-56 rounded bg-ink-3" />
      <div className="mt-12 h-[clamp(2.8rem,9vw,9rem)] w-2/3 rounded bg-ink-3" />
      <div className="mt-6 h-4 w-80 rounded bg-ink-3" />
      <div className="mt-12 flex gap-2 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] h-[62svh] max-h-[760px] min-h-[380px] shrink-0 bg-ink-3" />
        ))}
      </div>
    </div>
  );
}

async function CarContent({ params }: { params: PageProps<"/estoque/[slug]">["params"] }) {
  const car = getCar((await params).slug);
  if (!car) notFound();

  const url = `${site.url}/estoque/${car.slug}`;
  const wa = whatsappLink(carWhatsappText(car, url));
  const name = `${car.brand} ${car.model} ${car.yearModel}`;

  const priceBlock = (
    <>
      <p className="text-xs text-mute">Valor do veículo</p>
      <p className="font-wide text-4xl font-medium tabular md:text-5xl">{brl(car.price)}</p>
      <div className="mt-5 flex flex-wrap gap-2 lg:justify-end">
        {[car.year, kmFmt(car.km), fuelShort(car.fuel), car.transmission].map((t) => (
          <span key={t} className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-bone-2 tabular">
            {t}
          </span>
        ))}
      </div>
    </>
  );

  const sheet = [
    { icon: Calendar, k: "Ano", v: car.year },
    { icon: Gauge, k: "Quilometragem", v: kmFmt(car.km) },
    { icon: Gear, k: "Câmbio", v: car.transmission },
    { icon: Fuel, k: "Combustível", v: car.fuel },
    { icon: Palette, k: "Cor", v: car.color },
    { icon: Door, k: "Portas", v: car.doors ? String(car.doors) : null },
    { icon: Bolt, k: "Potência", v: car.power },
    { icon: Bolt, k: "Torque", v: car.torque },
  ].filter((s) => s.v);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${car.title} ${car.version} ${car.yearModel}`,
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleConfiguration: car.version,
    color: car.color,
    vehicleTransmission: car.transmission,
    fuelType: car.fuel,
    vehicleModelDate: String(car.yearModel),
    productionDate: String(car.yearFab),
    numberOfDoors: car.doors ?? undefined,
    mileageFromOdometer: { "@type": "QuantitativeValue", value: car.km, unitCode: "KMT" },
    itemCondition: car.isNew ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    image: car.photos.slice(0, 8).map((p) => p.src),
    offers: {
      "@type": "Offer",
      url,
      price: car.price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: site.name },
    },
  };

  return (
    <article data-sticky-cta>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Cabeçalho */}
      <header className="wrap pt-[calc(var(--header-h)+2rem)] pb-8 md:pt-[calc(var(--header-h)+4rem)] md:pb-14">
        <nav aria-label="Navegação estrutural" data-reveal className="mb-8 md:mb-10">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-mute">
            <li><Link href="/" className="hover:text-bone">Início</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/estoque" className="hover:text-bone">Estoque</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={`/estoque?marca=${car.brandKey}`} className="hover:text-bone">{car.brand}</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-bone-2">{car.model}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div data-reveal className="mb-5 flex items-center gap-2 whitespace-nowrap md:mb-6 md:flex-wrap md:gap-3">
              <BrandBadge logo={car.brandLogo} name={car.brand} size={44} className="max-md:h-8! max-md:w-8!" />
              <span className="font-semiwide text-[11px] tracking-[0.14em] text-bone-2 uppercase md:text-sm md:tracking-[0.2em]">{car.brand}</span>
              {car.badges.map((b) => (
                <span
                  key={b}
                  className={`eyebrow rounded-full px-2 py-1 text-[8px] tracking-[0.14em] md:px-3 md:py-1.5 md:text-[9px] md:tracking-[0.22em] ${
                    b === "0 km" ? "bg-gold text-ink" : "border border-line-strong text-bone-2"
                  }`}
                >
                  {b}
                </span>
              ))}
            </div>
            <h1 data-split className="font-wide text-[clamp(2.8rem,9vw,9rem)] leading-[0.86] font-medium tracking-tight">
              {car.model}
            </h1>
            <p data-reveal className="mt-5 text-sm tracking-[0.08em] text-bone-2 uppercase md:text-base">
              {car.version} <span className="text-mute">· {car.yearModel}</span>
            </p>
          </div>

          <div data-reveal className="hidden text-right lg:block">
            {priceBlock}
          </div>
        </div>
      </header>

      {/* Galeria */}
      <section aria-label="Fotos" data-reveal="fade">
        <Gallery photos={car.photos} title={name} />
      </section>

      {/* Preço no mobile/tablet: abaixo das fotos */}
      <div data-reveal className="wrap pt-10 lg:hidden">{priceBlock}</div>

      {/* Conteúdo */}
      <div className="wrap grid gap-16 py-20 md:py-28 lg:grid-cols-[1fr_400px] xl:gap-24">
        <div className="min-w-0 space-y-20">
          <section aria-labelledby="ficha">
            <h2 id="ficha" data-reveal className="eyebrow mb-8 text-gold">Ficha técnica</h2>
            <dl data-reveal="stagger" className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
              {sheet.map(({ icon: Icon, k, v }) => (
                <div key={k} className="bg-ink p-5">
                  <Icon width={18} height={18} className="text-mute" />
                  <dt className="mt-4 text-[10px] tracking-[0.16em] text-mute uppercase">{k}</dt>
                  <dd className="mt-1 font-semiwide font-medium tabular">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {(car.headline || car.highlights.length > 0) && (
            <section aria-labelledby="sobre-veiculo">
              <h2 id="sobre-veiculo" data-reveal className="eyebrow mb-8 text-gold">Sobre este veículo</h2>
              {car.headline && (
                <p data-reveal className="font-semiwide text-2xl leading-snug font-medium md:text-3xl">{car.headline}</p>
              )}
              {car.specs.length > 0 && (
                <p data-reveal className="mt-4 text-bone-2">{car.specs.join(" · ")}</p>
              )}
              {car.highlights.length > 0 && (
                <ul data-reveal="stagger" className="mt-10 grid gap-x-10 border-t border-line sm:grid-cols-2">
                  {car.highlights.map((h) => (
                    <li key={h} className="flex gap-3 border-b border-line py-3.5 text-[15px] text-bone-2">
                      <Check width={16} height={16} className="mt-1 shrink-0 text-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {car.features.length > 0 && (
            <section aria-labelledby="caracteristicas">
              <h2 id="caracteristicas" data-reveal className="eyebrow mb-8 text-gold">Características</h2>
              <ul data-reveal="stagger" className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <li key={f} className="rounded-full border border-line-strong px-4 py-2 text-sm">{f}</li>
                ))}
              </ul>
            </section>
          )}

          {car.options.length > 0 && (
            <section aria-labelledby="opcionais">
              <h2 id="opcionais" data-reveal className="eyebrow mb-8 text-gold">
                Opcionais <span className="text-mute">({car.options.length})</span>
              </h2>
              <ul data-reveal="stagger" className="grid gap-x-8 gap-y-3 text-[15px] text-bone-2 sm:grid-cols-2 xl:grid-cols-3">
                {car.options.map((o) => (
                  <li key={o} className="flex gap-2.5">
                    <Check width={16} height={16} className="mt-1 shrink-0 text-gold" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Lateral */}
        <aside aria-label="Negociação" className="lg:relative">
          <div className="space-y-4 lg:sticky lg:top-28">
            <div data-reveal className="border border-line bg-ink-2 p-7">
              <p className="text-xs text-mute">{name}</p>
              <p className="mt-1 font-wide text-3xl font-medium tabular">{brl(car.price)}</p>
              <div className="mt-6 grid gap-2.5">
                <a href={wa} target="_blank" rel="noopener" className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gold font-medium text-ink transition hover:bg-gold-soft">
                  <WhatsApp /> Tenho interesse
                </a>
                <div className="grid grid-cols-2 gap-2.5">
                  <a href={site.phones[0].href} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line-strong text-sm transition hover:border-bone">
                    <Phone width={16} height={16} /> Ligar
                  </a>
                  <Link href={`/financiamento?veiculo=${car.slug}`} className="inline-flex h-12 items-center justify-center rounded-full border border-line-strong text-sm transition hover:border-bone">
                    Simular
                  </Link>
                </div>
              </div>
            </div>

            <div data-reveal className="border border-line p-7">
              <p className="eyebrow mb-1 text-bone">Envie sua proposta</p>
              <p className="mb-4 text-sm text-mute">Aceitamos seu usado na troca.</p>
              <LeadForm
                compact
                cta="Enviar proposta"
                subject={`Proposta para ${name} (${car.version}) anunciado por ${brl(car.price)}\n${url}`}
                fields={[
                  { name: "nome", label: "Seu nome", required: true, autoComplete: "name" },
                  { name: "telefone", label: "Telefone", type: "tel", required: true, autoComplete: "tel" },
                  { name: "proposta", label: "Valor da proposta" },
                  { name: "troca", label: "Carro na troca (opcional)" },
                ]}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Similares */}
      <section aria-labelledby="similares" className="border-t border-line py-20 md:py-28">
        <div className="wrap">
          <SectionHead id="similares" eyebrow="Você também pode gostar" title="Veículos similares" link={{ href: "/estoque", label: "Ver todo o estoque" }} />
          <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {similarCars(car).map((c, i) => (
              <div key={c.id} data-reveal data-delay={i * 0.08}>
                <CarCard car={c} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barra fixa mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-ink/90 px-(--gutter) py-3 backdrop-blur-xl lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-xs text-mute">{name}</p>
          <p className="font-semiwide text-lg font-medium tabular">{brl(car.price)}</p>
        </div>
        <a href={wa} target="_blank" rel="noopener" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-gold px-5 text-sm font-medium text-ink">
          <WhatsApp width={18} height={18} /> Tenho interesse
        </a>
      </div>
      <PageMotion />
    </article>
  );
}
