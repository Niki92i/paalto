# paalto.dev landing page

Single-file static site. Deploy anywhere — Vercel, Netlify, GitHub Pages, your own server. No build step.

## Structure

- `index.html` — the whole site, one page, semantic HTML, Tailwind via CDN.
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

- Background: `#FAFAF7` (warm off-white)
- Text: `#0A0A0A`
- Accent: `#D4FF00` (acid)
- Type: system-ui stack with `font-feature-settings: 'ss01', 'cv11'`
- One accent at a time. No gradients. No shadows.
