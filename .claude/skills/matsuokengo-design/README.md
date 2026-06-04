# Matsuo Kengo — Design System

> *"Mango's not-so-minimal."*
> A monochrome canvas, one green accent, Plus Jakarta Sans (with IBM Plex CJK) — and an obsessive amount of motion craft hiding underneath.

This is the design language of **Kenneth Johannes Fang** (松尾賢吾 / *Matsuo Kengo*, nicknamed **"Mango"**) — a developer and researcher. Design *new* things in this voice: a site, a deck, an app UI, a one-pager, a mock. The aesthetic is **minimal on the surface, not-so-minimal in the details** — a quiet near-monochrome canvas that, on closer inspection, is doing a lot: conic-gradient glow borders that sweep toward the cursor, 3D card tilt, staged scroll-in, a macOS-style IME retype when language switches, physically-plausible motion everywhere. That tension *is* the brand.

This document describes the **grammar**, not any one page. `ui_kits/portfolio/` is one worked example of the grammar (a recreation of matsuokengo.com) — read it for *how the motion is wired*, not as the spec to copy.

---

## VOICE

Plain, modest, concrete. Describe what a thing **is** and what it **does**, then stop. No marketing adjectives, no hype, no exclamation marks (unless a product name literally contains one).

- **Casing:** Sentence case in prose. Title Case for section and project names. UPPERCASE only for tiny tag labels (`iOS & macOS`, `WEB`, `ML`), set in small caps via `text-transform`.
- **Person:** Third-person / no-person, descriptive. Never "I built" — say what the thing *does*. "You/your" only when describing a user benefit.
- **Length:** Brutally short. Blurbs are one or two sentences (~15–35 words). Labels are one word where possible.
- **Tone:** Understated confidence — let the work speak.
- **Status:** Honest about state. Label unfinished work ("In Progress" amber badge, "Coming Soon"); never hide or oversell it.
- **Punctuation:** Ampersands over "and" in tight labels. Action links end in a trailing arrow — `Visit →`, `Learn more →`. Em-dashes for appositives.
- **Emoji:** None. Ever. The only pictographic flourish is the `→` arrow on links.
- **Bilingual by design:** quietly bilingual. English name with the Japanese alias 松尾賢吾 beneath it, in green. When localised, every string can retype itself in the target language (the IME signature, below). Respect both identities.

*Register check:* "Developer & researcher building apps, tools, and things worth reading." — that's the whole bio. Match that economy.

---

## VISUAL FOUNDATIONS

**In one breath:** a white (or near-black) page, ink-black text, mid-grey captions, one green accent, 24px-rounded cards with animated conic-gradient borders, and motion that's *everywhere* but always subtle and physically plausible. Tokens live in `colors_and_type.css` — import it first.

### Color
- **Monochrome base.** Light: `#fff` page / `#f7f7f7` alt-band / `#111` ink / `#737373` muted. Dark: `#0d0d0d` / `#141414` / `#ebebeb` / `#808080`.
- **Exactly one accent:** brand green `#008760` (light) / `#00a068` (dark). Used *sparingly* — the Japanese alias, action links, `::selection`, button-hover text. A highlight, never a fill. Don't flood a surface with it.
- **Dark mode is first-class**, driven purely by `prefers-color-scheme` — no toggle. Every token has a dark counterpart. Always design for both.
- **Status amber** (`#fef3c7`/`#92400e` light, `#3b1f00`/`#fcd34d` dark) is the *only* other hue — reserved for "In Progress" badges.
- **Let imported imagery keep its own color.** App icons and logos keep their native brand colors; the page stays neutral so they pop. Never tint someone else's mark.

