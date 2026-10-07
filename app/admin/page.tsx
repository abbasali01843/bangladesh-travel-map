import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getAdminContext() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: role } = await supabase.from("UserRole").select("role").eq("authUserId", user.id).maybeSingle();
  if (!role || role.role !== "ADMIN") redirect("/");
  return { supabase, user };
}

export default async function AdminPage() {
  const { supabase, user } = await getAdminContext();
  const [{ count: pendingClaims }, { count: pendingReports }, { count: sources }, { count: verifications }] = await Promise.all([
    supabase.from("Claim").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("Report").select("*", { count: "exact", head: true }),
    supabase.from("DataSource").select("*", { count: "exact", head: true }),
    supabase.from("VerificationRecord").select("*", { count: "exact", head: true }),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <div><div className="text-xs font-black text-emerald-600">GHURECHI ADMIN</div><h1 className="text-2xl font-black">Moderation Dashboard</h1></div>
          <div className="text-xs font-bold text-slate-500">{user.email}</div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["Pending Claims", pendingClaims ?? 0],["Reports", pendingReports ?? 0],["Sources", sources ?? 0],["Verifications", verifications ?? 0]].map(([label,value]) => <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="text-xs font-black text-slate-400">{label}</div><div className="mt-2 text-3xl font-black">{value}</div></div>)}
        </div>
        <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900"><b>Moderation queue:</b> claim/report খুলে source যাচাই, approve/reject, verification level এবং audit note এক জায়গা থেকে পরিচালনা করা হবে।</div>
      </section>
    </main>
  );
}
