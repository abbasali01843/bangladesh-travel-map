"use client";

import { MapPinned } from "lucide-react";
import { getLevel, getPercent } from "../../lib/travel";

type ScoreHeroProps = {
  visitedCount: number;
};

export function ScoreHero({ visitedCount }: ScoreHeroProps) {
  const percent = getPercent(visitedCount);
  const { title, badge } = getLevel(visitedCount);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-5 sm:pt-10">
      <div className="grid items-end gap-6 md:grid-cols-[1fr_320px] lg:gap-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <MapPinned size={14} />
            MY TRAVEL MAP
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            বাংলাদেশের কতটা
            <br />
            <span className="text-emerald-600">ঘুরে দেখেছেন?</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            আপনি যে ৬৪টি জেলা ঘুরেছেন সেগুলো টিক দিন। এক মিনিটেই আপনার Travel
            Score তৈরি করুন এবং বন্ধুদের Challenge দিন।
          </p>
        </div>

        <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl sm:p-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Travel Score
              </div>
              <div className="mt-1 text-4xl font-black sm:text-5xl">
                {percent}%
              </div>
            </div>
            <div className="text-right text-sm text-slate-400">
              {visitedCount} / 64
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.max(percent, 2)}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-sm font-bold text-emerald-300">{title}</div>
            <div className="text-xs font-bold text-slate-400">{badge}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
