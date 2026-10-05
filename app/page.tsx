"use client";
import { useMemo, useState } from "react";
import { Map, Share2, Trophy, ChevronRight } from "lucide-react";

const divisions=["ঢাকা","চট্টগ্রাম","রাজশাহী","খুলনা","বরিশাল","সিলেট","রংপুর","ময়মনসিংহ"];
const districts=["ঢাকা","চট্টগ্রাম","কক্সবাজার","সিলেট","রাজশাহী","খুলনা","বরিশাল","রংপুর","ময়মনসিংহ","বান্দরবান","রাঙামাটি","খাগড়াছড়ি"];

export default function Home(){
 const [visited,setVisited]=useState<string[]>([]);
 const toggle=(d:string)=>setVisited(v=>v.includes(d)?v.filter(x=>x!==d):[...v,d]);
 const percent=useMemo(()=>Math.round(visited.length/64*100),[visited]);
 return <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
  <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><div><div className="text-2xl font-black tracking-tight">Ghurechi<span className="text-emerald-600">.</span></div></div><button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold">আমার স্কোর</button></header>
  <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 text-center"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white"><Map size={24}/></div><p className="mb-3 text-sm font-bold uppercase tracking-[.18em] text-emerald-700">Bangladesh Travel Map</p><h1 className="text-4xl font-black tracking-tight sm:text-6xl">বাংলাদেশের কতটা<br/><span className="text-emerald-600">ঘুরে দেখেছেন?</span></h1><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500">আপনি যে জেলাগুলো ঘুরেছেন সেগুলো নির্বাচন করুন। আপনার ট্রাভেল স্কোর তৈরি করুন এবং বন্ধুদের সাথে শেয়ার করুন।</p></section>
  <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-16 md:grid-cols-[1fr_300px]">
   <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-extrabold">আপনার ঘোরা জেলা</h2><p className="text-sm text-slate-500">এখন নির্বাচিত: {visited.length} / 64</p></div><div className="text-right"><div className="text-3xl font-black text-emerald-600">{percent}%</div><div className="text-xs font-semibold text-slate-400">TRAVEL SCORE</div></div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{districts.map(d=><button key={d} onClick={()=>toggle(d)} className={`rounded-2xl border px-3 py-3 text-left text-sm font-bold transition ${visited.includes(d)?"border-emerald-500 bg-emerald-50 text-emerald-700":"border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300"}`}>{visited.includes(d)?"✓ ":""}{d}</button>)}</div><p className="mt-4 text-xs text-slate-400">প্রথম সংস্করণে ১২টি জেলা দেখানো হচ্ছে; পূর্ণ ৬৪ জেলা map data পরের commit-এ যুক্ত হবে।</p></div>
   <aside className="space-y-4"><div className="rounded-3xl bg-slate-950 p-6 text-white"><Trophy size={22} className="mb-5 text-emerald-400"/><div className="text-sm text-slate-400">আপনার ট্রাভেল লেভেল</div><div className="mt-1 text-2xl font-black">{visited.length===0?"শুরু করি":"পথিক"}</div><div className="mt-5 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-emerald-500" style={{width:`${Math.max(percent,2)}%`}}/></div></div><button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-extrabold text-white shadow-lg shadow-emerald-200"><Share2 size={18}/> স্কোর শেয়ার করুন <ChevronRight size={18}/></button></aside>
  </section>
  <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">Ghurechi · Bangladesh Travel Map</footer>
 </main>
}