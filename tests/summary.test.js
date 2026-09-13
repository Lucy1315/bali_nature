import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checklistProgress, buildSummary, summaryToText } from '../js/lib/summary.js';
import { initialState } from '../js/state.js';

const data = {
  regions: [{ id: 'ubud', name: 'Ubud' }, { id: 'sanur', name: 'Sanur' }],
  copy: { filterLabels: { work: 'Work', nature: 'Nature', beach: 'Beach', quiet: 'Quiet', community: 'Community' } },
};

test('checklistProgress: 0/6, 3/6, 6/6', () => {
  const c = initialState().checklist;
  assert.deepEqual(checklistProgress(c), { done: 0, total: 6, complete: false });
  assert.deepEqual(checklistProgress({ ...c, visa: true, insurance: true, transport: true }), { done: 3, total: 6, complete: false });
  const all = Object.fromEntries(Object.keys(c).map((k) => [k, true]));
  assert.deepEqual(checklistProgress(all), { done: 6, total: 6, complete: true });
});

test('buildSummary: 미선택 상태', () => {
  const s = buildSummary(initialState(), data);
  assert.equal(s.area, null);
  assert.equal(s.lifestyle, null);
  assert.equal(s.monthly, null, '입력이 하나도 없으면 null');
  assert.equal(s.annual, null);
  assert.equal(s.monthlyKRW, null);
  assert.deepEqual(s.progress, { done: 0, total: 6, complete: false });
});

test('buildSummary: 선택·입력 반영, lifestyle 라벨 결합, KRW', () => {
  const st = initialState();
  st.area = 'ubud';
  st.filters = ['nature', 'quiet'];
  st.budget.items.housing = 8000000;
  st.budget.items.food = 4000000;
  st.budget.rate = 12;
  st.checklist.visa = true;
  const s = buildSummary(st, data);
  assert.equal(s.area, 'Ubud');
  assert.equal(s.lifestyle, 'Nature + Quiet');
  assert.equal(s.monthly, 12000000);
  assert.equal(s.annual, 144000000);
  assert.equal(s.monthlyKRW, 1000000);
  assert.equal(s.annualKRW, 12000000);
  assert.equal(s.progress.done, 1);
});

test('buildSummary: 환율 없으면 KRW null, 항목 0 입력은 monthly 0', () => {
  const st = initialState();
  st.budget.items.other = 0;
  const s = buildSummary(st, data);
  assert.equal(s.monthly, 0);
  assert.equal(s.monthlyKRW, null);
});

test('summaryToText: 5줄, 미선택은 대시', () => {
  const text = summaryToText(buildSummary(initialState(), data));
  const lines = text.split('\n');
  assert.equal(lines.length, 6, '제목 1줄 + 5값');
  assert.equal(lines[0], 'YOUR BALI YEAR');
  assert.match(lines[1], /^Base: —$/);
  assert.match(lines[5], /^Checklist: 0 \/ 6$/);
  const st = initialState(); st.area = 'sanur'; st.budget.items.housing = 5000000; st.budget.rate = 10;
  const t2 = summaryToText(buildSummary(st, data)).split('\n');
  assert.equal(t2[1], 'Base: Sanur');
  assert.equal(t2[3], 'Monthly: 5,000,000 IDR (500,000 KRW)');
  assert.equal(t2[4], 'Year: 60,000,000 IDR (6,000,000 KRW)');
});
