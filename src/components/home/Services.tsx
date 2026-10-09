import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";

const items = [
  {
    href: "/vender",
    img: "/hero/sell.webp",
    eyebrow: "Venda ou troca",
    title: "Avalie seu carro",
    text: "Fale com a Garage Select e receba uma avaliação para negociar com mais segurança.",
    cta: "Solicitar avaliação",
  },
  {
    href: "/financiamento",
    img: "/hero/finance.webp",
    eyebrow: "Crédito",
    title: "Simule seu financiamento",
    text: "Condições competitivas e taxas atrativas com as principais instituições financeiras.",
    cta: "Simular agora",
  },
];

export function Services() {
  return (
    <section aria-label="Serviços" className="py-24 md:py-32">
      <div className="wrap grid gap-4 md:grid-cols-2 md:gap-6">
        {items.map((it, i) => (
          <Link
            key={it.href}
            href={it.href}
            data-reveal="img"
            data-delay={i * 0.12}
            className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden bg-ink-3 p-7 md:min-h-[560px] md:p-10"
          >
            <Image
              src={it.img}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.6s] ease-(--ease-expo) group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 transition-colors duration-700 group-hover:via-black/30" />
            <div className="relative">
              <p className="eyebrow text-gold">{it.eyebrow}</p>
              <h3 className="mt-4 font-wide text-[clamp(1.8rem,3.4vw,3rem)] leading-[0.95] font-medium tracking-tight uppercase">{it.title}</h3>
              <p className="mt-4 max-w-sm text-bone-2">{it.text}</p>
              <span className="mt-8 inline-flex items-center gap-3 border-b border-bone/40 pb-1.5 text-sm font-medium transition-colors group-hover:border-gold group-hover:text-gold">
                {it.cta} <ArrowUpRight width={16} height={16} className="transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
