"use client";

type HeaderProps = {
  visitedCount: number;
  installPrompt: any;
  onInstall: () => void;
};

export function Header({ visitedCount, installPrompt, onInstall }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f7f8f5]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-5">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-left"
        >
          <div className="text-xl font-black tracking-tight sm:text-2xl">
            Ghurechi<span className="text-emerald-600">.</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            বাংলাদেশ ট্রাভেল ম্যাপ
          </div>
        </button>

        <div className="flex items-center gap-2">
          {installPrompt && (
            <button
              onClick={onInstall}
              className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-700"
            >
              অ্যাপ ইনস্টল
            </button>
          )}
          <div className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-extrabold shadow-sm">
            <span className="text-emerald-600">{visitedCount}</span>
            <span className="text-slate-400"> / 64</span>
            <span className="ml-1 hidden text-slate-400 sm:inline">জেলা</span>
          </div>
        </div>
      </div>
    </header>
  );
}
