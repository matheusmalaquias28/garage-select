"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  brands,
  brl,
  filterCars,
  parseFilters,
  SORTS,
  toSearch,
  type Car,
  type Filters,
  type SortKey,
} from "@/lib/stock";
import { whatsappLink } from "@/lib/site";
import { lockScroll } from "@/lib/scroll";
import { CarCard } from "@/components/cars/CarCard";
import { FilterPanel } from "./FilterPanel";
import { Select } from "@/components/ui/Select";
import { Close, Sliders, WhatsApp } from "@/components/Icons";

const LABELS: Partial<Record<keyof Filters, (v: string | number) => string>> = {
  busca: (v) => `“${v}”`,
  marca: (v) => brands.find((b) => b.key === v)?.name ?? String(v),
  modelo: (v) => String(v),
  precoMin: (v) => `A partir de ${brl(Number(v))}`,
  precoMax: (v) => `Até ${brl(Number(v))}`,
  anoMin: (v) => `De ${v}`,
  anoMax: (v) => `Até ${v}`,
  kmMax: (v) => `Até ${new Intl.NumberFormat("pt-BR").format(Number(v))} km`,
  combustivel: (v) => String(v),
  cambio: (v) => String(v),
};

export function StockBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const f = useMemo(() => parseFilters(new URLSearchParams(sp.toString())), [sp]);
  const list = useMemo(() => filterCars(f), [f]);
  const [drawer, setDrawer] = useState(false);

  const set = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...parseFilters(new URLSearchParams(window.location.search)), ...patch };
      router.replace(`${pathname}${toSearch(next)}`, { scroll: false });
    },
    [router, pathname],
  );

  const clear = () => router.replace(pathname, { scroll: false });

  useEffect(() => {
    lockScroll(drawer);
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  const active = (Object.keys(LABELS) as (keyof Filters)[]).filter((k) => f[k] !== undefined);
  const key = toSearch({ ...f, ordem: undefined });

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:gap-16">
      {/* Sidebar desktop */}
      <aside aria-label="Filtros" className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 no-scrollbar" data-lenis-prevent>
          <div className="mb-2 flex items-center justify-between">
            <p className="eyebrow text-bone">Filtros</p>
            {active.length > 0 && (
              <button type="button" onClick={clear} className="text-xs text-mute underline-offset-4 hover:text-gold hover:underline">
                Limpar tudo
              </button>
            )}
          </div>
          <FilterPanel f={f} set={set} />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Barra de resultado */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <p aria-live="polite" className="font-semiwide text-lg">
            <span className="tabular">{list.length}</span>{" "}
            <span className="text-mute">{list.length === 1 ? "veículo encontrado" : "veículos encontrados"}</span>
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm lg:hidden"
            >
              <Sliders width={18} height={18} /> Filtros
              {active.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-semibold text-ink">
                  {active.length}
                </span>
              )}
            </button>
            <Select
              variant="pill"
              label="Ordenar"
              value={f.ordem ?? "recentes"}
              onChange={(v) => set({ ordem: v === "recentes" ? undefined : (v as SortKey) })}
              options={Object.entries(SORTS).map(([k, v]) => ({ value: k, label: v }))}
            />
          </div>
        </div>

        {/* Filtros ativos */}
        {active.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {active.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set(k === "marca" ? { marca: undefined, modelo: undefined } : { [k]: undefined })}
                className="group inline-flex items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pr-2 pl-3.5 text-[13px] transition hover:bg-white/10"
              >
                {LABELS[k]!(f[k] as string | number)}
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 group-hover:bg-gold group-hover:text-ink">
                  <Close width={11} height={11} />
                </span>
              </button>
            ))}
            <button type="button" onClick={clear} className="ml-1 text-[13px] text-mute hover:text-gold">
              Limpar filtros
            </button>
          </div>
        )}

        {list.length ? (
          <Grid key={key} list={list} />
        ) : (
          <Empty onClear={clear} />
        )}
      </div>

      {/* Drawer mobile */}
      <div className={`fixed inset-0 z-[70] lg:hidden ${drawer ? "" : "pointer-events-none"}`} aria-hidden={!drawer} inert={!drawer}>
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity duration-500 ${drawer ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawer(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filtros"
          className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ink-2 transition-transform duration-700 ease-(--ease-expo) ${
            drawer ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-line px-(--gutter)">
            <p className="eyebrow">Filtros</p>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Fechar filtros"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong"
            >
              <Close width={16} height={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-(--gutter) py-4" data-lenis-prevent>
            <FilterPanel f={f} set={set} />
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-line p-(--gutter)">
            <button type="button" onClick={clear} className="h-13 rounded-full border border-line-strong px-5 text-sm">
              Limpar
            </button>
            <button type="button" onClick={() => setDrawer(false)} className="h-13 rounded-full bg-gold font-medium text-ink">
              Ver {list.length} {list.length === 1 ? "veículo" : "veículos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Grid({ list }: { list: Car[] }) {
  return (
    <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((car, i) => (
        <div
          key={car.id}
          className="animate-[card-in_0.9s_var(--ease-expo)_both]"
          style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
        >
          <CarCard car={car} priority={i < 3} />
        </div>
      ))}
      <style>{`@keyframes card-in{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

function Empty({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 border border-line p-8 md:p-14">
      <p className="eyebrow text-gold">Nenhum resultado</p>
      <h2 className="font-wide text-3xl font-medium tracking-tight uppercase md:text-4xl">Não achou o carro ideal?</h2>
      <p className="max-w-lg text-bone-2">
        Nosso estoque gira rápido. Conte o que você procura e um consultor busca o veículo certo para você.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={whatsappLink("Olá! Estou procurando um veículo e não encontrei no estoque do site. Podem me ajudar?")}
          target="_blank"
          rel="noopener"
          className="inline-flex h-13 items-center gap-3 rounded-full bg-gold px-6 font-medium text-ink"
        >
          <WhatsApp /> Encomendar um carro
        </a>
        <button type="button" onClick={onClear} className="h-13 rounded-full border border-line-strong px-6">
          Limpar filtros
        </button>
      </div>
    </div>
  );
}
