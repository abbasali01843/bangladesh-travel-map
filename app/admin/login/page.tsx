"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-7 text-slate-900 shadow-2xl">
        <div className="text-xs font-black text-emerald-600">GHURECHI ADMIN</div>
        <h1 className="mt-2 text-3xl font-black">অ্যাডমিন লগইন</h1>
        <p className="mt-2 text-sm text-slate-500">Verification ও moderation পরিচালনার জন্য লগইন করুন।</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin email" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"/>
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"/>
          {error && <div className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
          <button disabled={loading} className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white disabled:opacity-50">{loading ? "লগইন হচ্ছে..." : "লগইন"}</button>
        </form>
      </div>
    </main>
  );
}
