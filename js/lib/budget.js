// 예산 계산 — 순수 함수. FR-023~FR-027, R-08·R-11
export const BUDGET_ITEM_IDS = ['housing', 'food', 'coworking', 'transport', 'wellness', 'insurance', 'other'];
export const MAX_AMOUNT = 1e12;
export const MAX_RATE = 1e6;

export function emptyItems() {
  return Object.fromEntries(BUDGET_ITEM_IDS.map((id) => [id, null]));
}

export function sumMonthly(items) {
  return BUDGET_ITEM_IDS.reduce((sum, id) => sum + (Number.isFinite(items?.[id]) ? items[id] : 0), 0);
}

export function annual(monthly) {
  return monthly * 12;
}

// 1 KRW = rate IDR → KRW = IDR ÷ rate
export function toKRW(idr, rate) {
  if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(idr)) return null;
  return Math.round(idr / rate);
}

function parseNumber(input) {
  if (input === null || input === undefined) return null;
  if (typeof input === 'number') return input;
  const s = String(input).replace(/[,\s_]/g, '').trim();
  if (s === '') return null;
  if (!/^-?\d+(\.\d+)?$/.test(s)) return NaN;
  return Number(s);
}

export function validateAmount(input) {
  const n = parseNumber(input);
  if (n === null) return { ok: true, value: null };
  if (Number.isNaN(n)) return { ok: false, error: '숫자만 입력한다.' };
  if (n < 0) return { ok: false, error: '0 이상의 금액을 입력한다.' };
  if (n > MAX_AMOUNT) return { ok: false, error: '금액이 너무 크다. 1조 IDR 이하로 입력한다.' };
  return { ok: true, value: Math.round(n) };
}

export function validateRate(input) {
  const n = parseNumber(input);
  if (n === null) return { ok: true, value: null };
  if (Number.isNaN(n)) return { ok: false, error: '숫자만 입력한다.' };
  if (n <= 0) return { ok: false, error: '0보다 큰 값을 입력한다.' };
  if (n > MAX_RATE) return { ok: false, error: '환율 값이 너무 크다.' };
  return { ok: true, value: n };
}

// touched에 없는 항목만 지역 기본값으로 덮어쓴다. 새 객체 반환.
export function applyRegionDefaults(items, touched, defaults) {
  const keep = new Set(touched || []);
  const out = { ...emptyItems(), ...items };
  for (const id of BUDGET_ITEM_IDS) {
    if (!keep.has(id) && Number.isFinite(defaults?.[id])) out[id] = defaults[id];
  }
  return out;
}
