"use client";

import { getLevel, getMotivationalText, getPercent } from "../lib/travel";

type ShareCardProps = {
  visited: string[];
};

export function ShareCard({ visited }: ShareCardProps) {
  const percent = getPercent(visited.length);
  const { title, badge } = getLevel(visited.length);
  const message = getMotivationalText(visited.length);

  return (
    <div
      id="ghurechi-share-card"
      className="relative mx-auto aspect-[1.91/1] w-full max-w-[760px] overflow-hidden rounded-[28px] bg-slate-950 p-7 text-white shadow-2xl sm:rounded-[32px] sm:p-10"
    >
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-black sm:text-2xl">
              Ghurechi<span className="text-emerald-400">.</span>
            </div>
            <div className="mt-1 text-[10px] font-bold tracking-[0.2em] text-slate-400 sm:text-xs">
              BANGLADESH TRAVEL MAP
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold sm:text-xs">
              {badge}
            </div>
            <div className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold sm:block">
              {title}
            </div>
          </div>
        </div>

        <div>
          <div className="text-6xl font-black tracking-tight text-emerald-400 sm:text-8xl">
            {percent}%
          </div>
          <div className="mt-1 text-lg font-extrabold sm:text-xl">
            {visited.length} / 64 জেলা ঘুরেছি
          </div>
          <div className="mt-2 text-xs font-bold text-emerald-300 sm:text-sm">
            {message}
          </div>
          <div className="mt-1.5 text-sm text-slate-400">
            বাংলাদেশের কতটা ঘুরে দেখেছেন?
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 sm:text-xs">
          <span>ghurechi.vercel.app</span>
          <span>তুমি কয়টি ঘুরেছ?</span>
        </div>
      </div>
    </div>
  );
}
