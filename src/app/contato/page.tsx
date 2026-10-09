import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { Visit } from "@/components/home/Visit";
import { PageMotion } from "@/components/motion/MotionProvider";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Garage Select: (27) 3062-7550, WhatsApp (27) 99801-3537. Av. Profa. Francelina Carneiro Setúbal, 804, Itapuã, Vila Velha/ES.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        eyebrow="Fale conosco"
        title="Contato"
        text="Preencha o formulário ou use um dos nossos canais de atendimento. Responderemos o mais rápido possível."
        crumbs={[{ label: "Contato" }]}
      />
      <section className="wrap py-20 md:py-28">
        <div data-reveal className="mx-auto max-w-3xl border border-line bg-ink-2 p-7 md:p-12">
          <h2 className="mb-8 font-wide text-2xl font-medium uppercase">Envie sua mensagem</h2>
          <LeadForm
            subject="Olá! Vim pelo site da Garage Select."
            cta="Enviar mensagem"
            fields={[
              { name: "nome", label: "Nome", required: true, autoComplete: "name" },
              { name: "telefone", label: "Telefone", type: "tel", required: true, autoComplete: "tel" },
              { name: "email", label: "E-mail", type: "email", autoComplete: "email", full: true },
              { name: "mensagem", label: "Mensagem", type: "textarea", required: true },
            ]}
          />
        </div>
      </section>
      <Visit heading={false} />
      <PageMotion />
    </>
  );
}
