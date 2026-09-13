// 12 Months — FR-013·FR-014, DESIGN §5.5
import { el } from '../lib/dom.js';

const RHYTHM = { work: 'Work', explore: 'Explore', recharge: 'Recharge', community: 'Community' };

export function render(root, data) {
  const body = root.querySelector('[data-section-body]');
  body.append(
    el('p', { class: 'measure muted', text: data.copy.sectionIntros.twelveMonths }),
    el('ol', { class: 'timeline' },
      data.months.map((m) => el('li', { class: 'month', dataset: { month: String(m.month) } },
        el('span', { class: 'month__num en', text: String(m.month).padStart(2, '0') }),
        el('span', { class: `rhythm rhythm--${m.rhythm}`, text: RHYTHM[m.rhythm] || m.rhythm }),
        el('h3', { class: 'month__title', text: m.title }),
        el('p', { class: 'month__body', text: m.body }),
        el('p', { class: 'month__season caption', text: `참고 · ${m.seasonNote}` }),
      )),
    ),
    el('p', { class: 'source', text: `계절·날씨 메모는 일반적으로 알려진 경향을 완화해 적은 것이다 · 기준 ${data.months[0]?.asOf ?? '—'}` }),
  );
}
export function bind() {}
