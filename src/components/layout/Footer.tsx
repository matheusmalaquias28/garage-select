import Link from "next/link";
import { brands, cars } from "@/lib/stock";
import { mapsUrl, nav, site, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";
import { ArrowUpRight, Facebook, Instagram, WhatsApp } from "@/components/Icons";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-2">
      {/* CTA */}
      <div className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow mb-6 text-gold">Atendimento consultivo</p>
          <h2 data-split className="font-wide text-[clamp(2.2rem,6vw,5.5rem)] leading-[0.95] font-medium tracking-tight uppercase">
            O próximo carro
            <br />
            começa aqui.
          </h2>
        </div>
        <div data-reveal className="flex flex-col gap-4 lg:items-end">
          <p className="max-w-sm text-bone-2 lg:text-right">
            Fale com um consultor da Garage Select para tirar dúvidas, agendar uma visita ou avaliar o seu usado na troca.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-gold px-7 font-medium text-ink transition hover:bg-gold-soft"
            >
              <WhatsApp /> Chamar no WhatsApp
            </a>
            <Link
              href="/estoque"
              className="inline-flex h-14 items-center gap-3 rounded-full border border-line-strong px-7 font-medium transition hover:border-bone"
            >
              Ver estoque
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="h-px bg-line" />
      </div>

      {/* Colunas */}
      <div className="wrap grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <Logo className="w-48" />
          <p className="max-w-xs text-sm leading-relaxed text-mute">
            Veículos novos e seminovos, nacionais e importados, revisados criteriosamente para você comprar com tranquilidade.
          </p>
          <div className="flex gap-3">
            <a href={site.instagram.href} target="_blank" rel="noopener" aria-label="Instagram da Garage Select" className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong transition hover:border-gold hover:text-gold">
              <Instagram />
            </a>
            <a href={site.facebook.href} target="_blank" rel="noopener" aria-label="Facebook da Garage Select" className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong transition hover:border-gold hover:text-gold">
              <Facebook />
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener" aria-label="WhatsApp da Garage Select" className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong transition hover:border-gold hover:text-gold">
              <WhatsApp />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-5 text-mute">Navegação</p>
          <ul className="grid gap-3">
            <li>
              <Link href="/" className="link-line text-bone-2 hover:text-bone">Início</Link>
            </li>
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-line text-bone-2 hover:text-bone">{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/privacidade" className="link-line text-bone-2 hover:text-bone">Política de privacidade</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5 text-mute">Marcas em estoque</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {brands.map((b) => (
              <li key={b.key}>
                <Link href={`/estoque?marca=${b.key}`} className="group flex items-baseline gap-1.5 text-bone-2 hover:text-bone">
                  <span className="link-line">{b.name}</span>
                  <sup className="text-[10px] text-mute tabular">{b.count}</sup>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-7">
          <div>
            <p className="eyebrow mb-4 text-mute">Contato</p>
            {site.phones.map((p) => (
              <a key={p.href} href={p.href} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 hover:text-gold">
                <span className="font-semiwide text-lg tabular">{p.label}</span>
                <span className="text-xs text-mute">{p.kind}</span>
              </a>
            ))}
          </div>
          <div>
            <p className="eyebrow mb-4 text-mute">Onde estamos</p>
            <a href={mapsUrl} target="_blank" rel="noopener" className="group inline-flex items-start gap-2 text-bone-2 hover:text-bone">
              <span>
                {site.address.street}
                <br />
                {site.address.district}, {site.address.city} / {site.address.state}
              </span>
              <ArrowUpRight width={16} height={16} className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <div>
            <p className="eyebrow mb-4 text-mute">Horário</p>
            {site.hours.map((h) => (
              <p key={h.days} className="flex justify-between gap-4 text-sm text-bone-2">
                <span>{h.days}</span>
                <span className="tabular">{h.time}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Assinatura gigante */}
      <div aria-hidden className="wrap select-none">
        <p
          data-reveal="fade"
          className="font-wide translate-y-[18%] text-center text-[clamp(1.75rem,8.4vw,9.6rem)] leading-none font-semibold whitespace-nowrap text-transparent uppercase [-webkit-text-stroke:1px_rgb(255_255_255/0.12)]"
        >
          Garage Select
        </p>
      </div>

      <div className="relative border-t border-line bg-ink">
        <div className="wrap flex flex-col gap-3 py-6 text-xs text-mute md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Garage Select. Todos os direitos reservados. CNPJ {site.cnpj}
          </p>
          <p>
            {cars.length} veículos em estoque · Vila Velha, ES
          </p>
        </div>
      </div>
    </footer>
  );
}
