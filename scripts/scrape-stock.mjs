// Atualiza o estoque a partir do site atual (AutoCerto). Uso: node scripts/scrape-stock.mjs src/data/stock.json && node scripts/analyze-photos.mjs
import { writeFileSync } from "node:fs";

const BASE = "https://garageselect.com.br";
const out = process.argv[2];

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));

const strip = (s) => decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

const list = await (await fetch(`${BASE}/Veiculos`)).text();
const paths = [...new Set([...list.matchAll(/href="(\/Veiculo\/[^"]+\/detalhes)"/g)].map((m) => m[1]))];
console.log("found", paths.length);

const cars = [];
for (const path of paths) {
  const html = await (await fetch(BASE + path)).text();
  const id = path.split("/")[3];
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]))
    .find((j) => j["@type"] === "Car");

  const specs = {};
  for (const m of html.matchAll(/<span class="vd-spec-text"><small>([^<]+)<\/small><strong>([^<]*)<\/strong>/g)) {
    specs[strip(m[1]).toLowerCase()] = strip(m[2]);
  }

  const lists = {};
  for (const m of html.matchAll(/<h3>([^<]+)<\/h3>\s*<\/div>\s*<ul class="vd-feature-grid">([\s\S]*?)<\/ul>/g)) {
    lists[strip(m[1])] = [...m[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => strip(x[1]));
  }

  const aboutM = html.match(/<div class="vd-about">([\s\S]*?)<\/div>/);
  const about = aboutM
    ? decode(aboutM[1].replace(/<\/?br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
        .split("\n")
        .map((l) => l.replace(/\s+/g, " ").trim())
        .filter((l) => l && !/^R\$/.test(l))
    : [];

  const photos = [
    ...new Map(
      [...html.matchAll(/class="swiper-slide" data-src="([^"]+)" data-order="(\d+)"/g)].map((m) => [m[1], +m[2]]),
    ),
  ]
    .sort((a, b) => a[1] - b[1])
    .map((x) => x[0]);

  const subtitle = strip(html.match(/<p class="vd-subtitle">([\s\S]*?)<\/p>/)?.[1] ?? "");
  const [yFab, yMod] = (specs["ano"] ?? "").split("/").map(Number);

  cars.push({
    id,
    sourceUrl: BASE + path,
    brand: ld.brand.name,
    model: ld.model,
    version: ld.vehicleConfiguration,
    subtitle,
    yearFab: yFab,
    yearModel: yMod,
    km: ld.mileageFromOdometer?.value ?? Number((specs["km"] ?? "0").replace(/\D/g, "")),
    price: Number(ld.offers.price),
    color: specs["cor"] ?? ld.color,
    transmission: specs["câmbio"] ?? ld.vehicleTransmission,
    fuel: specs["combustível"] ?? ld.fuelType,
    doors: Number(specs["portas"] ?? ld.numberOfDoors ?? 0) || null,
    condition: ld.itemCondition?.includes("New") ? "novo" : "usado",
    features: lists["Características"] ?? [],
    options: lists["Opcionais"] ?? [],
    about,
    photos: photos.length ? photos : ld.image,
  });
  console.log(id, ld.brand.name, ld.model, photos.length, "fotos");
}

writeFileSync(out, JSON.stringify(cars, null, 2));