### Type
- **Plus Jakarta Sans** is the Latin typeface — a humanist geometric drawn in Jakarta (a nod to Mango's Indonesian roots): warm, even, clean, not an over-used UI default. Don't substitute Inter/Roboto.
- **IBM Plex Sans JP + KR** cover Japanese and Korean. Ship one `font-family` chain — `"Plus Jakarta Sans", "IBM Plex Sans JP", "IBM Plex Sans KR", …` — and the browser resolves it **per character**: Latin → Jakarta, 松尾賢吾 → Plex JP, 한글 → Plex KR. This matters because the brand localises into ja / ko / id.
- **Headlines:** bold (700), negative tracking (≈`-0.03em`), tight line-height (≈1.08). **Body:** regular weight, 1.6 line-height.
- **Micro layer:** ~11px uppercase tags at `+0.07em` tracking. Use fluid `clamp()` sizing so display type scales with the viewport (e.g. 36→60px).

### Spacing & layout
- **~960px max-width**, centered, generous fluid padding (`clamp(1.25rem, 5vw, 2.5rem)`).
- Let sections breathe — large fluid vertical padding (`clamp(2.5rem, 7vw, 4.5rem)`).
- **Alternating section bands** (some sections on `--bg-alt`) create rhythm without rules or boxes.
- Card grids: auto-fill `minmax(250px, 1fr)` (slim variant ~210px); a featured card can span 2 columns at wider widths.
- Sticky, slim nav that grows only a hairline bottom border after you scroll.

### Backgrounds
- **Flat solid color.** No gradients on backgrounds, no photos, no patterns, no textures, no noise. Whitespace does the heavy lifting. The *only* gradients in the system are functional: the conic glow borders and button border-fills.

### Cards — the signature surface
- 24px radius, `overflow: hidden`, flex column. The border is **not** a plain line — it's a `conic-gradient` painted into the `border-box` (page color fills the `padding-box`), so a brighter highlight can travel around the perimeter.
- **Resting:** barely-there glow edge, no shadow (light) / subtle border (dark).
- **Hover:** soft low shadow appears, the card lifts (`translateY(-6px) scale(1.02)`), **3D-tilts** toward the cursor (`perspective(800px)`, max ≈±12°/±6°), the inner image scales ~1.05, and the glow highlight tracks the pointer's X around the border. Tags **invert** (transparent → filled muted ground, text → page color).

### Motion — the "not-so-minimal" part
The principles, not the exact frame counts (see the UI kit for rAF math):

- **Scroll-in choreography.** Elements start `opacity:0, translateY(~18–36px)` and rise into place on a single `IntersectionObserver`, eased `cubic-bezier(0.16, 1, 0.3, 1)` over ~0.9s. Group a grid so it reveals as one, staggered ~0.1s per card.
- **Staged entrance.** On load, reveal in sequence (e.g. nav → headline → subhead → buttons, ~60ms apart) rather than all at once.
- **The glow sweep.** Card/button borders "power on" (glow 0→1 over ~0.7s) on first appearance, then continuously follow the mouse via rAF lerp loops that **stop themselves** when motion settles (no idle rAF).
- **3D tilt** is pointer-driven on desktop, device-orientation-driven on mobile; disabled on `(hover: none)`.
- **Real loading states.** When there's media to load, show an honest preloader (a filling progress bar) rather than a fake spinner.
- **The IME signature.** When the locale is ja/ko/id, strings can **delete and retype themselves** in the target language, simulating macOS Live Conversion (romaji → hiragana → kanji → confirm). The single most distinctive brand moment — use it where a language switch happens.
- **Easing vocabulary:** `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for image/tag transitions; plain `ease` for color/opacity micro-transitions (~0.15s). **No bounces, no springs, no infinite loops.** Always respect `prefers-reduced-motion`.

### Hover / press
- **Links:** fade to ~0.7 opacity, or shift muted→ink. Accent links keep accent, just dim.
- **Buttons:** text goes green on hover; the conic border highlight follows the cursor; no background change.
- **No separate press state** — interactions are hover-and-release; the physicality comes from the tilt, not a click-shrink.

### Borders, radius, shadow
- **Radius:** `24px` for large surfaces (cards, buttons; full circle for a back-to-top), `4px` for tags/badges. Nothing in between.
- **Borders:** 1px hairlines in `--border`; the *expressive* borders are the conic-gradient ones.
- **Shadows:** only on card hover, never at rest. Soft, low, large-radius, low-opacity. No elevation-shadow system — lean on borders + whitespace.
- **No glassmorphism / backdrop-blur.** Surfaces are opaque. The only alpha is inside glow gradients and hover shadows.

### Imagery
- **No photography, no illustration, no stock.** When a real product mark exists, sit it in a `--surface` icon tile, `object-fit: contain`, padded — and let it keep its own colors.
- **Every `<img>` gets a graceful text fallback** (`onerror` swaps to a colored text tile). Robustness is part of the aesthetic.
- When you have no real asset, use a neutral text tile or a subtly-striped placeholder — never a hand-drawn SVG illustration.

---

## ICONOGRAPHY

Almost icon-free by design — this is a text-and-mark language.

- **No icon font, no icon library.** No Lucide/Heroicons/Font Awesome dependency. Hand-place inline `<svg>` only where unavoidable.
- **House style for the rare UI icon:** 16×16, `fill="currentColor"`, filled for brand glyphs (e.g. GitHub mark, envelope) / 2px round-stroke for line glyphs (e.g. chevron). Match that if you must add one.
- **The `→` arrow** on action links is a literal Unicode character — copy, not an icon.
- **The "MK" monogram** is the brand mark: bold, `+0.05em` tracking, set in the system font, green in the favicon (`#00a068`). Nav logo + favicon. See `assets/favicon.svg`.
- **Default to no icon.** If you must add one, match the house style above and flag the substitution.

---

## What's in this folder

- **`README.md`** — this file: the grammar (voice + visual foundations + iconography).
- **`colors_and_type.css`** — color tokens (light + dark) and semantic type styles. Import first.
- **`SKILL.md`** — front-matter so this system works as a downloadable skill.
- **`fonts/`** — self-hosted brand fonts (Plus Jakarta Sans variable + italic; IBM Plex Sans JP / KR static 400/500/700). Wired into `colors_and_type.css` as one per-character `font-family` chain. Works offline, no CDN.
- **`assets/`** — the `MK` favicon (`favicon.svg`). The brand mark and nothing else.
- **`preview/`** — design-system specimen cards (color, type, components, motion).
- **`ui_kits/portfolio/`** — one worked example of the grammar: an interactive recreation of matsuokengo.com (glow cards, scroll-in, locale toggle, 3D tilt). Modular `*.jsx` components (Nav, Hero, ProjectCard, GlowBorder, SectionBand, Footer) + its own README on how the motion is wired. Treat it as a reference build, not the spec.

> **Font note:** brand type is fully self-hosted from `fonts/`. The `@font-face` paths in `colors_and_type.css` are relative to project root, so they resolve from the UI kit too. Plus Jakarta Sans (Latin) + IBM Plex Sans JP/KR (Japanese/Korean), one chain that resolves per character.
