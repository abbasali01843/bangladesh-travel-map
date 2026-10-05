"use client";

import { Check, Copy, Download, RotateCcw } from "lucide-react";
import { ShareCard } from "../share-card";

type ShareModalProps = {
  visited: string[];
  downloading: boolean;
  copied: boolean;
  onClose: () => void;
  onExport: () => void;
  onCopyLink: () => void;
  onReset: () => void;
};

export function ShareModal({
  visited,
  downloading,
  copied,
  onClose,
  onExport,
  onCopyLink,
  onReset,
}: ShareModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-4 text-center shadow-2xl sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-sm font-black text-slate-900">
          আপনার Travel Score
        </div>

        <div className="overflow-hidden rounded-2xl">
          <ShareCard visited={visited} />
        </div>

        <button
          onClick={onExport}
          disabled={downloading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-70"
        >
          <Download size={17} />
          {downloading ? "তৈরি হচ্ছে..." : "ছবি শেয়ার / ডাউনলোড"}
        </button>

        <button
          onClick={onCopyLink}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 font-extrabold text-slate-700 transition hover:bg-slate-50"
        >
          {copied ? (
            <>
              <Check size={17} className="text-emerald-600" />
              কপি হয়েছে
            </>
          ) : (
            <>
              <Copy size={17} />
              লিংক কপি করুন
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold text-slate-400 transition hover:text-slate-700"
        >
          <RotateCcw size={14} />
          নতুন করে শুরু করুন
        </button>
      </div>
    </div>
  );
}
