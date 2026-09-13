import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchRegions } from '../js/lib/filter.js';

const regions = [
  { id: 'canggu', tags: ['work', 'beach', 'community'] },
  { id: 'ubud', tags: ['work', 'nature', 'quiet', 'community'] },
  { id: 'sanur', tags: ['quiet', 'beach'] },
  { id: 'uluwatu', tags: ['beach', 'nature', 'quiet'] },
];

test('필터 없음 → 전부 neutral, none=false', () => {
  const r = matchRegions(regions, []);
  assert.deepEqual(r.status, { canggu: 'neutral', ubud: 'neutral', sanur: 'neutral', uluwatu: 'neutral' });
  assert.equal(r.none, false);
  assert.deepEqual(r.matched, []);
});

test('단일 필터 quiet → 충족 highlighted, 나머지 dimmed', () => {
  const r = matchRegions(regions, ['quiet']);
  assert.equal(r.status.canggu, 'dimmed');
  assert.equal(r.status.ubud, 'highlighted');
  assert.equal(r.status.sanur, 'highlighted');
  assert.equal(r.status.uluwatu, 'highlighted');
  assert.deepEqual(r.matched, ['ubud', 'sanur', 'uluwatu']);
  assert.equal(r.none, false);
});

test('AND: quiet + beach → sanur·uluwatu만', () => {
  const r = matchRegions(regions, ['quiet', 'beach']);
  assert.deepEqual(r.matched, ['sanur', 'uluwatu']);
});

test('매치 0 → none=true, 전부 dimmed', () => {
  const r = matchRegions(regions, ['work', 'nature', 'beach', 'quiet', 'community']);
  assert.equal(r.none, true);
  assert.deepEqual(Object.values(r.status), ['dimmed', 'dimmed', 'dimmed', 'dimmed']);
});

test('미상 필터는 무시한다', () => {
  const r = matchRegions(regions, ['quiet', 'nope']);
  assert.deepEqual(r.matched, ['ubud', 'sanur', 'uluwatu']);
});

test('입력을 변경하지 않는다', () => {
  const f = ['quiet'];
  matchRegions(regions, f);
  assert.deepEqual(f, ['quiet']);
  assert.deepEqual(regions[0].tags, ['work', 'beach', 'community']);
});
