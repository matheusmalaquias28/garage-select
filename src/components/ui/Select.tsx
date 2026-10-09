"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/scroll";
import { Check, Close } from "@/components/Icons";

export type SelectOption = {
  value: string;
  label: string;
  /** logo/ícone exibido à esquerda (ex.: marca) */
  icon?: string;
  /** informação secundária à direita (ex.: contagem) */
  meta?: string | number;
  disabled?: boolean;
};

type Variant = "hero" | "line" | "pill";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** texto da opção vazia (value ""); omita para não oferecer opção vazia */
  placeholder?: string;
  variant?: Variant;
  className?: string;
};

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
    className={`shrink-0 transition-transform duration-500 ease-(--ease-expo) ${open ? "rotate-180 text-gold" : "text-bone/60"}`}
  >
    <path d="m3 4.5 3 3 3-3" />
  </svg>
);

const MOBILE = "(max-width: 767px)";

export function Select({ label, value, onChange, options, placeholder, variant = "line", className = "" }: Props) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number; width: number; up: boolean; max: number } | null>(null);
  const typed = useRef({ text: "", t: 0 });

  const all: SelectOption[] = placeholder !== undefined ? [{ value: "", label: placeholder }, ...options] : options;
  const selected = all.find((o) => o.value === value);
  const hasValue = value !== "";

  const place = useCallback(() => {
    const r = trigger.current?.getBoundingClientRect();
    if (!r) return;
    const gap = 8;
    const below = window.innerHeight - r.bottom - gap * 2;
    const above = r.top - gap * 2;
    const up = below < 260 && above > below;
    const max = Math.min(340, up ? above : below);
    const width = Math.max(r.width, 240);
    const left = Math.min(r.left, window.innerWidth - width - 12);
    setPos(up ? { bottom: window.innerHeight - r.top + gap, left, width, up, max } : { top: r.bottom + gap, left, width, up, max });
  }, []);

  const show = () => {
    const isSheet = window.matchMedia(MOBILE).matches;
    setSheet(isSheet);
    const i = all.findIndex((o) => o.value === value);
    setActive(i < 0 ? 0 : i);
    if (!isSheet) place();
    setOpen(true);
  };

  const close = useCallback((focus = true) => {
    setOpen(false);
    if (focus) trigger.current?.focus({ preventScroll: true });
  }, []);

  const choose = (o: SelectOption) => {
    if (o.disabled) return;
    onChange(o.value);
    close();
  };

  // posição, clique fora, rolagem
  useEffect(() => {
    if (!open) return;
    if (sheet) {
      lockScroll(true);
      return () => lockScroll(false);
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!trigger.current?.contains(t) && !list.current?.parentElement?.contains(t)) close(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", place, { passive: true, capture: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", place, { capture: true });
      window.removeEventListener("resize", place);
    };
  }, [open, sheet, place, close]);

  // foco na lista ao abrir
  useLayoutEffect(() => {
    if (open) list.current?.focus({ preventScroll: true });
  }, [open]);

  // mantém a opção ativa visível
  useEffect(() => {
    if (!open) return;
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const move = (dir: 1 | -1, from = active) => {
    let i = from;
    for (let n = 0; n < all.length; n++) {
      i = (i + dir + all.length) % all.length;
      if (!all[i].disabled) return setActive(i);
    }
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const nav: Record<string, () => void> = {
      ArrowDown: () => move(1),
      ArrowUp: () => move(-1),
      Home: () => move(1, -1),
      End: () => move(-1, all.length),
      Enter: () => choose(all[active]),
      " ": () => choose(all[active]),
      Escape: () => close(),
    };
    if (nav[e.key]) {
      e.preventDefault();
      nav[e.key]();
    } else if (e.key === "Tab") {
      close(false);
    } else if (e.key.length === 1) {
      const now = Date.now();
      typed.current = { text: (now - typed.current.t < 600 ? typed.current.text : "") + e.key.toLowerCase(), t: now };
      const i = all.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(typed.current.text));
      if (i >= 0) setActive(i);
    }
  };

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      show();
    }
  };

  /* ---------- gatilho ---------- */

  const valueText = (
    <span className={`truncate ${hasValue ? "text-bone" : variant === "hero" ? "text-bone/90" : "text-bone-2"}`}>
      {selected?.label ?? placeholder ?? "Selecione"}
    </span>
  );

  const triggerCls = {
    hero: "group/sel relative flex h-full w-full min-w-0 flex-col items-start justify-center gap-1.5 px-5 py-4 text-left transition-colors hover:bg-white/[0.04] lg:px-6",
    line: `group/sel flex h-12 w-full items-center justify-between gap-3 border-b text-left text-sm transition-colors ${
      open ? "border-gold" : "border-line-strong hover:border-bone/50"
    }`,
    pill: `group/sel inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
      open ? "border-gold" : "border-line-strong hover:border-bone/60"
    }`,
  }[variant];

  return (
    <>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-label={`${label}: ${selected?.label ?? placeholder ?? ""}`}
        onClick={() => (open ? close() : show())}
        onKeyDown={onTriggerKey}
        className={`${triggerCls} ${className}`}
      >
        {variant === "hero" ? (
          <>
            <span className="eyebrow flex items-center gap-2 text-[10px] text-mute">
              {label}
              {hasValue && <span className="h-1 w-1 rounded-full bg-gold" aria-hidden />}
            </span>
            <span className="flex w-full items-center justify-between gap-3 text-[15px]">
              <span className="flex min-w-0 items-center gap-2.5">
                {selected?.icon && <Logo src={selected.icon} size={20} />}
                {valueText}
              </span>
              <Chevron open={open} />
            </span>
            <span
              aria-hidden
              className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gold transition-transform duration-700 ease-(--ease-expo) ${
                open ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </>
        ) : variant === "pill" ? (
          <>
            <span className="text-mute max-sm:sr-only">{label}:</span>
            {valueText}
            <Chevron open={open} />
          </>
        ) : (
          <>
            <span className="flex min-w-0 items-center gap-2.5">
              {selected?.icon && <Logo src={selected.icon} size={20} />}
              {valueText}
            </span>
            <Chevron open={open} />
          </>
        )}
      </button>

      {open &&
        createPortal(
          sheet ? (
            <div className="fixed inset-0 z-[95]">
              <div className="absolute inset-0 bg-black/70 animate-[sel-fade_0.3s_ease-out]" onClick={() => close()} />
              <div
                role="dialog"
                aria-label={label}
                className="absolute inset-x-0 bottom-0 flex max-h-[78svh] flex-col rounded-t-2xl border-t border-line-strong bg-ink-2 animate-[sel-sheet_0.5s_var(--ease-expo)]"
              >
                <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/20" />
                <div className="flex items-center justify-between px-5 pt-3 pb-4">
                  <p className="eyebrow text-bone">{label}</p>
                  <button type="button" onClick={() => close()} aria-label="Fechar" className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong">
                    <Close width={14} height={14} />
                  </button>
                </div>
                <List
                  ref={list}
                  id={`${id}-list`}
                  label={label}
                  options={all}
                  value={value}
                  active={active}
                  setActive={setActive}
                  onKeyDown={onListKey}
                  onChoose={choose}
                  large
                  className="overflow-y-auto overscroll-contain px-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
                />
              </div>
            </div>
          ) : (
            pos && (
              <div
                className={`fixed z-[95] overflow-hidden rounded-xl border border-line-strong bg-ink-2/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl ${
                  pos.up ? "origin-bottom animate-[sel-up_0.35s_var(--ease-expo)]" : "origin-top animate-[sel-down_0.35s_var(--ease-expo)]"
                }`}
                style={{ top: pos.top, bottom: pos.bottom, left: pos.left, width: pos.width }}
              >
                <List
                  ref={list}
                  id={`${id}-list`}
                  label={label}
                  options={all}
                  value={value}
                  active={active}
                  setActive={setActive}
                  onKeyDown={onListKey}
                  onChoose={choose}
                  className="overflow-y-auto overscroll-contain p-1.5"
                  style={{ maxHeight: pos.max }}
                />
              </div>
            )
          ),
          document.body,
        )}
    </>
  );
}

