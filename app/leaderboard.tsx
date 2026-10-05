"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy, UserRound, LockKeyhole, ChevronRight } from "lucide-react";

type LeaderboardProps = {
  visited: string[];
};

type LocalEntry = {
  name: string;
  score: number;
};

const STORAGE_KEY = "ghurechi-leaderboard-profile";

export function Leaderboard({ visited }: LeaderboardProps) {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const profile = JSON.parse(raw) as LocalEntry;
        if (profile?.name) {
          setName(profile.name);
          setSaved(true);
        }
      }
    } catch {}
  }, []);

  const saveProfile = () => {
    const clean = name.trim().slice(0, 24);
    if (!clean) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name: clean, score: visited.length })
      );
      setName(clean);
      setSaved(true);
    } catch {}
  };

  const currentScore = useMemo(() => visited.length, [visited]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1fr_330px] md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
            <Trophy size={14} /> COMMUNITY
          </div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            বাংলাদেশ ভ্রমণ <span className="text-emerald-600">Leaderboard</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            আপনার ভ্রমণ স্কোর দিয়ে দেশের অন্য ভ্রমণকারীদের সঙ্গে প্রতিযোগিতা করুন।
            Leaderboard-এ যোগ দেওয়া সম্পূর্ণ ঐচ্ছিক।
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole size={13} /> কোনো ইমেইল প্রয়োজন নেই
            </span>
            <span>•</span>
            <span>শুধু ডাকনাম + স্কোর</span>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <div className="flex items-center gap-2 text-xs font-black text-slate-400">
            <UserRound size={15} /> আপনার অবস্থান
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-3xl font-black">{currentScore} জেলা</div>
              <div className="mt-1 text-xs font-bold text-emerald-300">
                {Math.round((currentScore / 64) * 100)}% Travel Score
              </div>
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-black hover:bg-white/15"
            >
              {saved ? "প্রোফাইল" : "যোগ দিন"} <ChevronRight size={14} />
            </button>
          </div>

          {open && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <label className="text-xs font-bold text-slate-400">
                আপনার ডাকনাম
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={24}
                  placeholder="যেমন: Travel Lover"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm font-bold text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
                />
                <button
                  onClick={saveProfile}
                  disabled={!name.trim()}
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white disabled:opacity-40"
                >
                  Save
                </button>
              </div>
              {saved && (
                <p className="mt-2 text-[11px] font-bold text-slate-500">
                  এখন শুধু এই ডিভাইসে সংরক্ষিত। Supabase যুক্ত হলে এখান থেকেই
                  public leaderboard-এ publish করা হবে।
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-black text-slate-800">
              Public ranking প্রস্তুত করা হচ্ছে
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-400">
              Backend ছাড়া ভুয়া ranking দেখাচ্ছি না—Supabase সংযুক্ত হলেই real Top 50
              এখানে আসবে।
            </div>
          </div>
          <div className="hidden rounded-full bg-white px-3 py-2 text-[11px] font-black text-slate-400 sm:block">
            TOP 50
          </div>
        </div>
      </div>
    </div>
  );
}
