# Portfolio UI Kit — matsuokengo.com

A high-fidelity, interactive React recreation of **Kenneth Johannes Fang's** personal portfolio. Built by reading the original source (`kengomatsuo/kengomatsuo`: `index.html`, `style.css`, `script.js`, `locales/`), not from screenshots — so the motion is reproduced, not approximated.

Open **`index.html`** to run it. It's a real page: scroll-in choreography, cursor-tracking conic glow borders, 3D card tilt, and a working **EN / 日本 language toggle** that re-types every string — the alias and "Client Work" heading retype through a simulated macOS **Live Conversion** IME (romaji → hiragana → kanji), exactly like the live site.

## Files

| File | What it holds |
|---|---|
| `index.html` | Mounts React + Babel, loads the kit. Links `../../colors_and_type.css`. |
| `portfolio.css` | Structural + component CSS, ported from the site's `style.css`. Includes the `.glow-border` conic-gradient edge. |
| `data.js` | All copy (EN + JA), project metadata, IME frame sequences, icon-fallback colors. `window.MK_DATA`. |
| `hooks.jsx` | The signature motion: `useGlowTilt` (rAF glow sweep + 3D tilt, ported from `script.js`), `useAppear` (IntersectionObserver reveal), `imeRetype` / `typeOut` (the Live-Conversion + typewriter animations), and the three inline UI icons. |
| `components.jsx` | `Nav` (+ lang toggle), `Hero`, `GlowButton`, `ProjectCard`, `Section`, `Research`, `Footer`, `BackToTop`. |
| `app.jsx` | Assembles the page; holds `lang` state. |

## Component inventory

- **Nav** — sticky 54px bar, MK monogram, muted links (hover → ink), hairline border on scroll, EN/日本 pill toggle.
- **Hero** — bilingual name + green alias + bio + two glow buttons (GitHub / Email). Retypes on locale change.
- **GlowButton** — pill with the cursor-tracking conic border; text turns green on hover (no tilt).
- **ProjectCard** — the signature card: 24px radius, conic glow border, icon tile (`--surface`) with text fallback, tag (inverts on hover), optional amber "In Progress" badge, one-line blurb, arrow links. 3D-tilts to the cursor and lifts on hover. Featured variant spans two columns with a 21:9 image.
- **Section** — titled band (optional `alt` background, optional `slim` grid). Auto-fill `minmax(250px,1fr)` / `minmax(210px,1fr)`.
- **Research** — the IEEE publication block (left-border accent).
- **BackToTop** — circular button that fades in past 300px.

## How the motion is wired

- **Glow + tilt** (`useGlowTilt`) runs one `requestAnimationFrame` lerp loop per element that **stops itself** when motion settles (no idle rAF). It sweeps `--card-light-angle` toward the pointer's X and drives a `perspective(800px)` rotateX/Y. The conic gradient in `.glow-border` reads those CSS vars; `--card-glow` animates 0→1 on first appear for the "power-on" sweep. `@property --card-glow` (in `colors_and_type.css`) makes that transition smooth.
- **Reveal** (`useAppear`) adds `.visible` when a section enters the viewport; CSS eases opacity + translateY over 0.9s on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **IME** (`imeRetype`) walks `[confirmed, composing]` frames from `data.js`, underlining the composing area and pausing longer on kanji candidates — a faithful port of `locales/ja.js`.

## What's intentionally simplified

This is a UI kit, not the production app: links are inert (`href="#"`), there's no loading overlay, no device-orientation tilt, and only EN/JA are wired (the real site also does Korean & Indonesian). The visual + interaction fidelity is the point.
