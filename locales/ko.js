import {
  GAEIN_IME,
  EOPMU_IME,
  HAKGYO_IME,
  YEONGU_IME,
  YEOLLAK_IME,
  CLIENT_WORK_KO_IME,
  MATSUO_KENGO_KO_IME,
  HERO_SUB_KO_IME,
} from "./ko-ime.js";

const CURSOR = "|";
const DELETE_MIN = 280;
const DELETE_MAX = 320;
const TYPE_MIN = 500;
const TYPE_MAX = 1000;
const HANGUL_KEYSTROKE_MS = 35;   // base ms per jamo keypress
const HANGUL_BOUNDARY_MS = 30;    // pause between words

const IME_MAP = {
  "nav-personal": GAEIN_IME,
  "nav-work": EOPMU_IME,
  "nav-school": HAKGYO_IME,
  "nav-research": YEONGU_IME,
  "nav-contact": YEOLLAK_IME,
  "section-personal": GAEIN_IME,
  "section-client-work": CLIENT_WORK_KO_IME,
  "section-school": HAKGYO_IME,
  "section-research": YEONGU_IME,
  "hero-alias": MATSUO_KENGO_KO_IME,
  "hero-sub": HERO_SUB_KO_IME,
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

  function hangulDelay(i) {
    const [, comp] = imeFrames[i];
    const nextComp = i + 1 < imeFrames.length ? imeFrames[i + 1][1] : "";
    // Word/syllable boundary — brief natural pause before next block
    if (comp === "" && nextComp !== "")
      return HANGUL_BOUNDARY_MS + Math.random() * HANGUL_BOUNDARY_MS;
    // Regular jamo keystroke
    return HANGUL_KEYSTROKE_MS + Math.random() * HANGUL_KEYSTROKE_MS;
  }

  function startTyping() {
    if (imeFrames) {
      let fi = 0;
      function imeStep() {
        if (fi >= imeFrames.length) {
          el.textContent = target;
          return;
        }
        const [done, composing] = imeFrames[fi];
        show(done, composing);
        setTimeout(imeStep, hangulDelay(fi++));
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
  "nav-personal": "개인",
  "nav-work": "업무",
  "nav-school": "학교",
  "nav-research": "연구",
  "nav-contact": "연락",
  "hero-alias": "마쓰오 겐고",
  "hero-sub": "앱, 툴, 읽을 가치가 있는 것들을 만드는 개발자 겸 연구자.",
  "hero-btn-email": "이메일",
  "section-personal": "개인",
  "section-client-work": "클라이언트 작업",
  "section-school": "학교",
  "section-research": "연구",
  "tag-web": "웹",
  "tag-mobile": "모바일",
  "tag-game": "게임",
  "tag-logistics-pwa": "물류 PWA",
  "card-title-cutling": "컷링",
  "cutling-desc":
    "iOS와 macOS용 네이티브 클립보드 매니저. 자주 쓰는 스니펫과 이미지를 저장하고, 내장 키보드에서 어느 앱에나 붙여넣기 가능. 계정 불필요.",
  "card-link-website": "웹사이트 →",
  "what-desc":
    "화면 스트리밍 영상에 텍스트 번역을 실시간으로 덮어씌우는 iOS 앱. 완전 오프라인 지원.",
  "badge-in-progress": "제작 중",
  "badge-coming-soon": "출시 예정",
  "img-coming-soon": "출시 예정",
  "itinerary-id-desc": "인도네시아 여행자를 위한 여행 일정 플래너.",
  "card-link-visit": "사이트 방문 →",
  "txe-desc": "배송 회사 TXE Express를 위한 업무 앱.",
  "card-link-visit-site": "사이트 방문 →",
  "polindo-desc":
    "PT Polindo Utama를 위한 사내 모바일 앱. 직원들이 회사 이벤트와 활동을 조회, 등록, 관리할 수 있음.",
  "card-link-learn-more": "자세히 보기 →",
  "pop-desc":
    "Prevented Ocean Plastic의 업무를 디지털화하는 플랫폼. 입고·생산·샘플링·품질 관리·출하를 전 직급에 걸쳐 커버.",
  "itinerary-gen-desc":
    "여행 일정을 만들고 공유할 수 있는 웹 앱. 개인 클라이언트를 위해 제작.",
  "learn-desc":
    "동영상 강의와 퀴즈를 갖춘 어린이용 학습 사이트. 스트릭과 보상으로 지속을 유도.",
  "card-link-play": "플레이 →",
  "last-minute-desc":
    "학생들이 수업에 참여하고 P2P 화상통화를 할 수 있는 온라인 학습 플랫폼.",
  "let-me-rest-desc": "픽셀 아트 브라우저 미니게임. 모바일 버전도 있음.",
  "sporocarp-desc":
    "식용 버섯과 독버섯을 구별하는 이미지 분류기. Hugging Face에 라이브 데모 있음.",
  "card-link-live-demo": "라이브 데모 →",
  "research-link": "IEEE Xplore에서 읽기 →",
};

export default function () {
  document.documentElement.lang = "ko";

  const appStore = document.querySelector(
    'a[href*="apps.apple.com/app/cutling"]',
  );
  if (appStore)
    appStore.href = "https://apps.apple.com/kr/app/cutling/id6759476314";

  const cutlingSite = document.querySelector(
    'a[href*="kengomatsuo.github.io/Cutling"]',
  );
  if (cutlingSite)
    cutlingSite.href = "https://kengomatsuo.github.io/Cutling/";

  const els = Array.from(document.querySelectorAll("[data-i18n]"))
    .map((el, i) => ({ el, i, target: STRINGS[el.dataset.i18n] }))
    .filter(({ el, target }) => target && target !== el.textContent);

  els.forEach(({ el, i, target }) => {
    const imeFrames = IME_MAP[el.dataset.i18n] ?? null;
    setTimeout(() => scrambleEl(el, target, imeFrames), i * 35);
  });
}
