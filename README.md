# বাংলাদেশ লোকাল ডিরেক্টরি 🇧🇩 — Ghurechi

**Ghurechi** একটি Bangladesh Hyper-Local Information Platform। লক্ষ্য হলো বিভাগ → জেলা → উপজেলা → ইউনিয়ন → ওয়ার্ড/গ্রাম স্তরে যাচাইকৃত স্থানীয় তথ্য, প্রতিষ্ঠান, সেবা, উৎস ও verification history এক জায়গায় রাখা।

## বর্তমান পাইলট

**কাঞ্চনা ইউনিয়ন, সাতকানিয়া, চট্টগ্রাম**

পাইলটের canonical locality structure:
- ৩টি প্রধান গ্রাম
- ৯টি ওয়ার্ড
- শিক্ষা, বাজার, ধর্মীয় স্থান, পরিবহন ও জরুরি সেবা
- প্রতিটি গুরুত্বপূর্ণ তথ্যের verification level
- disputed/unverified তথ্য আলাদা রাখা
- source registry + verification history

## Architecture

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth + RLS
- PostGIS geography/index foundation
- PWA
- Leaflet/OpenStreetMap
- Admin moderation + verification center
- Data source / verification / moderation audit trail

## Data principles

- তথ্য বানিয়ে যোগ করা হবে না।
- coordinate না থাকলে coordinate বানানো হবে না।
- OFFICIAL, VERIFIED, COMMUNITY, UNVERIFIED, ARCHIVED আলাদা থাকবে।
- public directory-তে শুধু approved এবং verified-level data প্রকাশিত হবে।
- unverified data future verification-এর জন্য database-এ থাকতে পারে, কিন্তু public final data হিসেবে দেখানো হবে না।
- source ও last-checked context রাখা হবে।

## Development order

1. Kanchana 1.0
2. Supabase-backed frontend
3. Search + PostGIS map upgrade
4. SEO/domain cleanup
5. User contribution + admin approval
6. Satkania expansion
7. Nationwide expansion

## Admin

Admin dashboard:
- /admin/login
- moderation queue
- verification center
- moderation audit tracking

## Development

    npm install
    npm run dev
    npm run build

Production deployment is connected to the GitHub main branch through Vercel.
