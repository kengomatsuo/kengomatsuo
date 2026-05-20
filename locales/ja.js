import {
  KOJIN_IME,
  SHIGOTO_IME,
  GAKKOU_IME,
  KENKYUU_IME,
  RENRAKU_IME,
  CLIENT_WORK_IME,
  MATSUO_KENGO_IME,
  HERO_SUB_IME,
} from "./ja-ime.js";

const CURSOR = "|";
const DELETE_MIN = 280;
const DELETE_MAX = 320;
const TYPE_MIN = 500;
const TYPE_MAX = 1000;
const IME_KEYSTROKE_MS = 35; // base ms per keypress
const IME_MORA_MS = 28; // completing a mora (fast burst)
const IME_CANDIDATE_MS = 70; // pause while kanji candidate shows
const IME_BOUNDARY_MS = 30; // gap between confirmed words

const IME_MAP = {
  "nav-personal": KOJIN_IME,
  "nav-work": SHIGOTO_IME,
  "nav-school": GAKKOU_IME,
  "nav-research": KENKYUU_IME,
  "nav-contact": RENRAKU_IME,
  "section-personal": KOJIN_IME,
  "section-client-work": CLIENT_WORK_IME,
  "section-school": GAKKOU_IME,
  "section-research": KENKYUU_IME,
  "hero-alias": MATSUO_KENGO_IME,
  "hero-sub": HERO_SUB_IME,
};

function scrambleEl(el, target, imeFrames) {
  const source = el.textContent.trim();
  const DELETE_MS =
    (DELETE_MIN + Math.random() * (DELETE_MAX - DELETE_MIN)) /
    Math.max(1, source.length);
  const TYPE_MS =
    (TYPE_MIN + Math.random() * (TYPE_MAX - TYPE_MIN)) /
    Math.max(1, target.length);

  el.style.position = "relative";
  const cur = document.createElement("span");
  cur.setAttribute("aria-hidden", "true");
  cur.style.cssText = "position:absolute;user-select:none;pointer-events:none";
  cur.textContent = CURSOR;

  function show(done, composing) {
    el.textContent = done;
    if (composing) {
      const span = document.createElement("span");
      span.style.cssText =
        "text-decoration:underline;text-underline-offset:3px";
      span.textContent = composing;
      el.appendChild(span);
    }
    el.appendChild(cur);
  }

  function startTyping() {
    if (imeFrames) {
      const hasKanji = (s) => /[一-鿿]/.test(s);
      const hasKatakana = (s) => /[゠-ヿ]/.test(s);
      const endsRomaji = (s) => /[a-z]$/.test(s);

      function imeDelay(i) {
        const [, comp] = imeFrames[i];
        const nextComp = i + 1 < imeFrames.length ? imeFrames[i + 1][1] : "";
        // Kanji candidate — user reads before confirming
        if (hasKanji(comp))
          return IME_CANDIDATE_MS + Math.random() * IME_CANDIDATE_MS;
        // Katakana candidate — familiar loanword, confirm faster
        if (hasKatakana(comp))
          return IME_CANDIDATE_MS * 0.6 + Math.random() * IME_CANDIDATE_MS * 0.4;
        // Word boundary — brief pause before starting next word
        if (comp === "" && nextComp !== "")
          return IME_BOUNDARY_MS + Math.random() * IME_BOUNDARY_MS;
        // Completing a mora (ends in kana) — fast muscle-memory burst
        if (!endsRomaji(comp) && comp !== "")
          return IME_MORA_MS + Math.random() * IME_MORA_MS;
        // Partial romaji mid-sequence
        return IME_KEYSTROKE_MS + Math.random() * IME_KEYSTROKE_MS;
      }

      let fi = 0;
      function imeStep() {
        if (fi >= imeFrames.length) {
          el.textContent = target;
          return;
        }
        const [done, composing] = imeFrames[fi];
        show(done, composing);
        setTimeout(imeStep, imeDelay(fi++));
      }
      imeStep();
    } else {
      let typed = [];
      function type() {
        if (typed.length < target.length) {
          typed.push(target[typed.length]);
          show(typed.join(""), "");
          setTimeout(type, TYPE_MS * (0.3 + Math.random() * 1.2));
        } else {
          el.textContent = target;
        }
      }
      type();
    }
  }

  let remaining = [...source];

  function del() {
    if (remaining.length > 0) {
      remaining.pop();
      show(remaining.join(""), "");
      setTimeout(del, DELETE_MS);
    } else {
      startTyping();
    }
  }

  show(source, "");
  setTimeout(del, DELETE_MS);
}

