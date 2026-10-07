import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import data from "../../../../data/kanchana.json";

type Props = { params: Promise<{ slug: string }> };

const items = data.search_index;

function findItem(slug: string) {
  return items.find((item) => item.slug === slug);
}

export function generateStaticParams() {
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.name + " — " + item.type + ", " + data.name + ", " + data.upazila + ", " + data.district,
  };
}

export default async function LocalDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: item.name,
    description: item.name + " — " + item.type + ", " + data.name + ", " + data.upazila + ", " + data.district,
    address: {
      "@type": "PostalAddress",
      addressLocality: data.upazila,
      addressRegion: data.district,
      addressCountry: "BD",
    },
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/" className="text-xs font-black text-emerald-700 hover:underline">
          ← কাঞ্চনা ডিরেক্টরিতে ফিরে যান
        </Link>
        <article className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{item.type}</span>
            <span className={item.verified ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700" : "rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700"}>
              {item.verified ? "উৎস যাচাই" : "পুনঃযাচাই বাকি"}
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">{item.name}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            {item.name} সম্পর্কে কাঞ্চনা ইউনিয়ন, সাতকানিয়া, চট্টগ্রামের লোকাল ডিরেক্টরি তথ্য।
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[11px] font-bold text-slate-400">ইউনিয়ন</div><div className="mt-1 font-black">{data.name}</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[11px] font-bold text-slate-400">উপজেলা</div><div className="mt-1 font-black">{data.upazila}</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[11px] font-bold text-slate-400">জেলা</div><div className="mt-1 font-black">{data.district}</div></div>
          </div>
          {!item.verified && <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-900">এই তথ্যটি স্থানীয়/সরকারি উৎস দিয়ে পুনঃযাচাই সম্পন্ন না হওয়া পর্যন্ত চূড়ান্ত তথ্য হিসেবে ব্যবহার করবেন না।</div>}
        </article>
      </div>
    </main>
  );
}
