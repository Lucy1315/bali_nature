// 현재 섹션 표시 — FR-002, R-12
export function init(nav) {
  if (!nav || !('IntersectionObserver' in window)) return;
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const ratios = new Map();
  const update = () => {
    let best = null, bestRatio = 0;
    for (const [id, r] of ratios) if (r > bestRatio) { best = id; bestRatio = r; }
    for (const [id, a] of byId) {
      if (id === best && bestRatio > 0) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) ratios.set(e.target.id, e.intersectionRatio);
    update();
  }, { rootMargin: '-64px 0px -40% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
  for (const id of byId.keys()) {
    const sec = document.getElementById(id);
    if (sec) io.observe(sec);
  }
}
