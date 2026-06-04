/* matsuokengo.com UI kit — content + localisation data.
   Mirrors the real index.html copy and locales/ja.js strings. */
window.MK_DATA = {
  en: {
    nav: { personal: "Personal", work: "Work", school: "School", research: "Research", contact: "Contact" },
    hero: {
      name: "Kenneth Johannes Fang",
      alias: "Matsuo Kengo",
      sub: "Developer & researcher building apps, tools, and things worth reading.",
      github: "GitHub", email: "Email",
    },
    sections: { personal: "Personal", work: "Client Work", school: "School", research: "Research" },
    links: { visit: "Visit →", website: "Website →", learnMore: "Learn more →", play: "Play →", liveDemo: "Live demo →", appStore: "App Store →", visitSite: "Visit site →", github: "GitHub →", comingSoon: "Coming soon" },
    badge: { inProgress: "In Progress", comingSoon: "Coming Soon" },
    research: {
      title: "Client-Based Learning and Zero-Knowledge Proof Implementation in Social Media Recommendation Systems",
      authors: "Kenneth Johannes Fang · Bryan Archie · Anderies Anderies · Andry Chowanda",
      venue: "Bina Nusantara University, Tangerang, Indonesia · IEEE",
      link: "Read on IEEE Xplore →",
    },
  },
  ja: {
    nav: { personal: "個人", work: "仕事", school: "学校", research: "研究", contact: "連絡" },
    hero: {
      name: "Kenneth Johannes Fang",
      alias: "松尾賢吾",
      sub: "アプリやツール、読む価値のあるものを作るデベロッパー兼研究者。",
      github: "GitHub", email: "メール",
    },
    sections: { personal: "個人", work: "クライアント案件", school: "学校", research: "研究" },
    links: { visit: "サイトへ →", website: "ウェブサイト →", learnMore: "詳細を見る →", play: "プレイ →", liveDemo: "ライブデモ →", appStore: "App Store →", visitSite: "サイトへ →", github: "GitHub →", comingSoon: "近日公開" },
    badge: { inProgress: "制作中", comingSoon: "近日公開" },
    research: {
      title: "Client-Based Learning and Zero-Knowledge Proof Implementation in Social Media Recommendation Systems",
      authors: "Kenneth Johannes Fang · Bryan Archie · Anderies Anderies · Andry Chowanda",
      venue: "Bina Nusantara University, Tangerang, Indonesia · IEEE",
      link: "IEEE Xploreで読む →",
    },
  },

  // [confirmed, composing] frames simulating macOS Live Conversion
  ime: {
    alias: [["","m"],["","ま"],["","まつ"],["","まつお"],["","松尾"],["松尾",""],["松尾","k"],["松尾","け"],["松尾","けん"],["松尾","けんご"],["松尾","賢吾"],["松尾賢吾",""]],
    "sections.work": [["","k"],["","ク"],["","クラ"],["","クライ"],["","クライア"],["","クライアン"],["","クライアント"],["クライアント",""],["クライアント","a"],["クライアント","あ"],["クライアント","あん"],["クライアント","あんけん"],["クライアント","案件"],["クライアント案件",""]],
  },

  projects: {
    personal: [
      { featured:true, icon:"cutling-icon.png", iconDark:"cutling-dark-mode-icon.png", tag:"iOS & macOS", title:"Cutling",
        desc:"Native clipboard manager for iOS and macOS that saves your most-used snippets and images so you can paste them into any app through a built-in keyboard, no account needed.",
        descJa:"iOSとmacOS向けのネイティブクリップボードマネージャー。よく使うスニペットや画像を保存し、内蔵キーボードからどのアプリにでも貼り付け可能。アカウント不要。",
        actions:[{label:"appStore",accent:true},{label:"website",muted:true}] },
      { placeholder:"comingSoon", tag:"iOS", badge:"inProgress", title:"What?",
        desc:"iOS app that streams your screen and overlays translations on top of the original text, fully offline.",
        descJa:"画面のストリーミング映像にテキストの翻訳をリアルタイムで重ね合わせるiOSアプリ。完全オフライン対応。",
        actions:[{label:"comingSoon",muted:true,static:true}] },
      { icon:"itinerary-id-icon.png", iconDark:"itinerary-id-dark-mode-icon.png", tag:"Web", title:"Itinerary.id",
        desc:"Travel itinerary planner built for Indonesian travelers.",
        descJa:"インドネシア旅行者向けに作られた旅程プランナー。",
        actions:[{label:"visit",accent:true}] },
    ],
    work: [
      { icon:"txeexpress-icon.png", iconDark:"txeexpress-dark-mode-icon.png", tag:"Logistics PWA", title:"TXE Express",
        desc:"Operations app for TXE Express, a courier and delivery company.",
        descJa:"宅配・配送会社TXE Express向けの業務アプリ。",
        actions:[{label:"visitSite",accent:true}] },
      { icon:"polindo-logo.png", iconDark:"polindo-dark-mode-logo.png", tag:"Mobile", title:"PolindoHC",
        desc:"Internal mobile app for PT Polindo Utama — employees browse, register for, and track upcoming company activities and events.",
        descJa:"PT Polindo Utama向けの社内モバイルアプリ。社員が会社のイベントや活動を閲覧・登録・管理できる。",
        actions:[{label:"learnMore",accent:true}] },
      { icon:"prevented-ocean-plastic-logo.png", iconDark:"prevented-ocean-plastic-dark-mode-logo.png", tag:"Mobile", badge:"inProgress", title:"POP App",
        desc:"Paper-to-digital operations platform for Prevented Ocean Plastic — covering intake, production, sampling, QC, and shipment across all roles.",
        descJa:"Prevented Ocean Plasticの業務をデジタル化するプラットフォーム。受入・生産・サンプリング・品質管理・出荷を全役職にわたってカバー。",
        actions:[{label:"learnMore",accent:true}] },
      { icon:"eralink-indonesia-logo.png", tag:"Web", title:"Itinerary Generator",
        desc:"Web app for building and sharing travel itineraries, made for a private client.",
        descJa:"旅程の作成と共有ができるWebアプリ。個人クライアント向けに制作。",
        actions:[{label:"learnMore",accent:true}] },
    ],
    school: [
      { tag:"Web", title:"Learn!", desc:"Kids learning site with video lessons and quizzes, with streaks and rewards to keep them coming back.",
        descJa:"動画レッスンとクイズを備えた子ども向け学習サイト。ストリークと報酬で継続を促進。", actions:[{label:"visit",accent:true}] },
      { tag:"Web", title:"Last Minute", desc:"Online course platform where students can attend classes and peer-to-peer video call.",
        descJa:"学生が授業に参加し、P2Pビデオ通話ができるオンライン学習プラットフォーム。", actions:[{label:"github",muted:true}] },
      { tag:"Game", title:"Let Me Rest", desc:"Pixel-art browser minigame, also packaged for mobile.",
        descJa:"ピクセルアートのブラウザミニゲーム。モバイル版もあり。", actions:[{label:"play",accent:true}] },
      { tag:"ML", title:"Sporocarp Classifier", desc:"Image classifier that tells edible mushrooms from poisonous ones, with a live demo on Hugging Face.",
        descJa:"食べられるキノコと毒キノコを判別する画像分類器。Hugging Faceにライブデモあり。", actions:[{label:"liveDemo",accent:true},{label:"github",muted:true}] },
    ],
  },

  // text-tile fallback colors (match the site's onerror swap)
  fallback: { "Cutling":["#4ECBA3","#1a1a1a"], "Itinerary.id":["#3D5A6C","#fff"], "TXE Express":["#023B72","#fff"], "PolindoHC":["#214384","#f3b335"], "POP App":["#00B4D8","#fff"], "Itinerary Generator":["#FAFAFA","#09090B"] },
};
