# Contract: 콘텐츠 데이터 계약 (`data/*.js`)

`scripts/lint-content.mjs`가 `npm test`에서 검사한다. 위반 시 종료 코드 1.

## 공통

- 모든 파일은 ES 모듈로 named export 하나를 내보낸다(`regions`, `months`, `workLive`, `stay`, `checklist`,
  `localLife`, `copy`).
- 문자열은 한국어 문어체 또는 사용자 입력의 영문 표기. HTML 태그를 포함하지 않는다(렌더 시 textContent).
- 날짜는 `YYYY-MM-DD`, 기준 시점은 `YYYY-MM`.

## 필수 필드·개수

| 파일 | 개수 | 필수 필드 |
|---|---|---|
| `regions.js` | 정확히 4 (`canggu, ubud, sanur, uluwatu`) | `id name vibe scores{work,nature,convenience,calm} tags recommendedFor budgetDefaults(7키) workLive{internet,coworking,cafe} source{label,asOf}` |
| `months.js` | 정확히 12, `month` 1..12 순서 | `month rhythm title body seasonNote asOf` |
| `workLive.js` | 정확히 5 | `id title why checks compare`; `timezone`은 `offset overlap`, `routine`은 `examples` |
| `stay.js` | 정확히 2 (`general, remoteWorker`) | `id title paragraphs lastUpdated officialSources(≥1, url 포함)` |
| `checklist.js` | 정확히 6 | `id title why` |
| `localLife.js` | 정확히 6 | `id eyebrow title body` |
| `copy.js` | — | `hero{title,subtitle,tagline}`(원문 고정), `whyBali(4)`, `filterLabels(5)`, `budgetLabels(7)`, `notices{storageUnavailable,rateHint,emptyBudget,notSelected,official}`, `rateExample{value,asOf}` |

## 표현 규칙 (헌장 V, FR-014·FR-034)

- `stay.*.paragraphs`, `months.*.seasonNote`에서 정규식 `/(가능하다|가능합니다|된다|됩니다|허용된다|허용됩니다)/`
  매치 0건. ("~로 알려져 있다", "~를 확인해야 한다", "대체로" 등 완화 표현 사용)
- `stay.*.paragraphs` 중 하나 이상에 "변경될 수 있다"가 포함된다.
- `stay.*.officialSources`에 `imigrasi.go.id` 도메인이 하나 이상 포함된다.
- `copy.hero`는 다음 문자열과 정확히 일치한다:
  - title `BALI 365`
  - subtitle `디지털노마드로 발리에서 1년 살기`
  - tagline `여행보다 길고, 이민보다 가볍게. 일하고, 머물고, 살아보는 발리의 365일.`

## 수치 규칙 (FR-043)

- `regions.*.scores.*`, `workLive.*`: 1~5 정수.
- `regions.*.budgetDefaults.*`: 0 이상 정수(IDR).
- 수치가 있는 모든 객체에 `source.asOf` 또는 `asOf`가 있다. 값이 확인되지 않으면 수치 대신 문자열
  `'확인불가'`를 허용하고, 화면은 이를 그대로 표시한다.
