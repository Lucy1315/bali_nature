# Data Model: BALI 365

**Date**: 2026-09-13 · 근거: `spec.md` Key Entities, `research.md` R-02~R-04·R-11. 두 종류의 데이터가 있다.
**콘텐츠 데이터**(`data/*.js`, 편집자가 관리, 읽기 전용)와 **사용자 상태**(`localStorage`, 사용자가 만든다).

## 1. 콘텐츠 데이터 (읽기 전용, `data/*.js`)

### Region (`data/regions.js`)

| 필드 | 타입 | 규칙 |
|---|---|---|
| `id` | `'canggu'│'ubud'│'sanur'│'uluwatu'` | 고유. 상태의 `area`가 참조 |
| `name` | string | 표시명("Canggu") |
| `vibe` | string | 지역 분위기 한 문장(FR-016) |
| `scores.work` `scores.nature` `scores.convenience` | 1~5 정수 | 원격근무 적합도·자연 접근성·생활 편의성(FR-017) |
| `scores.calm` | 1~5 정수 | 1=활기, 5=조용함(양극 척도) |
| `tags` | `LifestyleFilter[]` | 추천 라이프스타일. 필터 AND 매칭 대상(FR-019) |
| `recommendedFor` | string | 추천 라이프스타일 한 줄 |
| `budgetDefaults` | `Record<BudgetItemId, number>` | 항목별 참고 월 생활비(IDR, 정수 ≥ 0)(FR-026) |
| `workLive.internet` `workLive.coworking` `workLive.cafe` | 1~5 정수 | Work & Live 비교 등급(FR-030) |
| `source` | `{ label: string, url?: string, asOf: 'YYYY-MM' }` | 모든 수치의 출처·기준 시점(FR-043). 없으면 `label:'편집자 평가'` |

### LifestyleFilter

`'work' │ 'nature' │ 'beach' │ 'quiet' │ 'community'`. 표시 라벨은 `data/copy.js`의 `filterLabels`.

### BudgetItemId

`'housing' │ 'food' │ 'coworking' │ 'transport' │ 'wellness' │ 'insurance' │ 'other'`(순서 고정, FR-023).
표시명은 `data/copy.js`의 `budgetLabels`(영문 + 국문 보조).

### MonthRhythm (`data/months.js`, 12개)

| 필드 | 타입 | 규칙 |
|---|---|---|
| `month` | 1~12 | 순서대로 |
| `rhythm` | `'work'│'explore'│'recharge'│'community'` | 리듬 라벨 1개(FR-013) |
| `title` | string | 한 줄 제목 |
| `body` | string | 한두 줄 설명 |
| `seasonNote` | string | 완화된 표현("대체로…"). 금지 표현 검사 대상(FR-014) |
| `asOf` | `'YYYY-MM'` | 기준 시점 |

### WorkLiveCriterion (`data/workLive.js`, 5개)

`{ id:'internet'│'coworking'│'cafe'│'timezone'│'routine', title, why, checks: string[], compare: boolean }`.
`compare`가 true인 3개만 지역 비교 표에 오른다. `timezone`은 `offset:{bali:'+8', korea:'+9'}, overlap: string`,
`routine`은 `examples: string[]`을 추가로 가진다(FR-031).

### StayInfo (`data/stay.js`, 2개: `general`, `remoteWorker`)

| 필드 | 타입 | 규칙 |
|---|---|---|
| `id` | `'general'│'remoteWorker'` | 별도 영역(FR-033) |
| `title` | string | |
| `paragraphs` | string[] | 금지 표현("가능하다|된다|허용된다") 0건(FR-034) |
| `lastUpdated` | `'YYYY-MM-DD'` | 표시 필수(FR-035). 12개월 초과 시 추가 안내(Edge Case) |
| `officialSources` | `{ label, url }[]` | 최소 1개, 인도네시아 이민청 포함(FR-035) |

### ChecklistItem (`data/checklist.js`, 6개)

