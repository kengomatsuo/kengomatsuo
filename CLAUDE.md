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
2. Copies all static assets (`images/`, `itinerary-generator/`, `polindohc/`, `prevented-ocean-plastic/`, `locales/`, `favicon.svg`, `CNAME`, `robots.txt`)
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

## Fonts

Self-hosted brand type, one font-family chain that resolves per character:
Latin → **Plus Jakarta Sans** (variable), Japanese → **IBM Plex Sans JP**,
Korean → **IBM Plex Sans KR** (both static 400/500/700). All are OFL-licensed.

The `fonts/` files are subset woff2 produced by `build-fonts.sh`, which subsets
from the source `.ttf`s in `.claude/skills/matsuokengo-design/fonts/` (Jakarta →
Latin ranges; Plex JP/KR → only the glyphs actually used by the matching
`locales/*.js` files). Tooling (`fonttools` + `brotli`) installs into a
throwaway venv.

**`deploy.sh` runs `build-fonts.sh` automatically** (output to `_dist/fonts`), so
the deployed fonts always match the current locales — no manual step before
deploy. The committed `fonts/` copies exist only so local dev stays build-free;
re-run `bash build-fonts.sh` to refresh them after editing JP/KR text, since the
CJK subset is glyph-exact (new characters won't show locally until regenerated).

A local `build-fonts.sh` run (without `MK_FONTS_OUT`) also regenerates
`favicon.svg` — the "MK" wordmark as Plus Jakarta Sans Bold outlines, so it
renders without a webfont. Deploy skips this step and ships the committed SVG.

`fonts/PlusJakartaSans.woff2` is preloaded in `index.html`, and the loading
overlay waits on `document.fonts.ready` before lifting, so text never paints in
a fallback font. `@font-face` declarations use `font-display: block`.

## Localisation / IME animations

`locales/ja.js` handles Japanese translation. Strings with IME frame sequences (nav, section headers, hero text) simulate macOS Live Conversion keystroke-by-keystroke. See `locales/IME_GUIDE.md` for the frame format, timing constants, and how to add new strings.
