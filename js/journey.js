// 사진 여정 모션.
//  - 텍스트 등장: IntersectionObserver가 .is-visible을 붙이고 CSS 전환이 처리한다(rAF 의존 없음, 스크롤 이벤트로 동작).
//  - 사진 확대·시차: GSAP ScrollTrigger(js/vendor, 로컬). 없거나 reduced-motion이면 정적 레이아웃 그대로.
//  - 처음 뷰포트 안에 있는 장면(Hero 등)은 숨기지 않는다: 정지 상태에서도 보이는 페이지.
export function init() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const root = document.documentElement;
  const scenes = [...document.querySelectorAll('.scene')];

  if ('IntersectionObserver' in window) {
    root.classList.add('js-journey');
    const vh = window.innerHeight;
    for (const scene of scenes) {
      const panel = scene.querySelector('.scene__panel');
      if (!panel) continue;
      const r = panel.getBoundingClientRect();
      if (r.top < vh * 0.9) scene.classList.add('is-visible'); // 초기 화면 안 → 즉시 보임
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    for (const scene of scenes) if (!scene.classList.contains('is-visible')) io.observe(scene);
  }

  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  scenes.forEach((scene, index) => {
    const img = scene.querySelector('.scene__bg img');
    if (!img) return;
    gsap.fromTo(img, { scale: index === 0 ? 1.08 : 1.16, yPercent: -3 }, {
      scale: 1.02, yPercent: 3, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    });
  });
}
