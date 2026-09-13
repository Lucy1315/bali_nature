import { test } from 'node:test';
import assert from 'node:assert/strict';

import { KEY, load, save, clear, sanitize, resetMemory } from '../js/storage.js';

import { initialState } from '../js/state.js';

function fakeStorage(init = {}) {
  const map = new Map(Object.entries(init));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    _map: map,
  };
}

test('KEY 접두어', () => { assert.equal(KEY, 'bali365:plan'); });

test('정상 왕복', () => {
  const st = fakeStorage();
  const state = { ...initialState(), area: 'ubud', filters: ['nature', 'quiet'] };
  state.budget = { ...state.budget, items: { ...state.budget.items, housing: 8000000 }, touched: ['housing'], rate: 12 };
  state.checklist = { ...state.checklist, visa: true };
  assert.deepEqual(save(state, { storage: st }), { available: true });
  const r = load({ storage: st });
  assert.equal(r.available, true);
  assert.equal(r.recovered, false);
  assert.deepEqual(r.state, state);
});

test('저장된 값이 없으면 초기값', () => {
  const r = load({ storage: fakeStorage() });
  assert.deepEqual(r.state, initialState());
  assert.equal(r.available, true);
  assert.equal(r.recovered, false);
});

test('손상 JSON → 초기값, recovered', () => {
  const r = load({ storage: fakeStorage({ [KEY]: '{not json' }) });
  assert.deepEqual(r.state, initialState());
  assert.equal(r.recovered, true);
});

test('version 0 → 초기값', () => {
  const r = load({ storage: fakeStorage({ [KEY]: JSON.stringify({ version: 0, area: 'ubud' }) }) });
  assert.deepEqual(r.state, initialState());
  assert.equal(r.recovered, true);
});

test('필드별 부분 복구: 미상 지역·filters 문자열·items 문자열·rate 음수·checklist 누락', () => {
  const raw = {
    version: 1, area: 'mars', filters: 'x',
    budget: { items: { housing: '8000000', food: 4000000, nope: 1 }, touched: ['food', 'zzz'], rate: -3 },
    checklist: { visa: true, insurance: 'yes' },
  };
  const { state, recovered } = sanitize(raw);
  assert.equal(recovered, true);
  assert.equal(state.area, null);
  assert.deepEqual(state.filters, []);
  assert.equal(state.budget.items.housing, null, '문자열 금액은 초기값');
  assert.equal(state.budget.items.food, 4000000, '유효한 항목은 유지');
  assert.equal('nope' in state.budget.items, false);
  assert.deepEqual(state.budget.touched, ['food']);
  assert.equal(state.budget.rate, null);
  assert.equal(state.checklist.visa, true);
  assert.equal(state.checklist.insurance, false);
  assert.equal(state.checklist.emergency, false);
});

test('filters 중복·미상 값 제거, items 상한·소수', () => {
  const raw = { ...initialState(), filters: ['work', 'work', 'nope', 'beach'] };
  raw.budget = { ...raw.budget, items: { ...raw.budget.items, housing: 1e13, food: 12.7 } };
  const { state } = sanitize(raw);
  assert.deepEqual(state.filters, ['work', 'beach']);
  assert.equal(state.budget.items.housing, null);
  assert.equal(state.budget.items.food, null, '정수가 아니면 초기값');
});

test('setItem이 throw → available:false, 메모리 폴백으로 load 가능', () => {
  const st = fakeStorage();
  st.setItem = () => { throw new Error('QuotaExceeded'); };
  const state = { ...initialState(), area: 'sanur' };
  assert.deepEqual(save(state, { storage: st }), { available: false });
  const r = load({ storage: st });
  assert.equal(r.available, false);
  assert.equal(r.state.area, 'sanur', '메모리에 보관한 최신 상태를 돌려준다');
});

test('getItem이 throw → 초기값, available:false', () => {
  resetMemory();
  const st = { getItem() { throw new Error('blocked'); }, setItem() {}, removeItem() {} };
  const r = load({ storage: st });
  assert.equal(r.available, false);
  assert.deepEqual(r.state, initialState());
});

test('storage가 없으면(null/undefined) available:false', () => {
  resetMemory();
  assert.equal(load({ storage: undefined }).available, false);
  const r = load({ storage: null });
  assert.equal(r.available, false);
});

test('clear는 키를 지우고 초기값을 돌려준다', () => {
  const st = fakeStorage({ [KEY]: JSON.stringify({ ...initialState(), area: 'ubud' }) });
  const r = clear({ storage: st });
  assert.deepEqual(r.state, initialState());
  assert.equal(st.getItem(KEY), null);
});