function Logo({ src, size }: { src: string; size: number }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-bone" style={{ width: size, height: size }}>
      <Image src={src} alt="" width={size * 2} height={size * 2} className="h-[66%] w-[66%] object-contain" />
    </span>
  );
}

type ListProps = {
  ref: React.Ref<HTMLUListElement>;
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  active: number;
  setActive: (i: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onChoose: (o: SelectOption) => void;
  large?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function List({ ref, id, label, options, value, active, setActive, onKeyDown, onChoose, large, className, style }: ListProps) {
  return (
    <ul
      ref={ref}
      id={id}
      role="listbox"
      aria-label={label}
      tabIndex={-1}
      aria-activedescendant={`${id}-${active}`}
      onKeyDown={onKeyDown}
      data-lenis-prevent
      className={`no-scrollbar outline-none ${className}`}
      style={style}
    >
      {options.map((o, i) => {
        const isSel = o.value === value;
        return (
          <li
            key={o.value || "__empty"}
            id={`${id}-${i}`}
            data-index={i}
            role="option"
            aria-selected={isSel}
            aria-disabled={o.disabled || undefined}
            onPointerMove={() => !o.disabled && active !== i && setActive(i)}
            onClick={() => onChoose(o)}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 transition-colors duration-200 ${large ? "min-h-13 text-base" : "min-h-10 text-sm"} ${
              o.disabled ? "cursor-not-allowed opacity-30" : i === active ? "bg-white/[0.07]" : ""
            } ${isSel ? "text-gold" : "text-bone"}`}
          >
            {o.icon && <Logo src={o.icon} size={large ? 26 : 22} />}
            <span className={`flex-1 truncate ${o.value === "" ? "text-bone-2" : ""} ${isSel ? "!text-gold" : ""}`}>{o.label}</span>
            {o.meta !== undefined && <span className="text-xs text-mute tabular">{o.meta}</span>}
            <span className="flex w-4 justify-end">{isSel && <Check width={15} height={15} />}</span>
          </li>
        );
      })}
    </ul>
  );
}
