"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/stock";
import { lockScroll } from "@/lib/scroll";
import { ChevronLeft, ChevronRight, Close, Expand } from "@/components/Icons";

export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState<number | null>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  // índice visível na trilha
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const left = el.scrollLeft + 1;
    const i = items.findIndex((c) => c.offsetLeft + c.offsetWidth / 2 > left);
    setIndex(Math.max(0, i));
  };

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const target = items[Math.min(items.length - 1, Math.max(0, index + dir))];
    el.scrollTo({ left: target.offsetLeft - items[0].offsetLeft, behavior: "smooth" });
  };

  // arrastar com mouse
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { down: true, x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) {
      d.moved = true;
      track.current.style.scrollSnapType = "none";
    }
    track.current.scrollLeft = d.left - dx;
  };
  const onUp = () => {
    drag.current.down = false;
    if (track.current) track.current.style.scrollSnapType = "";
  };

  return (
    <>
      <div className="relative">
        <div
          ref={track}
          onScroll={onScroll}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-(--gutter) select-none md:cursor-grab md:active:cursor-grabbing"
          style={{ scrollPaddingInline: "var(--gutter)" }}
          aria-label={`Galeria de fotos: ${title}`}
          role="region"
        >
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => !drag.current.moved && setBox(i)}
              aria-label={`Ampliar foto ${i + 1} de ${photos.length}`}
              className={`group relative h-[62svh] max-h-[760px] min-h-[380px] shrink-0 snap-start overflow-hidden bg-ink-3 ${
                p.framing === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={p.src}
                alt={`${title}, foto ${i + 1}`}
                fill
                draggable={false}
                priority={i < 3}
                quality={80}
                sizes="(min-width: 1024px) 40vw, 85vw"
                className="pointer-events-none object-cover transition-transform duration-[1.2s] ease-(--ease-expo) group-hover:scale-[1.04]"
              />
              <span className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                <Expand width={16} height={16} />
              </span>
            </button>
          ))}
        </div>

        <div className="wrap mt-5 flex items-center justify-between">
          <p className="eyebrow text-mute tabular">
            <span className="text-bone">{String(index + 1).padStart(2, "0")}</span> / {String(photos.length).padStart(2, "0")}
          </p>
          <div className="mx-6 hidden h-px flex-1 bg-line md:block">
            <div
              className="h-px bg-gold transition-[width] duration-500"
              style={{ width: `${((index + 1) / photos.length) * 100}%` }}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Foto anterior" disabled={index === 0} className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong transition hover:border-bone disabled:opacity-30">
              <ChevronLeft />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Próxima foto" disabled={index >= photos.length - 1} className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong transition hover:border-bone disabled:opacity-30">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {box !== null && <Lightbox photos={photos} title={title} start={box} onClose={() => setBox(null)} />}
    </>
  );
}

function Lightbox({ photos, title, start, onClose }: { photos: Photo[]; title: string; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const touch = useRef(0);
  const prev = useCallback(() => setI((v) => (v - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setI((v) => (v + 1) % photos.length), [photos.length]);

  useEffect(() => {
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, prev, next]);

  const p = photos[i];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${i + 1} de ${photos.length}`}
      className="fixed inset-0 z-[90] flex flex-col bg-black/95 backdrop-blur-sm animate-[lb-in_0.4s_ease-out]"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
      }}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-(--gutter)">
        <p className="eyebrow text-bone-2 tabular">
          {String(i + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </p>
        <p className="hidden truncate px-6 text-sm text-mute md:block">{title}</p>
        <button type="button" onClick={onClose} aria-label="Fechar galeria" autoFocus className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong hover:border-bone">
          <Close width={18} height={18} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20">
        <div
          key={p.src}
          className={`relative animate-[lb-img_0.5s_var(--ease-expo)] ${p.framing === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"}`}
          style={{ width: `min(100%, calc((100svh - 10.5rem) * ${p.framing === "portrait" ? 0.75 : 4 / 3}))` }}
        >
          <Image src={p.src} alt={`${title}, foto ${i + 1}`} fill sizes="100vw" quality={90} className="object-cover" />
        </div>
        <button type="button" onClick={prev} aria-label="Foto anterior" className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 md:left-6">
          <ChevronLeft />
        </button>
        <button type="button" onClick={next} aria-label="Próxima foto" className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 md:right-6">
          <ChevronRight />
        </button>
      </div>

      <div className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto px-(--gutter) py-4" data-lenis-prevent>
        {photos.map((ph, n) => (
          <button
            key={ph.src}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Ver foto ${n + 1}`}
            aria-current={n === i}
            className={`relative h-16 w-12 shrink-0 overflow-hidden transition-opacity ${n === i ? "opacity-100 ring-1 ring-gold" : "opacity-40 hover:opacity-80"}`}
          >
            <Image src={ph.src} alt="" fill sizes="48px" quality={70} className="object-cover" />
          </button>
        ))}
      </div>
      <style>{`@keyframes lb-in{from{opacity:0}}@keyframes lb-img{from{opacity:0;transform:scale(.97)}}`}</style>
    </div>
  );
}
