# Deployment Guide

This template can be deployed two ways. Pick based on the features you need.

| | GitHub Pages | Vercel |
|---|---|---|
| Cost | Free | Free (Hobby) |
| Setup | Zero-config | ~2 minutes |
| Rendering | Static export | Native Next.js |
| Image optimization | No (raw files served) | Yes (WebP/AVIF, responsive) |
| "Download Kertas Acara" | Downloads a **PDF** | Downloads a tightly-cropped **JPG** |
| Base path | `/<repo-name>` (auto) | Root (`/`) |
| Custom domain | Supported | Supported (+ automatic SSL) |

Both read the same public Google Sheets and require no secrets.

---

## How the build modes work

The build reads an environment variable, `STATIC_EXPORT`, to decide its mode
(see `next.config.ts`):

- **`STATIC_EXPORT=true`** → `output: "export"` (a fully static site for GitHub
  Pages). Route handlers under `src/app/api/` are **not** supported by a static
  export, so the deploy workflow removes that folder before building. The
  download button then falls back to a direct Google PDF link.
- **unset** (Vercel) → Next.js runs natively. Image optimization is on, and the
  `/api/kertas-acara/export` route proxies Google's PDF so the browser can
  convert it to a JPG.

You normally never set `STATIC_EXPORT` yourself — the GitHub Actions workflow
sets it, and Vercel leaves it unset.

---

## Option A — GitHub Pages

1. Push your repo to GitHub.
2. **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
3. Push to `main`.

The included workflow (`.github/workflows/deploy.yml`) will:

- install dependencies (with npm caching),
- remove `src/app/api` (unsupported by static export),
- build with `STATIC_EXPORT=true` and
  `NEXT_PUBLIC_BASE_PATH=/<your-repo-name>` (derived automatically from the repo
  name, so **forks need no configuration**),
- deploy the `out/` folder to Pages.

Your site will be live at `https://<your-user>.github.io/<your-repo-name>/`.

### Custom domain on GitHub Pages

If you serve from a custom domain at the root (e.g. `www.yourchurch.org`), the
base path should be empty. Remove the `NEXT_PUBLIC_BASE_PATH` line from the
workflow's `env` block (and add your domain under Settings → Pages).

---

## Option B — Vercel

1. Sign in at [vercel.com](https://vercel.com) (you can use any email; it does
   not need to match your GitHub account).
2. **Add New Project** → import your repository.
3. Vercel auto-detects Next.js. **Leave all settings at their defaults** and do
   **not** set `NEXT_PUBLIC_BASE_PATH` (Vercel serves at the root).
4. **Deploy.**

Every push to `main` redeploys automatically. Add a custom domain under
**Project → Settings → Domains** (SSL is provisioned automatically).

> You can run **both** at once — GitHub Pages and Vercel deploy independently
> from the same repo and don't conflict.

---

## Local preview

```bash
# Normal dev server (Vercel-like: API route + image optimization available)
npm run dev

# Production build (Vercel-like)
npm run build

# Static-export build (GitHub-Pages-like)
STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build
#   → outputs to ./out ; note the /your-repo-name prefix on asset URLs
```

---

## Troubleshooting

- **Assets 404 on GitHub Pages** — the base path is wrong. Confirm the repo name
  matches the URL path, and that you didn't remove the `NEXT_PUBLIC_BASE_PATH`
  line unless you're on a root custom domain.
- **Vercel build fails on the API route** — make sure you did *not* set
  `STATIC_EXPORT=true` in Vercel's environment variables. It must be unset there.
- **"Download Kertas Acara" gives a PDF, not a JPG** — you're on a static host
  (GitHub Pages). The JPG conversion requires the server route, which only runs
  on Vercel. This is expected.
