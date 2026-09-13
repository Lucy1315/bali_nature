// 라이프스타일 필터 매칭 — FR-019·FR-020, R-10. AND 기준.
const KNOWN = new Set(['work', 'nature', 'beach', 'quiet', 'community']);

export function matchRegions(regions, filters) {
  const active = (filters || []).filter((f) => KNOWN.has(f));
  const status = {};
  const matched = [];
  for (const r of regions) {
    if (active.length === 0) { status[r.id] = 'neutral'; continue; }
    const ok = active.every((f) => r.tags.includes(f));
    status[r.id] = ok ? 'highlighted' : 'dimmed';
    if (ok) matched.push(r.id);
  }
  return { status, matched, none: active.length > 0 && matched.length === 0 };
}
