// Local Life — FR-015, DESIGN §5.9
import { el } from '../lib/dom.js';

export function render(root, data) {
  const body = root.querySelector('[data-section-body]');
  body.append(
    el('p', { class: 'measure muted', text: data.copy.sectionIntros.localLife }),
    el('div', { class: 'grid grid--3' },
      data.localLife.map((c) => el('article', { class: 'card card--flat local-item' },
        el('p', { class: 'eyebrow', text: c.eyebrow }),
        el('h3', { class: 'card-title', text: c.title }),
        el('p', { text: c.body }),
      )),
    ),
  );
}
export function bind() {}
