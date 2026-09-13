// DESIGN §2.2 대비 계산표를 css/tokens.css에서 읽어 검증한다. 기준 미달이면 종료 코드 1.
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../css/tokens.css', import.meta.url), 'utf8');
const tokens = {};
for (const m of css.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)) tokens[m[1]] = m[2];

function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}
export function contrast(a, b) {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [전경, 배경, 최소 비율, 용도]
const pairs = [
  ['ink', 'canvas', 4.5, '본문'],
  ['ink', 'surface', 4.5, '카드 본문'],
  ['ink-muted', 'canvas', 4.5, '보조 텍스트'],
  ['ink-muted', 'surface', 4.5, '카드 보조 텍스트'],
  ['palm', 'canvas', 4.5, '강조 텍스트·현재 내비'],
  ['palm', 'surface', 4.5, '카드 강조 텍스트'],
  ['white', 'palm', 4.5, '선택된 pill·Primary 버튼'],
  ['ink', 'ocean', 4.5, 'Ocean 라벨 위 텍스트'],
  ['ocean-ink', 'canvas', 4.5, 'Ocean 계열 텍스트'],
  ['terracotta-ink', 'canvas', 4.5, '오류 문구'],
  ['terracotta-ink', 'surface', 4.5, '카드 안 오류 문구'],
  ['muted-raw', 'canvas', 3.0, '입력·체크박스 테두리(UI 경계)'],
  ['muted-raw', 'surface', 3.0, '카드 안 입력 테두리'],
  ['palm', 'canvas', 3.0, '포커스 링'],
  ['muted-raw', 'canvas', 3.0, '큰 텍스트(24px+) 보조색'],
];

let failed = 0;
const rows = pairs.map(([fg, bg, min, use]) => {
  const ratio = contrast(tokens[fg], tokens[bg]);
  const ok = ratio >= min;
  if (!ok) failed++;
  return { 전경: fg, 배경: bg, 비율: ratio.toFixed(2), 기준: min.toFixed(1), 판정: ok ? 'PASS' : 'FAIL', 용도: use };
});
console.table(rows);
if (failed) { console.error(`contrast: ${failed}개 조합이 기준에 미달한다.`); process.exit(1); }
console.log(`contrast: ${rows.length}개 조합 전부 통과.`);
