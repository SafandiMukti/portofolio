// ===== HUD live timer (signature broadcast element) =====
(function(){
  const start = Date.now();
  const el = document.getElementById('hudTimer');
  function tick(){
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2,'0');
    const s = String(elapsed % 60).padStart(2,'0');
    el.textContent = `${m}:${s}`;
  }
  setInterval(tick, 1000);
  tick();
})();

// ===== Nav toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== GSAP setup =====
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
if (hasGsap) gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hasGsap && !reduceMotion) {
  // Hero load-in sequence: brief "signal boot" flicker, then resolve
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.set('body', { visibility: 'visible' })
    .from('[data-hero-word]', {
      yPercent: 110,
      duration: 1,
      stagger: 0.12,
      ease: 'power4.out'
    }, 0.15)
    .to('.eyebrow', { opacity: 1, y: 0, duration: 0.6 }, 0.1)
    .to('.hero-headline', { opacity: 1, y: 0, duration: 0.7 }, 0.55)
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, 0.65)
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.7 }, 0.75);

  // Scroll-triggered reveals for everything else
  document.querySelectorAll('.section [data-reveal]').forEach((elm) => {
    gsap.to(elm, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elm,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });
} else {
  // tanpa animasi (gerak dikurangi, atau CDN GSAP gagal dimuat): tampilkan semuanya
  document.querySelectorAll('[data-reveal], [data-hero-word]').forEach(elm => {
    elm.style.opacity = 1;
    elm.style.transform = 'none';
  });
}


