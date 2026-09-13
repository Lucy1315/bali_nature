// data/*.js 콘텐츠 계약 검사 — contracts/content-schema.md. 위반 시 종료 코드 1.
const load = async (n) => Object.values(await import(`../data/${n}.js`))[0];
const [copy, regions, months, workLive, stay, checklist, localLife] =
  await Promise.all(['copy', 'regions', 'months', 'workLive', 'stay', 'checklist', 'localLife'].map(load));

const errors = [];
const fail = (msg) => errors.push(msg);
const isInt15 = (v) => Number.isInteger(v) && v >= 1 && v <= 5;
const need = (obj, keys, where) => { for (const k of keys) if (obj?.[k] === undefined) fail(`${where}: 필드 '${k}' 누락`); };
const FORBID = /(가능하다|가능합니다|된다|됩니다|허용된다|허용됩니다)/;
const HTML = /<[a-z!/][^>]*>/i;
const POLITE = /(입니다|습니다|세요|해요|예요)\s*[.!]?$/m;

const allStrings = [];
const walk = (v, path) => {
  if (typeof v === 'string') allStrings.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
};
walk({ copy, regions, months, workLive, stay, checklist, localLife }, 'data');
for (const [p, s] of allStrings) {
  if (HTML.test(s)) fail(`${p}: HTML 태그 포함`);
  if (POLITE.test(s)) fail(`${p}: 존댓말 종결 ("${s.slice(-12)}")`);
}

// copy
if (copy.hero?.title !== 'BALI 365') fail('copy.hero.title 원문 불일치');
if (copy.hero?.subtitle !== '디지털노마드로 발리에서 1년 살기') fail('copy.hero.subtitle 원문 불일치');
if (copy.hero?.tagline !== '여행보다 길고, 이민보다 가볍게. 일하고, 머물고, 살아보는 발리의 365일.') fail('copy.hero.tagline 원문 불일치');
if (copy.whyBali?.length !== 4) fail('copy.whyBali 4개 아님');
for (const k of ['work', 'nature', 'beach', 'quiet', 'community']) if (!copy.filterLabels?.[k]) fail(`copy.filterLabels.${k} 누락`);
for (const k of ['housing', 'food', 'coworking', 'transport', 'wellness', 'insurance', 'other']) need(copy.budgetLabels?.[k], ['en', 'ko'], `copy.budgetLabels.${k}`);
need(copy.notices, ['storageUnavailable', 'rateHint', 'emptyBudget', 'notSelected', 'official', 'noMatch', 'regionDefault', 'copied', 'copyFallback', 'resetConfirm', 'resetAllConfirm', 'checklistDone', 'staleInfo'], 'copy.notices');
need(copy.rateExample, ['value', 'asOf'], 'copy.rateExample');
need(copy.sectionIntros, ['findYourBase', 'twelveMonths', 'monthlyBudget', 'workLive', 'visaStay', 'localLife', 'myBaliYear'], 'copy.sectionIntros');

// regions
const RIDS = ['canggu', 'ubud', 'sanur', 'uluwatu'];
if (regions.map((r) => r.id).join() !== RIDS.join()) fail(`regions id/순서: ${regions.map((r) => r.id).join()}`);
for (const r of regions) {
  const w = `regions.${r.id}`;
  need(r, ['name', 'vibe', 'scores', 'tags', 'recommendedFor', 'budgetDefaults', 'workLive', 'source'], w);
  for (const k of ['work', 'nature', 'convenience', 'calm']) if (!isInt15(r.scores?.[k]) && r.scores?.[k] !== '확인불가') fail(`${w}.scores.${k} 1~5 아님`);
  for (const k of ['internet', 'coworking', 'cafe']) if (!isInt15(r.workLive?.[k]) && r.workLive?.[k] !== '확인불가') fail(`${w}.workLive.${k} 1~5 아님`);
  for (const k of ['housing', 'food', 'coworking', 'transport', 'wellness', 'insurance', 'other']) {
    const v = r.budgetDefaults?.[k];
    if (!(Number.isInteger(v) && v >= 0) && v !== '확인불가') fail(`${w}.budgetDefaults.${k} 0 이상 정수 아님`);
  }
  for (const t of r.tags || []) if (!copy.filterLabels[t]) fail(`${w}.tags에 미상 값 ${t}`);
  need(r.source, ['label', 'asOf'], `${w}.source`);
  if (r.source?.asOf && !/^\d{4}-\d{2}$/.test(r.source.asOf)) fail(`${w}.source.asOf 형식`);
}

// months
if (months.length !== 12 || months.some((m, i) => m.month !== i + 1)) fail('months 12개·순서 위반');
for (const m of months) {
  need(m, ['rhythm', 'title', 'body', 'seasonNote', 'asOf'], `months[${m.month}]`);
  if (!['work', 'explore', 'recharge', 'community'].includes(m.rhythm)) fail(`months[${m.month}].rhythm 미상`);
  if (FORBID.test(m.seasonNote)) fail(`months[${m.month}].seasonNote 금지 표현`);
}

// workLive
const WIDS = ['internet', 'coworking', 'cafe', 'timezone', 'routine'];
if (workLive.map((c) => c.id).join() !== WIDS.join()) fail('workLive id/순서');
for (const c of workLive) {
  need(c, ['title', 'why', 'checks', 'compare'], `workLive.${c.id}`);
  if (c.id === 'timezone') need(c, ['offset', 'overlap'], 'workLive.timezone');
  if (c.id === 'routine' && !(Array.isArray(c.examples) && c.examples.length)) fail('workLive.routine.examples 누락');
}
if (workLive.filter((c) => c.compare).map((c) => c.id).join() !== 'internet,coworking,cafe') fail('workLive.compare는 internet·coworking·cafe만 true');

// stay
if (stay.map((s) => s.id).join() !== 'general,remoteWorker') fail('stay id/순서');
for (const s of stay) {
  const w = `stay.${s.id}`;
  need(s, ['title', 'paragraphs', 'lastUpdated', 'officialSources'], w);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.lastUpdated || '')) fail(`${w}.lastUpdated 형식`);
  for (const [i, p] of (s.paragraphs || []).entries()) if (FORBID.test(p)) fail(`${w}.paragraphs[${i}] 금지 표현: "${p.match(FORBID)[0]}"`);
  if (!(s.paragraphs || []).some((p) => p.includes('변경될 수 있다'))) fail(`${w}: "변경될 수 있다" 없음`);
  if (!(s.officialSources || []).some((o) => /imigrasi\.go\.id/.test(o.url || ''))) fail(`${w}.officialSources에 imigrasi.go.id 없음`);
  for (const o of s.officialSources || []) need(o, ['label', 'url'], `${w}.officialSources`);
}

// checklist · localLife
if (checklist.map((c) => c.id).join() !== 'visa,insurance,accommodation,workspace,transport,emergency') fail('checklist id/순서');
for (const c of checklist) need(c, ['title', 'why'], `checklist.${c.id}`);
if (localLife.map((c) => c.id).join() !== 'culture,temple,transport,health,community,waste') fail('localLife id/순서');
for (const c of localLife) need(c, ['eyebrow', 'title', 'body'], `localLife.${c.id}`);

if (errors.length) { console.error(`lint-content: ${errors.length}건 위반\n- ` + errors.join('\n- ')); process.exit(1); }
console.log(`lint-content: 통과 (문자열 ${allStrings.length}개 검사, regions ${regions.length}·months ${months.length}·stay ${stay.length}·checklist ${checklist.length}·localLife ${localLife.length})`);