const STRINGS = {
  "nav-personal": "個人",
  "nav-work": "仕事",
  "nav-school": "学校",
  "nav-research": "研究",
  "nav-contact": "連絡",
  "hero-alias": "松尾賢吾",
  "hero-sub": "アプリやツール、読む価値のあるものを作るデベロッパー兼研究者。",
  "hero-btn-email": "メール",
  "section-personal": "個人",
  "section-client-work": "クライアント案件",
  "section-school": "学校",
  "section-research": "研究",
  "tag-web": "ウェブ",
  "tag-mobile": "モバイル",
  "tag-game": "ゲーム",
  "tag-logistics-pwa": "物流PWA",
  "card-title-cutling": "カットリング",
  "cutling-desc":
    "iOSとmacOS向けのネイティブクリップボードマネージャー。よく使うスニペットや画像を保存し、内蔵キーボードからどのアプリにでも貼り付け可能。アカウント不要。",
  "card-link-website": "ウェブサイト →",
  "what-desc":
    "画面のストリーミング映像にテキストの翻訳をリアルタイムで重ね合わせるiOSアプリ。完全オフライン対応。",
  "badge-in-progress": "制作中",
  "badge-coming-soon": "近日公開",
  "img-coming-soon": "近日公開",
  "itinerary-id-desc": "インドネシア旅行者向けに作られた旅程プランナー。",
  "card-link-visit": "サイトへ →",
  "txe-desc": "宅配・配送会社TXE Express向けの業務アプリ。",
  "card-link-visit-site": "サイトへ →",
  "polindo-desc":
    "PT Polindo Utama向けの社内モバイルアプリ。社員が会社のイベントや活動を閲覧・登録・管理できる。",
  "card-link-learn-more": "詳細を見る →",
  "pop-desc":
    "Prevented Ocean Plasticの業務をデジタル化するプラットフォーム。受入・生産・サンプリング・品質管理・出荷を全役職にわたってカバー。",
  "itinerary-gen-desc":
    "旅程の作成と共有ができるWebアプリ。個人クライアント向けに制作。",
  "learn-desc":
    "動画レッスンとクイズを備えた子ども向け学習サイト。ストリークと報酬で継続を促進。",
  "card-link-play": "プレイ →",
  "last-minute-desc":
    "学生が授業に参加し、P2Pビデオ通話ができるオンライン学習プラットフォーム。",
  "let-me-rest-desc": "ピクセルアートのブラウザミニゲーム。モバイル版もあり。",
  "sporocarp-desc":
    "食べられるキノコと毒キノコを判別する画像分類器。Hugging Faceにライブデモあり。",
  "card-link-live-demo": "ライブデモ →",
  "research-link": "IEEE Xploreで読む →",
};

export default function () {
  document.documentElement.lang = "ja";

  const appStore = document.querySelector(
    'a[href*="apps.apple.com/app/cutling"]',
  );
  if (appStore)
    appStore.href = "https://apps.apple.com/jp/app/cutling/id6759476314";

  const cutlingSite = document.querySelector(
    'a[href*="kengomatsuo.github.io/Cutling"]',
  );
  if (cutlingSite)
    cutlingSite.href = "https://kengomatsuo.github.io/Cutling/ja/";

  const els = Array.from(document.querySelectorAll("[data-i18n]"))
    .map((el, i) => ({ el, i, target: STRINGS[el.dataset.i18n] }))
    .filter(({ el, target }) => target && target !== el.textContent);

  els.forEach(({ el, i, target }) => {
    const imeFrames = IME_MAP[el.dataset.i18n] ?? null;
    setTimeout(() => scrambleEl(el, target, imeFrames), i * 35);
  });
}
