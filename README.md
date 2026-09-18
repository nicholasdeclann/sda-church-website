# SDA Church Website Template

A modern, responsive church website template built with **Next.js 15**,
**TypeScript**, and **MUI**. Designed to be **forked and customized by any
church** — most churches only need to edit a single configuration file and
point it at their own Google Sheets.

It originated as the site for an Indonesian Seventh-day Adventist church, so the
UI text is in Indonesian by default; you can translate the visible strings in
the page components as needed.

There is **no backend, no database, and no login**. All data is read at runtime
from **public Google Sheets**, so the church staff maintain everything from a
spreadsheet — no code changes or redeploys needed to update content.

---

## Pages

| Page | Route | What it does |
|------|-------|--------------|
| **Home** | `/` | Welcome hero, worship/online-meeting card, Instagram card, embedded Google Map |
| **Kertas Acara** | `/kertas-acara` | Weekly worship order, pulled live from Google Sheets, with this-week / next-week navigation, name search, and a **"Download as JPG"** button for sharing to WhatsApp |
| **Ulang Tahun** | `/ulang-tahun` | Congregation birthdays falling in the current week |
| **Pengumuman** | `/pengumuman` | Announcements, embedded as a Canva slideshow |

---

## Quick Start

1. **Use this template** on GitHub (green *"Use this template"* button) or fork
   it, to create your church's own repository.
2. **Edit [`src/config/church.ts`](src/config/church.ts)** — the one file you
   must change. Fill in your church name, service times, Zoom link, Instagram,
   Google Maps embed, Canva embed, and your Google Sheet IDs. Every field is
   typed and commented.
3. **Replace the images** in `public/assets/images/` with your own. Keep the
   same filenames, or update the `assets` block in `church.ts` to match your
   filenames. (The template ships with placeholder SVGs.)
4. **Set up your Google Sheets** — follow **[SETUP.md](SETUP.md)** for the exact
   spreadsheet structure the app expects.
5. **Deploy** — see [Deployment](#deployment) below. GitHub Pages works with
   zero configuration; Vercel unlocks a couple of extra features.

---

## Configuration reference

All church-specific values live in **`src/config/church.ts`**. It is fully
typed, so your editor autocompletes and validates every field.

| Key | What it controls |
|-----|------------------|
| `name`, `shortName`, `description` | Church name in the tab title, navbar, footer, and SEO description |
| `welcomeHeading`, `welcomeSubtitle` | Homepage hero text |
| `assets.logo` / `.zoomLogo` / `.birthdayHeader` | Image filenames inside `public/assets/images/` |
| `services[]` | The worship-service cards on the homepage (`name` + `time`) |
| `zoom.id` / `.password` / `.url` | Online meeting details on the homepage |
| `instagram.handle` / `.url` | Instagram card |
| `mapsEmbedUrl` | Google Maps embed iframe `src` |
| `pengumumanEmbedUrl` | Canva design embed URL for the announcements page |
| `sheets.schedule` | Worship-schedule spreadsheet (`sheetId` + `gid`) — **new file each quarter** |
| `sheets.liturgy` | Liturgy spreadsheet (`sheetId` + `kertasAcaraGid` + `laguSionGid`) |
| `sheets.birthdays` | Birthday spreadsheet (`sheetId` + `tabGids[]`) |
| `kertasAcara.hymnalPrefix`, `.fixedHymns`, `.pengumumanRole` | Worship-order display details |
| `kertasAcara.export` | The sheet range downloaded by the "Download as JPG" button (`sheetId` + `gid` + `range`) |
| `kertasAcara.parsing` | Keywords that map your schedule sheet's rows into sections (see SETUP.md) |

> **All referenced Google Sheets must be shared publicly** ("Anyone with the
> link → Viewer"). No API key or service account is used.

---

## Deployment

The template supports two hosting options. **GitHub Pages is the zero-config
default.** **Vercel** additionally enables Next.js image optimization and the
in-app JPG download. See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for full
details; a summary follows.

### Option A — GitHub Pages (default, zero config)

1. In your repo: **Settings → Pages → Build and deployment → Source =
   "GitHub Actions"**.
2. Push to `main`. The included workflow (`.github/workflows/deploy.yml`)
   builds a static export and deploys it. The site's base path is derived
   automatically from your repository name, so there is nothing else to set.

On GitHub Pages the site is a fully static export. The "Download as JPG" button
falls back to downloading the worship order as a **PDF** directly from Google
(the JPG conversion needs a server, which a static host does not have).

### Option B — Vercel (recommended for full features)

1. Import the repo at [vercel.com](https://vercel.com) → **Add New Project**.
2. Accept the auto-detected Next.js settings. **No environment variables
   needed** (leave `NEXT_PUBLIC_BASE_PATH` unset — Vercel serves at the root).
3. Deploy.

On Vercel the app runs Next.js natively, so you get automatic image
optimization (WebP/AVIF) and the "Download as JPG" button produces a real JPG
(cropped tightly to the worship-order cells).

---

## Notable features & behavior

- **Live data with light caching.** Sheets are fetched client-side and cached
  in memory for a short time (`src/lib/sheetCache.ts`): schedule ~5 min,
  liturgy ~10 min, birthdays ~60 min. Edits to a sheet appear on the next
  fetch; to see them immediately, **hard-reload** the page (`Cmd/Ctrl+Shift+R`)
  or open a new tab.
- **Per-quarter schedule.** Many churches use a new schedule spreadsheet each
  quarter. Just update `sheets.schedule.sheetId` and `.gid` when the quarter
  changes — no code edits.
- **Download Kertas Acara as JPG.** Proxies Google Sheets' native PDF export of
  a configured cell range, then crops it tightly to the content (with a small
  white margin) for clean WhatsApp sharing. On static hosts it downloads the
  PDF instead.

---

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

To preview a GitHub-Pages-style static export locally:

```bash
STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build
# output is written to ./out
```

---

## Project structure

```
├── src/
│   ├── config/
│   │   └── church.ts              # ← the ONE file each church edits
│   ├── lib/
│   │   ├── asset.ts               # base-path-aware asset URL helper
│   │   ├── sheetCache.ts          # in-memory Google Sheets cache (per-source TTLs)
│   │   └── kertasAcaraExport.ts   # builds the Google Sheets PDF-export URL
│   ├── components/
│   │   └── Navbar.tsx
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx               # Home
│       ├── kertas-acara/          # Worship order (Google Sheets)
│       │   ├── page.tsx
│       │   └── components/        # CollapsibleSection, section cards, DownloadButton
│       ├── ulang-tahun/           # Birthdays (Google Sheets)
│       ├── pengumuman/            # Announcements (Canva embed)
│       └── api/
│           └── kertas-acara/export/route.ts  # PDF-export proxy (Vercel only)
├── public/assets/images/          # logo, meeting logo, birthday header (placeholders)
├── .github/workflows/deploy.yml   # GitHub Pages deploy
├── SETUP.md                       # Google Sheets setup guide
├── docs/DEPLOYMENT.md             # GitHub Pages vs Vercel
└── next.config.ts
```

---

## Tech stack

- **Framework:** Next.js 15 (App Router) — static export for GitHub Pages, or
  native runtime on Vercel
- **Language:** TypeScript
- **UI:** MUI (Material UI) v7 + Emotion
- **Data:** public Google Sheets (client-side fetch, no API key)
- **PDF → JPG:** `pdfjs-dist` (client-side)
- **Hosting:** GitHub Pages (Actions) or Vercel

## License

MIT
