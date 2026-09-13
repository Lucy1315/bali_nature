import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore, reducer, initialState, ACTIONS } from '../js/state.js';

const regions = [
  { id: 'ubud', budgetDefaults: { housing: 8000000, food: 4000000, coworking: 1500000, transport: 800000, wellness: 1500000, insurance: 700000, other: 1000000 } },
  { id: 'canggu', budgetDefaults: { housing: 12000000, food: 5000000, coworking: 2000000, transport: 1200000, wellness: 2000000, insurance: 800000, other: 1500000 } },
];
const data = { regions };
const mk = () => createStore(initialState(), reducer, data);

test('initialState 모양', () => {
  const s = initialState();
  assert.equal(s.version, 1);
  assert.equal(s.area, null);
  assert.deepEqual(s.filters, []);
  assert.deepEqual(Object.keys(s.budget.items).length, 7);
  assert.deepEqual(s.budget.touched, []);
  assert.equal(s.budget.rate, null);
  assert.deepEqual(Object.values(s.checklist), [false, false, false, false, false, false]);
});

test('createStore: dispatch → getState, 구독자는 변화가 있을 때만', () => {
  const store = mk();
  let calls = 0;
  const unsub = store.subscribe(() => { calls++; });
  store.dispatch({ type: ACTIONS.TOGGLE_FILTER, payload: 'work' });
  assert.deepEqual(store.getState().filters, ['work']);
  assert.equal(calls, 1);
  store.dispatch({ type: ACTIONS.CLEAR_FILTERS });
  store.dispatch({ type: ACTIONS.CLEAR_FILTERS }); // 이미 비어 있음 → 변화 없음
  assert.equal(calls, 2);
  unsub();
  store.dispatch({ type: ACTIONS.TOGGLE_FILTER, payload: 'work' });
  assert.equal(calls, 2);
});

test('HYDRATE는 상태를 교체한다', () => {
  const store = mk();
  const next = { ...initialState(), area: 'ubud' };
  store.dispatch({ type: ACTIONS.HYDRATE, payload: next });
  assert.equal(store.getState().area, 'ubud');
});

test('SELECT_AREA: 단일 선택, 같은 값 재선택은 해제, 기본값 적용', () => {
  const store = mk();
  store.dispatch({ type: ACTIONS.SELECT_AREA, payload: 'ubud' });
  assert.equal(store.getState().area, 'ubud');
  assert.equal(store.getState().budget.items.housing, 8000000);
  store.dispatch({ type: ACTIONS.SELECT_AREA, payload: 'canggu' });
  assert.equal(store.getState().area, 'canggu');
  assert.equal(store.getState().budget.items.housing, 12000000);
  store.dispatch({ type: ACTIONS.SELECT_AREA, payload: 'canggu' });
  assert.equal(store.getState().area, null);
  store.dispatch({ type: ACTIONS.SELECT_AREA, payload: 'mars' });
  assert.equal(store.getState().area, null, '미상 지역은 무시');
});

test('SELECT_AREA는 touched 항목을 보호한다', () => {
  const store = mk();
  store.dispatch({ type: ACTIONS.SELECT_AREA, payload: 'ubud' });
  store.dispatch({ type: ACTIONS.SET_BUDGET_ITEM, payload: { id: 'food', value: 9999999 } });
  store.dispatch({ type: ACTIONS.SELECT_AREA, payload: 'canggu' });
  const b = store.getState().budget;
  assert.equal(b.items.food, 9999999);
  assert.equal(b.items.housing, 12000000);
  assert.deepEqual(b.touched, ['food']);
  store.dispatch({ type: ACTIONS.RESET_BUDGET_TO_REGION });
  assert.equal(store.getState().budget.items.food, 5000000);
  assert.deepEqual(store.getState().budget.touched, []);
});

test('TOGGLE_FILTER: 추가/제거, 미상 값 무시', () => {
  const store = mk();
  store.dispatch({ type: ACTIONS.TOGGLE_FILTER, payload: 'quiet' });
  store.dispatch({ type: ACTIONS.TOGGLE_FILTER, payload: 'beach' });
  assert.deepEqual(store.getState().filters, ['quiet', 'beach']);
  store.dispatch({ type: ACTIONS.TOGGLE_FILTER, payload: 'quiet' });
  assert.deepEqual(store.getState().filters, ['beach']);
  const before = store.getState();
  store.dispatch({ type: ACTIONS.TOGGLE_FILTER, payload: 'nope' });
  assert.equal(store.getState(), before);
});

test('SET_BUDGET_ITEM: 유효값만 반영, null이면 touched에서 제거', () => {
  const store = mk();
  store.dispatch({ type: ACTIONS.SET_BUDGET_ITEM, payload: { id: 'housing', value: 5000000 } });
  assert.equal(store.getState().budget.items.housing, 5000000);
  assert.deepEqual(store.getState().budget.touched, ['housing']);
  const before = store.getState();
  store.dispatch({ type: ACTIONS.SET_BUDGET_ITEM, payload: { id: 'housing', value: -5 } });
  assert.equal(store.getState(), before, '음수는 무시');
  store.dispatch({ type: ACTIONS.SET_BUDGET_ITEM, payload: { id: 'nope', value: 1 } });
  assert.equal(store.getState(), before, '미상 항목은 무시');
  store.dispatch({ type: ACTIONS.SET_BUDGET_ITEM, payload: { id: 'housing', value: null } });
  assert.equal(store.getState().budget.items.housing, null);
  assert.deepEqual(store.getState().budget.touched, []);
});

test('SET_RATE: 양수만, null 허용', () => {
  const store = mk();
  store.dispatch({ type: ACTIONS.SET_RATE, payload: 12 });
  assert.equal(store.getState().budget.rate, 12);
  store.dispatch({ type: ACTIONS.SET_RATE, payload: -1 });
  assert.equal(store.getState().budget.rate, 12);
  store.dispatch({ type: ACTIONS.SET_RATE, payload: null });
  assert.equal(store.getState().budget.rate, null);
});

test('TOGGLE_CHECK / RESET_CHECKLIST / RESET_ALL', () => {
  const store = mk();
  store.dispatch({ type: ACTIONS.TOGGLE_CHECK, payload: 'visa' });
  store.dispatch({ type: ACTIONS.TOGGLE_CHECK, payload: 'insurance' });
  assert.equal(store.getState().checklist.visa, true);
  store.dispatch({ type: ACTIONS.TOGGLE_CHECK, payload: 'visa' });
  assert.equal(store.getState().checklist.visa, false);
  const before = store.getState();
  store.dispatch({ type: ACTIONS.TOGGLE_CHECK, payload: 'nope' });
  assert.equal(store.getState(), before);
  store.dispatch({ type: ACTIONS.RESET_CHECKLIST });
  assert.equal(store.getState().checklist.insurance, false);
  store.dispatch({ type: ACTIONS.SELECT_AREA, payload: 'ubud' });
  store.dispatch({ type: ACTIONS.RESET_ALL });
  assert.deepEqual(store.getState(), initialState());
});

test('reducer는 원본 상태를 변경하지 않는다', () => {
  const s = initialState();
  const snapshot = JSON.stringify(s);
  reducer(s, { type: ACTIONS.TOGGLE_FILTER, payload: 'work' }, data);
  reducer(s, { type: ACTIONS.SET_BUDGET_ITEM, payload: { id: 'food', value: 1 } }, data);
  reducer(s, { type: ACTIONS.TOGGLE_CHECK, payload: 'visa' }, data);
  assert.equal(JSON.stringify(s), snapshot);
});
