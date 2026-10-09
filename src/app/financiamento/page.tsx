import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { FinanceForm } from "@/components/forms/FinanceForm";
import { PageMotion } from "@/components/motion/MotionProvider";

export const metadata: Metadata = {
  title: "Financiamento",
  description: "Simule o financiamento do seu carro com a Garage Select. Trabalhamos com as principais instituições financeiras do país.",
  alternates: { canonical: "/financiamento" },
};

const perks = [
  ["Principais bancos", "Parceria com as principais instituições financeiras."],
  ["Taxas competitivas", "Condições pensadas para caber no seu orçamento."],
  ["Resposta rápida", "Nossa equipe retorna com as melhores condições para você."],
];

export default function FinanciamentoPage() {
  return (
    <>
      <PageHero
        eyebrow="Crédito"
        title="Financiamento"
        text="Preencha os dados abaixo e nossa equipe entrará em contato com as melhores condições para você."
        crumbs={[{ label: "Financiamento" }]}
      />
      <section className="wrap grid gap-16 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] xl:gap-24">
        <ul data-reveal="stagger" className="self-start border-t border-line">
          {perks.map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7">
              <span className="eyebrow pt-1.5 text-gold">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-semiwide text-xl font-medium">{t}</p>
                <p className="mt-2 text-mute">{d}</p>
              </div>
            </li>
          ))}
        </ul>
        <div data-reveal className="border border-line bg-ink-2 p-7 md:p-12">
          <h2 className="font-wide text-2xl font-medium uppercase">Ficha de simulação</h2>
          <p className="mt-2 mb-8 text-sm text-mute">
            Por segurança, documentos como CPF e RG são solicitados somente no atendimento com o consultor.
          </p>
          <Suspense>
            <FinanceForm />
          </Suspense>
        </div>
      </section>
      <PageMotion />
    </>
  );
}
