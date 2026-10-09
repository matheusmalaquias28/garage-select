import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  text,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-[calc(var(--header-h)+3.5rem)] pb-14 md:pt-[calc(var(--header-h)+5rem)] md:pb-20">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gold/[0.05] blur-3xl" />
      <div className="wrap relative">
        <nav aria-label="Navegação estrutural" data-reveal className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-mute">
            <li>
              <Link href="/" className="hover:text-bone">
                Início
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {c.href ? (
                  <Link href={c.href} className="hover:text-bone">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-bone-2">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p data-reveal className="eyebrow mb-5 flex items-center gap-3 text-gold">
              <span className="h-px w-8 bg-gold" /> {eyebrow}
            </p>
            <h1 data-split className="font-wide text-[clamp(2.4rem,7vw,7rem)] leading-[0.9] font-medium tracking-tight uppercase">
              {title}
            </h1>
          </div>
          {text && (
            <p data-reveal className="max-w-md text-bone-2 lg:pb-3">
              {text}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
