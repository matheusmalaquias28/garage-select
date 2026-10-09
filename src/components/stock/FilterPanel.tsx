"use client";

import { useEffect, useState } from "react";
import {
  brands,
  brl,
  cars,
  filterCars,
  fuels,
  KM_STEPS,
  modelsFor,
  PRICE_STEPS,
  transmissions,
  years,
  type Filters,
} from "@/lib/stock";
import { Search } from "@/components/Icons";
import { BrandBadge } from "@/components/cars/BrandBadge";
import { Select, type SelectOption } from "@/components/ui/Select";

type Props = { f: Filters; set: (patch: Partial<Filters>) => void };

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-6">
      <legend className="eyebrow float-left mb-4 w-full text-[10px] text-mute">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-2 text-[13px] transition-colors ${
        active ? "border-gold bg-gold text-ink" : "border-line-strong text-bone-2 hover:border-bone hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

export function FilterPanel({ f, set }: Props) {
  const [q, setQ] = useState(f.busca ?? "");

  const [prevBusca, setPrevBusca] = useState(f.busca);
  // sincroniza o campo quando a busca muda por fora (ex.: "Limpar filtros")
  if (prevBusca !== f.busca) {
    setPrevBusca(f.busca);
    setQ(f.busca ?? "");
  }
  useEffect(() => {
    const t = window.setTimeout(() => {
      if ((f.busca ?? "") !== q) set({ busca: q || undefined });
    }, 280);
    return () => window.clearTimeout(t);
  }, [q, f.busca, set]);

  // contagem por marca considerando os demais filtros
  const base = filterCars({ ...f, marca: undefined, modelo: undefined });
  const brandCount = (key: string) => base.filter((c) => c.brandKey === key).length;

  // opção com contagem de resultados aplicando só ela sobre os filtros atuais
  const opt = (value: string | number, label: string, patch: Partial<Filters>): SelectOption => {
    const n = filterCars({ ...f, ...patch }).length;
    return { value: String(value), label, meta: n, disabled: n === 0 };
  };
  const str = (v?: number) => (v ? String(v) : "");
  const num = (v: string) => Number(v) || undefined;

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Buscar por marca, modelo ou versão</span>
        <Search width={18} height={18} className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-mute" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar modelo, versão…"
          className="h-12 w-full border-b border-line-strong bg-transparent pl-8 text-[15px] text-bone outline-none placeholder:text-mute focus:border-gold"
        />
      </label>

      <Group title="Marca">
        <ul className="-mx-2 grid gap-0.5">
          <li>
            <button
              type="button"
              onClick={() => set({ marca: undefined, modelo: undefined })}
              className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition-colors ${
                !f.marca ? "bg-white/[0.06] text-bone" : "text-bone-2 hover:bg-white/[0.03]"
              }`}
            >
              Todas as marcas <span className="text-xs text-mute tabular">{base.length}</span>
            </button>
          </li>
          {brands.map((b) => {
            const n = brandCount(b.key);
            const active = f.marca === b.key;
            return (
              <li key={b.key}>
                <button
                  type="button"
                  aria-pressed={active}
                  disabled={!n && !active}
                  onClick={() => set({ marca: active ? undefined : b.key, modelo: undefined })}
                  className={`flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors disabled:opacity-35 ${
                    active ? "bg-white/[0.06] text-gold" : "text-bone-2 hover:bg-white/[0.03] hover:text-bone"
                  }`}
                >
                  <BrandBadge logo={b.logo} name="" size={26} />
                  <span className="flex-1 text-left">{b.name}</span>
                  <span className="text-xs text-mute tabular">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Modelo">
        <Select
          label="Modelo"
          placeholder="Todos os modelos"
          value={f.modelo ?? ""}
          onChange={(v) => set({ modelo: v || undefined })}
          options={modelsFor(f.marca).map((m) => opt(m, m, { modelo: m }))}
        />
      </Group>

      <Group title="Preço">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Preço mínimo"
            placeholder="De"
            value={str(f.precoMin)}
            onChange={(v) => set({ precoMin: num(v) })}
            options={PRICE_STEPS.map((p) => opt(p, brl(p), { precoMin: p }))}
          />
          <Select
            label="Preço máximo"
            placeholder="Até"
            value={str(f.precoMax)}
            onChange={(v) => set({ precoMax: num(v) })}
            options={PRICE_STEPS.map((p) => opt(p, brl(p), { precoMax: p }))}
          />
        </div>
      </Group>

      <Group title="Ano do modelo">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Ano mínimo"
            placeholder="De"
            value={str(f.anoMin)}
            onChange={(v) => set({ anoMin: num(v) })}
            options={[...years].reverse().map((y) => opt(y, String(y), { anoMin: y }))}
          />
          <Select
            label="Ano máximo"
            placeholder="Até"
            value={str(f.anoMax)}
            onChange={(v) => set({ anoMax: num(v) })}
            options={years.map((y) => opt(y, String(y), { anoMax: y }))}
          />
        </div>
      </Group>

      <Group title="Quilometragem">
        <Select
          label="Quilometragem"
          placeholder="Qualquer quilometragem"
          value={str(f.kmMax)}
          onChange={(v) => set({ kmMax: num(v) })}
          options={KM_STEPS.map((k) => opt(k, `Até ${new Intl.NumberFormat("pt-BR").format(k)} km`, { kmMax: k }))}
        />
      </Group>

      <Group title="Combustível">
        <div className="flex flex-wrap gap-2">
          {fuels.map((x) => (
            <Chip key={x} active={f.combustivel === x} onClick={() => set({ combustivel: f.combustivel === x ? undefined : x })}>
              {x}
            </Chip>
          ))}
        </div>
      </Group>

      {transmissions.length > 1 && (
      <Group title="Câmbio">
        <div className="flex flex-wrap gap-2">
          {transmissions.map((x) => (
            <Chip key={x} active={f.cambio === x} onClick={() => set({ cambio: f.cambio === x ? undefined : x })}>
              {x}
            </Chip>
          ))}
        </div>
      </Group>
      )}

      <p className="pt-6 text-xs text-mute">
        Estoque com {cars.length} veículos, atualizado pela equipe Garage Select.
      </p>
    </div>
  );
}
