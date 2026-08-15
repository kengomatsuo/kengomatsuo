#!/bin/bash
set -e

DIST="_dist"
REMOTE=$(git remote get-url origin)

rm -rf "$DIST"
mkdir -p "$DIST"

# Minify CSS and JS to temp files
bunx lightningcss-cli --minify style.css -o /tmp/_min.css
bunx terser script.js --compress --mangle -o /tmp/_min.js

# Inline both into a single HTML file
python3 - <<'EOF'
import re

css  = open('/tmp/_min.css').read()
js   = open('/tmp/_min.js').read()
html = open('index.html').read()

html = re.sub(r'<link rel="stylesheet" href="style\.css" />', f'<style>{css}</style>', html)
html = re.sub(r'<script src="script\.js"></script>', f'<script>{js}</script>', html)

open('_dist/index.html', 'w').write(html)
EOF

cp /tmp/_min.css "$DIST/style.css"
rm -f /tmp/_min.css /tmp/_min.js

# Copy remaining assets
cp favicon.svg CNAME robots.txt "$DIST/"
cp -r images itinerary-generator polindohc prevented-ocean-plastic warehouse-ops \
      solute cutling txe-express locales "$DIST/"

# Self-hosted webfonts: subset + convert to woff2 fresh from source (build-fonts.sh),
# so the deployed fonts always match the current locales/ glyph set.
MK_FONTS_OUT="$DIST/fonts" bash build-fonts.sh

# Case-study screenshots are the content of those pages, so they get a bigger cap:
# a dashboard or data table resized to 512px tall is unreadable. Long edge 1600px.
find "$DIST" \( -name "Preview-*.png" -o -name "Screenshot-*.png" \) | while IFS= read -r f; do
  magick "$f" -resize '1600x1600>' "$f"
done

# Everything else (logos, icons, card art) stays small: max 512px height, never upscale.
find "$DIST" \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) \
     ! -name "Preview-*" ! -name "Screenshot-*" | while IFS= read -r f; do
  magick "$f" -resize 'x512>' "$f"
done

# Convert PNGs to WebP (only keep if smaller)
find "$DIST" -name "*.png" | while IFS= read -r f; do
  out="${f%.png}.webp"
  cwebp -q 85 -quiet "$f" -o "$out"
  if [ "$(stat -f%z "$out")" -ge "$(stat -f%z "$f")" ]; then
    rm "$out"
  fi
done

# Minify SVGs
find "$DIST" -name "*.svg" | while IFS= read -r f; do
  bunx svgo "$f" -o "$f" --config svgo.config.js --quiet
done

# Push to gh-pages
cd "$DIST"
git init -q
git checkout -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push --force "$REMOTE" gh-pages
cd ..
rm -rf "$DIST"

echo "Deployed."
