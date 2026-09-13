// Visa & Stay + 체크리스트 — FR-033~FR-038, DESIGN §5.8
import { el, inlineConfirm } from '../lib/dom.js';
import { checklistProgress } from '../lib/summary.js';
import { formatProgress } from '../lib/format.js';
import { ACTIONS } from '../state.js';

const EYEBROW = { general: 'Long-term Stay', remoteWorker: 'Remote Worker' };

function monthsSince(iso) {
  const d = new Date(iso); if (Number.isNaN(d)) return Infinity;
  const now = new Date();
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
}

function stayCard(s, copy) {
  return el('article', { class: 'card stay-card' },
    el('div', { class: 'stay-card__head' },
      el('p', { class: 'eyebrow', text: EYEBROW[s.id] || s.id }),
      el('p', { class: 'caption en', text: `Last updated ${s.lastUpdated}` }),
    ),
    el('h3', { class: 'card-title', text: s.title }),
    monthsSince(s.lastUpdated) > 12 ? el('p', { class: 'caption', style: 'color: var(--terracotta-ink)', text: copy.notices.staleInfo }) : null,
    el('div', { class: 'stack' }, s.paragraphs.map((p) => el('p', { text: p }))),
    el('div', { class: 'callout' },
      el('p', { text: copy.notices.official }),
      el('p', {}, s.officialSources.flatMap((o, i) => [i ? ' · ' : '', el('a', { href: o.url, target: '_blank', rel: 'noopener', text: o.label })])),
    ),
  );
}

export function render(root, data) {
  const { copy, stay, checklist } = data;
  const body = root.querySelector('[data-section-body]');
  body.append(
    el('p', { class: 'measure muted', text: copy.sectionIntros.visaStay }),
    el('div', { class: 'grid grid--2' }, stay.map((s) => stayCard(s, copy))),
    el('div', { class: 'checklist' },
      el('p', { class: 'eyebrow', text: 'Checklist' }),
      el('h3', { class: 'card-title', text: '장기 체류 준비 체크리스트' }),
      el('div', { class: 'progress' },
        el('span', { class: 'progress__num', dataset: { progress: '' }, 'aria-live': 'polite' }),
        el('div', { class: 'progress__bar' }, el('div', { class: 'progress__fill', dataset: { progressFill: '' } })),
      ),
      el('ul', {}, checklist.map((c) => el('li', { class: 'check' },
        el('input', { type: 'checkbox', id: `check-${c.id}`, dataset: { check: c.id } }),
        el('label', { for: `check-${c.id}` }, el('span', { class: 'check__title', text: c.title }), el('span', { class: 'check__why', text: c.why })),
      ))),
      el('p', { class: 'empty', dataset: { checklistDone: '' }, hidden: true, role: 'status', text: copy.notices.checklistDone }),
      el('div', { class: 'btn-row' },
        el('button', { type: 'button', class: 'btn btn--tertiary', dataset: { action: 'reset-checklist' }, text: '체크리스트 초기화' }),
      ),
    ),
  );
}

export function bind(root, store, data) {
  root.addEventListener('change', (e) => {
    const box = e.target.closest('[data-check]');
    if (box) store.dispatch({ type: ACTIONS.TOGGLE_CHECK, payload: box.dataset.check });
  });
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="reset-checklist"]');
    if (btn) inlineConfirm(btn, data.copy.notices.resetConfirm, () => store.dispatch({ type: ACTIONS.RESET_CHECKLIST }));
  });
  const update = (state) => {
    for (const box of root.querySelectorAll('[data-check]')) box.checked = state.checklist[box.dataset.check] === true;
    const p = checklistProgress(state.checklist);
    root.querySelector('[data-progress]').textContent = formatProgress(p.done, p.total);
    root.querySelector('[data-progress-fill]').style.width = `${(p.done / p.total) * 100}%`;
    root.querySelector('[data-checklist-done]').hidden = !p.complete;
  };
  store.subscribe(update);
  update(store.getState());
}
