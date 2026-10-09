import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/site";
import { PageMotion } from "@/components/motion/MotionProvider";

export const metadata: Metadata = {
  title: "Política de privacidade",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <>
      <PageHero eyebrow="Institucional" title="Privacidade" crumbs={[{ label: "Política de privacidade" }]} />
      <section className="wrap py-20">
        <div className="max-w-2xl space-y-6 leading-relaxed text-bone-2">
          <p className="rounded border border-gold/40 bg-gold/5 p-4 text-sm text-gold">
            [A CONFIRMAR] Texto provisório. Substituir pela política oficial da Garage Select.
          </p>
          <p>
            Este site não armazena os dados digitados nos formulários: ao enviar, a mensagem é aberta no WhatsApp para que você a envie
            diretamente à nossa equipe.
          </p>
          <p>
            Utilizamos dados de navegação apenas para melhorar o desempenho do site. Para dúvidas sobre seus dados, fale com a
            {" "}{site.name} pelo telefone {site.phones[0].label}.
          </p>
        </div>
      </section>
      <PageMotion />
    </>
  );
}
