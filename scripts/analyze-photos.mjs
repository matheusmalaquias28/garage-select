// Detecta fotos "retrato com faixas brancas laterais" (padrão do AutoCerto: 1024x768 com conteúdo 3:4 ao centro)
// e grava `framing` em src/data/stock.json. Uso: node scripts/analyze-photos.mjs
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const file = new URL("../src/data/stock.json", import.meta.url);
const cars = JSON.parse(readFileSync(file, "utf8"));

async function framing(url) {
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const { data, info } = await sharp(buf).resize(64, 48, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  // Colunas 0..9 (≈ 15% da largura) quase brancas e uniformes => faixas laterais
  let sum = 0;
  let n = 0;
  for (let y = 0; y < info.height; y++) {
    for (const x of [1, 3, 5, 7, 56, 58, 60, 62]) {
      sum += data[y * info.width + x];
      n++;
    }
  }
  return sum / n > 245 ? "portrait" : "landscape";
}

for (const car of cars) {
  const results = [];
  for (let i = 0; i < car.photos.length; i += 8) {
    const batch = car.photos.slice(i, i + 8);
    results.push(...(await Promise.all(batch.map(async (src) => ({ src, framing: await framing(src) })))));
  }
  car.photos = results;
  console.log(car.model, results.filter((r) => r.framing === "portrait").length, "/", results.length);
}

writeFileSync(file, JSON.stringify(cars, null, 2));
