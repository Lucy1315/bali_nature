import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BUDGET_ITEM_IDS, emptyItems, sumMonthly, annual, toKRW,
  validateAmount, validateRate, applyRegionDefaults, MAX_AMOUNT,
} from '../js/lib/budget.js';

const full = { housing: 8000000, food: 4000000, coworking: 1500000, transport: 800000, wellness: 1500000, insurance: 700000, other: 1000000 };

test('BUDGET_ITEM_IDS 순서 고정 7개', () => {
  assert.deepEqual(BUDGET_ITEM_IDS, ['housing', 'food', 'coworking', 'transport', 'wellness', 'insurance', 'other']);
  assert.deepEqual(Object.values(emptyItems()), [null, null, null, null, null, null, null]);
});

test('sumMonthly: null은 0, 7항목 합', () => {
  assert.equal(sumMonthly(full), 17500000);
  assert.equal(sumMonthly({ ...emptyItems(), housing: 5000000 }), 5000000);
  assert.equal(sumMonthly(emptyItems()), 0);
});

test('annual = monthly × 12', () => {
  assert.equal(annual(17500000), 210000000);
  assert.equal(annual(0), 0);
});

test('toKRW: rate null/0/음수 → null, 아니면 IDR ÷ rate 반올림', () => {
  assert.equal(toKRW(17500000, null), null);
  assert.equal(toKRW(17500000, 0), null);
  assert.equal(toKRW(17500000, -3), null);
  assert.equal(toKRW(17500000, 12), 1458333);
  assert.equal(toKRW(0, 12), 0);
});

test('validateAmount: 빈값 → null 허용, 숫자 문자열 허용, 나머지 오류', () => {
  assert.deepEqual(validateAmount(''), { ok: true, value: null });
  assert.deepEqual(validateAmount(null), { ok: true, value: null });
  assert.deepEqual(validateAmount('8,000,000'), { ok: true, value: 8000000 });
  assert.deepEqual(validateAmount(1234.6), { ok: true, value: 1235 });
  assert.equal(validateAmount('abc').ok, false);
  assert.equal(validateAmount(-1).ok, false);
  assert.equal(validateAmount(MAX_AMOUNT + 1).ok, false);
  assert.equal(validateAmount(MAX_AMOUNT).ok, true);
  assert.equal(typeof validateAmount('abc').error, 'string');
});

test('validateRate: 빈값 → null, 양수만 허용, 상한', () => {
  assert.deepEqual(validateRate(''), { ok: true, value: null });
  assert.deepEqual(validateRate('12'), { ok: true, value: 12 });
  assert.deepEqual(validateRate('11.5'), { ok: true, value: 11.5 });
  assert.equal(validateRate(0).ok, false);
  assert.equal(validateRate(-2).ok, false);
  assert.equal(validateRate('x').ok, false);
  assert.equal(validateRate(1e7).ok, false);
});

test('applyRegionDefaults: touched 항목은 보호, 나머지 덮어씀', () => {
  const items = { ...emptyItems(), food: 9999999, housing: 1 };
  const out = applyRegionDefaults(items, ['food'], full);
  assert.equal(out.food, 9999999);
  assert.equal(out.housing, 8000000);
  assert.equal(out.other, 1000000);
  assert.notEqual(out, items, '새 객체를 반환한다');
});

test('applyRegionDefaults: touched 비우면 전부 덮어씀', () => {
  const items = { ...full, food: 1 };
  assert.deepEqual(applyRegionDefaults(items, [], full), full);
});

test('SC-003 표 기반: 임의 조합 10개의 합·연간·환산', () => {
  const cases = [
    [[1, 2, 3, 4, 5, 6, 7], 10],
    [[1000000, 0, 0, 0, 0, 0, 0], 12],
    [[8000000, 4000000, 1500000, 800000, 1500000, 700000, 1000000], 12],
    [[null, null, null, null, null, null, 500000], 11.5],
    [[12000000, 5000000, 2500000, 1500000, 2500000, 1000000, 1500000], 13],
    [[0, 0, 0, 0, 0, 0, 0], 12],
    [[6000000, 3000000, 1000000, 600000, 800000, 500000, 800000], 9],
    [[7777777, 1, 1, 1, 1, 1, 1], 7],
    [[1e11, 1e11, 1e11, 1e11, 1e11, 1e11, 1e11], 12],
    [[123, 456, 789, 0, null, 10, 20], 1],
  ];
  for (const [vals, rate] of cases) {
    const items = Object.fromEntries(BUDGET_ITEM_IDS.map((id, i) => [id, vals[i]]));
    const m = vals.reduce((a, v) => a + (v ?? 0), 0);
    assert.equal(sumMonthly(items), m);
    assert.equal(annual(m), m * 12);
    assert.equal(toKRW(m, rate), Math.round(m / rate));
  }
});
