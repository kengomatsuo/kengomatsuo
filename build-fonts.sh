#!/bin/bash
# Regenerate the web fonts in fonts/ from the source .ttf files.
#
# - Plus Jakarta Sans (Latin): variable .ttf -> Latin-subset variable woff2.
# - IBM Plex Sans JP / KR (CJK): static weights subset down to ONLY the glyphs
#   actually used by the matching locale files, then converted to woff2.
#
# Source .ttf files live in the design skill; outputs are committed in fonts/
# and shipped to gh-pages by deploy.sh.
#
# Re-run this whenever you add or change JP/KR text in locales/ — the CJK
# subset is glyph-exact, so new characters won't render until regenerated.
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/.claude/skills/matsuokengo-design/fonts"
OUT="${MK_FONTS_OUT:-$ROOT/fonts}"   # deploy.sh points this at _dist/fonts
VENV="${MK_FONTS_VENV:-/tmp/mk-fonts-venv}"

# fonttools + brotli (for woff2) in an isolated venv (Python is PEP 668 managed)
if [ ! -x "$VENV/bin/pyftsubset" ]; then
  echo "Setting up font tooling venv at $VENV ..."
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --quiet --upgrade pip fonttools brotli
fi
PYFTSUBSET="$VENV/bin/pyftsubset"
PY="$VENV/bin/python"

mkdir -p "$OUT"

# Latin coverage for Plus Jakarta Sans: Basic Latin + Latin-1 + Latin Extended-A,
# general punctuation (curly quotes, dashes, ellipsis), arrows (→), currency.
LATIN_UNICODES="U+0000-00FF,U+0100-017F,U+2000-206F,U+2070-209F,U+20A0-20BF,U+2190-2193,U+2212,U+2022,U+25CF"

echo "→ Plus Jakarta Sans (Latin, variable)"
"$PYFTSUBSET" "$SRC/PlusJakartaSans-VariableFont_wght.ttf" \
  --unicodes="$LATIN_UNICODES" \
  --layout-features='*' \
  --flavor=woff2 \
  --output-file="$OUT/PlusJakartaSans.woff2"

# Extract the exact set of characters used by a language's locale files,
# seeded with printable ASCII so the CJK face is self-sufficient for mixed text.
extract_glyphs() {
  local out="$1"; shift
  "$PY" - "$out" "$@" <<'PYEOF'
import sys
out = sys.argv[1]
chars = set(chr(c) for c in range(0x20, 0x7F))  # printable ASCII seed
for path in sys.argv[2:]:
    with open(path, encoding="utf-8") as f:
        chars.update(f.read())
chars.discard("\n"); chars.discard("\r"); chars.discard("\t")
with open(out, "w", encoding="utf-8") as f:
    f.write("".join(sorted(chars)))
print(f"  {out}: {len(chars)} glyphs")
PYEOF
}

JA_TXT="/tmp/mk-fonts-ja.txt"
KO_TXT="/tmp/mk-fonts-ko.txt"
extract_glyphs "$JA_TXT" "$ROOT/locales/ja.js" "$ROOT/locales/ja-ime.js"
extract_glyphs "$KO_TXT" "$ROOT/locales/ko.js" "$ROOT/locales/ko-ime.js"

# weight name -> file suffix used by IBM Plex static weights
subset_cjk() {
  local family="$1" textfile="$2"
  for pair in "Regular" "Medium" "Bold"; do
    echo "→ IBM Plex Sans $family ($pair)"
    "$PYFTSUBSET" "$SRC/IBMPlexSans${family}-${pair}.ttf" \
      --text-file="$textfile" \
      --layout-features='*' \
      --flavor=woff2 \
      --output-file="$OUT/IBMPlexSans${family}-${pair}.woff2"
  done
}

subset_cjk "JP" "$JA_TXT"
subset_cjk "KR" "$KO_TXT"

rm -f "$JA_TXT" "$KO_TXT"

# Regenerate favicon.svg: "MK" as Plus Jakarta Sans Bold outlines, so it renders
# without a webfont. Only on a local build (MK_FONTS_OUT unset) — never rewrite
# the working tree during deploy, which sets MK_FONTS_OUT.
if [ -z "${MK_FONTS_OUT:-}" ]; then
  echo "→ favicon.svg (MK outlines)"
  "$PY" - "$SRC/PlusJakartaSans-VariableFont_wght.ttf" "$ROOT/favicon.svg" <<'PYEOF'
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.misc.transform import Transform

src, out = sys.argv[1], sys.argv[2]
TRACKING, BOX_W, BOX_H, FILL = -250, 28, 23, "#00a068"
f = TTFont(src)
instantiateVariableFont(f, {"wght": 700}, inplace=True)
gs, cmap, hmtx = f.getGlyphSet(), f.getBestCmap(), f["hmtx"]
placements, x = [], 0
for ch in "MK":
    g = cmap[ord(ch)]; rec = RecordingPen(); gs[g].draw(rec)
    placements.append((rec, x)); x += hmtx[g][0] + TRACKING
bp = BoundsPen(gs)
for rec, ox in placements:
    rec.replay(TransformPen(bp, Transform().translate(ox, 0)))
xMin, yMin, xMax, yMax = bp.bounds
s = min(BOX_W / (xMax - xMin), BOX_H / (yMax - yMin))
cx, cy = (xMin + xMax) / 2, (yMin + yMax) / 2
pen = SVGPathPen(gs, ntos=lambda v: format(round(v, 2), "g"))
for rec, ox in placements:
    rec.replay(TransformPen(pen, Transform().translate(16, 16).scale(s, -s).translate(-cx, -cy).translate(ox, 0)))
open(out, "w").write(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n'
    '  <!-- "MK" wordmark as outlines from Plus Jakarta Sans Bold (700) so it\n'
    '       renders identically without a webfont. Regenerate via build-fonts.sh. -->\n'
    f'  <path fill="{FILL}" d="{pen.getCommands()}"/>\n</svg>\n'
)
PYEOF
fi

echo
echo "Done. Output:"
ls -lh "$OUT"/*.woff2 | awk '{print "  " $9 "  " $5}'
