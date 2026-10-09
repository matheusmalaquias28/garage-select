"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { onIntroDone } from "@/lib/intro";
import { cars } from "@/lib/stock";
import { HeroSearch } from "./HeroSearch";

const VIDEO = {
  desktop: { webm: "/video/hero-desktop.webm", mp4: "/video/hero-desktop.mp4", poster: "/video/hero-desktop-poster.webp" },
  mobile: { webm: "/video/hero-mobile.webm", mp4: "/video/hero-mobile.mp4", poster: "/video/hero-mobile-poster.webp" },
};
// Tela "deitada" usa o vídeo 16:9; retrato (celular, tablet em pé) usa o 9:16
const LANDSCAPE = "(min-aspect-ratio: 1/1)";

const QUICK = [
  { label: "Elétricos", href: "/estoque?combustivel=El%C3%A9trico" },
  { label: "Híbridos", href: "/estoque?combustivel=H%C3%ADbrido" },
  { label: "Até R$ 150 mil", href: "/estoque?precoMax=150000" },
  { label: "Acima de R$ 400 mil", href: "/estoque?precoMin=400000&ordem=maior-preco" },
  { label: "Até 20 mil km", href: "/estoque?kmMax=20000&ordem=menor-km" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<keyof typeof VIDEO | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Intro
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: gsap.Context | undefined;
    const off = onIntroDone(() => {
      ctx = gsap.context(() => {
        if (reduce) {
          gsap.set("[data-intro]", { opacity: 1, visibility: "visible" });
          return;
        }
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo("[data-hero-bg]", { scale: 1.25 }, { scale: 1, duration: 2.4 }, 0)
          .set("[data-intro]", { visibility: "visible", opacity: 1 }, 0)
          .from("[data-hero-line]", { yPercent: 115, duration: 1.4, stagger: 0.1 }, 0.15)
          .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.55)
          .from("[data-hero-search]", { y: 50, opacity: 0, duration: 1.4 }, 0.7)
          .from(document.querySelector("[data-header]"), { opacity: 0, duration: 1.2, clearProps: "opacity" }, 0.5);
      }, el);
    });
    return () => {
      off();
      ctx?.revert();
    };
  }, []);

  // Vídeo: escolhe a versão pela proporção da tela; sem vídeo com reduced-motion ou economia de dados
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const mq = window.matchMedia(LANDSCAPE);
    let ready = false;
    const pick = () => ready && setVariant(mq.matches ? "desktop" : "mobile");
    // só baixa o vídeo depois do preloader (não disputa CPU/rede com a animação; o pôster cobre até lá)
    const off = onIntroDone(() => {
      ready = true;
      pick();
    });
    mq.addEventListener("change", pick);
    window.addEventListener("orientationchange", pick);
    window.addEventListener("resize", pick, { passive: true });
    return () => {
      off();
      mq.removeEventListener("change", pick);
      window.removeEventListener("orientationchange", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <section ref={root} className="relative flex flex-col overflow-hidden bg-ink md:min-h-[100svh]" aria-label="Destaque">
      {/* Fundo: no mobile cobre só a primeira tela (vídeo + título); no desktop, a hero inteira */}
      <div data-hero-bg className="absolute inset-x-0 top-0 h-[100svh] md:inset-y-0 md:h-auto">
        <picture>
          <source media={LANDSCAPE} srcSet={VIDEO.desktop.poster} />
          <img src={VIDEO.mobile.poster} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        {variant && (
          <video
            key={variant}
            ref={video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            disablePictureInPicture
            onPlaying={() => (setReady(true), setPlaying(true))}
            onPause={() => setPlaying(false)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          >
            <source src={VIDEO[variant].webm} type='video/webm; codecs="av01.0.08M.08"' />
            <source src={VIDEO[variant].mp4} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-black/40" />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/10 to-transparent" />
        <div className="grain absolute inset-0 overflow-hidden" />
      </div>

      {/* Conteúdo */}
      <div className="wrap relative z-10 flex min-h-[100svh] flex-1 flex-col justify-end pt-[calc(var(--header-h)+3rem)] pb-10 md:min-h-0 md:pb-0">
        <div data-intro>
          <div data-hero-fade className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
            <span className="h-px w-6 shrink-0 bg-gold md:w-10" />
            <p className="eyebrow text-[9px] tracking-[0.16em] whitespace-nowrap text-bone/85 sm:text-[0.6875rem] sm:tracking-[0.22em]">
              Seminovos premium · Vila Velha, ES
            </p>
          </div>

          <h1 className="font-wide text-[clamp(2.05rem,8.6vw,10.5rem)] leading-[0.86] font-medium tracking-[-0.02em] uppercase">
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-hero-line className="block">Selecionados</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block text-bone/45 md:pl-[1.15em]">
                um a um<span className="text-gold">.</span>
              </span>
            </span>
          </h1>

          <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p data-hero-fade className="max-w-md text-[15px] leading-relaxed text-bone-2 md:text-base">
              Nacionais e importados, novos e seminovos, revisados criteriosamente.{" "}
              <span className="text-bone">{cars.length} veículos</span> prontos para sair da nossa garagem.
            </p>
            {variant && (
              <button
                data-hero-fade
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo"}
                className="group hidden items-center gap-3 justify-self-start text-bone/70 md:flex transition-colors hover:text-bone lg:justify-self-end"
              >
                <span className="eyebrow text-[10px]">Tour pela garagem</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-gold">
                  {playing ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
                      <rect x="1" y="0.5" width="2.6" height="9" />
                      <rect x="6.4" y="0.5" width="2.6" height="9" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
                      <path d="M2 0.5v9l7.5-4.5z" />
                    </svg>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Busca: abaixo da primeira tela no mobile, sobre o vídeo no desktop */}
      <div className="wrap relative z-10 pb-12 md:pt-10 md:pb-12">
        <div data-intro>
          <div data-hero-search>
            <p className="eyebrow mb-4 flex items-center gap-3 text-gold md:hidden">
              <span className="h-px w-6 bg-gold" /> Encontre seu veículo
            </p>
            <HeroSearch />
            <div className="no-scrollbar -mx-(--gutter) mt-4 flex gap-2 overflow-x-auto px-(--gutter)">
              <span className="eyebrow flex shrink-0 items-center pr-2 text-[10px] text-mute">Atalhos</span>
              {QUICK.map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="shrink-0 rounded-full border border-line-strong bg-black/20 px-4 py-2 text-[13px] text-bone-2 backdrop-blur-md transition hover:border-gold hover:text-gold"
                >
                  {q.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
