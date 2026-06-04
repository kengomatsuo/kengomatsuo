---
name: matsuokengo-design
description: Use this skill to generate well-branded interfaces and assets for Matsuo Kengo (matsuokengo.com / Kenneth Johannes Fang — "Mango"), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## What's here

- `README.md` — full brand context: content + visual foundations, iconography, manifest.
- `colors_and_type.css` — color tokens (light + dark) and semantic type styles. Import first.
- `fonts/` — the self-hosted brand fonts (Plus Jakarta Sans variable + IBM Plex Sans JP / KR). `colors_and_type.css` `@font-face`s these; ship the folder with the skill so type works offline.
- `assets/` — the MK favicon (`favicon.svg`). The brand mark, nothing else.
- `preview/` — design-system specimen cards (color, type, components, motion).
- `ui_kits/portfolio/` — one worked example of the grammar: an interactive React recreation of matsuokengo.com (Nav, Hero, glow ProjectCard, Section, Research, Footer) showing the signature glow-border + 3D-tilt + IME-retype motion. A reference build, not the spec.

## The brand in one line

Monochrome canvas, one green accent (`#008760` / `#00a068` dark), **Plus Jakarta Sans** Latin type paired with **IBM Plex Sans JP / KR** for Japanese & Korean (one `font-family` chain, resolved per character), 24px-rounded cards with cursor-tracking conic glow borders, and subtle physically-plausible motion everywhere. Minimal on the surface, *not-so-minimal* in the details. First-class dark mode. No emoji.
