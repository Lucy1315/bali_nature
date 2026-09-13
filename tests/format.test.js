import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatNumber, formatIDR, formatKRW, formatProgress } from '../js/lib/format.js';

test('formatNumber: 쉼표 천 단위, 정수 반올림', () => {
  assert.equal(formatNumber(18500000), '18,500,000');
  assert.equal(formatNumber(1234.6), '1,235');
  assert.equal(formatNumber(0), '0');
});

test('formatIDR / formatKRW: 통화 접미, null은 대시', () => {
  assert.equal(formatIDR(18500000), '18,500,000 IDR');
  assert.equal(formatKRW(1541667), '1,541,667 KRW');
  assert.equal(formatIDR(null), '—');
  assert.equal(formatKRW(undefined), '—');
  assert.equal(formatIDR(NaN), '—');
});

test('formatProgress: "N / M"', () => {
  assert.equal(formatProgress(3, 6), '3 / 6');
  assert.equal(formatProgress(0, 6), '0 / 6');
});
