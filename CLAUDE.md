# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal portfolio site (matsuokengo.com). No build step, no dependencies — just `index.html`, `style.css`, and static assets served directly.

## Development

```bash
python3 -m http.server   # serve locally
```

Deploy by pushing to `gh-pages`:

```bash
git push origin main:gh-pages
```

## Architecture

Everything lives in two files:

- **`index.html`** — all markup and all JavaScript (inline `<script>` at the bottom of `<body>`). Sections: hero, personal projects, client work, school, research, contact/footer.
- **`style.css`** — all styling. Uses CSS custom properties for theming; dark mode via `prefers-color-scheme`. Key variables defined on `:root`.

### JS animation system

All scroll-in animations use a single `IntersectionObserver` (`appearObserver`). Elements with class `appear` are invisible until the observer fires `visible` on them. Project cards inside `.project-grid` are grouped so the entire section reveals at once (via the `cardGroups` Map).

Card hover effects (light angle sweep + 3D tilt) run on `requestAnimationFrame` loops that stop when motion settles. The tilt is skipped on touch/mobile devices via `window.matchMedia("(hover: none)")`.

Hero buttons have a separate shimmer-angle animation driven by `mousemove`.
