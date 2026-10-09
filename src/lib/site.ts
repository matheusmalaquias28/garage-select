export const site = {
  name: "Garage Select",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://garageselect.com.br",
  description:
    "Seminovos premium e 0 km em Vila Velha/ES. Veículos nacionais e importados revisados criteriosamente, com avaliação do seu usado e financiamento com as principais instituições.",
  phones: [
    { label: "(27) 3062-7550", href: "tel:+552730627550", kind: "Loja" },
    { label: "(27) 99801-3537", href: "tel:+5527998013537", kind: "WhatsApp" },
  ],
  whatsapp: "5527998013537",
  instagram: { label: "@garage_select", href: "https://www.instagram.com/garage_select" },
  facebook: { label: "Facebook", href: "https://www.facebook.com/b2cmotors" },
  address: {
    street: "Av. Profa. Francelina Carneiro Setúbal, 804",
    district: "Itapuã",
    city: "Vila Velha",
    state: "ES",
    full: "Avenida Professora Francelina Carneiro Setúbal, 804, Itapuã, Vila Velha, ES",
  },
  hours: [
    { days: "Segunda a sexta", time: "9h às 19h" },
    { days: "Sábado", time: "9h às 14h" },
  ],
  // [A CONFIRMAR] com o cliente
  cnpj: "[A CONFIRMAR]",
  email: "[A CONFIRMAR]",
} as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.full)}`;
export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`;

export function whatsappLink(text = "Olá! Vim pelo site da Garage Select.") {
  return `https://api.whatsapp.com/send?phone=${site.whatsapp}&text=${encodeURIComponent(text)}`;
}

export const nav = [
  { label: "Estoque", href: "/estoque" },
  { label: "Venda seu carro", href: "/vender" },
  { label: "Financiamento", href: "/financiamento" },
  { label: "A Garage", href: "/#sobre" },
  { label: "Contato", href: "/contato" },
] as const;
