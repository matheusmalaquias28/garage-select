"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { brands, brl, cars, filterCars, modelsFor, PRICE_STEPS, toSearch, years, type Filters } from "@/lib/stock";
import { Search } from "@/components/Icons";
import { Select, type SelectOption } from "@/components/ui/Select";

export function HeroSearch() {
  const router = useRouter();
  const [f, setF] = useState<Filters>({});
  const models = useMemo(() => modelsFor(f.marca), [f.marca]);
  const count = useMemo(() => filterCars(f).length, [f]);

  const set = (patch: Partial<Filters>) => setF((prev) => ({ ...prev, ...patch }));

  // contagem de resultados de cada opção, considerando os demais campos
  const opt = (value: string | number, label: string, patch: Partial<Filters>, icon?: string): SelectOption => {
    const n = filterCars({ ...f, ...patch }).length;
    return { value: String(value), label, meta: n, disabled: n === 0, icon };
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/estoque${toSearch(f)}`);
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Buscar veículos"
      className="grid overflow-hidden rounded-md border border-line-strong bg-ink/55 backdrop-blur-2xl max-lg:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] [&>button[role=combobox]]:border-line max-lg:[&>button[role=combobox]:nth-child(odd)]:border-r max-lg:[&>button[role=combobox]]:border-b lg:[&>button[role=combobox]]:border-r"
    >
      <Select
        variant="hero"
        label="Marca"
        placeholder="Todas"
        value={f.marca ?? ""}
        onChange={(v) => set({ marca: v || undefined, modelo: undefined })}
        options={brands.map((b) => opt(b.key, b.name, { marca: b.key, modelo: undefined }, b.logo))}
      />
      <Select
        variant="hero"
        label="Modelo"
        placeholder="Todos"
        value={f.modelo ?? ""}
        onChange={(v) => set({ modelo: v || undefined })}
        options={models.map((m) => opt(m, m, { modelo: m }))}
      />
      <Select
        variant="hero"
        label="Preço até"
        placeholder="Qualquer valor"
        value={f.precoMax ? String(f.precoMax) : ""}
        onChange={(v) => set({ precoMax: Number(v) || undefined })}
        options={PRICE_STEPS.map((p) => opt(p, brl(p), { precoMax: p }))}
      />
      <Select
        variant="hero"
        label="Ano mínimo"
        placeholder="Qualquer ano"
        value={f.anoMin ? String(f.anoMin) : ""}
        onChange={(v) => set({ anoMin: Number(v) || undefined })}
        options={years.map((y) => opt(y, String(y), { anoMin: y }))}
      />
      <button
        type="submit"
        disabled={count === 0}
        className="group flex h-full min-h-16 items-center justify-center gap-3 bg-gold px-8 font-medium text-ink transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:bg-ink-4 disabled:text-mute max-lg:col-span-2"
      >
        <Search width={18} height={18} />
        <span className="whitespace-nowrap">
          {count === 0 ? "Nenhum veículo" : count === cars.length ? `Ver ${count} veículos` : `Ver ${count} ${count === 1 ? "veículo" : "veículos"}`}
        </span>
      </button>
    </form>
  );
}
