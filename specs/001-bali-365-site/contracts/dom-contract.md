# Contract: DOM·모듈·이벤트 계약

## 섹션 골격 (`index.html`)

| 순서 | `<section id>` | `aria-labelledby` 제목 id | 모듈 |
|---|---|---|---|
| 1 | `hero` | `hero-title` | `js/sections/hero.js` |
| 2 | `why-bali` | `why-bali-title` | `whyBali.js` |
| 3 | `find-your-base` | `find-your-base-title` | `areaExplorer.js` |
| 4 | `twelve-months` | `twelve-months-title` | `timeline.js` |
| 5 | `monthly-budget` | `monthly-budget-title` | `budget.js` |
| 6 | `work-live` | `work-live-title` | `workLive.js` |
| 7 | `visa-stay` | `visa-stay-title` | `visaStay.js` |
| 8 | `local-life` | `local-life-title` | `localLife.js` |
| 9 | `my-bali-year` | `my-bali-year-title` | `myBaliYear.js` |

`<nav aria-label="섹션">`의 링크는 위 id를 `href="#id"`로 가리키고, 현재 섹션 링크에 `aria-current="true"`.

## 섹션 모듈 인터페이스

```js
export function render(root, data, state) {}   // root: section 요소. DOM 생성만. 부수효과 없음
export function bind(root, store, data) {}      // 이벤트 → store.dispatch, 필요 시 store.subscribe
```

`app.js`는 `storage.load()` → `createStore(state)` → 각 섹션 `render` → `bind` → `store.subscribe(storage.save)`
순으로 실행한다.

## 스토어 인터페이스 (`js/state.js`)

```js
createStore(initialState, reducer) → { getState(), dispatch(action), subscribe(fn) → unsubscribe }
```

`action`은 `{ type, payload? }`. `subscribe` 콜백은 `(state, action)`을 받는다. `dispatch`는 상태가 실제로
바뀐 경우에만 구독자를 호출한다.

## 데이터 속성 (테스트·검증에서 요소를 찾는 안정적 훅)

| 속성 | 요소 | 값 |
|---|---|---|
| `data-region` | 지역 카드 | RegionId |
| `data-state` | 지역 카드 | `neutral │ highlighted │ dimmed` |
| `data-selected` | 지역 카드 | `true │ false` |
| `data-filter` | 필터 pill(`<button aria-pressed>`) | LifestyleFilter |
| `data-budget-item` | 예산 입력 `<input>` | BudgetItemId |
| `data-rate` | 환율 입력 | — |
| `data-out` | 결과 값 요소 | `monthly │ annual │ monthlyKRW │ annualKRW` |
| `data-check` | 체크박스 `<input type=checkbox>` | ChecklistItemId |
| `data-progress` | 진행률 텍스트(`aria-live=polite`) | — |
| `data-summary` | My Bali Year 값 | `area │ lifestyle │ monthly │ annual │ progress` |
| `data-action` | 버튼 | `select-area │ clear-filters │ reset-budget │ reset-checklist │ reset-all │ copy-plan` |
| `data-month` | 타임라인 항목 | 1..12 |

## 접근성 계약 (DESIGN §8)

- 필터 pill: `<button type="button" aria-pressed="true|false">`.
- 체크리스트: 네이티브 `<input type="checkbox" id>` + `<label for>`.
- 진행률·요약 갱신 영역: `aria-live="polite"`.
- 오류 문구: 입력에 `aria-invalid="true"` + `aria-describedby`로 연결.
- 확인이 필요한 초기화: 네이티브 `confirm()` 대신 인라인 확인 버튼 2단계(브라우저 모달 금지 — 자동화
  검증 시 모달이 세션을 막는다).
- 모든 상호작용 요소는 `:focus-visible`에 `--palm` 2px 외곽선.
