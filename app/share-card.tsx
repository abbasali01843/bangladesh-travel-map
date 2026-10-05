"use client";
import { districts } from "../data/districts";

export function ShareCard({visited}:{visited:string[]}){
 const percent=Math.round(visited.length/64*100);
 const level=visited.length===0?"নতুন পথিক":visited.length<8?"ঘোরাঘুরি শুরু":visited.length<20?"অভিজ্ঞ ভ্রমণকারী":visited.length<40?"বাংলাদেশ ভ্রমণপাগল":"দেশভ্রমণ কিংবদন্তি";
 return <div id="ghurechi-share-card" className="relative mx-auto aspect-[1.91/1] w-full max-w-[760px] overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-2xl sm:p-10"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"/><div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between"><div><div className="text-2xl font-black">Ghurechi<span className="text-emerald-400">.</span></div><div className="mt-1 text-xs font-bold tracking-widest text-slate-400">BANGLADESH TRAVEL MAP</div></div><div className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold">{level}</div></div><div><div className="text-7xl font-black tracking-tight text-emerald-400 sm:text-8xl">{percent}%</div><div className="mt-1 text-xl font-extrabold">{visited.length} / 64 জেলা ঘুরেছি</div><div className="mt-2 text-sm text-slate-400">বাংলাদেশের কতটা ঘুরে দেখেছেন?</div></div><div className="flex items-center justify-between text-xs font-bold text-slate-500"><span>ghurechi</span><span>তুমি কয়টি ঘুরেছ?</span></div></div></div>;
}
