"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { markIntroDone } from "@/lib/intro";
import { lockScroll } from "@/lib/scroll";

const KEY = "gs-intro";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || html.classList.contains("intro-seen")) {
      markIntroDone();
      return;
    }

    const finish = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      lockScroll(false);
      html.classList.add("intro-seen");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(el, { opacity: 0, duration: 0.4, delay: 0.3, onComplete: () => (markIntroDone(), finish()) });
      return;
    }

    lockScroll(true);
    const counter = { v: 0 };
    const num = el.querySelector<HTMLElement>("[data-pl-num]");
    const ctx = gsap.context(() => {});
    let cancelled = false;
    // começa só depois das fontes e de a página assentar (no celular a hidratação trava a thread principal)
    const start = () =>
      ctx.add(() => {
      gsap
        .timeline({ defaults: { ease: "expo.inOut" } })
        .to("[data-pl-path]", { strokeDashoffset: 0, duration: 1.6, stagger: 0.18, ease: "power3.inOut" }, 0.1)
        .to(counter, {
          v: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        }, 0)
        .to("[data-pl-bar]", { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0)
        .fromTo("[data-pl-word]", { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.6)
        .to("[data-pl-inner]", { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" }, 2.15)
        .add(markIntroDone, 2.5)
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1 }, 2.45)
        .add(finish);
      });
    document.fonts.ready.then(() =>
      requestAnimationFrame(() => requestAnimationFrame(() => !cancelled && start())),
    );

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div data-pl-inner className="flex w-full flex-col items-center">
        <svg viewBox="0 0 100 104" className="h-24 w-24 md:h-28 md:w-28" fill="none" strokeWidth="2.4" strokeLinejoin="miter">
          {/* Monograma: dois losangos entrelaçados (inspirado na marca) */}
          <path data-pl-path strokeDasharray={400} strokeDashoffset={400} stroke="#fec800" d="M44 8 72 36 44 64 16 36Z" />
          <path data-pl-path strokeDasharray={400} strokeDashoffset={400} stroke="#fec800" d="M44 24 56 36 44 48 38 42 44 36" />
          <path data-pl-path strokeDasharray={400} strokeDashoffset={400} stroke="#f2f0eb" d="M56 40 84 68 56 96 28 68Z" />
          <path data-pl-path strokeDasharray={400} strokeDashoffset={400} stroke="#f2f0eb" d="M56 56 44 68 56 80 62 74 56 68" />
        </svg>
        <div className="mt-8 flex gap-[0.4em] overflow-hidden font-wide text-sm tracking-[0.4em] uppercase">
          <span data-pl-word className="inline-block" style={{ transform: "translateY(110%)" }}>Garage</span>
          <span data-pl-word className="inline-block text-gold" style={{ transform: "translateY(110%)" }}>Select</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-(--gutter) pb-8">
        <div className="mb-4 flex items-end justify-between">
          <p className="eyebrow text-mute">Vila Velha · ES</p>
          <p className="font-wide text-5xl leading-none font-medium tabular md:text-7xl">
            <span data-pl-num>000</span>
          </p>
        </div>
        <div className="h-px w-full bg-line">
          <div data-pl-bar className="h-px origin-left scale-x-0 bg-gold" />
        </div>
      </div>
    </div>
  );
}