// ===== Language toggle EN / ID =====
// Teks Inggris adalah isi HTML aslinya (tampil juga tanpa JavaScript); terjemahan Indonesia ada di sini.
const ID = {
  'nav.about': 'Di Balik Layar',
  'nav.code': 'Kode Sumber',
  'nav.reel': 'Karya',
  'nav.live': 'Operasi Langsung',
  'nav.design': 'Bingkai demi Bingkai',
  'nav.rundown': 'Perjalanan',
  'nav.standby': 'Hubungi',
  'hero.headline': 'Lulusan Informatika yang membangun sistem backend dan web, dengan latar belakang produksi siaran langsung.',
  'hero.cta1': 'Lihat Proyek',
  'hero.cta2': 'Hubungi Saya',
  'signal.title': 'CEK SINYAL — TOKOHERBAL',
  'about.p1': 'Saya lulusan Informatika (2026) dari <strong>Universitas Amikom Purwokerto</strong>. Saya membangun backend web dan aplikasi 3D interaktif. Proyek terbaru saya, <strong>TokoHerbal</strong>, adalah toko full-stack yang terdiri dari service Go, PostgreSQL, Redis, dan Docker, lengkap dengan tes otomatis dan CI.',
  'about.p2': 'Selama kuliah saya juga bekerja di produksi siaran langsung: visual LED/Videotron, streaming dengan OBS Studio, dan siaran turnamen. Dari situ saya terbiasa tetap tenang saat ada yang rusak ketika acara sedang berjalan. Kebiasaan yang sama saya bawa ke debugging, pemantauan, dan menjaga sistem tetap hidup.',
  'stat.1': 'Service dalam satu stack Docker Compose',
  'stat.3': 'Peran produksi pertama',
  'code.title': 'Pemrograman & Pengembangan',
  'code.lead': 'Saya paling kuat di sisi backend dan di membawa sistem dari "jalan di laptop saya" menjadi "jalan di container dengan tes dan CI". Saya juga membuat antarmuka dan pengalaman 3D.',
  'skill.backend': 'Backend',
  'skill.data': 'Data & Cache',
  'skill.devops': 'DevOps & Alat',
  'skill.3d': '3D & Game',
  'reel.title': 'Karya Pilihan',
  'toko.desc': 'Toko produk herbal yang dipisah menjadi service auth dan service produk, masing-masing dengan database PostgreSQL sendiri, ditambah cache Redis dan frontend Next.js. Semuanya jalan dengan satu perintah <code>docker compose up</code>.',
  'toko.p1': 'Token akses JWT dengan refresh token yang dirotasi',
  'toko.p2': 'Cache Redis dan rate limit per IP yang tetap melayani saat Redis mati',
  'toko.p3': 'Circuit breaker antar service, jadi dependensi yang gagal tidak membuat request menggantung',
  'toko.p4': 'Stok dikurangi secara atomik di dalam transaksi database',
  'toko.p5': 'Peran pelanggan dan admin dipisah; akun admin tidak bisa memesan',
  'toko.p6': 'Unit test dan pipeline GitHub Actions',
  'toko.link': 'Lihat Kode di GitHub →',
  'vt.desc': 'Universitas Amikom Purwokerto: tur virtual interaktif yang membantu calon mahasiswa menjelajahi tata letak kampus dalam 3D. Saya mengerjakan tata letak gedung, lingkungan, UI/UX, dan build Unity dari awal sampai akhir. Ini adalah tugas akhir saya.',
  'vt.link': 'Lihat Demo Langsung →',
  'arch.desc': 'Aplikasi web marketplace untuk membeli, menyewa, dan memasang iklan properti (rumah, kos, apartemen) dengan kontrol akses berbasis peran dan fitur untuk pembeli maupun penjual. Dibuat dengan ASP.NET di Visual Studio.',
  'obs.desc': 'Merancang dan mengoperasikan tata letak layar untuk siaran turnamen online: komposisi scene, overlay, dan pergantian scene secara langsung di OBS Studio.',
  'reel.archive': 'DOKUMENTASI LENGKAP & ARSIP DESAIN — GOOGLE DRIVE',
  'live.title': 'Multimedia Acara & Produksi Langsung',
  'live.lead': 'Jalur kedua saya. Acara langsung adalah tempat saya belajar bekerja di bawah tekanan waktu nyata bersama tim.',
  'ampu.1': 'Mendukung produksi acara dan operasi live streaming sebagai bagian dari kru produksi.',
  'ampu.2': 'Membantu operasi streaming di balik layar, termasuk pengaturan dan pengelolaan OBS Studio saat acara langsung.',
  'ampu.3': 'Menyiapkan dan mengelola tata letak layar serta konten visual yang dipakai saat siaran.',
  'ampu.4': 'Menjadi fotografer acara bila diperlukan, mendokumentasikan kegiatan dan acara kampus.',
  'esa.1': 'Mendukung penyelenggaraan dan pelaksanaan turnamen esports offline maupun online.',
  'esa.2': 'Membantu penyajian visual LED/Videotron pada turnamen offline.',
  'esa.3': 'Mengoperasikan OBS Studio untuk siaran turnamen online, mengelola scene dan tata letak layar.',
  'esa.4': 'Berkoordinasi dengan tim acara soal kebutuhan teknis dan visual selama turnamen berlangsung.',
  'design.title': 'Desain Kreatif & Visual',
  'ore.1': 'Merancang materi visual untuk acara komunitas, termasuk banner acara dan desain kaos.',
  'ore.2': 'Membuat aset visual yang disesuaikan dengan tema dan kebutuhan tiap acara.',
  'ore.3': 'Mendokumentasikan acara komunitas lewat fotografi acara.',
  'run.title': 'Perjalanan',
  'tl.1.h': 'Mulai di ORECIMA & Esport Arena',
  'tl.1.p': 'Langkah pertama di produksi acara: desain visual, fotografi, dan kerja kru multimedia.',
  'tl.2.p': 'IPK 3.68/4.00. Tugas akhir: Virtual Tour 3D interaktif dengan Unity dan Blender.',
  'tl.3.p': 'Operasi streaming di balik layar dan produksi visual acara langsung.',
  'tl.4.h': 'Membangun TokoHerbal',
  'tl.4.p': 'Toko full-stack dengan service Go, PostgreSQL, Redis, Docker, tes, dan CI, dibangun bertahap untuk belajar bagaimana backend sungguhan disusun.',
  'tl.5.h': 'Terbuka untuk Bekerja',
  'tl.5.p': 'Mencari posisi junior di backend, web, atau pengembangan perangkat lunak dan IT. Terbuka juga untuk pengembangan game dan pekerjaan multimedia acara / produksi langsung.',
  'standby.title': 'Siap untuk<br>aba-aba berikutnya.',
  'standby.lead': 'Punya proyek yang butuh perangkat lunak, aplikasi web, atau setup produksi langsung? Mari ngobrol.'
};

(function(){
  const nodes = [...document.querySelectorAll('[data-i18n]')];
  nodes.forEach(n => { n.dataset.en = n.innerHTML; });
  const toggle = document.getElementById('langToggle');

  function apply(lang){
    document.documentElement.lang = lang;
    nodes.forEach(n => {
      const key = n.getAttribute('data-i18n');
      n.innerHTML = (lang === 'id' && ID[key] !== undefined) ? ID[key] : n.dataset.en;
    });
    toggle.querySelectorAll('[data-lang-opt]').forEach(o => {
      o.classList.toggle('active', o.dataset.langOpt === lang);
    });
    toggle.setAttribute('aria-pressed', String(lang === 'id'));
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  let lang = 'en';
  try { lang = localStorage.getItem('lang') || ''; } catch (e) {}
  if (lang !== 'en' && lang !== 'id') lang = (navigator.language || '').toLowerCase().startsWith('id') ? 'id' : 'en';
  apply(lang);

  toggle.addEventListener('click', () => apply(document.documentElement.lang === 'id' ? 'en' : 'id'));
})();
