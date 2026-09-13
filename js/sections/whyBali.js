// Why Bali — FR-012, DESIGN §5.2
import { el } from '../lib/dom.js';

export function render(root, data) {
  const body = root.querySelector('[data-section-body]');
  body.append(el('div', { class: 'grid grid--2 why-grid' },
    data.copy.whyBali.map((w) => el('article', { class: 'why-item' },
      el('p', { class: 'eyebrow', text: w.eyebrow }),
      el('h3', { class: 'card-title', text: w.title }),
      el('p', { class: 'measure', text: w.body }),
    )),
  ));
}
export function bind() {}
