import raw from "@/data/stock.json";

type RawCar = (typeof raw)[number];

export type Photo = { src: string; framing: "portrait" | "landscape" };

export type Car = {
  id: string;
  slug: string;
  sourceUrl: string;
  brand: string;
  brandKey: string;
  brandLogo: string;
  model: string;
  version: string;
  title: string;
  headline: string;
  yearFab: number;
  yearModel: number;
  year: string;
  km: number;
  price: number;
  color: string;
  transmission: string;
  fuel: string;
  doors: number | null;
  isNew: boolean;
  power: string | null;
  torque: string | null;
  badges: string[];
  specs: string[];
  highlights: string[];
  features: string[];
  options: string[];
  photos: Photo[];
};

const BRAND_NAMES: Record<string, string> = {
  AUDI: "Audi",
  BMW: "BMW",
  BYD: "BYD",
  CHERY: "Chery",
  CHEVROLET: "Chevrolet",
  FORD: "Ford",
  GWM: "GWM",
  HONDA: "Honda",
  HYUNDAI: "Hyundai",
  JEEP: "Jeep",
  "MERCEDES-BENZ": "Mercedes-Benz",
  NISSAN: "Nissan",
  PEUGEOT: "Peugeot",
  PORSCHE: "Porsche",
  TOYOTA: "Toyota",
  VOLKSWAGEN: "Volkswagen",
  VOLVO: "Volvo",
};

const MODEL_NAMES: Record<string, string> = {
  "SANTA FE": "Santa Fe",
  "YUAN PRO": "Yuan Pro",
  "TIGGO 5x": "Tiggo 5x",
  "HAVAL H6": "Haval H6",
};

// Ordem da vitrine "Últimas novidades" do site atual
const FEATURED_IDS = ["5530074", "5507857", "5557507", "5528787", "5477538", "5555314", "5528537", "5634666"];

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const titleCase = (s: string) =>
  MODEL_NAMES[s] ??
  s
    .split(" ")
    .map((w) => (w.length <= 3 || /\d/.test(w) ? w : w[0] + w.slice(1).toLowerCase()))
    .join(" ");

function parseAbout(lines: string[]) {
  const [headline = "", ...rest] = lines;
  const specs: string[] = [];
  const highlights: string[] = [];
  for (const line of rest) {
    if (line.startsWith("-")) {
      const h = line.replace(/^-\s*/, "").trim();
      const item = h && h[0].toUpperCase() + h.slice(1);
      if (item && !highlights.some((x) => x.toLowerCase() === item.toLowerCase())) highlights.push(item);
    } else if (!specs.includes(line) && !/^\d[\d.,]*\s*(mil\s*)?km$/i.test(line) && !/^zero km$/i.test(line)) {
      specs.push(line);
    }
  }
  return { headline, specs, highlights };
}

function pickBadges(car: RawCar, highlights: string[]) {
  const text = highlights.join(" | ").toLowerCase();
  const badges: string[] = [];
  if (car.condition === "novo" || car.km === 0) badges.push("0 km");
  if (/único dono/.test(text)) badges.push("Único dono");
  if (/garantia/.test(text) || car.features.some((f) => /garantia/i.test(f))) badges.push("Garantia");
  if (/revis(ões|ado).*(concession|porsche|bmw|audi|mercedes|byd)/.test(text) || car.features.some((f) => /revisado/i.test(f)))
    badges.push("Revisado");
  return badges.slice(0, 2);
}

function build(car: RawCar): Omit<Car, "slug"> {
  const { headline, specs, highlights } = parseAbout(car.about);
  const all = car.about.join(" ");
  const power = all.match(/(\d{2,4})\s*cv/i)?.[1] ?? null;
  const torque = all.match(/(\d{1,3}(?:,\d)?)\s*kgfm/i)?.[1] ?? null;
  const brandKey = slugify(car.brand).replace(/-/g, "");
  const brand = BRAND_NAMES[car.brand] ?? titleCase(car.brand);
  const model = titleCase(car.model);
  return {
    id: car.id,
    sourceUrl: car.sourceUrl,
    brand,
    brandKey,
    brandLogo: `/brands/${brandKey}.webp`,
    model,
    version: car.version,
    title: `${brand} ${model}`,
    headline,
    yearFab: car.yearFab,
    yearModel: car.yearModel,
    year: `${car.yearFab}/${car.yearModel}`,
    km: car.km,
    price: car.price,
    color: car.color,
    transmission: car.transmission,
    fuel: car.fuel,
    doors: car.doors,
    isNew: car.condition === "novo" || car.km === 0,
    power: power ? `${power} cv` : null,
    torque: torque ? `${torque} kgfm` : null,
    badges: pickBadges(car, highlights),
    specs,
    highlights,
    features: car.features,
    options: car.options,
    photos: car.photos as Photo[],
  };
}

function withSlugs(list: Omit<Car, "slug">[]): Car[] {
  const seen = new Map<string, number>();
  return list.map((c) => {
    let slug = slugify(`${c.brand} ${c.model} ${c.version} ${c.yearModel}`);
    const n = seen.get(slug) ?? 0;
    seen.set(slug, n + 1);
    if (n > 0) slug = `${slug}-${c.id}`;
    return { ...c, slug };
  });
}

