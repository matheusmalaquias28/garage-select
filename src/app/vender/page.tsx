import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { blobEnabled } from "@/lib/uploads";
import { PageMotion } from "@/components/motion/MotionProvider";

export const metadata: Metadata = {
  title: "Venda seu veículo",
  description: "Venda ou troque seu carro com a Garage Select: avaliação justa, pagamento 100% seguro e consultor dedicado do início ao fim.",
  alternates: { canonical: "/vender" },
};

const steps = [
  ["Conte sobre o carro", "Modelo, ano, quilometragem e o valor que você espera."],
  ["Avaliação", "Um consultor analisa e agenda a vistoria na nossa loja."],
  ["Proposta e pagamento", "Proposta transparente e pagamento 100% seguro, ou use o valor na troca."],
];

export default function VenderPage() {
  return (
    <>
      <PageHero
        eyebrow="Venda ou troca"
        title={
          <>
            Venda seu
            <br />
            veículo
          </>
        }
        text="Temos a solução completa para você vender seu veículo ganhando mais. Pagamento 100% seguro e um consultor especialista cuidando da sua venda do início ao fim."
        crumbs={[{ label: "Venda seu veículo" }]}
      />

      <section className="wrap grid gap-16 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] xl:gap-24">
        <div>
          <ol data-reveal="stagger" className="border-t border-line">
            {steps.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7">
                <span className="eyebrow pt-1.5 text-gold">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-semiwide text-xl font-medium">{t}</p>
                  <p className="mt-2 text-mute">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div data-reveal="img" className="relative mt-12 hidden aspect-[16/9] overflow-hidden lg:block">
            <Image src="/hero/sell.webp" alt="" fill sizes="45vw" className="object-cover" />
          </div>
        </div>

        <div data-reveal className="border border-line bg-ink-2 p-7 md:p-12">
          <h2 className="font-wide text-2xl font-medium uppercase">Dados para avaliação</h2>
          <p className="mt-2 mb-8 text-sm text-mute">Quanto mais fotos, mais precisa a avaliação.</p>
          <LeadForm
            subject="Olá! Quero vender meu veículo para a Garage Select."
            cta="Solicitar avaliação"
            photos={{ upload: blobEnabled() }}
            fields={[
              { name: "nome", label: "Seu nome", required: true, autoComplete: "name" },
              { name: "telefone", label: "Telefone", type: "tel", required: true, autoComplete: "tel" },
              { name: "email", label: "E-mail", type: "email", autoComplete: "email", full: true },
              { name: "veiculo", label: "Veículo (marca, modelo, versão)", required: true, full: true },
              { name: "ano", label: "Ano", required: true },
              { name: "km", label: "Quilometragem", required: true },
              { name: "valor", label: "Valor desejado", full: true },
              { name: "obs", label: "Observações", type: "textarea" },
            ]}
          />
        </div>
      </section>
      <PageMotion />
    </>
  );
}
