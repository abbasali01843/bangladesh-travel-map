# Ghurechi 🇧🇩

**বাংলাদেশের কতটা ঘুরে দেখেছেন?**

A clean, modern Bangladesh travel map and travel-progress sharing app.

**Live:** [ghurechi.vercel.app](https://ghurechi.vercel.app)

---

## Features

- Interactive 64-district SVG map
- Click map or list to mark visited districts
- Travel Score, Levels & Badges
- Shareable score card (PNG)
- Friend Challenge links
- Division progress tracking
- PWA-ready (installable)
- Local persistence + URL state sync
- Dynamic Open Graph images

## Stack

- **Next.js 15** (App Router)
- **React 19** + TypeScript
- **Tailwind CSS**
- `manchitro` (Bangladesh district map)
- `html-to-image` (share card export)
- PWA Manifest

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── components/          # UI components
│   ├── Header.tsx
│   ├── ScoreHero.tsx
│   ├── MapSection.tsx
│   ├── DistrictPicker.tsx
│   ├── Sidebar.tsx
│   └── ShareModal.tsx
├── api/og/              # Dynamic OG image
├── BangladeshDistrictMap.tsx
├── leaderboard.tsx
├── share-card.tsx
├── page-content.tsx     # Main client page
└── page.tsx             # Server page + metadata
data/
└── districts.ts         # 64 districts data
lib/
└── travel.ts            # Shared level/score helpers
```

## Roadmap

- [x] Full 64-district interactive SVG map
- [x] Persistent local travel profile
- [x] Shareable score card and challenge links
- [x] Badges and travel levels
- [ ] Map color themes
- [ ] Name + photo on share card
- [ ] Supabase social features / real leaderboard
- [ ] District guides and trip planner

## Author

Abbas Ali

## License

Private / All rights reserved
