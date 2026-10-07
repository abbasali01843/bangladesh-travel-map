"use client";

import { useEffect, useMemo, useState } from "react";
import data from "../data/kanchana.json";
import KanchanaMap from "./kanchana-map";
import PwaRegister from "./pwa-register";

type Tab = "overview" | "transport" | "education" | "markets" | "places" | "emergency";

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-black text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{children}</span>;
}

function Verified({ value }: { value?: boolean }) {
  return <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${value ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{value ? "উৎস যাচাই" : "পুনঃযাচাই বাকি"}</span>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [globalQuery, setGlobalQuery] = useState("");

  const tabs = useMemo(() => [
    ["overview", "সারসংক্ষেপ"],
    ["transport", "যাতায়াত"],
    ["education", "শিক্ষা"],
    ["markets", "হাট-বাজার"],
    ["places", "স্থান"],
    ["emergency", "জরুরি নম্বর"]
  ] as const, []);

  const schools = [...data.education.secondary, ...data.education.madrasas, ...data.education.primary.map(name => ({ name, verified: false }))];
  const filteredSchools = schools.filter((item) => item.name.includes(query));
  const globalResults = globalQuery.trim() ? data.search_index.filter((item) => item.name.includes(globalQuery.trim())).slice(0, 8) : [];
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setGlobalQuery(q);
  }, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (globalQuery.trim()) url.searchParams.set("q", globalQuery.trim());
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url);
  }, [globalQuery]);
  const selectSearchResult = (item: { name: string; type: string }) => {
    setGlobalQuery(item.name);
    const target = item.type === "বাজার" ? "markets" : item.type === "মাধ্যমিক" || item.type === "মাদ্রাসা" || item.type === "প্রাথমিক" ? "education" : item.type === "গ্রাম" ? "overview" : "places";
    setTab(target as Tab);
    window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <PwaRegister />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f7f8f5]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <div className="text-2xl font-black tracking-tight">বাংলাদেশ লোকাল ডিরেক্টরি<span className="text-emerald-600">.</span></div>
            <div className="text-[11px] font-bold text-slate-400">Hyper-Local Pilot · Phase 1</div>
          </div>
          <div className="rounded-full bg-slate-950 px-3 py-2 text-xs font-extrabold text-white">পাইলট: {data.name}</div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <Pill>{data.division} বিভাগ</Pill><Pill>{data.district} জেলা</Pill><Pill>{data.upazila} উপজেলা</Pill><Pill>৪নং ইউনিয়ন</Pill>
          </div>
          <h1 className="text-3xl font-black sm:text-5xl">{data.name}</h1>
          <div className="relative mt-5 max-w-2xl">
            <input value={globalQuery} onChange={(e) => setGlobalQuery(e.target.value)} placeholder="কাঞ্চনার গ্রাম, বাজার, স্কুল বা মাদ্রাসা খুঁজুন..." aria-label="কাঞ্চনা লোকাল সার্চ" className="w-full rounded-2xl border border-white/15 bg-white px-5 py-4 pr-12 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400" />
            {globalQuery && <button onClick={() => setGlobalQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-black text-slate-500 hover:bg-slate-100">মুছুন</button>}
          </div>
          {globalQuery && <div className="mt-2 max-w-2xl rounded-2xl bg-white p-2 text-slate-900 shadow-2xl">
            {globalResults.length ? globalResults.map((item) => <button key={item.type + item.name} onClick={() => { window.location.href = "/kanchana/" + item.slug; }} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-slate-50"><span className="font-extrabold">{item.name}</span><span className="text-[10px] font-black text-slate-400">{item.type}{item.verified ? " · যাচাই" : " · পুনঃযাচাই"}</span></button>) : <div className="px-3 py-3 text-xs font-semibold text-slate-500">কোনো মিল পাওয়া যায়নি। অন্য নাম দিয়ে চেষ্টা করুন।</div>}
          </div>}
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            গ্রাম, ওয়ার্ড, যাতায়াত, শিক্ষা, বাজার, দর্শনীয় স্থান ও জরুরি সেবা—এক জায়গায় সাজানো কাঞ্চনা পাইলট ডিরেক্টরি।
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">৩</div><div className="text-xs font-bold text-slate-300">গ্রাম</div></div>
            <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">৯</div><div className="text-xs font-bold text-slate-300">ওয়ার্ড</div></div>
            <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">৩</div><div className="text-xs font-bold text-slate-300">প্রধান বাজার</div></div>
            <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">{data.emergency_numbers.length}</div><div className="text-xs font-bold text-slate-300">জরুরি নম্বর</div></div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6"><div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-900">ℹ️ এই পাইলটের কিছু স্থানীয় তথ্য এখনও পুনঃযাচাই পর্যায়ে আছে। “পুনঃযাচাই বাকি” চিহ্নিত তথ্যকে চূড়ান্ত তথ্য হিসেবে ব্যবহার করবেন না।</div></div>

      <nav className="mx-auto max-w-7xl overflow-x-auto px-4 pb-5 sm:px-6">
        <div className="flex min-w-max gap-2">
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`rounded-full px-4 py-2.5 text-xs font-extrabold transition ${tab === id ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-200"}`}>{label}</button>
          ))}
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {tab === "overview" && <>
            <Section title="কাঞ্চনা ম্যাপ">
              <KanchanaMap lat={data.map.center.lat} lng={data.map.center.lng} zoom={data.map.zoom} name={data.name} />
            </Section>
            <Section title="গ্রাম ও ওয়ার্ড" id="overview">
              <div className="grid gap-3 sm:grid-cols-3">
                {data.villages.map(v => <div key={v.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-black">{v.name}</div><div className="mt-2 flex flex-wrap gap-1.5">{v.wards.map(w => <Pill key={w}>ওয়ার্ড {String(w).padStart(2, "0")}</Pill>)}</div></div>)}
              </div>
            </Section>
            <Section title="কিছু গুরুত্বপূর্ণ তথ্য">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-4"><div className="text-xs font-bold text-emerald-700">পোস্ট কোড</div><div className="mt-1 text-2xl font-black text-emerald-900">{data.postal_code}</div></div>
                <div className="rounded-2xl bg-slate-100 p-4"><div className="text-xs font-bold text-slate-500">মৌজা</div><div className="mt-1 text-xl font-black">কাঞ্চনা মৌজা</div></div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-500">{data.verification_note}</p>
            </Section>
          </>}

          {tab === "transport" && <Section title="যাতায়াত ও প্রধান সড়ক" id="transport">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">{data.transport.upazila_hq}</div>
              {data.transport.main_roads.map((r) => <div key={r.name} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div className="font-black">{r.name}</div><Verified value={r.verified}/></div>{r.note && <p className="mt-2 text-xs leading-6 text-slate-500">{r.note}</p>}</div>)}
              {data.transport.bridge_waterways.map((r) => <div key={r.name} className="rounded-2xl border border-slate-200 p-4"><div className="font-black">{r.name}</div><p className="mt-2 text-xs leading-6 text-slate-500">{r.note}</p></div>)}
            </div>
          </Section>}

          {tab === "education" && <Section title="শিক্ষা প্রতিষ্ঠান" id="education">
            <div className="mb-4"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="প্রতিষ্ঠানের নাম খুঁজুন..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400"/></div>
            <div className="grid gap-2 sm:grid-cols-2">
              {filteredSchools.map((s, i) => <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-extrabold">{s.name}</div>{"eiin" in s && s.eiin && <div className="mt-1 text-[11px] font-bold text-slate-400">EIIN {s.eiin}</div>}</div><Verified value={"verified" in s ? s.verified : false}/></div></div>)}
            </div>
            <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-800">{data.education.primary_verification}</div>
          </Section>}

          {tab === "markets" && <Section title="হাট-বাজার" id="markets">
            <div className="grid gap-3 sm:grid-cols-3">
              {data.markets.map(m => <div key={m.name} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-2"><div className="font-black">{m.name}</div><Verified value={m.verified}/></div><div className="mt-2 text-xs text-slate-400">{m.area}</div>{m.note && <p className="mt-2 text-xs leading-6 text-amber-700">{m.note}</p>}</div>)}
            </div>
          </Section>}

          {tab === "places" && <Section title="স্থান ও লোকাল সেবা" id="places">
            <div className="space-y-5">
              <div>
                <div className="mb-2 text-xs font-black text-slate-400">ধর্মীয় স্থান</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {data.categories.religious_places.map((p) => <div key={p.name} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-2"><div><div className="font-black">{p.name}</div><div className="mt-1 text-xs text-slate-400">{p.type}</div></div><Verified value={p.verified}/></div></div>)}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-black text-slate-400">ঐতিহাসিক/দর্শনীয় স্থান</div>
                {data.categories.landmarks.map((p) => <div key={p.name} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-2"><div><div className="font-black">{p.name}</div><div className="mt-1 text-xs text-slate-400">{p.type}</div></div><Verified value={p.verified}/></div></div>)}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-xs font-semibold leading-6 text-slate-500">স্বাস্থ্যকেন্দ্র ও সরকারি সেবার যাচাইযোগ্য তালিকা পাওয়া গেলে এই অংশে যুক্ত করা হবে। অনুমানভিত্তিক প্রতিষ্ঠান যোগ করা হয়নি।</div>
            </div>
          </Section>}

          {tab === "emergency" && <Section title="জরুরি সেবা" id="emergency">
            <div className="grid gap-2 sm:grid-cols-2">
              {data.emergency_numbers.map(item => <a key={item.name + item.number} href={`tel:${item.number}`} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300"><div className="flex items-start justify-between gap-3"><div><div className="font-black">{item.name}</div><div className="mt-1 text-xs text-slate-400">{item.type}</div></div><div className="text-xl font-black text-emerald-600">{item.number}</div></div></a>)}
            </div>
          </Section>}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-black text-slate-400">DATA STATUS</div>
            <div className="mt-2 flex items-center justify-between"><span className="font-black">is_published</span><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">{String(data.is_published)}</span></div>
            <div className="mt-3 text-xs leading-6 text-slate-500">কাঞ্চনা এখন পাইলট হিসেবে দৃশ্যমান। যেসব এন্ট্রি পুনঃযাচাই দরকার, সেগুলো আলাদা করে চিহ্নিত করা আছে।</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-black">ডেটা সোর্স</div>
            <div className="mt-3 space-y-2">{data.sources.slice(0,6).map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="block text-xs font-bold leading-5 text-emerald-700 hover:underline">{s.title}</a>)}</div>
          </div>
        </aside>
      </section>
      <footer className="border-t border-slate-200 py-8 text-center text-xs font-bold text-slate-400">বাংলাদেশ লোকাল ডিরেক্টরি · কাঞ্চনা পাইলট · Phase 1</footer>
    </main>
  );
}
