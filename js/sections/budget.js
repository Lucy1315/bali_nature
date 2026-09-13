// Monthly Budget — FR-023~FR-028, DESIGN §5.6·§6.4
import { el } from '../lib/dom.js';
import { BUDGET_ITEM_IDS, sumMonthly, annual, toKRW, validateAmount, validateRate } from '../lib/budget.js';
import { formatNumber, formatIDR, formatKRW } from '../lib/format.js';
import { ACTIONS } from '../state.js';

function field(id, label, suffix, extra = {}) {
  const inputId = `budget-${id}`;
  const errId = `${inputId}-error`;
  return el('div', { class: 'field' },
    el('label', { class: 'field__label', for: inputId },
      el('span', { class: 'en', text: label.en }),
      el('span', { class: 'caption', text: label.ko }),
    ),
    el('div', { class: 'field__control' },
      el('input', { id: inputId, class: 'field__input', type: 'text', inputmode: 'decimal', autocomplete: 'off', 'aria-describedby': errId, ...extra }),
      el('span', { class: 'field__suffix', text: suffix }),
    ),
    el('p', { id: errId, class: 'field__error', hidden: true }),
  );
}

export function render(root, data) {
  const { copy } = data;
  const body = root.querySelector('[data-section-body]');
  body.append(
    el('p', { class: 'measure muted', text: copy.sectionIntros.monthlyBudget }),
    el('div', { class: 'budget' },
      el('form', { class: 'budget__form', novalidate: true, onsubmit: (e) => e.preventDefault() },
        el('p', { class: 'source', dataset: { regionHint: '' } }),
        BUDGET_ITEM_IDS.map((id) => field(id, copy.budgetLabels[id], 'IDR', { dataset: { budgetItem: id } })),
        el('div', { class: 'btn-row' },
          el('button', { type: 'button', class: 'btn btn--tertiary', dataset: { action: 'reset-budget' }, hidden: true, text: '지역 기본값으로 되돌리기' }),
        ),
      ),
      el('div', { class: 'budget__result' },
        el('p', { class: 'empty', dataset: { budgetEmpty: '' }, text: copy.notices.emptyBudget }),
        el('div', { dataset: { budgetOut: '' } },
          el('p', { class: 'eyebrow', text: 'Monthly Budget' }),
          el('p', { class: 'budget__num num', dataset: { out: 'monthly' }, 'aria-live': 'polite' }),
          el('p', { class: 'caption budget__krw', dataset: { out: 'monthlyKRW' } }),
          el('p', { class: 'eyebrow', text: 'Annual Budget' }),
          el('p', { class: 'budget__num num', dataset: { out: 'annual' }, 'aria-live': 'polite' }),
          el('p', { class: 'caption budget__krw', dataset: { out: 'annualKRW' } }),
        ),
        el('hr', { class: 'hr' }),
        el('div', { class: 'field budget__rate' },
          el('label', { class: 'field__label', for: 'budget-rate' }, el('span', { class: 'en', text: '1 KRW =' }), el('span', { class: 'caption', text: '원화 1원당 루피아' })),
          el('div', { class: 'field__control' },
            el('input', { id: 'budget-rate', class: 'field__input', type: 'text', inputmode: 'decimal', autocomplete: 'off', dataset: { rate: '' }, 'aria-describedby': 'budget-rate-error budget-rate-hint', placeholder: String(copy.rateExample.value) }),
            el('span', { class: 'field__suffix', text: 'IDR' }),
          ),
          el('p', { id: 'budget-rate-error', class: 'field__error', hidden: true }),
          el('p', { id: 'budget-rate-hint', class: 'field__hint', dataset: { rateHint: '' } }),
        ),
      ),
    ),
  );
}

function showError(input, message) {
  const err = document.getElementById(input.getAttribute('aria-describedby').split(' ')[0]);
  if (message) { input.setAttribute('aria-invalid', 'true'); err.textContent = message; err.hidden = false; }
  else { input.removeAttribute('aria-invalid'); err.textContent = ''; err.hidden = true; }
}

export function bind(root, store, data) {
  const { copy, regions } = data;
  const inputs = Object.fromEntries([...root.querySelectorAll('[data-budget-item]')].map((i) => [i.dataset.budgetItem, i]));
  const rateInput = root.querySelector('[data-rate]');

  for (const [id, input] of Object.entries(inputs)) {
    input.addEventListener('input', () => {
      const v = validateAmount(input.value);
      showError(input, v.ok ? '' : v.error);
      if (v.ok) store.dispatch({ type: ACTIONS.SET_BUDGET_ITEM, payload: { id, value: v.value } });
    });
    input.addEventListener('blur', () => {
      const v = store.getState().budget.items[id];
      if (!input.getAttribute('aria-invalid')) input.value = Number.isFinite(v) ? formatNumber(v) : '';
    });
  }
  rateInput.addEventListener('input', () => {
    const v = validateRate(rateInput.value);
    showError(rateInput, v.ok ? '' : v.error);
    if (v.ok) store.dispatch({ type: ACTIONS.SET_RATE, payload: v.value });
  });
  root.querySelector('[data-action="reset-budget"]').addEventListener('click', () => store.dispatch({ type: ACTIONS.RESET_BUDGET_TO_REGION }));

  const update = (state) => {
    const { items, rate } = state.budget;
    for (const [id, input] of Object.entries(inputs)) {
      if (document.activeElement === input) continue;
      const v = items[id];
      const shown = Number.isFinite(v) ? formatNumber(v) : '';
      if (input.value !== shown) { input.value = shown; showError(input, ''); }
    }
    if (document.activeElement !== rateInput) {
      const shown = rate === null ? '' : String(rate);
      if (rateInput.value !== shown) { rateInput.value = shown; showError(rateInput, ''); }
    }
    const region = regions.find((r) => r.id === state.area);
    const hint = root.querySelector('[data-region-hint]');
    hint.textContent = region
      ? copy.notices.regionDefault.replace('{region}', region.name).replace('{source}', region.source?.label || '편집자 평가').replace('{asOf}', region.source?.asOf || '확인불가')
      : copy.notices.notSelected;
    root.querySelector('[data-action="reset-budget"]').hidden = !region;

    const any = BUDGET_ITEM_IDS.some((id) => Number.isFinite(items[id]));
    root.querySelector('[data-budget-empty]').hidden = any;
    root.querySelector('[data-budget-out]').hidden = !any;
    const monthly = sumMonthly(items);
    const year = annual(monthly);
    root.querySelector('[data-out="monthly"]').textContent = formatIDR(monthly);
    root.querySelector('[data-out="annual"]').textContent = formatIDR(year);
    const mk = toKRW(monthly, rate), ak = toKRW(year, rate);
    root.querySelector('[data-out="monthlyKRW"]').textContent = mk === null ? '' : `≈ ${formatKRW(mk)} · 참고용 환산`;
    root.querySelector('[data-out="annualKRW"]').textContent = ak === null ? '' : `≈ ${formatKRW(ak)} · 참고용 환산`;
    root.querySelector('[data-rate-hint]').textContent = rate === null
      ? `${copy.notices.rateHint} 예시 ${copy.rateExample.value} · ${copy.rateExample.asOf} · ${copy.rateExample.note}`
      : `외부 환율을 조회하지 않는다. 입력한 환율(1 KRW = ${rate} IDR)로만 환산한다.`;
  };
  store.subscribe(update);
  update(store.getState());
}
