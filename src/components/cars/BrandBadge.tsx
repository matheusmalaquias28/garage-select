import Image from "next/image";

export function BrandBadge({ logo, name, size = 44, className = "" }: { logo: string; name: string; size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-bone shadow-[0_6px_20px_-8px_rgba(0,0,0,0.6)] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={logo} alt={name} width={size * 2} height={size * 2} className="h-[64%] w-[64%] object-contain" />
    </span>
  );
}
