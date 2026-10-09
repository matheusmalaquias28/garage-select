"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { nav, site, whatsappLink, mapsUrl } from "@/lib/site";
import { lockScroll } from "@/lib/scroll";
import { Close, Instagram, Facebook, WhatsApp, ArrowUpRight } from "@/components/Icons";
import { Logo } from "./Logo";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(el, { visibility: "visible" })
        .fromTo("[data-m-bg]", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
        .fromTo(
          "[data-m-panel]",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "expo.inOut" },
          0,
        )
        .fromTo(
          "[data-m-link]",
          { yPercent: 120 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
          0.45,
        )
        .fromTo("[data-m-fade]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 }, 0.65);
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      lockScroll(true);
    } else {
      tl.current.timeScale(1.8).reverse();
      lockScroll(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-[60] xl:hidden"
    >
      <div data-m-bg className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div data-m-panel className="absolute inset-0 flex flex-col overflow-y-auto bg-ink-2" data-lenis-prevent>
        <div className="flex h-(--header-h) shrink-0 items-center justify-between px-(--gutter)">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong"
          >
            <Close width={18} height={18} />
          </button>
          <Logo className="w-36" />
          <span className="w-11" />
        </div>

        <nav aria-label="Menu mobile" className="mt-6 flex flex-col px-(--gutter)">
          {nav.map((l, i) => (
            <div key={l.href} className="overflow-hidden border-b border-line">
              <Link
                data-m-link
                href={l.href}
                onClick={onClose}
                className="flex items-baseline gap-4 py-4 text-bone active:text-gold"
              >
                <span className="eyebrow w-6 text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-wide text-[clamp(1.6rem,7vw,2.4rem)] leading-none font-medium uppercase">
                  {l.label}
                </span>
              </Link>
            </div>
          ))}
        </nav>

        <div className="mt-auto grid gap-8 px-(--gutter) pt-12 pb-10">
          <a
            data-m-fade
            href={whatsappLink()}
            target="_blank"
            rel="noopener"
            className="flex h-14 items-center justify-center gap-3 rounded-full bg-gold font-medium text-ink"
          >
            <WhatsApp /> Falar no WhatsApp
          </a>
          <div data-m-fade className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="eyebrow mb-3 text-mute">Telefones</p>
              {site.phones.map((p) => (
                <a key={p.href} href={p.href} className="block py-1 text-bone tabular">
                  {p.label}
                </a>
              ))}
            </div>
            <div>
              <p className="eyebrow mb-3 text-mute">Horário</p>
              {site.hours.map((h) => (
                <p key={h.days} className="py-1 text-bone-2">
                  {h.days.replace("Segunda a sexta", "Seg a sex")}: {h.time}
                </p>
              ))}
            </div>
          </div>
          <a data-m-fade href={mapsUrl} target="_blank" rel="noopener" className="flex items-start gap-2 text-sm text-bone-2">
            {site.address.street}, {site.address.district}, {site.address.city}/{site.address.state}
            <ArrowUpRight width={16} height={16} className="mt-0.5 shrink-0" />
          </a>
          <div data-m-fade className="flex gap-3">
            <a href={site.instagram.href} target="_blank" rel="noopener" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong">
              <Instagram />
            </a>
            <a href={site.facebook.href} target="_blank" rel="noopener" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong">
              <Facebook />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
