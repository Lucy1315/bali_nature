// 장면 골격 — data/scenes.js의 사진·제목을 각 섹션에 그린다 (korea-nature 구조)
import { el } from '../lib/dom.js';

export function renderScene(root, scene) {
  const img = el('img', { src: `assets/images/${scene.image}.webp`, alt: scene.alt, loading: scene.id === 'hero' ? 'eager' : 'lazy', decoding: 'async', fetchpriority: scene.id === 'hero' ? 'high' : 'auto', width: '1920', height: '1280' });
  const picture = el('picture', {}, el('source', { media: '(max-width: 767px)', srcset: `assets/images/${scene.image}-960.webp` }), img);
  const bg = el('div', { class: 'scene__bg', 'aria-hidden': 'true' }, picture, el('div', { class: 'scene__scrim' }),
    el('p', { class: 'scene__credit' }, 'Photo: ', el('a', { href: scene.credit.url, target: '_blank', rel: 'noopener', text: scene.credit.artist, tabindex: '-1' }), ` · ${scene.credit.license}`));
  const wide = root.classList.contains('scene--wide');
  const panel = el('div', { class: `scene__panel${wide ? ' scene__panel--wide' : ''}` });
  if (scene.title) {
    panel.append(el('div', { class: 'scene__head' },
      el('p', { class: 'eyebrow', text: scene.eyebrow, dataset: { reveal: '' } }),
      el('h2', { id: `${scene.id}-title`, class: 'scene-title', text: scene.title, dataset: { reveal: '' } }),
      scene.tagline ? el('p', { class: 'tagline', text: scene.tagline, dataset: { reveal: '' } }) : null,
    ));
  }
  panel.append(el('div', { class: 'section-body', dataset: { sectionBody: '', reveal: '' } }));
  root.append(bg, el('div', { class: 'scene__content' }, panel));
}
