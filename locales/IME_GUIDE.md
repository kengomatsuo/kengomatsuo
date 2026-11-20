# Japanese IME Animation Guide

Animated transitions for Japanese strings simulate macOS Live Conversion: romaji keystrokes accumulate as hiragana in a composing area, then the IME auto-converts to kanji/katakana without a space press. The user glances at the candidate, then confirms with enter.

## Files

- `locales/ja-ime.js` — all IME frame arrays, one export per string
- `locales/ja.js` — imports frames, maps them to `data-i18n` keys via `IME_MAP`, runs the animation

## Frame format

Each frame is `[confirmed, composing]`:

- `confirmed` — text already committed (normal style)
- `composing` — text currently being typed (underlined, IME pending area)

```js
["", "m"],            // typing 'm' — nothing confirmed yet
["", "ま"],           // 'ma' complete → mora resolves to ま
["", "まつ"],         // 'tsu' complete → つ
["", "まつお"],       // 'o' → お
["", "松尾"],         // Live Conversion fires — candidate appears (still underlined)
["松尾", ""],         // enter → confirmed, composing cleared
["松尾", "k"],        // start next word
["松尾", "けんご"],   // ...
["松尾", "賢吾"],     // Live Conversion
["松尾賢吾", ""],     // enter → confirm
```

### Rules

- **Romaji partials** (`"sh"`, `"ts"`, `"けn"`) appear as-is until the mora is complete
- **`n` before a consonant** resolves to `ん` in the same frame the consonant is typed: `"けn"` → `"けんg"` (not a separate `"けん"` frame)
- **Live Conversion** fires as soon as the IME would recognise the word — for common words this is right after the final mora, for well-known proper nouns (surnames, place names) it may fire before the full compound is typed
- **Confirm frame** (`["word", ""]`) always follows the candidate frame
- **Punctuation** (、。) goes directly to confirmed with no composing step

### Double consonants (っ)

Type the consonant twice. The first becomes っ, the second starts the next mora:

```js
["", "がk"],    // first k
["", "がっk"],  // second k → っ + k pending
["", "がっこ"], // 'o' completes こ
```

## Adding a new string

1. Work out the romaji keystroke sequence
2. Trace each keypress to its on-screen state as `[confirmed, composing]`
3. Export the array from `ja-ime.js`
4. Import it in `ja.js` and add it to `IME_MAP`

### When does Live Conversion fire?

- **Single common words**: after the final mora (よむ → 読む, かち → 価値)
- **Katakana loanwords**: after the full word (くらいあんと → クライアント)
- **Common surnames/place names**: as soon as the surname is complete, before the given name (まつお → 松尾, then けんご → 賢吾 separately)
- **Compound words**: may convert each component separately (クライアント then 案件)

When unsure, type the string on a real macOS Japanese IME and observe where conversion happens.

## Timing constants (in `ja.js`)

| Constant | Default | Controls |
|---|---|---|
| `IME_KEYSTROKE_MS` | 35ms | Base delay for partial romaji keystrokes |
| `IME_MORA_MS` | 28ms | Delay after completing a mora (kana) |
| `IME_CANDIDATE_MS` | 70ms | Pause while kanji candidate is shown |
| `IME_BOUNDARY_MS` | 30ms | Gap after confirming, before next word |

All delays have a `×(0–1)` random component added for natural variance.

## Generic strings (no IME frames)

Strings not in `IME_MAP` use a simple char-by-char typewriter effect controlled by `TYPE_MIN`/`TYPE_MAX` (total duration budget divided evenly across characters). This is intentional for short strings where the IME simulation would be invisible.
