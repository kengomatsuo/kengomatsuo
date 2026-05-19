function scrambleEl(el, target, isScramblable) {
  const phase1Start = performance.now();
  const source = el.textContent.trim();
  const pool = [...new Set(target)];
  const phase1Duration = Math.min(500, Math.max(250, source.length * 8));
  const phase2StartTime = phase1Start + phase1Duration * -0.2;
  const phase2Duration = Math.min(900, Math.max(500, target.length * 5));
  const noise = Array.from(
    { length: Math.max(source.length, target.length) },
    () => pool[Math.floor(Math.random() * pool.length)],
  );

  function frame(now) {
    const t1 = Math.min(1, (now - phase1Start) / phase1Duration);
    const noiseProgress = (1 - (1 - t1) * (1 - t1)) * source.length;
    let out = "";

    if (now < phase2StartTime) {
      for (let i = 0; i < source.length; i++) {
        if (i < noiseProgress) {
          noise[i] = pool[Math.floor(Math.random() * pool.length)];
          out += noise[i];
        } else {
          out += source[i];
        }
      }
      el.textContent = out;
      requestAnimationFrame(frame);
    } else {
      const t = Math.min(1, (now - phase2StartTime) / phase2Duration);
      const eased = 1 - (1 - t) * (1 - t);
      const lockProgress = eased * target.length;
      const resolved = Math.floor(lockProgress);
      const currentLength = Math.max(
        resolved,
        Math.round(source.length + (target.length - source.length) * eased),
      );
      for (let i = 0; i < currentLength; i++) {
        if (i < resolved) {
          out += target[i];
        } else if (i < noiseProgress) {
          const spinProb = Math.min(1, (i - lockProgress) / 2);
          if (Math.random() < spinProb)
            noise[i] = pool[Math.floor(Math.random() * pool.length)];
          out += noise[i];
        } else {
          out += i < source.length ? source[i] : noise[i];
        }
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
  }

  requestAnimationFrame(frame);
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

const isScramblable = (ch) => /[぀-ヿ一-鿿]/.test(ch);

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
    setTimeout(() => scrambleEl(el, target, isScramblable), i * 35);
  });
}
