// 숫자·통화 표기 — R-09: 쉼표 천 단위, 통화 코드 접미, 정수 반올림
const nf = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 });

export function formatNumber(n) {
  if (!Number.isFinite(n)) return '—';
  return nf.format(Math.round(n));
}
export function formatIDR(n) {
  return Number.isFinite(n) ? `${formatNumber(n)} IDR` : '—';
}
export function formatKRW(n) {
  return Number.isFinite(n) ? `${formatNumber(n)} KRW` : '—';
}
export function formatProgress(done, total) {
  return `${done} / ${total}`;
}
