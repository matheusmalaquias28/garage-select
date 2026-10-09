import { brands, cars } from "@/lib/stock";

const pillars = [
  {
    n: "01",
    title: "Revisados criteriosamente",
    text: "Cada veículo passa por uma checagem rigorosa antes de entrar no estoque, para você comprar com tranquilidade.",
  },
  {
    n: "02",
    title: "Avaliação do seu usado",
    text: "Receba uma avaliação justa e use o seu carro na negociação, com consultor dedicado do início ao fim.",
  },
  {
    n: "03",
    title: "Financiamento sob medida",
    text: "Trabalhamos com as principais instituições financeiras para oferecer taxas competitivas e parcelas que cabem no seu orçamento.",
  },
];

export function About() {
  const stats = [
    { v: String(cars.length), l: "Veículos em estoque" },
    { v: String(brands.length), l: "Marcas nacionais e importadas" },
    { v: "100%", l: "Dos veículos revisados criteriosamente" },
    { v: "6", l: "Dias por semana de atendimento" },
  ];

  return (
    <section id="sobre" aria-labelledby="sobre-title" className="relative scroll-mt-24 border-t border-line bg-ink-2 py-24 md:py-36">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p data-reveal className="eyebrow mb-6 flex items-center gap-3 text-gold">
              <span className="h-px w-8 bg-gold" /> A Garage Select
            </p>
            <h2 id="sobre-title" data-split className="font-wide text-[clamp(2rem,4.6vw,4.25rem)] leading-[0.95] font-medium tracking-tight uppercase">
              Quem entende, seleciona.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-bone-2 lg:col-span-6 lg:col-start-7 lg:pt-14">
            <p data-reveal>
              Nos consagramos como uma das agências de automóveis de maior prestígio da região. Somos especializados na venda de
              veículos <span className="text-bone">novos e usados, nacionais e importados</span>.
            </p>
            <p data-reveal className="text-base text-mute">
              Todos os nossos veículos são revisados criteriosamente, o que garante tranquilidade na hora da compra. Venha nos visitar
              em Vila Velha: nossos consultores terão prazer em atender você.
            </p>
          </div>
        </div>

        <dl data-reveal="stagger" className="mt-20 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.l} className={`border-b border-line py-8 lg:border-b-0 ${i % 2 ? "pl-6" : "pr-6"} lg:px-8 ${i ? "lg:border-l" : "lg:pl-0"}`}>
              <dt className="sr-only">{s.l}</dt>
              <dd className="font-wide text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-medium tabular">{s.v}</dd>
              <p className="mt-3 text-sm text-mute">{s.l}</p>
            </div>
          ))}
        </dl>

        <div data-reveal="stagger" className="mt-20 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {pillars.map((p) => (
            <article key={p.n} className="group relative bg-ink-2 p-8 transition-colors duration-700 hover:bg-ink-3 md:p-10">
              <span className="eyebrow text-gold">{p.n}</span>
              <h3 className="mt-10 font-semiwide text-xl font-medium md:mt-16">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{p.text}</p>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-(--ease-expo) group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
