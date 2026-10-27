import {
  KOJIN_IME,
  SHIGOTO_IME,
  GAKKOU_IME,
  KENKYUU_IME,
  SHIKAKU_IME,
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
  "nav-certifications": SHIKAKU_IME,
  "nav-contact": RENRAKU_IME,
  "section-personal": KOJIN_IME,
  "section-client-work": CLIENT_WORK_IME,
  "section-school": GAKKOU_IME,
  "section-research": KENKYUU_IME,
  "section-certifications": SHIKAKU_IME,
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
  "nav-certifications": "資格",
  "nav-contact": "連絡",
  "hero-alias": "松尾賢吾",
  "hero-sub": "アプリやツール、読む価値のあるものを作るデベロッパー兼研究者。",
  "hero-btn-email": "メール",
  "section-personal": "個人",
  "section-client-work": "クライアント案件",
  "section-school": "学校",
  "section-research": "研究",
  "section-certifications": "資格",
  "tag-cloud": "クラウド",
  "tag-language": "語学",
  "aca-cloud-engineer-desc":
    "Alibaba Cloudのアソシエイト級認定。2025年5月にスコア72で合格、2027年5月まで有効。",
  "aws-compute-desc":
    "AWS Educateのトレーニングバッジ。コンピューティングサービスの基礎コースを修了。",
  "aws-cloud101-desc":
    "AWS Educateのトレーニングバッジ。クラウドコンピューティングの入門コースを修了。",
  "ielts-desc":
    "アカデミック・モジュールでオーバーオールバンドスコア8.0（CEFR C1）。リスニング8.0、リーディング8.5、ライティング6.5、スピーキング8.0。",
  "card-link-credly": "Credlyで確認 →",
  "tag-web": "ウェブ",
  "tag-mobile": "モバイル",
  "tag-game": "ゲーム",
  "tag-logistics-pwa": "物流PWA",
  "tag-desktop": "デスクトップ",
  "tag-pos": "POSプラットフォーム",
  "card-title-cutling": "カットリング",
  "cutling-desc":
    "iPhone・iPad・Mac向けのクリップボード管理アプリ。保存したスニペットや画像を、どのアプリにも貼り付けられる。",
  "card-link-website": "ウェブサイト →",
  "card-link-app-store": "App Store →",
  "what-desc":
    "画面のストリーミング映像にテキストの翻訳をリアルタイムで重ね合わせるiOSアプリ。完全オフライン対応。",
  "badge-in-progress": "制作中",
  "badge-pilot": "パイロット版",
  "badge-coming-soon": "近日公開",
  "img-coming-soon": "近日公開",
  "itinerary-id-desc": "インドネシア旅行者向けに作られた旅程プランナー。",
  "saf-desc":
    "講義スライドやPDFから、要約とAnkiのフラッシュカードを作るローカルAIツール。ネット接続もAPIキーも要らない。",
  "stya-desc":
    "カフェやレストラン向けのホワイトラベルPOS。スマートフォンからタブレット、据え置き端末まで、同じ一つのアプリで動く。",
  "card-link-visit": "サイトへ →",
  "courier-desc":
    "宅配会社の業務アプリ。荷物の追跡、配送状況の管理、売上ダッシュボードを備える。",
  "card-link-visit-site": "サイトへ →",
  "events-desc":
    "社内イベントの閲覧、参加登録、参加予定の確認ができる社員向けアプリ。",
  "card-link-learn-more": "詳細を見る →",
  "recycling-desc":
    "リサイクル工場の紙の業務を電子化するアプリ。原料の受け入れから出荷までを扱う。",
  "itinerary-gen-desc":
    "お客様向けの旅程を作成・共有・書き出しできる社内向けWebアプリ。",
  "warehouse-ops-desc":
    "自転車パーツのネット販売店向けの倉庫アプリ。配送ラベルがそのままピッキングリストになり、在庫の増減はすべて記録される。",
  "mahjong-booking-desc":
    "麻雀店の予約サイト。卓を1時間単位で押さえられる。",
  "erp-desc":
    "中国語教室向けの基幹システム。申込、時間割、支払い、出欠、成績表までを一つで管理する。",
  "parts-desc":
    "バイク用品・整備店向けの管理システム。在庫、売上、仕入れ、税務レポートを扱う。",
  "emergency-desc":
    "日本の防災担当者が地図上で災害対応を調整するためのダッシュボードのプロトタイプ。",
  "leaderboard-desc":
    "麻雀クラブの成績表。スタッフが対局のあとに入力し、誰でも閲覧できる。",
  "undirect-desc":
    "クリックを横取りするページを止める Safari 機能拡張。ページが飛ばそうとしたサイトも一覧で確認できる。",
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
    'a[href*="cutling.matsuokengo.com"]',
  );
  if (cutlingSite)
    cutlingSite.href = "https://cutling.matsuokengo.com/ja/";

  const els = Array.from(document.querySelectorAll("[data-i18n]"))
    .map((el, i) => ({ el, i, target: STRINGS[el.dataset.i18n] }))
    .filter(({ el, target }) => target && target !== el.textContent);

  els.forEach(({ el, i, target }) => {
    const imeFrames = IME_MAP[el.dataset.i18n] ?? null;
    setTimeout(() => scrambleEl(el, target, imeFrames), i * 35);
  });
}
