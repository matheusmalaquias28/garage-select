import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label="Garage Select, página inicial" className={`inline-flex shrink-0 ${className}`}>
      <Image
        src="/brand/logo.png"
        alt="Garage Select"
        width={342}
        height={61}
        priority={priority}
        className="h-auto w-full"
        sizes="200px"
      />
    </Link>
  );
}
