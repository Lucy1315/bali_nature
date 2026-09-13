// Local Life — FR-015. part: 카드 id 배열(장면당 3장)
import { el } from '../lib/dom.js';

export function render(root, data, state, part) {
  const ids = Array.isArray(part) ? part : data.localLife.map((c) => c.id);
  const cards = data.localLife.filter((c) => ids.includes(c.id));
  root.querySelector('[data-section-body]').append(
    el('div', { class: 'grid grid--3' },
      cards.map((c) => el('article', { class: 'card card--flat local-item' },
        el('p', { class: 'eyebrow', text: c.eyebrow }),
        el('h3', { class: 'card-title', text: c.title }),
        el('p', { text: c.body }),
      )),
    ),
  );
}
export function bind() {}
