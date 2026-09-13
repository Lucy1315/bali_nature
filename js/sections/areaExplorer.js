// Find Your Base — FR-016~FR-022, DESIGN §5.3·§5.4
import { el, clear, meter } from '../lib/dom.js';
import { matchRegions } from '../lib/filter.js';
import { ACTIONS, FILTER_IDS } from '../state.js';

function areaCard(r, copy) {
  const src = r.source || {};
  return el('article', { class: 'card area-card', dataset: { region: r.id, state: 'neutral', selected: 'false' } },
    el('div', { class: 'area-card__head' },
      el('h3', { class: 'card-title' }, r.name, ' ', el('span', { class: 'caption', text: r.nameKo || '' })),
      el('span', { class: 'eyebrow area-card__selected', text: 'Selected', hidden: true, dataset: { selectedBadge: '' } }),
    ),
    el('p', { class: 'area-card__vibe', text: r.vibe }),
    el('div', { class: 'area-card__tags' }, r.tags.map((t) => el('span', { class: 'tag', text: copy.filterLabels[t] || t }))),
    el('div', { class: 'area-card__meters' },
      meter(r.scores.work, { label: '원격근무' }),
      meter(r.scores.nature, { label: '자연' }),
      meter(r.scores.convenience, { label: '생활 편의' }),
      meter(r.scores.calm, { label: '조용함' }),
    ),
    el('p', { class: 'caption', text: r.recommendedFor }),
    el('p', { class: 'source', text: `${src.label || '편집자 평가'} · ${src.asOf || '확인불가'}` }),
    el('button', { type: 'button', class: 'btn btn--secondary', dataset: { action: 'select-area', region: r.id }, 'aria-pressed': 'false', text: '내 베이스로 선택' }),
  );
}

export function render(root, data) {
  const { copy, regions } = data;
  const body = root.querySelector('[data-section-body]');
  body.append(
    el('p', { class: 'measure muted', text: copy.sectionIntros.findYourBase }),
    el('div', { class: 'pill-group', role: 'group', 'aria-label': '라이프스타일 필터' },
      FILTER_IDS.map((f) => el('button', { type: 'button', class: 'pill', dataset: { filter: f }, 'aria-pressed': 'false', title: copy.filterHints?.[f] || '', text: copy.filterLabels[f] })),
      el('button', { type: 'button', class: 'btn btn--tertiary', dataset: { action: 'clear-filters' }, text: '필터 해제' }),
    ),
    el('p', { class: 'empty', dataset: { nomatch: '' }, hidden: true, role: 'status', text: copy.notices.noMatch }),
    el('div', { class: 'grid grid--4 area-grid' }, regions.map((r) => areaCard(r, copy))),
  );
}

export function bind(root, store, data) {
  root.addEventListener('click', (e) => {
    const pill = e.target.closest('[data-filter]');
    if (pill) return store.dispatch({ type: ACTIONS.TOGGLE_FILTER, payload: pill.dataset.filter });
    const act = e.target.closest('[data-action]');
    if (!act) return;
    if (act.dataset.action === 'clear-filters') store.dispatch({ type: ACTIONS.CLEAR_FILTERS });
    if (act.dataset.action === 'select-area') store.dispatch({ type: ACTIONS.SELECT_AREA, payload: act.dataset.region });
  });
  const update = (state) => {
    const result = matchRegions(data.regions, state.filters);
    for (const pill of root.querySelectorAll('[data-filter]')) pill.setAttribute('aria-pressed', String(state.filters.includes(pill.dataset.filter)));
    root.querySelector('[data-nomatch]').hidden = !result.none;
    for (const card of root.querySelectorAll('.area-card')) {
      const id = card.dataset.region;
      card.dataset.state = result.status[id] || 'neutral';
      const selected = state.area === id;
      card.dataset.selected = String(selected);
      card.querySelector('[data-selected-badge]').hidden = !selected;
      const btn = card.querySelector('[data-action="select-area"]');
      btn.setAttribute('aria-pressed', String(selected));
      btn.textContent = selected ? '선택됨 · 해제' : '내 베이스로 선택';
    }
  };
  store.subscribe(update);
  update(store.getState());
}
