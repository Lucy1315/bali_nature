// Work & Live — FR-029~FR-032, DESIGN §5.7
import { el, meter } from '../lib/dom.js';

export function render(root, data) {
  const { copy, workLive, regions } = data;
  const body = root.querySelector('[data-section-body]');
  const compare = workLive.filter((c) => c.compare);
  const tz = workLive.find((c) => c.id === 'timezone');
  const routine = workLive.find((c) => c.id === 'routine');
  const asOf = regions[0]?.source?.asOf || '확인불가';

  body.append(
    el('p', { class: 'measure muted', text: copy.sectionIntros.workLive }),
    el('div', { class: 'grid grid--5 criteria' },
      workLive.map((c) => el('article', { class: 'card card--flat criterion' },
        el('p', { class: 'eyebrow', text: c.id }),
        el('h3', { class: 'card-title', text: c.title }),
        el('p', { text: c.why }),
        el('ul', { class: 'criterion__checks' }, (c.checks || []).map((t) => el('li', { class: 'caption', text: `· ${t}` }))),
      )),
    ),
    el('div', { class: 'table-scroll' },
      el('table', { class: 'compare' },
        el('caption', { text: `지역별 참고 등급 · 편집자 평가 · ${asOf}` }),
        el('thead', {}, el('tr', {},
          el('th', { scope: 'col', text: '기준' }),
          regions.map((r) => el('th', { scope: 'col', dataset: { region: r.id, selected: 'false' }, text: r.name })),
        )),
        el('tbody', {}, compare.map((c) => el('tr', {},
          el('th', { scope: 'row', text: c.title }),
          regions.map((r) => el('td', { dataset: { region: r.id, selected: 'false' } }, meter(r.workLive?.[c.id], { label: c.title, variant: 'meter--ocean' }))),
        ))),
      ),
    ),
    el('div', { class: 'grid grid--2 worklive-blocks' },
      tz && el('article', { class: 'card card--flat' },
        el('p', { class: 'eyebrow', text: 'Timezone' }),
        el('h3', { class: 'card-title', text: tz.title }),
        el('p', { text: `발리 ${tz.offset?.bali ?? 'UTC+8'} · 한국 ${tz.offset?.korea ?? 'UTC+9'}` }),
        el('p', { text: tz.overlap }),
      ),
      routine && el('article', { class: 'card card--flat' },
        el('p', { class: 'eyebrow', text: 'Work Routine' }),
        el('h3', { class: 'card-title', text: routine.title }),
        el('ul', { class: 'stack' }, (routine.examples || []).map((t) => el('li', { text: t }))),
      ),
    ),
  );
}

export function bind(root, store) {
  const update = (state) => {
    for (const cell of root.querySelectorAll('[data-region]')) cell.dataset.selected = String(cell.dataset.region === state.area);
  };
  store.subscribe(update);
  update(store.getState());
}
