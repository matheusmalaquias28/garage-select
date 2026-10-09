import Image from "next/image";
import Link from "next/link";
import { type Car, brl, fuelShort, kmFmt } from "@/lib/stock";
import { BrandBadge } from "./BrandBadge";
import { ArrowUpRight } from "@/components/Icons";

const SIZES = "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export function CarCard({ car, priority = false }: { car: Car; priority?: boolean }) {
  const [cover, alt] = [car.photos[0], car.photos.find((p, i) => i > 0 && p.framing === "portrait")];

  return (
    <article className="group relative">
      <Link href={`/estoque/${car.slug}`} className="block focus-visible:outline-offset-4" aria-label={`${car.title} ${car.version} ${car.yearModel}, ${brl(car.price)}`}>
        {/* Foto */}
        <div className="relative aspect-[3/4] overflow-hidden bg-ink-3">
          <Image
            src={cover.src}
            alt={`${car.title} ${car.yearModel}`}
            fill
            sizes={SIZES}
            quality={80}
            priority={priority}
            className="object-cover transition-transform duration-[1.4s] ease-(--ease-expo) group-hover:scale-[1.06]"
          />
          {alt && (
            <Image
              src={alt.src}
              alt=""
              fill
              sizes={SIZES}
              quality={80}
              className="hidden scale-[1.06] object-cover opacity-0 transition-[opacity,transform] duration-[1.2s] ease-(--ease-expo) group-hover:scale-100 group-hover:opacity-100 md:block"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/45 via-transparent to-black/50" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <BrandBadge logo={car.brandLogo} name={car.brand} size={42} />
            <div className="flex flex-col items-end gap-1.5">
              {car.badges.map((b) => (
                <span
                  key={b}
                  className={`eyebrow rounded-full px-2.5 py-1.5 text-[9px] tracking-[0.18em] backdrop-blur-md ${
                    b === "0 km" ? "bg-gold text-ink" : "bg-black/45 text-bone"
                  }`}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
            <span className="eyebrow text-[10px] text-bone/80 tabular">{car.photos.length} fotos</span>
            <span className="eyebrow flex translate-y-3 items-center gap-2 rounded-full bg-bone px-4 py-2.5 text-[10px] text-ink opacity-0 transition-all duration-700 ease-(--ease-expo) group-hover:translate-y-0 group-hover:opacity-100">
              Ver detalhes <ArrowUpRight width={14} height={14} />
            </span>
          </div>
        </div>

        {/* Informações */}
        <div className="pt-5">
          <p className="eyebrow text-[10px] text-mute">
            {car.brand} <span className="text-gold">·</span> {car.yearModel}
          </p>
          <h3 className="mt-2 font-wide text-2xl leading-tight font-medium tracking-tight transition-colors duration-500 group-hover:text-gold">
            {car.model}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-mute uppercase">{car.version}</p>

          <dl className="mt-4 grid grid-cols-3 border-y border-line text-[13px]">
            {[
              ["Ano", car.year],
              ["Km", kmFmt(car.km)],
              ["Motor", car.power ?? fuelShort(car.fuel)],
            ].map(([k, v], i) => (
              <div key={k} className={`py-3 ${i ? "border-l border-line pl-3" : ""}`}>
                <dt className="text-[10px] tracking-[0.14em] text-mute uppercase">{k}</dt>
                <dd className="mt-0.5 text-bone tabular">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-mute">
                {fuelShort(car.fuel)} · {car.transmission}
              </p>
              <p className="font-semiwide text-xl font-medium tabular">{brl(car.price)}</p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
              <ArrowUpRight width={18} height={18} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
