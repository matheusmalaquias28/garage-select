import { whatsappLink } from "@/lib/site";
import { WhatsApp } from "@/components/Icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener"
      aria-label="Conversar no WhatsApp"
      data-wa-float
      className="group fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_40px_-10px_rgba(37,211,102,0.6)] transition-transform duration-500 hover:scale-110 md:right-6 md:bottom-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-20 [animation-duration:2.4s]" />
      <WhatsApp width={26} height={26} className="relative" />
    </a>
  );
}
