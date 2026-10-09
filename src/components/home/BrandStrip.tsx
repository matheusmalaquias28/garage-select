import Link from "next/link";
import { brands } from "@/lib/stock";
import { BrandBadge } from "@/components/cars/BrandBadge";

export function BrandStrip() {
  const row = [...brands, ...brands];
  return (
    <section aria-label="Marcas em estoque" className="relative border-y border-line bg-ink py-8">
      <div className="wrap mb-6 flex items-center justify-between">
        <p className="eyebrow text-mute">
          <span className="text-bone tabular">{brands.length}</span> marcas em estoque
        </p>
        <Link href="/estoque" className="eyebrow link-line text-bone/80 hover:text-bone">
          Explorar todas
        </Link>
      </div>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <ul className="flex w-max animate-[marquee_60s_linear_infinite] gap-3 group-hover:[animation-play-state:paused]">
          {row.map((b, i) => (
            <li key={`${b.key}-${i}`} aria-hidden={i >= brands.length || undefined}>
              <Link
                href={`/estoque?marca=${b.key}`}
                tabIndex={i >= brands.length ? -1 : undefined}
                className="flex items-center gap-3 rounded-full border border-line py-2 pr-5 pl-2 transition-colors duration-500 hover:border-gold hover:bg-white/[0.03]"
              >
                <BrandBadge logo={b.logo} name={b.name} size={36} />
                <span className="font-semiwide text-sm font-medium whitespace-nowrap">{b.name}</span>
                <span className="text-xs text-mute tabular">{b.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <style>{`@keyframes marquee{to{transform:translateX(-50%)}}`}</style>
    </section>
  );
}
