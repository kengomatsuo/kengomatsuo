import { scrambleEl } from "./utils.js";

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
  "card-title-cutling": "Cutling",
  "cutling-desc":
    "Manajer clipboard native untuk iOS dan macOS yang menyimpan cuplikan dan gambar yang sering digunakan, lalu memungkinkan penempelan ke aplikasi mana pun lewat keyboard bawaan. Tanpa akun.",
  "card-link-website": "Situs web →",
  "what-desc":
    "Aplikasi iOS yang melakukan streaming layar dan menampilkan terjemahan di atas teks asli secara real-time, sepenuhnya offline.",
  "badge-in-progress": "Sedang Dikerjakan",
  "badge-coming-soon": "Segera Hadir",
  "img-coming-soon": "Segera Hadir",
  "itinerary-id-desc":
    "Perencana itinerari perjalanan yang dibuat untuk wisatawan Indonesia.",
  "card-link-visit": "Kunjungi →",
  "txe-desc": "Aplikasi operasional untuk TXE Express, perusahaan kurir dan pengiriman.",
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

const POOL = "abcdefghijklmnopqrstuvwxyz";
const isScramblable = (ch) => /[a-zA-Z]/.test(ch);

export default function () {
  document.documentElement.lang = "id";

  const appStore = document.querySelector('a[href*="apps.apple.com/app/cutling"]');
  if (appStore) appStore.href = "https://apps.apple.com/id/app/cutling/id6759476314";

  const cutlingSite = document.querySelector('a[href*="kengomatsuo.github.io/Cutling"]');
  if (cutlingSite) cutlingSite.href = "https://kengomatsuo.github.io/Cutling/id/";

  Array.from(document.querySelectorAll("[data-i18n]")).forEach((el, i) => {
    const target = STRINGS[el.dataset.i18n];
    if (target) setTimeout(() => scrambleEl(el, target, POOL, isScramblable), i * 35);
  });
}
