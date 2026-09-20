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
  navMenu.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// ===== GSAP setup =====
gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
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
  document.querySelectorAll('[data-reveal], [data-hero-word]').forEach(elm => {
    elm.style.opacity = 1;
    elm.style.transform = 'none';
  });
}
