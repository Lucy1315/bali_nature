// My Bali Year — FR-008·FR-039~FR-042, DESIGN §5.10
import { el, inlineConfirm } from '../lib/dom.js';
import { buildSummary, summaryToText } from '../lib/summary.js';
import { formatIDR, formatKRW, formatProgress } from '../lib/format.js';
import { ACTIONS } from '../state.js';
import * as storage from '../storage.js';

const ROWS = [
  ['area', 'Base', '#find-your-base'],
  ['lifestyle', 'Lifestyle', '#find-your-base'],
  ['monthly', 'Monthly', '#monthly-budget'],
  ['annual', 'Year', '#monthly-budget'],
  ['progress', 'Checklist', '#checklist'],
];

export function render(root, data) {
  const { copy } = data;
  const body = root.querySelector('[data-section-body]');
  body.append(
    el('p', { class: 'measure muted', text: copy.sectionIntros.myBaliYear }),
    el('article', { class: 'card summary', 'aria-live': 'polite' },
      el('p', { class: 'eyebrow', text: 'Your Bali Year' }),
      el('dl', { class: 'summary__rows' }, ROWS.map(([key, label, href]) => el('div', { class: 'summary__row' },
        el('dt', { class: 'eyebrow', text: label }),
        el('dd', {},
          el('span', { class: 'summary__value fade', dataset: { summary: key } }),
          el('span', { class: 'caption summary__sub', dataset: { summarySub: key } }),
          el('a', { class: 'link caption summary__go', href, dataset: { summaryGo: key }, text: '선택하러 가기 →' }),
        ),
      ))),
      el('div', { class: 'btn-row summary__actions' },
        el('button', { type: 'button', class: 'btn btn--secondary', dataset: { action: 'copy-plan' }, text: '계획 복사' }),
        el('button', { type: 'button', class: 'btn btn--tertiary', dataset: { action: 'reset-all' }, text: '처음부터 다시' }),
        el('span', { class: 'caption', dataset: { copied: '' }, role: 'status' }),
      ),
      el('pre', { class: 'summary__fallback caption', dataset: { copyFallback: '' }, hidden: true, tabindex: '0' }),
    ),
  );
}

export function bind(root, store, data) {
  const { copy } = data;
  const q = (sel) => root.querySelector(sel);

  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'reset-all') {
      inlineConfirm(btn, copy.notices.resetAllConfirm, () => { storage.clear(); store.dispatch({ type: ACTIONS.RESET_ALL }); });
    }
    if (btn.dataset.action === 'copy-plan') {
      const text = summaryToText(buildSummary(store.getState(), data));
      const status = q('[data-copied]');
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = copy.notices.copied;
        q('[data-copy-fallback]').hidden = true;
      } catch {
        const pre = q('[data-copy-fallback]');
        pre.textContent = text; pre.hidden = false; pre.focus();
        status.textContent = copy.notices.copyFallback;
      }
      setTimeout(() => { status.textContent = ''; }, 2500);
    }
  });

  const setValue = (key, text, sub = '') => {
    const v = q(`[data-summary="${key}"]`);
    const empty = text === null;
    const next = empty ? copy.notices.notSelected : text;
    if (v.textContent !== next) {
      v.textContent = next;
      v.classList.remove('fade-in'); void v.offsetWidth; v.classList.add('fade-in');
    }
    v.classList.toggle('summary__value--empty', empty);
    q(`[data-summary-sub="${key}"]`).textContent = sub;
    q(`[data-summary-go="${key}"]`).hidden = !empty;
  };

  const update = (state) => {
    const s = buildSummary(state, data);
    setValue('area', s.area);
    setValue('lifestyle', s.lifestyle);
    setValue('monthly', s.monthly === null ? null : formatIDR(s.monthly), s.monthlyKRW === null ? '' : `≈ ${formatKRW(s.monthlyKRW)}`);
    setValue('annual', s.annual === null ? null : formatIDR(s.annual), s.annualKRW === null ? '' : `≈ ${formatKRW(s.annualKRW)}`);
    setValue('progress', s.progress.done === 0 ? null : formatProgress(s.progress.done, s.progress.total));
  };
  store.subscribe(update);
  update(store.getState());
}
