import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUpazilaDirectory } from "../../../lib/directory-live";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getUpazilaDirectory(slug);
  if (!data) return {};
  return {
    title: data.upazila.name + " উপজেলা",
    description: data.upazila.name + ", " + (data.district?.name ?? "") + " — ইউনিয়ন, সেবা ও লোকাল ডিরেক্টরি তথ্য।",
  };
}

export default async function UpazilaPage({ params }: Props) {
  const { slug } = await params;
  const data = await getUpazilaDirectory(slug);
  if (!data) notFound();

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link href="/" className="text-xs font-black text-emerald-700 hover:underline">← মূল ডিরেক্টরিতে ফিরে যান</Link>
        <header className="mt-6 rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <div className="text-xs font-bold text-slate-400">{data.district?.name ?? "জেলা"}</div>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">{data.upazila.name} উপজেলা</h1>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">{data.unions.length}</div><div className="text-xs text-slate-300">ইউনিয়ন</div></div>
            <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">{data.serviceCount}</div><div className="text-xs text-slate-300">যাচাইকৃত প্রকাশযোগ্য সেবা</div></div>
          </div>
        </header>
        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-black">ইউনিয়নসমূহ</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.unions.map((item) => (
              <Link key={item.id} href={"/union/" + item.slug} className="rounded-2xl border border-slate-200 p-4 hover:border-emerald-400 hover:bg-emerald-50">
                <div className="font-black">{item.name}</div>
                <div className="mt-1 text-xs text-slate-400">ইউনিয়ন ডিরেক্টরি →</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
