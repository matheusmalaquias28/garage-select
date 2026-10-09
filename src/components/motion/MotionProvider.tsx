"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { getLenis, scrollToTarget, setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Sistema de animação por atributos:
 * - data-split            título revelado linha a linha (máscara)
 * - data-reveal="up|fade|img|stagger"
 * - data-parallax="0.15"  deslocamento vertical relativo
 * - data-delay="0.2"
 * Elementos com data-intro são animados pelo próprio componente (ex.: hero), não aqui.
 */
export function SmoothScroll() {
  // Lenis (uma vez)
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // mantém a suavização padrão: em travadas longas (celular hidratando/decodificando vídeo) as animações não "pulam"
    gsap.ticker.lagSmoothing(500, 33);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}

/** Renderizar no fim de cada página: roda depois que o conteúdo da página hidratou. */
export function PageMotion() {
  useEffect(() => {
    const lenis = getLenis();
    if (window.location.hash) {
      const id = window.location.hash;
      window.setTimeout(() => scrollToTarget(id, -40), 300);
    } else if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    if (reduced()) return;

    let cancelled = false;
    const ctx = gsap.context(() => {});
    const splits: SplitText[] = [];
    const run = () => ctx.add(() => {
      document.querySelectorAll<HTMLElement>("[data-split]:not([data-intro])").forEach((el) => {
        const split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        splits.push(split);
        gsap.set(el, { visibility: "visible" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.09,
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-intro])").forEach((el) => {
        const kind = el.dataset.reveal;
        const delay = Number(el.dataset.delay ?? 0);
        const st = { trigger: el, start: "top 90%", once: true };
        if (kind === "img") {
          gsap.set(el, { opacity: 1 });
          gsap.fromTo(
            el,
            { clipPath: "inset(12% 8% 12% 8%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", delay, scrollTrigger: st },
          );
          const img = el.querySelector("img");
          if (img) gsap.from(img, { scale: 1.25, duration: 1.8, ease: "expo.out", delay, scrollTrigger: st });
        } else if (kind === "stagger") {
          gsap.set(el, { opacity: 1 });
          gsap.from(el.children, {
            y: 40,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.08,
            delay,
            scrollTrigger: st,
          });
        } else if (kind === "fade") {
          gsap.to(el, { opacity: 1, duration: 1.2, ease: "power2.out", delay, scrollTrigger: st });
        } else {
          gsap.fromTo(
            el,
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay, scrollTrigger: st },
          );
        }
      });

      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 0.15);
        gsap.fromTo(
          el,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });
    document.fonts.ready.then(() => {
      if (!cancelled) {
        run();
        ScrollTrigger.refresh();
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    window.addEventListener("load", refresh);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      cancelled = true;
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return null;
}
