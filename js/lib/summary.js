// My Bali Year 요약 — FR-038·FR-039·FR-042
import { sumMonthly, annual, toKRW, BUDGET_ITEM_IDS } from './budget.js';
import { formatIDR, formatKRW, formatProgress } from './format.js';

export function checklistProgress(checklist) {
  const ids = Object.keys(checklist);
  const done = ids.filter((id) => checklist[id] === true).length;
  return { done, total: ids.length, complete: ids.length > 0 && done === ids.length };
}

export function buildSummary(state, data) {
  const region = data.regions.find((r) => r.id === state.area);
  const labels = data.copy?.filterLabels || {};
  const lifestyle = state.filters.length ? state.filters.map((f) => labels[f] || f).join(' + ') : null;
  const anyInput = BUDGET_ITEM_IDS.some((id) => Number.isFinite(state.budget.items[id]));
  const monthly = anyInput ? sumMonthly(state.budget.items) : null;
  const year = monthly === null ? null : annual(monthly);
  return {
    area: region ? region.name : null,
    areaId: region ? region.id : null,
    lifestyle,
    monthly,
    annual: year,
    monthlyKRW: monthly === null ? null : toKRW(monthly, state.budget.rate),
    annualKRW: year === null ? null : toKRW(year, state.budget.rate),
    progress: checklistProgress(state.checklist),
  };
}

function money(idr, krw) {
  if (idr === null) return '—';
  return krw === null ? formatIDR(idr) : `${formatIDR(idr)} (${formatKRW(krw)})`;
}

export function summaryToText(s) {
  return [
    'YOUR BALI YEAR',
    `Base: ${s.area ?? '—'}`,
    `Lifestyle: ${s.lifestyle ?? '—'}`,
    `Monthly: ${money(s.monthly, s.monthlyKRW)}`,
    `Year: ${money(s.annual, s.annualKRW)}`,
    `Checklist: ${formatProgress(s.progress.done, s.progress.total)}`,
  ].join('\n');
}
