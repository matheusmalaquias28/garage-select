import { mapsEmbed, mapsUrl, site, whatsappLink } from "@/lib/site";
import { ArrowUpRight, Clock, Phone, Pin } from "@/components/Icons";

export function Visit({ heading = true }: { heading?: boolean }) {
  return (
    <section aria-labelledby="visita-title" className="border-t border-line">
      <div className="grid lg:grid-cols-2">
        <div className="wrap flex flex-col justify-center py-20 lg:max-w-none lg:py-28 lg:pr-16">
          {heading && (
            <>
              <p data-reveal className="eyebrow mb-6 flex items-center gap-3 text-gold">
                <span className="h-px w-8 bg-gold" /> Visite a garagem
              </p>
              <h2 id="visita-title" data-split className="font-wide text-[clamp(2rem,4.4vw,4rem)] leading-[0.95] font-medium tracking-tight uppercase">
                Venha ver de perto.
              </h2>
            </>
          )}
          <div data-reveal="stagger" className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            <a href={mapsUrl} target="_blank" rel="noopener" className="group bg-ink p-6 transition-colors hover:bg-ink-2 sm:col-span-2">
              <Pin className="text-gold" />
              <p className="mt-5 text-lg">
                {site.address.street}
                <br />
                <span className="text-bone-2">
                  {site.address.district}, {site.address.city} / {site.address.state}
                </span>
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm text-mute transition-colors group-hover:text-gold">
                Como chegar <ArrowUpRight width={15} height={15} />
              </span>
            </a>
            <div className="bg-ink p-6">
              <Clock className="text-gold" />
              <div className="mt-5 space-y-1 text-sm">
                {site.hours.map((h) => (
                  <p key={h.days} className="flex justify-between gap-3">
                    <span className="text-bone-2">{h.days}</span>
                    <span className="tabular">{h.time}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="bg-ink p-6">
              <Phone className="text-gold" />
              <div className="mt-5 space-y-1 text-sm">
                {site.phones.map((p) => (
                  <a key={p.href} href={p.href} className="flex justify-between gap-3 hover:text-gold">
                    <span className="tabular">{p.label}</span>
                    <span className="text-mute">{p.kind}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a
            data-reveal
            href={whatsappLink("Olá! Gostaria de agendar uma visita à Garage Select.")}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex h-14 items-center justify-center gap-3 self-start rounded-full bg-gold px-8 font-medium text-ink transition hover:bg-gold-soft"
          >
            Agendar visita
          </a>
        </div>
        <div data-reveal="fade" className="relative min-h-[420px] bg-ink-3 lg:min-h-full">
          <iframe
            title="Mapa: Garage Select em Vila Velha"
            src={mapsEmbed}
            className="map-dark absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
