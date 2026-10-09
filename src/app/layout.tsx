import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/motion/MotionProvider";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Garage Select | Seminovos premium em Vila Velha, ES",
    template: "%s | Garage Select",
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    images: ["/video/hero-desktop-poster.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090a",
};

// Marca a página antes da pintura: JS ativo e intro já vista nesta sessão
const boot = `document.documentElement.classList.add('js');try{if(sessionStorage.getItem('gs-intro'))document.documentElement.classList.add('intro-seen')}catch(e){}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: site.name,
  url: site.url,
  telephone: "+55-27-3062-7550",
  image: `${site.url}/video/hero-desktop-poster.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Avenida Professora Francelina Carneiro Setúbal, 804",
    addressLocality: "Vila Velha",
    addressRegion: "ES",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
  ],
  sameAs: [site.instagram.href, site.facebook.href],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
          Pular para o conteúdo
        </a>
        <Preloader />
        <SmoothScroll />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
