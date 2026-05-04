# paalto.dev landing page

Single-file static site. Deploy anywhere — Vercel, Netlify, GitHub Pages, your own server. No build step.

## Structure

- `index.html` — the whole site, one page, semantic HTML, no build step.
- `og.svg` — Open Graph image source. Render to PNG at 1200×630 before launch.
- `favicon.svg` — square logomark.

## Local preview

```bash
cd site
python3 -m http.server 4000
# open http://localhost:4000
```

## Deploy to Vercel

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
