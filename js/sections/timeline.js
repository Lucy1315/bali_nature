// 12 Months — FR-013·FR-014. part: 월 번호 배열(장면당 3달)
import { el } from '../lib/dom.js';
const RHYTHM = { work: 'Work', explore: 'Explore', recharge: 'Recharge', community: 'Community' };

export function render(root, data, state, part) {
  const nums = Array.isArray(part) ? part : data.months.map((m) => m.month);
  const list = data.months.filter((m) => nums.includes(m.month));
  const body = root.querySelector('[data-section-body]');
  body.append(
    el('ol', { class: 'timeline timeline--quarter' },
      list.map((m) => el('li', { class: 'month', dataset: { month: String(m.month) } },
        el('span', { class: 'month__num en', text: String(m.month).padStart(2, '0') }),
        el('span', { class: `rhythm rhythm--${m.rhythm}`, text: RHYTHM[m.rhythm] || m.rhythm }),
        el('h3', { class: 'month__title', text: m.title }),
        el('p', { class: 'month__body', text: m.body }),
        el('p', { class: 'month__season caption', text: `참고 · ${m.seasonNote}` }),
      )),
    ),
  );
  if (nums.includes(12)) body.append(el('p', { class: 'source', text: `계절·날씨 메모는 단정이 아니라 일반적인 경향을 적은 참고 정보이다 · 기준 ${data.months[0]?.asOf ?? '—'}` }));
}
export function bind() {}
