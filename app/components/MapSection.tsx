"use client";

import { BangladeshDistrictMap } from "../BangladeshDistrictMap";

type MapSectionProps = {
  visited: string[];
  mapOpen: boolean;
  onToggleMap: () => void;
  onToggleDistrict: (id: string) => void;
};

export function MapSection({
  visited,
  mapOpen,
  onToggleMap,
  onToggleDistrict,
}: MapSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-5">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black sm:text-xl">বাংলাদেশের মানচিত্র</h2>
            <p className="text-sm text-slate-400">
              মানচিত্রের যেকোনো জেলায় চাপ দিয়ে ভ্রমণ স্ট্যাটাস বদলান
            </p>
          </div>
          <button
            onClick={onToggleMap}
            className="shrink-0 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
          >
            {mapOpen ? "মানচিত্র ছোট করুন" : "মানচিত্র দেখুন"}
          </button>
        </div>

        {mapOpen && (
          <BangladeshDistrictMap visited={visited} onToggle={onToggleDistrict} />
        )}
      </div>
    </section>
  );
}
