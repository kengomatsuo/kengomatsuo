# i18n Refactor Plan

## Goal
Clean, modular localisation. Each locale file owns all its own logic and exports a single default function. `script.js` handles detection + lazy load of `i18n.js` after images are downloaded — English browsers never load i18n.js at all. The locale function fires after the hero animation settles.

---

## Final file structure

```
i18n.js               ← detect lang, import locale, fire after hero-settled event
locales/
  utils.js            ← shared scrambleEl utility (ES module)
  ja.js               ← Japanese locale module, exports default function
  id.js               ← Indonesian locale module, exports default function
  ja.json             ← DELETE (replaced by ja.js)
  id.json             ← DELETE (replaced by id.js)
```

---

## How it hangs together

1. `script.js` detects `navigator.language` at the top (~3 lines). For English browsers this is the end — nothing extra loads.
2. Inside `window.addEventListener('load', ...)` (fires after images downloaded), if lang matches, `import('/i18n.js')` is called dynamically.
3. `i18n.js` immediately kicks off `import('/locales/${LANG}.js')` and listens for `'hero-settled'` on `window`. It also calls `fire()` via `setTimeout(0)` as a fallback in case the event already fired before i18n.js finished loading.
4. `script.js` dispatches `'hero-settled'` at 310ms + 950ms after the rAF+setTimeout (last hero element delay + animation settle ≈ 1360ms after load).
5. On `'hero-settled'` (or fallback), i18n.js awaits the locale import and calls `mod.default()`.
6. The locale function does everything: sets `lang` attr, updates hrefs, scrambles text.

---

## File specs

### i18n.js (new, regular script — only loaded for ja/id browsers)

```js
const LANG = (() => {
  const l = (navigator.language || '').split('-')[0].toLowerCase();
  return l === 'ja' || l === 'id' ? l : null;
})();

const localeReady = LANG ? import(`/locales/${LANG}.js`) : null;

let applied = false;
async function fire() {
  if (applied || !localeReady) return;
  applied = true;
  const { default: apply } = await localeReady;
  apply();
}

window.addEventListener('hero-settled', fire);
setTimeout(fire, 0); // fallback: if event fired before i18n.js loaded
```

---

### locales/utils.js (new, ES module)
Exports one function: `scrambleEl(el, target, pool, isScramblable)`.

- `duration` = clamp(target.length × 5, 500, 900)ms
- Ease-out quad progress → resolves chars left-to-right
- For each unresolved char: if `isScramblable(ch)` → random pool char, else pass through
  (preserves spaces, punctuation, Latin brand names in Japanese strings, numbers, etc.)
- Sets `el.textContent` each rAF frame; sets final value exactly on completion

---

### locales/ja.js (new, ES module)

```js
import { scrambleEl } from './utils.js';
export default function() { ... }
```

The exported function does, in order:
1. `document.documentElement.lang = 'ja'`
2. Update Cutling App Store href → `https://apps.apple.com/jp/app/cutling/id6759476314`
   - Target: `a[href*="apps.apple.com/app/cutling"]`
3. Update Cutling website href → `https://kengomatsuo.github.io/Cutling/ja/`
   - Target: `a[href*="kengomatsuo.github.io/Cutling"]`
4. Scramble all `[data-i18n]` elements, staggered 35ms each in DOM order
   - Pool: `'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'`
   - isScramblable: `/[぀-ヿ一-鿿]/.test(ch)` (hiragana + katakana + kanji)

**Strings (ja) — complete list:**
```
nav-personal          → 個人
nav-work              → 仕事
nav-school            → 学校
nav-research          → 研究
nav-contact           → 連絡
hero-alias            → 松尾賢吾
hero-sub              → アプリやツール、読む価値のあるものを作るデベロッパー兼研究者。
hero-btn-email        → メール
section-personal      → 個人
section-client-work   → クライアント案件
section-school        → 学校
section-research      → 研究
tag-web               → ウェブ
tag-mobile            → モバイル
tag-game              → ゲーム
tag-logistics-pwa     → 物流PWA
card-title-cutling    → カットリング
cutling-desc          → iOSとmacOS向けのネイティブクリップボードマネージャー。よく使うスニペットや画像を保存し、内蔵キーボードからどのアプリにでも貼り付け可能。アカウント不要。
card-link-website     → ウェブサイト →
what-desc             → 画面のストリーミング映像にテキストの翻訳をリアルタイムで重ね合わせるiOSアプリ。完全オフライン対応。
itinerary-id-desc     → インドネシア旅行者向けに作られた旅程プランナー。
card-link-visit       → サイトへ →
txe-desc              → 宅配・配送会社TXE Express向けの業務アプリ。
card-link-visit-site  → サイトへ →
polindo-desc          → PT Polindo Utama向けの社内モバイルアプリ。社員が会社のイベントや活動を閲覧・登録・管理できる。
card-link-learn-more  → 詳細を見る →
pop-desc              → Prevented Ocean Plasticの業務をデジタル化するプラットフォーム。受入・生産・サンプリング・品質管理・出荷を全役職にわたってカバー。
itinerary-gen-desc    → 旅程の作成と共有ができるWebアプリ。個人クライアント向けに制作。
learn-desc            → 動画レッスンとクイズを備えた子ども向け学習サイト。ストリークと報酬で継続を促進。
card-link-play        → プレイ →
last-minute-desc      → 学生が授業に参加し、P2Pビデオ通話ができるオンライン学習プラットフォーム。
let-me-rest-desc      → ピクセルアートのブラウザミニゲーム。モバイル版もあり。
sporocarp-desc        → 食べられるキノコと毒キノコを判別する画像分類器。Hugging Faceにライブデモあり。
card-link-live-demo   → ライブデモ →
badge-in-progress     → 制作中
badge-coming-soon     → 近日公開
img-coming-soon       → 近日公開  (card image placeholder div)
research-title        → ソーシャルメディア推薦システムにおけるクライアントベース学習とゼロ知識証明の実装
research-venue        → ビナ・ヌサンタラ大学、インドネシア タンゲラン校・IEEE
research-link         → IEEE Xploreで読む →
```

