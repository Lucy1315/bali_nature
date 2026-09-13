// DESIGN §2.2 대비 계산표를 css/tokens.css에서 읽어 검증한다. 기준 미달이면 종료 코드 1.
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../css/tokens.css', import.meta.url), 'utf8');
const tokens = {};
for (const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)) tokens[m[1]] = m[2];

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
  ['ink', 'surface-1', 4.5, '카드 본문'],
  ['ink', 'surface-2', 4.5, '강조 카드 본문'],
  ['ink-muted', 'canvas', 4.5, '보조 텍스트'],
  ['ink-muted', 'surface-1', 4.5, '카드 보조 텍스트'],
  ['ink-muted', 'surface-2', 4.5, '강조 카드 보조 텍스트'],
  ['accent', 'canvas', 4.5, 'eyebrow·링크'],
  ['accent', 'surface-1', 4.5, '카드 안 링크'],
  ['accent', 'surface-2', 4.5, '선택 열 헤더'],
  ['on-primary', 'primary', 4.5, '흰 알약 버튼 텍스트'],
  ['error', 'surface-1', 4.5, '오류 문구'],
  ['error', 'canvas', 4.5, '오류 문구(캔버스)'],
  ['border-input', 'surface-1', 3.0, '입력·체크박스 경계'],
  ['border-input', 'canvas', 3.0, '캔버스 위 입력 경계'],
  ['accent', 'canvas', 3.0, '포커스 링'],
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
