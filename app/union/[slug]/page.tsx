import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnionDirectory } from "../../../lib/directory-live";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };
type AreaItem = { id: string; name: string; slug: string; type: string; parentAreaId: string | null; verificationLevel: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getUnionDirectory(slug);
  if (!data) return {};
  return {
    title: data.union.name + " ইউনিয়ন",
    description: data.union.name + ", " + (data.upazila?.name ?? "") + " — গ্রাম, ওয়ার্ড, সেবা ও লোকাল ডিরেক্টরি তথ্য।",
  };
}

export default async function UnionPage({ params }: Props) {
  const { slug } = await params;
  const data = await getUnionDirectory(slug);
  if (!data) notFound();

  const villages = data.areas.filter((area: AreaItem) => area.type === "VILLAGE");
  const wards = data.areas.filter((area: AreaItem) => area.type === "WARD");

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link href="/" className="text-xs font-black text-emerald-700 hover:underline">← মূল ডিরেক্টরিতে ফিরে যান</Link>
        <header className="mt-6 rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <div className="text-xs font-bold text-slate-400">{data.upazila?.name ?? "উপজেলা"}</div>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">{data.union.name} ইউনিয়ন</h1>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">{villages.length}</div><div className="text-xs text-slate-300">গ্রাম</div></div>
            <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">{wards.length}</div><div className="text-xs text-slate-300">ওয়ার্ড</div></div>
            <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">{data.serviceCount}</div><div className="text-xs text-slate-300">যাচাইকৃত প্রকাশযোগ্য সেবা</div></div>
          </div>
        </header>
        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-black">গ্রাম</h2>
            <div className="space-y-2">
              {villages.map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 p-3 font-bold">{item.name}</div>)}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-black">ওয়ার্ড</h2>
            <div className="flex flex-wrap gap-2">
              {wards.map((item) => <span key={item.id} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black">{item.name}</span>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
