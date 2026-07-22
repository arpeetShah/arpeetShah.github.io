# Arpeet Shah — Portfolio

A 3D personal portfolio: WebGL particle galaxy, a scroll-driven chapter
flythrough, synthesized ambient audio, and a firework finish.

Built with Three.js, GSAP + ScrollTrigger, and Lenis — loaded as ES modules
from a CDN via an import map, so there is **no build step**.

## Run locally
ES modules must be served over HTTP (opening the file directly won't work):

```bash
cd portfolio
python3 -m http.server 5173
```

Open http://localhost:5173

## Deploy

### Option A — Netlify Drop (fastest, ~60 seconds, no account needed)
1. Go to <https://app.netlify.com/drop>
2. Drag this whole `portfolio` folder onto the page
3. You get a live URL instantly. Claim it with a free account to keep it
   and rename it to something like `arpeetshah.netlify.app`.

### Option B — GitHub Pages (permanent, free)
1. Create a new **public** repo on GitHub named `portfolio`
   (or `arpeetshah.github.io` to get a root-level URL).
2. Then run:

```bash
git remote add origin https://github.com/USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

3. On GitHub: **Settings → Pages → Source: `main` / root → Save**
4. Live in ~1 minute at `https://USERNAME.github.io/portfolio/`

All asset paths are relative, so it works from a subpath without changes.

## Editing content
Everything lives in the `CONTENT` object at the top of [`js/main.js`](js/main.js):
name, hero lines, bio, chapters, writing, email, socials.

Images go in [`images/`](images/README.md) — see that file for the exact
filenames. Missing images fall back to styled placeholders automatically.

## Structure
| File | Purpose |
|---|---|
| `js/main.js` | All content + wiring |
| `js/scene.js` | Hero particle galaxy (custom GLSL) |
| `js/chapters.js` | 3D chapter flythrough |
| `js/modelviewer.js` | Rotating 3D model in each detail panel |
| `js/audio.js` | Synthesized ambient pad + underwater muffle |
| `js/fireworks.js` | Contact-section celebration |
| `css/style.css` | All styling |
