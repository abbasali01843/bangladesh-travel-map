import type { Metadata } from "next";
import HomeContent from "./page-content";
import { districts } from "../data/districts";

type Props = {
  searchParams: Promise<{ v?: string }>;
};

function validIds(value?: string) {
  if (!value) return [];
  return value
    .split(",")
    .filter((id) => districts.some((d) => d.id === id));
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const visited = validIds(params.v);
  const imageUrl = `/api/og?v=${encodeURIComponent(visited.join(","))}`;

  return {
    title: "Ghurechi — বাংলাদেশের কতটা ঘুরে দেখেছেন?",
    description: `আমি বাংলাদেশের ${visited.length}টি জেলা ঘুরেছি। আপনিও আপনার Travel Score তৈরি করুন।`,
    openGraph: {
      title: "Ghurechi — বাংলাদেশের কতটা ঘুরে দেখেছেন?",
      description: `আমি বাংলাদেশের ${visited.length}টি জেলা ঘুরেছি। আপনি কয়টি ঘুরেছেন?`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Ghurechi Travel Score",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ghurechi — বাংলাদেশের কতটা ঘুরে দেখেছেন?",
      description: `আমি বাংলাদেশের ${visited.length}টি জেলা ঘুরেছি। আপনি কয়টি ঘুরেছেন?`,
      images: [imageUrl],
    },
  };
}

export default function Home() {
  return <HomeContent />;
}
