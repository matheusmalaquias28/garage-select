"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { Phone, WhatsApp } from "@/components/Icons";

const left = nav.slice(0, 3);
const right = nav.slice(3);

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > lastY.current + 4 ? true : y < lastY.current - 4 ? false : (h) => h);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => href !== "/" && !href.includes("#") && pathname.startsWith(href);

  const linkCls = (href: string) =>
    `link-line eyebrow py-1 whitespace-nowrap transition-colors duration-300 ${isActive(href) ? "text-gold" : "text-bone/80 hover:text-bone"}`;

  return (
    <>
      <header
        data-header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-(--ease-expo) ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}
      >
        {!scrolled && (
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-[160%] bg-linear-to-b from-black/60 to-transparent" />
        )}
        <div className="wrap grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center gap-6">
          {/* Esquerda */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={open}
              className="group -ml-2 flex h-11 w-11 flex-col items-start justify-center gap-[7px] p-2 xl:hidden"
            >
              <span className="block h-px w-7 bg-bone transition-all duration-500 group-hover:w-5" />
              <span className="block h-px w-5 bg-bone transition-all duration-500 group-hover:w-7" />
            </button>
            <nav aria-label="Principal" className="hidden items-center gap-6 xl:flex 2xl:gap-8">
              {left.map((l) => (
                <Link key={l.href} href={l.href} className={linkCls(l.href)}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Centro */}
          <Logo priority className="w-36 sm:w-44 lg:w-48" />

          {/* Direita */}
          <div className="flex items-center justify-end gap-6 2xl:gap-8">
            <nav aria-label="Institucional" className="hidden items-center gap-6 xl:flex 2xl:gap-8">
              {right.map((l) => (
                <Link key={l.href} href={l.href} className={linkCls(l.href)}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <a
              href={site.phones[0].href}
              aria-label={`Ligar ${site.phones[0].label}`}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-line-strong text-bone/80 transition hover:border-bone hover:text-bone 2xl:flex"
            >
              <Phone width={16} height={16} />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener"
              className="group relative hidden h-10 items-center gap-2 overflow-hidden rounded-full bg-gold pr-4 pl-3.5 text-ink transition-transform duration-500 hover:scale-[1.03] lg:inline-flex"
            >
              <WhatsApp width={17} height={17} />
              <span className="eyebrow tracking-[0.16em] whitespace-nowrap">Fale conosco</span>
            </a>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
