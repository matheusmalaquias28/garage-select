import Link from "next/link";
import { ArrowRight } from "@/components/Icons";

export function SectionHead({
  id,
  eyebrow,
  title,
  link,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  link?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p data-reveal className="eyebrow mb-5 flex items-center gap-3 text-gold">
          <span className="h-px w-8 bg-gold" />
          {eyebrow}
        </p>
        <h2 id={id} data-split className="font-wide text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] font-medium tracking-tight uppercase">
          {title}
        </h2>
        {children}
      </div>
      {link && (
        <Link
          data-reveal
          href={link.href}
          className="group inline-flex items-center gap-3 self-end justify-self-start rounded-full border border-line-strong py-3 pr-3 pl-6 text-sm transition hover:border-gold md:justify-self-end"
        >
          {link.label}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 group-hover:translate-x-1 group-hover:bg-gold">
            <ArrowRight width={16} height={16} />
          </span>
        </Link>
      )}
    </div>
  );
}
