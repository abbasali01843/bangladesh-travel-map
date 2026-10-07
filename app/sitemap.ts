import type { MetadataRoute } from "next";
import data from "../data/kanchana.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bangladesh-travel-map.vercel.app";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...data.search_index.map((item) => ({
      url: base + "/kanchana/" + item.slug,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
