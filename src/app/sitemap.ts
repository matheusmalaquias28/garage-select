import type { MetadataRoute } from "next";
import { cars } from "@/lib/stock";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/estoque", "/vender", "/financiamento", "/contato"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...cars.map((c) => ({ url: `${site.url}/estoque/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
