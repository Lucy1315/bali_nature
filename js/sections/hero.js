// Hero — FR-009·FR-011. 사진·스크림은 scene.js가 그리고 여기서는 패널 내용만 채운다.
import { el } from '../lib/dom.js';

export function render(root, data) {
  const { hero, heroCta } = data.copy;
  const body = root.querySelector('[data-section-body]');
  body.append(
    el('p', { class: 'eyebrow', text: 'Digital Nomad · 365 Days' }),
    el('h1', { id: 'hero-title', class: 'hero__title', text: hero.title }),
    el('p', { class: 'hero__subtitle', text: hero.subtitle }),
    el('p', { class: 'hero__tagline', text: hero.tagline }),
    el('a', { class: 'btn btn--primary hero__cta', href: '#find-your-base', text: `${heroCta} ↓` }),
  );
  body.classList.add('hero__body');
}
export function bind() {}