Tags not translated (brand/universal): `iOS`, `iOS & macOS`, `ML`
Links not translated (brand): `App Store →`, `GitHub →`

---

### locales/id.js (new, ES module)
Same structure as ja.js.

The exported function does:
1. `document.documentElement.lang = 'id'`
2. Update Cutling App Store href → `https://apps.apple.com/id/app/cutling/id6759476314`
3. Update Cutling website href → `https://kengomatsuo.github.io/Cutling/id/`
4. Scramble all `[data-i18n]` elements, staggered 35ms each
   - Pool: `'abcdefghijklmnopqrstuvwxyz'`
   - isScramblable: `/[a-zA-Z]/.test(ch)`

**Strings (id) — complete list:**
```
nav-personal          → Pribadi
nav-work              → Pekerjaan
nav-school            → Akademik
nav-research          → Riset
nav-contact           → Kontak
hero-alias            → Matsuo Kengo  (unchanged — romanised Japanese name)
hero-sub              → Developer & peneliti yang membangun aplikasi, alat, dan hal-hal yang layak dibaca.
hero-btn-email        → Email  (unchanged — universally understood)
section-personal      → Pribadi
section-client-work   → Pekerjaan Klien
section-school        → Akademik
section-research      → Riset
tag-web               → Web  (unchanged)
tag-mobile            → Mobile  (unchanged)
tag-game              → Game  (unchanged)
tag-logistics-pwa     → PWA Logistik
card-title-cutling    → Cutling  (unchanged)
cutling-desc          → Manajer clipboard native untuk iOS dan macOS yang menyimpan cuplikan dan gambar yang sering digunakan, lalu memungkinkan penempelan ke aplikasi mana pun lewat keyboard bawaan. Tanpa akun.
card-link-website     → Situs web →
what-desc             → Aplikasi iOS yang melakukan streaming layar dan menampilkan terjemahan di atas teks asli secara real-time, sepenuhnya offline.
itinerary-id-desc     → Perencana itinerari perjalanan yang dibuat untuk wisatawan Indonesia.
card-link-visit       → Kunjungi →
txe-desc              → Aplikasi operasional untuk TXE Express, perusahaan kurir dan pengiriman.
card-link-visit-site  → Kunjungi situs →
polindo-desc          → Aplikasi mobile internal untuk PT Polindo Utama — karyawan dapat menelusuri, mendaftar, dan memantau kegiatan serta acara perusahaan.
card-link-learn-more  → Pelajari lebih →
pop-desc              → Platform operasional untuk Prevented Ocean Plastic — mencakup penerimaan, produksi, pengambilan sampel, QC, dan pengiriman untuk semua peran.
itinerary-gen-desc    → Aplikasi web untuk membuat dan berbagi itinerari perjalanan, dibuat untuk klien pribadi.
learn-desc            → Situs belajar anak-anak dengan pelajaran video dan kuis, dilengkapi streak dan hadiah untuk mendorong kembali.
card-link-play        → Mainkan →
last-minute-desc      → Platform kursus online tempat siswa dapat mengikuti kelas dan melakukan video call peer-to-peer.
let-me-rest-desc      → Minigame browser pixel art, tersedia juga untuk mobile.
sporocarp-desc        → Pengklasifikasi gambar yang membedakan jamur yang dapat dimakan dari yang beracun, dengan demo langsung di Hugging Face.
card-link-live-demo   → Demo langsung →
badge-in-progress     → Sedang Dikerjakan
badge-coming-soon     → Segera Hadir
img-coming-soon       → Segera Hadir
research-title        → Implementasi Client-Based Learning dan Zero-Knowledge Proof dalam Sistem Rekomendasi Media Sosial
research-venue        → Universitas Bina Nusantara, Tangerang, Indonesia · IEEE
research-link         → Baca di IEEE Xplore →
```

