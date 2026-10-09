"use client";

import { useRef, useState } from "react";
import { googleRating, reviews } from "@/data/reviews";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "@/components/Icons";

const Stars = ({ size = 14, value = 5 }: { size?: number; value?: number }) => (
  <span className="flex gap-0.5 text-gold" aria-hidden>
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor" opacity={i < Math.round(value) ? 1 : 0.25}>
        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z" />
      </svg>
    ))}
  </span>
);

const GoogleG = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

export function Reviews() {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
  };

  const score = googleRating.score.toLocaleString("pt-BR", { minimumFractionDigits: 1 });

  return (
    <section aria-labelledby="avaliacoes-title" className="overflow-hidden border-t border-line py-24 md:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16">
        {/* Nota geral */}
        <div className="flex flex-col">
          <p data-reveal className="eyebrow mb-6 flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-gold" /> Quem comprou recomenda
          </p>
          <h2 id="avaliacoes-title" data-split className="font-wide text-[clamp(2rem,2.9vw,3.5rem)] leading-[0.95] font-medium tracking-tight uppercase">
            Avaliações
          </h2>

          <div data-reveal className="mt-10 flex items-end gap-5">
            <p className="font-wide text-7xl leading-none font-medium tabular md:text-8xl" aria-label={`Nota ${score} de 5`}>
              {score}
            </p>
            <div className="pb-2">
              <Stars size={18} value={googleRating.score} />
              <p className="mt-2 flex items-center gap-2 text-sm text-bone-2">
                <GoogleG /> {googleRating.count} avaliações no Google
              </p>
            </div>
          </div>

          <div data-reveal className="mt-10 flex items-center gap-3 lg:mt-auto lg:pt-10">
            <a
              href={googleRating.url}
              target="_blank"
              rel="noopener"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-5 text-sm transition hover:border-gold hover:text-gold"
            >
              Ver todas no Google <ArrowUpRight width={15} height={15} className="transition-transform group-hover:rotate-45" />
            </a>
            <div className="ml-auto flex gap-2 lg:ml-0">
              <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label="Avaliações anteriores" className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong transition hover:border-bone disabled:opacity-30">
                <ChevronLeft />
              </button>
              <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label="Próximas avaliações" className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong transition hover:border-bone disabled:opacity-30">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div data-reveal className="relative min-w-0 lg:-mr-[var(--gutter)]">
          <ul
            ref={track}
            onScroll={onScroll}
            className="no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-2 lg:mx-0 lg:pl-0"
            style={{ scrollPaddingInline: "var(--gutter)" }}
          >
            {reviews.map((r) => (
              <li key={r.name} className="w-[min(85vw,380px)] shrink-0 snap-start">
                <figure className="group flex h-full flex-col rounded-2xl border border-line bg-ink-2 p-7 transition-colors duration-500 hover:border-line-strong md:p-8">
                  <div className="flex items-center justify-between">
                    <Stars />
                    <GoogleG />
                  </div>
                  <blockquote className="mt-6 flex-1 text-[15px] leading-relaxed text-bone-2">“{r.text}”</blockquote>
                  <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 font-semiwide text-sm font-medium text-gold">
                      {r.name[0]}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-bone">{r.name}</span>
                      <span className="block text-xs text-mute">
                        {r.badge ? `${r.badge} · ` : ""}
                        {r.when}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-linear-to-l from-ink to-transparent lg:block" />
        </div>
      </div>
    </section>
  );
}