`{ id:'visa'│'insurance'│'accommodation'│'workspace'│'transport'│'emergency', title, why }`(FR-036).

### LocalLifeCard (`data/localLife.js`, 6개)

`{ id:'culture'│'temple'│'transport'│'health'│'community'│'waste', eyebrow, title, body }`(FR-015).

### Copy (`data/copy.js`)

Hero 세 문구(FR-009, 원문 고정), Why Bali 4관점 `{ id, eyebrow, title, body }`, `filterLabels`,
`budgetLabels`, 안내 문구(저장 불가·환율 예시 `{ example: number, asOf }`·빈 예산·미선택), `officialNotice`.

## 2. 사용자 상태 (`localStorage['bali365:plan']`, 스키마 v1)

```text
PlanState {
  version: 1
  area: RegionId | null                       // 단일 선택 (FR-021)
  filters: LifestyleFilter[]                  // 중복 없음, 순서 = 선택 순서 (FR-018)
  budget: {
    items: Record<BudgetItemId, number | null> // IDR 정수 ≥ 0, null = 미입력 (FR-023)
    touched: BudgetItemId[]                   // 사용자가 직접 입력한 항목 (FR-026, R-11)
    rate: number | null                       // 1 KRW = rate IDR, > 0 (FR-025, R-08)
  }
  checklist: Record<ChecklistItemId, boolean> // (FR-037)
}
```

**초기값**: `area:null, filters:[], budget:{items: 전부 null, touched:[], rate:null}, checklist: 전부 false`.

**검증 규칙**(읽기 시, `storage.js`): 필드별로 타입·범위를 검사해 실패한 필드만 초기값으로 되돌린다.
`version`이 다르거나 없으면 전체 초기값(향후 마이그레이션 지점). `items` 값 상한 `1e12`.

**파생 값**(저장하지 않음, `lib/`에서 계산):

| 파생 값 | 함수 | 규칙 |
|---|---|---|
| `monthly` | `sumMonthly(items)` | null은 0으로, 정수 합 |
| `annual` | `annual(monthly)` | `monthly × 12` |
| `monthlyKRW`·`annualKRW` | `toKRW(idr, rate)` | `rate`가 null·≤0이면 null, 아니면 `Math.round(idr / rate)` |
| `filterResult` | `matchRegions(regions, filters)` | `{ status: Record<RegionId,'neutral'│'highlighted'│'dimmed'>, none: boolean }` |
| `progress` | `checklistProgress(checklist)` | `{ done, total: 6, complete: boolean }` |
| `summary` | `buildSummary(state, data)` | `{ area, lifestyle, monthly, annual, monthlyKRW, annualKRW, progress }` + `toText()` |

## 3. 상태 전이 (reducer 액션)

| 액션 | payload | 전이 |
|---|---|---|
| `HYDRATE` | `PlanState` | 저장소에서 읽은 검증 완료 상태로 교체 |
| `SELECT_AREA` | `RegionId │ null` | `area` 교체. 같은 값이면 null(해제). 지역이 생기면 `applyRegionDefaults` 적용 |
| `TOGGLE_FILTER` | `LifestyleFilter` | 있으면 제거, 없으면 추가 |
| `CLEAR_FILTERS` | — | `filters = []` |
| `SET_BUDGET_ITEM` | `{ id, value: number│null }` | 검증 통과 시 `items[id]` 교체, `touched`에 추가. null이면 `touched`에서 제거 |
| `RESET_BUDGET_TO_REGION` | — | `area`가 있으면 `touched = []`, `items = region.budgetDefaults` |
| `SET_RATE` | `number │ null` | 검증 통과 시 교체 |
| `TOGGLE_CHECK` | `ChecklistItemId` | 반전 |
| `RESET_CHECKLIST` | — | 전부 false |
| `RESET_ALL` | — | 초기값(FR-041) |

모든 전이 후 `storage.save(state)`가 호출된다(구독자 순서: 저장 → 섹션 → My Bali Year).
