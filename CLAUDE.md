# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal portfolio site (matsuokengo.com). Source files are plain HTML/CSS/JS — no framework, no build step for development.

## Development

```bash
python3 -m http.server   # serve locally
```

## Deploy

Deploy via `deploy.sh`, which does the following before pushing to `gh-pages`:

1. Minifies `style.css` (via `lightningcss`) and `script.js` (via `terser`) and inlines both into `index.html`
2. Copies all static assets (`images/`, `itinerary-generator/`, `polindohc/`, `prevented-ocean-plastic/`, `favicon.svg`, `CNAME`, `robots.txt`)
3. Converts PNGs to WebP with `cwebp -q 85`, keeping the WebP only if it's smaller than the PNG
4. Minifies SVGs with `svgo`
5. Force-pushes the result to `origin/gh-pages`

```bash
bash deploy.sh
```

In Zed, this is the **"Publish to gh-pages"** task (`.zed/tasks.json`).

Do **not** push directly to `gh-pages` — the branch is owned by the deploy script and will be overwritten.

## Architecture

Everything lives in two files:

- **`index.html`** — all markup and all JavaScript (inline `<script>` at the bottom of `<body>`). Sections: hero, personal projects, client work, school, research, contact/footer.
- **`style.css`** — all styling. Uses CSS custom properties for theming; dark mode via `prefers-color-scheme`. Key variables defined on `:root`.

### JS animation system

All scroll-in animations use a single `IntersectionObserver` (`appearObserver`). Elements with class `appear` are invisible until the observer fires `visible` on them. Project cards inside `.project-grid` are grouped so the entire section reveals at once (via the `cardGroups` Map).

Card hover effects (light angle sweep + 3D tilt) run on `requestAnimationFrame` loops that stop when motion settles. The tilt is skipped on touch/mobile devices via `window.matchMedia("(hover: none)")`.

Hero buttons have a separate shimmer-angle animation driven by `mousemove`.
