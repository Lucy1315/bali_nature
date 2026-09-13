// Hero — FR-009·FR-010·FR-011, DESIGN §5.1
import { el } from '../lib/dom.js';

export function render(root, data) {
  const { hero, heroCta } = data.copy;
  const picture = el('picture', { class: 'hero__picture' },
    el('source', { media: '(max-width: 767px)', srcset: 'assets/hero-960.jpg' }),
    el('img', { src: 'assets/hero-1920.jpg', alt: '', loading: 'eager', decoding: 'async', fetchpriority: 'high' }),
  );
  picture.querySelector('img').addEventListener('error', () => root.classList.add('section--hero-noimage'));
  root.append(
    picture,
    el('div', { class: 'hero__scrim', 'aria-hidden': 'true' }),
    el('div', { class: 'container hero__content' },
      el('h1', { id: 'hero-title', class: 'hero__title en', text: hero.title }),
      el('p', { class: 'hero__subtitle', text: hero.subtitle }),
      el('p', { class: 'hero__tagline', text: hero.tagline }),
      el('a', { class: 'btn btn--primary btn--on-photo hero__cta', href: '#find-your-base', text: `${heroCta} ↓` }),
    ),
    el('p', { class: 'hero__credit caption' },
      'Photo: ',
      el('a', { href: 'https://commons.wikimedia.org/wiki/File:Rice_terraces,_Bali.jpg', rel: 'noopener', target: '_blank', text: 'Vyacheslav Argenberg' }),
      ' · CC BY 4.0',
    ),
  );
}

export function bind() {}
