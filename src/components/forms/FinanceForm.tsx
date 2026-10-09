"use client";

import { useSearchParams } from "next/navigation";
import { brl, cars, getCar } from "@/lib/stock";
import { LeadForm } from "./LeadForm";

export function FinanceForm() {
  const car = getCar(useSearchParams().get("veiculo") ?? "");
  const options = cars.map((c) => `${c.brand} ${c.model} ${c.yearModel} · ${brl(c.price)}`);
  const selected = car ? `${car.brand} ${car.model} ${car.yearModel} · ${brl(car.price)}` : undefined;

  return (
    <LeadForm
      key={selected}
      subject="Olá! Gostaria de simular um financiamento."
      cta="Simular financiamento"
      fields={[
        { name: "veiculo", label: "Veículo de interesse", type: "select", options: ["Ainda não escolhi", ...options], defaultValue: selected, full: true },
        { name: "nome", label: "Nome completo", required: true, autoComplete: "name", full: true },
        { name: "telefone", label: "Celular", type: "tel", required: true, autoComplete: "tel" },
        { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
        { name: "entrada", label: "Valor de entrada" },
        { name: "parcelas", label: "Parcelas", type: "select", options: ["12x", "24x", "36x", "48x", "60x"] },
        { name: "troca", label: "Possui carro na troca?", type: "select", options: ["Não", "Sim"] },
        { name: "nascimento", label: "Data de nascimento" },
      ]}
    />
  );
}
