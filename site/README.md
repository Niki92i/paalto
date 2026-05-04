# paalto.dev landing page

Single-file static site. Deploy anywhere — Vercel, Netlify, GitHub Pages, your own server. The repo root includes a tiny static build script for platforms that expect an output directory.

## Structure

- `index.html` — main launch page, semantic HTML, no framework.
- `demo.html` — no-setup browser demo for non-technical testers.
- `og.svg` — Open Graph image source. Render to PNG at 1200×630 before launch.
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` — launch icons.
- `site.webmanifest` — install/share metadata.

## Local preview

```bash
cd site
python3 -m http.server 4000
# open http://localhost:4000
```

## Deploy to Vercel

Preferred from the repo root:

```bash
npm run build
npx vercel --prod
```

The root `vercel.json` runs `npm run build` and serves `dist/`, which is copied from `site/`.

Alternative if the Vercel project Root Directory is explicitly set to `site`:

```bash
npx vercel --prod ./site
# add custom domain paalto.dev in the Vercel project settings
```

## Deploy to GitHub Pages

```bash
# from the repo root, on a separate gh-pages branch:
git subtree push --prefix site origin gh-pages
# Settings → Pages → source: gh-pages branch, root
# add CNAME record paalto.dev → <user>.github.io
```

## Brand

- Background: `#fff`
- Text: `#000`
- Lines: `#000` hard grid, 1px borders
- Signal accent: `#D4FF00`, used only for primary actions and validation marks
- Type: IBM Plex Sans + IBM Plex Mono
- No gradients, shadows, rounded cards, or decorative illustrations.
