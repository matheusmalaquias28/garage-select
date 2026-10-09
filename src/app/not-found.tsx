import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[80svh] flex-col items-start justify-center pt-(--header-h)">
      <p className="eyebrow mb-6 text-gold">Erro 404</p>
      <h1 className="font-wide text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] font-medium uppercase">
        Saiu da
        <br />
        garagem.
      </h1>
      <p className="mt-6 max-w-md text-bone-2">Este veículo pode ter sido vendido ou a página não existe mais. Veja o que temos em estoque hoje.</p>
      <Link href="/estoque" className="mt-10 inline-flex h-14 items-center rounded-full bg-gold px-8 font-medium text-ink">
        Ver estoque
      </Link>
    </section>
  );
}
