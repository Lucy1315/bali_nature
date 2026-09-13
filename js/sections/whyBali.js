// Why Bali — FR-012. 관점 하나 = 장면 하나(part: 'work'|'life'|'nature'|'community')
import { el } from '../lib/dom.js';

export function render(root, data, state, part) {
  const item = data.copy.whyBali.find((w) => w.id === part);
  if (!item) return;
  root.querySelector('[data-section-body]').append(el('p', { class: 'lead measure', text: item.body }));
}
export function bind() {}
