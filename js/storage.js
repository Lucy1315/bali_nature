// localStorage 저장·복원 — contracts/state-schema.md, 헌장 VII
import { initialState, SCHEMA_VERSION, REGION_IDS, FILTER_IDS, CHECKLIST_IDS, BUDGET_ITEM_IDS } from './state.js';
import { MAX_AMOUNT, MAX_RATE } from './lib/budget.js';

export const KEY = 'bali365:plan';

let memory = null; // 저장소를 쓸 수 없을 때의 폴백
export function resetMemory() { memory = null; }

function defaultStorage() {
  try { return globalThis.localStorage; } catch { return undefined; }
}

// raw 객체를 검증해 필드별로 복구한다. { state, recovered }
export function sanitize(raw) {
  const init = initialState();
  if (!raw || typeof raw !== 'object' || raw.version !== SCHEMA_VERSION) return { state: init, recovered: true };
  let recovered = false;
  const state = initialState();

  if (raw.area === null || REGION_IDS.includes(raw.area)) state.area = raw.area ?? null;
  else recovered = true;

  if (Array.isArray(raw.filters)) {
    const seen = new Set();
    const cleaned = raw.filters.filter((f) => FILTER_IDS.includes(f) && !seen.has(f) && seen.add(f));
    if (cleaned.length !== raw.filters.length) recovered = true;
    state.filters = cleaned;
  } else if (raw.filters !== undefined) recovered = true;

  const b = raw.budget && typeof raw.budget === 'object' ? raw.budget : {};
  const items = b.items && typeof b.items === 'object' ? b.items : {};
  for (const id of BUDGET_ITEM_IDS) {
    const v = items[id];
    if (v === null || v === undefined) continue;
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= MAX_AMOUNT) state.budget.items[id] = v;
    else recovered = true;
  }
  if (Array.isArray(b.touched)) {
    const t = b.touched.filter((id) => BUDGET_ITEM_IDS.includes(id));
    if (t.length !== b.touched.length) recovered = true;
    state.budget.touched = [...new Set(t)];
  } else if (b.touched !== undefined) recovered = true;
  if (b.rate === null || b.rate === undefined) state.budget.rate = null;
  else if (typeof b.rate === 'number' && b.rate > 0 && b.rate <= MAX_RATE) state.budget.rate = b.rate;
  else recovered = true;

  const c = raw.checklist && typeof raw.checklist === 'object' ? raw.checklist : {};
  for (const id of CHECKLIST_IDS) {
    const v = c[id];
    if (v === undefined) continue;
    if (typeof v === 'boolean') state.checklist[id] = v;
    else recovered = true;
  }
  return { state, recovered };
}

export function load(opts = {}) {
  const storage = 'storage' in opts ? opts.storage : defaultStorage();
  if (!storage) return { state: memory ?? initialState(), available: false, recovered: false };
  let raw;
  try { raw = storage.getItem(KEY); } catch { return { state: memory ?? initialState(), available: false, recovered: false }; }
  if (memory) return { state: memory, available: false, recovered: false };
  if (raw === null || raw === undefined) return { state: initialState(), available: true, recovered: false };
  let parsed;
  try { parsed = JSON.parse(raw); } catch { return { state: initialState(), available: true, recovered: true }; }
  const { state, recovered } = sanitize(parsed);
  return { state, available: true, recovered };
}

export function save(state, opts = {}) {
  const storage = 'storage' in opts ? opts.storage : defaultStorage();
  if (!storage) { memory = state; return { available: false }; }
  try {
    storage.setItem(KEY, JSON.stringify(state));
    memory = null;
    return { available: true };
  } catch {
    memory = state;
    return { available: false };
  }
}

export function clear(opts = {}) {
  const storage = 'storage' in opts ? opts.storage : defaultStorage();
  memory = null;
  try { storage?.removeItem(KEY); } catch { /* 무시 */ }
  return { state: initialState() };
}
