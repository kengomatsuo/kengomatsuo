const PHASE1_MIN = 250;
const PHASE1_MAX = 500;
const PHASE1_CHAR_MS = 8;
const PHASE2_OVERLAP = 1;
const PHASE2_MIN = 500;
const PHASE2_MAX = 900;
const PHASE2_CHAR_MS = 5;

function scrambleEl(el, target, isScramblable) {
  const phase1Start = performance.now();
  const source = el.textContent.trim();
  const pool = [...new Set(target)];
  const phase1Duration = Math.min(
    PHASE1_MAX,
    Math.max(PHASE1_MIN, source.length * PHASE1_CHAR_MS),
  );
  const phase2StartTime = phase1Start + phase1Duration * PHASE2_OVERLAP;
  const phase2Duration = Math.min(
    PHASE2_MAX,
    Math.max(PHASE2_MIN, target.length * PHASE2_CHAR_MS),
  );
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
  "nav-personal": "Pribadi",
  "nav-work": "Pekerjaan",
  "nav-school": "Akademik",
  "nav-research": "Riset",
  "nav-contact": "Kontak",
  "hero-alias": "Matsuo Kengo",
  "hero-sub":
    "Developer & peneliti yang membangun aplikasi, alat, dan hal-hal yang layak dibaca.",
  "hero-btn-email": "Email",
  "section-personal": "Pribadi",
  "section-client-work": "Pekerjaan Klien",
  "section-school": "Akademik",
  "section-research": "Riset",
  "tag-web": "Web",
  "tag-mobile": "Mobile",
  "tag-game": "Game",
  "tag-logistics-pwa": "PWA Logistik",
  "tag-desktop": "Desktop",
  "tag-pos": "Platform Kasir",
  "card-title-cutling": "Cutling",
  "cutling-desc":
    "Manajer clipboard native untuk iPhone, iPad, dan Mac. Simpan cuplikan dan gambar yang sering digunakan, lalu tempel ke aplikasi mana pun — lewat keyboard khusus di iOS atau hotkey menu bar di Mac. Tanpa akun, tanpa pelacakan, dan gratis di Mac.",
  "card-link-website": "Situs web →",
  "what-desc":
    "Aplikasi iOS yang melakukan streaming layar dan menampilkan terjemahan di atas teks asli secara real-time, sepenuhnya offline.",
  "badge-in-progress": "Sedang Dikerjakan",
  "badge-coming-soon": "Segera Hadir",
  "img-coming-soon": "Segera Hadir",
  "itinerary-id-desc":
    "Perencana itinerari perjalanan yang dibuat untuk wisatawan Indonesia.",
  "saf-desc":
    "Alat AI lokal yang mengubah slide kuliah, PDF, dan dokumen menjadi ringkasan yang akurat serta kartu Anki yang dapat diekspor — berjalan sepenuhnya di perangkat Anda, tanpa internet atau API key.",
  "solute-desc":
    "Platform kasir white-label untuk kafe dan restoran — pemesanan mandiri lewat QR, aplikasi kasir, layar dapur, dan papan antrian TV dalam satu sistem real-time, dengan tampilan mengikuti brand tiap outlet di subdomainnya sendiri.",
  "card-link-visit": "Kunjungi →",
  "txe-desc":
    "Aplikasi operasional untuk TXE Express, perusahaan kurir dan pengiriman.",
  "card-link-visit-site": "Kunjungi situs →",
  "polindo-desc":
    "Aplikasi mobile internal untuk PT Polindo Utama — karyawan dapat menelusuri, mendaftar, dan memantau kegiatan serta acara perusahaan.",
  "card-link-learn-more": "Pelajari lebih →",
  "pop-desc":
    "Platform operasional untuk Prevented Ocean Plastic — mencakup penerimaan, produksi, pengambilan sampel, QC, dan pengiriman untuk semua peran.",
  "itinerary-gen-desc":
    "Aplikasi web untuk membuat dan berbagi itinerari perjalanan, dibuat untuk klien pribadi.",
  "learn-desc":
    "Situs belajar anak-anak dengan pelajaran video dan kuis, dilengkapi streak dan hadiah untuk mendorong kembali.",
  "card-link-play": "Mainkan →",
  "last-minute-desc":
    "Platform kursus online tempat siswa dapat mengikuti kelas dan melakukan video call peer-to-peer.",
  "let-me-rest-desc": "Minigame browser pixel art, tersedia juga untuk mobile.",
  "sporocarp-desc":
    "Pengklasifikasi gambar yang membedakan jamur yang dapat dimakan dari yang beracun, dengan demo langsung di Hugging Face.",
  "card-link-live-demo": "Demo langsung →",
  "research-link": "Baca di IEEE Xplore →",
};

const isScramblable = (ch) => /[a-zA-Z]/.test(ch);

export default function () {
  document.documentElement.lang = "id";

  const appStore = document.querySelector(
    'a[href*="apps.apple.com/app/cutling"]',
  );
  if (appStore)
    appStore.href = "https://apps.apple.com/id/app/cutling/id6759476314";

  const cutlingSite = document.querySelector(
    'a[href*="kengomatsuo.github.io/Cutling"]',
  );
  if (cutlingSite)
    cutlingSite.href = "https://kengomatsuo.github.io/Cutling/id/";

  const els = Array.from(document.querySelectorAll("[data-i18n]"))
    .map((el, i) => ({ el, i, target: STRINGS[el.dataset.i18n] }))
    .filter(({ el, target }) => target && target !== el.textContent);

  els.forEach(({ el, i, target }) => {
    setTimeout(() => scrambleEl(el, target, isScramblable), i * 35);
  });
}
