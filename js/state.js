// 단일 스토어 — R-03. reducer는 순수 함수이며 변화가 없으면 같은 참조를 돌려준다.
import { BUDGET_ITEM_IDS, emptyItems, applyRegionDefaults, validateAmount, validateRate } from './lib/budget.js';

export const SCHEMA_VERSION = 1;
export const REGION_IDS = ['canggu', 'ubud', 'sanur', 'uluwatu'];
export const FILTER_IDS = ['work', 'nature', 'beach', 'quiet', 'community'];
export const CHECKLIST_IDS = ['visa', 'insurance', 'accommodation', 'workspace', 'transport', 'emergency'];
export { BUDGET_ITEM_IDS };

export const ACTIONS = Object.freeze({
  HYDRATE: 'HYDRATE',
  SELECT_AREA: 'SELECT_AREA',
  TOGGLE_FILTER: 'TOGGLE_FILTER',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_BUDGET_ITEM: 'SET_BUDGET_ITEM',
  RESET_BUDGET_TO_REGION: 'RESET_BUDGET_TO_REGION',
  SET_RATE: 'SET_RATE',
  TOGGLE_CHECK: 'TOGGLE_CHECK',
  RESET_CHECKLIST: 'RESET_CHECKLIST',
  RESET_ALL: 'RESET_ALL',
});

export function initialState() {
  return {
    version: SCHEMA_VERSION,
    area: null,
    filters: [],
    budget: { items: emptyItems(), touched: [], rate: null },
    checklist: Object.fromEntries(CHECKLIST_IDS.map((id) => [id, false])),
  };
}

function regionDefaults(data, id) {
  return data?.regions?.find((r) => r.id === id)?.budgetDefaults;
}

export function reducer(state, action, data) {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.HYDRATE:
      return payload;

    case ACTIONS.SELECT_AREA: {
      const next = payload === state.area ? null : payload;
      if (next !== null && !REGION_IDS.includes(next)) return state;
      if (next === state.area) return state;
      let budget = state.budget;
      const defaults = next ? regionDefaults(data, next) : null;
      if (defaults) budget = { ...budget, items: applyRegionDefaults(budget.items, budget.touched, defaults) };
      return { ...state, area: next, budget };
    }

    case ACTIONS.TOGGLE_FILTER: {
      if (!FILTER_IDS.includes(payload)) return state;
      const has = state.filters.includes(payload);
      const filters = has ? state.filters.filter((f) => f !== payload) : [...state.filters, payload];
      return { ...state, filters };
    }

    case ACTIONS.CLEAR_FILTERS:
      return state.filters.length ? { ...state, filters: [] } : state;

    case ACTIONS.SET_BUDGET_ITEM: {
      const { id, value } = payload || {};
      if (!BUDGET_ITEM_IDS.includes(id)) return state;
      const v = validateAmount(value);
      if (!v.ok) return state;
      const items = { ...state.budget.items, [id]: v.value };
      const touched = v.value === null
        ? state.budget.touched.filter((t) => t !== id)
        : state.budget.touched.includes(id) ? state.budget.touched : [...state.budget.touched, id];
      return { ...state, budget: { ...state.budget, items, touched } };
    }

    case ACTIONS.RESET_BUDGET_TO_REGION: {
      const defaults = regionDefaults(data, state.area);
      if (!defaults) return state;
      return { ...state, budget: { ...state.budget, touched: [], items: applyRegionDefaults(state.budget.items, [], defaults) } };
    }

    case ACTIONS.SET_RATE: {
      const v = validateRate(payload);
      if (!v.ok || v.value === state.budget.rate) return state;
      return { ...state, budget: { ...state.budget, rate: v.value } };
    }

    case ACTIONS.TOGGLE_CHECK: {
      if (!CHECKLIST_IDS.includes(payload)) return state;
      return { ...state, checklist: { ...state.checklist, [payload]: !state.checklist[payload] } };
    }

    case ACTIONS.RESET_CHECKLIST:
      return { ...state, checklist: initialState().checklist };

    case ACTIONS.RESET_ALL:
      return initialState();

    default:
      return state;
  }
}

export function createStore(initial, reduce, data) {
  let state = initial;
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      const next = reduce(state, action, data);
      if (next === state) return;
      state = next;
      for (const fn of listeners) fn(state, action);
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