export const cars: Car[] = withSlugs(raw.map(build));

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);

export const featuredCars = FEATURED_IDS.map((id) => cars.find((c) => c.id === id)).filter(Boolean) as Car[];

export const spotlightCar = cars.find((c) => c.id === "5555314") ?? cars[0];

export const brands = Object.values(
  cars.reduce<Record<string, { name: string; key: string; logo: string; count: number }>>((acc, c) => {
    acc[c.brandKey] ??= { name: c.brand, key: c.brandKey, logo: c.brandLogo, count: 0 };
    acc[c.brandKey].count++;
    return acc;
  }, {}),
).sort((a, b) => a.name.localeCompare(b.name));

export function similarCars(car: Car, n = 4) {
  return cars
    .filter((c) => c.id !== car.id)
    .map((c) => ({ c, score: (c.brandKey === car.brandKey ? -1 : 0) + Math.abs(c.price - car.price) / car.price }))
    .sort((a, b) => a.score - b.score)
    .slice(0, n)
    .map((x) => x.c);
}

/* ---------- formatação ---------- */

export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

export const kmFmt = (v: number) => (v === 0 ? "0 km" : `${new Intl.NumberFormat("pt-BR").format(v)} km`);

export const fuelShort = (f: string) => (f === "Gasolina e Elétrico" ? "Híbrido" : f);

/* ---------- filtros ---------- */

export type Filters = {
  busca?: string;
  marca?: string;
  modelo?: string;
  precoMin?: number;
  precoMax?: number;
  anoMin?: number;
  anoMax?: number;
  kmMax?: number;
  combustivel?: string;
  cambio?: string;
  ordem?: SortKey;
};

export const SORTS = {
  recentes: "Mais recentes",
  "menor-preco": "Menor preço",
  "maior-preco": "Maior preço",
  "menor-km": "Menor quilometragem",
  "mais-novo": "Ano mais novo",
} as const;
export type SortKey = keyof typeof SORTS;

export const PRICE_STEPS = [80000, 100000, 125000, 150000, 200000, 250000, 300000, 400000, 500000, 700000, 900000];
export const KM_STEPS = [10000, 20000, 30000, 50000, 70000, 100000];
export const years = [...new Set(cars.map((c) => c.yearModel))].sort((a, b) => b - a);
export const fuels = [...new Set(cars.map((c) => fuelShort(c.fuel)))].sort();
export const transmissions = [...new Set(cars.map((c) => c.transmission))].sort();

export function modelsFor(brandKey?: string) {
  return [...new Set(cars.filter((c) => !brandKey || c.brandKey === brandKey).map((c) => c.model))].sort();
}

export function parseFilters(sp: URLSearchParams): Filters {
  const num = (k: string) => {
    const v = Number(sp.get(k));
    return Number.isFinite(v) && v > 0 ? v : undefined;
  };
  const str = (k: string) => sp.get(k) || undefined;
  const ordem = str("ordem");
  return {
    busca: str("busca"),
    marca: str("marca"),
    modelo: str("modelo"),
    precoMin: num("precoMin"),
    precoMax: num("precoMax"),
    anoMin: num("anoMin"),
    anoMax: num("anoMax"),
    kmMax: num("kmMax"),
    combustivel: str("combustivel"),
    cambio: str("cambio"),
    ordem: ordem && ordem in SORTS ? (ordem as SortKey) : undefined,
  };
}

export function toSearch(f: Filters) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) if (v !== undefined && v !== "" && v !== null) sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function filterCars(f: Filters, list = cars) {
  const q = f.busca ? slugify(f.busca) : "";
  const out = list.filter(
    (c) =>
      (!q || slugify(`${c.brand} ${c.model} ${c.version} ${c.yearModel} ${c.color}`).includes(q)) &&
      (!f.marca || c.brandKey === f.marca) &&
      (!f.modelo || c.model === f.modelo) &&
      (!f.precoMin || c.price >= f.precoMin) &&
      (!f.precoMax || c.price <= f.precoMax) &&
      (!f.anoMin || c.yearModel >= f.anoMin) &&
      (!f.anoMax || c.yearModel <= f.anoMax) &&
      (!f.kmMax || c.km <= f.kmMax) &&
      (!f.combustivel || fuelShort(c.fuel) === f.combustivel) &&
      (!f.cambio || c.transmission === f.cambio),
  );
  const sorters: Record<SortKey, (a: Car, b: Car) => number> = {
    recentes: (a, b) => Number(b.id) - Number(a.id),
    "menor-preco": (a, b) => a.price - b.price,
    "maior-preco": (a, b) => b.price - a.price,
    "menor-km": (a, b) => a.km - b.km,
    "mais-novo": (a, b) => b.yearModel - a.yearModel || a.km - b.km,
  };
  return out.sort(sorters[f.ordem ?? "recentes"]);
}

export function carWhatsappText(c: Car, url: string) {
  return `Olá! Tenho interesse neste veículo: ${c.brand} ${c.model} ${c.yearModel} - ${c.version} - ${brl(c.price)}. ${url}`;
}