---

## Changes to existing files

### index.html — new data-i18n attributes to add
- `<p class="hero-alias">` → add `data-i18n="hero-alias"`
- `<a class="hero-btn" href="mailto:...">` Email button text → wrap text in `<span data-i18n="hero-btn-email">Email</span>` (can't use textContent on element with SVG child)
- `<h3 class="card-title">Cutling</h3>` → add `data-i18n="card-title-cutling"`
- `<div class="card-image card-image--text placeholder">Coming Soon</div>` → add `data-i18n="img-coming-soon"`
- All `<span class="card-tag">` elements → add appropriate data-i18n keys
- All `<a class="card-link">` action links → add appropriate data-i18n keys
- `<a href="https://ieeexplore...">Read on IEEE Xplore →</a>` → add `data-i18n="research-link"`
- No `<script src="/i18n.js">` tag — i18n.js is loaded dynamically from script.js

### script.js
**Remove** these blocks entirely:
- `DETECTED_LANG` const
- `localePromise` const
- `SCRAMBLE_POOLS` const
- `scrambleEl()` function
- `applyTranslations()` function
- `setTimeout(applyTranslations, 310 + 950)` line

**Add at top** (~3 lines):
```js
const LANG = (() => {
  const l = (navigator.language || '').split('-')[0].toLowerCase();
  return l === 'ja' || l === 'id' ? l : null;
})();
```

**Add inside `window.addEventListener('load', ...)`** (right after loading overlay teardown):
```js
if (LANG) import('/i18n.js');
```

**Replace** removed setTimeout line with:
```js
setTimeout(() => window.dispatchEvent(new CustomEvent('hero-settled')), 310 + 950);
```

### locales/ja.json — DELETE
### locales/id.json — DELETE

---

## data-i18n key reference (complete)

| Key | English text | Element type |
|-----|-------------|--------------|
| hero-alias | Matsuo Kengo | p.hero-alias |
| hero-sub | Developer & researcher… | p.hero-sub |
| hero-btn-email | Email | span inside a.hero-btn |
| nav-personal | Personal | a in nav |
| nav-work | Work | a in nav |
| nav-school | School | a in nav |
| nav-research | Research | a in nav |
| nav-contact | Contact | a in nav |
| section-personal | Personal | h2.section-title |
| section-client-work | Client Work | h2.section-title |
| section-school | School | h2.section-title |
| section-research | Research | h2.section-title |
| tag-web | Web | span.card-tag |
| tag-mobile | Mobile | span.card-tag |
| tag-game | Game | span.card-tag |
| tag-logistics-pwa | Logistics PWA | span.card-tag |
| card-title-cutling | Cutling | h3.card-title |
| cutling-desc | Native clipboard… | p.card-desc |
| card-link-website | Website → | a.card-link |
| what-desc | iOS app that streams… | p.card-desc |
| badge-in-progress | In Progress | span.card-badge (×2) |
| badge-coming-soon | Coming soon | span.card-link--muted |
| img-coming-soon | Coming Soon | div.card-image--text |
| itinerary-id-desc | Travel itinerary… | p.card-desc |
| card-link-visit | Visit → | a.card-link |
| txe-desc | Operations app… | p.card-desc |
| card-link-visit-site | Visit site → | a.card-link |
| polindo-desc | Internal mobile app… | p.card-desc |
| card-link-learn-more | Learn more → | a.card-link (×2) |
| pop-desc | Paper-to-digital… | p.card-desc |
| itinerary-gen-desc | Web app for building… | p.card-desc |
| learn-desc | Kids learning site… | p.card-desc |
| card-link-play | Play → | a.card-link |
| last-minute-desc | Online course… | p.card-desc |
| let-me-rest-desc | Pixel-art browser… | p.card-desc |
| sporocarp-desc | Image classifier… | p.card-desc |
| card-link-live-demo | Live demo → | a.card-link |
| research-title | Client-Based Learning… | h3.pub-title |
| research-venue | Bina Nusantara… | p.pub-venue |
| research-link | Read on IEEE Xplore → | a.card-link |

---

## Order of implementation
1. Edit `index.html` — add all remaining data-i18n attributes (hero-alias, hero-btn-email span, card-title-cutling, img-coming-soon, card tags, card links)
2. Edit `script.js` — strip old locale code, add LANG detection, dynamic import, event dispatch
3. Create `locales/utils.js`
4. Create `locales/ja.js`
5. Create `locales/id.js`
6. Create `i18n.js`
7. Delete `locales/ja.json` and `locales/id.json`
