---

description: "BALI 365 구현 태스크 목록"
---

# Tasks: BALI 365 — 디지털노마드로 발리에서 1년 살기

**Input**: `specs/001-bali-365-site/`의 spec.md · plan.md · research.md · data-model.md · contracts/ ·
quickstart.md, 프로젝트 루트 `DESIGN.md`, 헌장 v1.0.1. 노션 §4 `/speckit.tasks` 프롬프트를 지시로 삼았다.

**Tests**: 헌장 원칙 III(테스트 우선)에 따라 로직 모듈은 테스트 태스크를 구현 태스크보다 앞에 둔다.
테스트를 먼저 쓰고 **실패를 확인한 뒤** 구현한다.

**Organization**: 노션 §4의 순서(기본 구조 → 디자인 토큰 → 콘텐츠 섹션 → 인터랙션 → localStorage →
responsive → 접근성 → 최종 검증)를 Spec Kit의 단계 구조(Setup → Foundational → 사용자 스토리별 → Polish)에
맞춰 배치했다. 사용자 스토리 단계 안에서는 "콘텐츠 렌더 → 인터랙션 → 저장 연결" 순이다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 다른 파일을 다루고 미완 태스크에 의존하지 않아 병렬 가능
- **[Story]**: US1~US6 (spec.md의 사용자 스토리)
- 각 태스크 아래 세 줄: **요구** = 관련 FR/SC, **디자인** = DESIGN.md 절, **확인** = 완료를 확인하는 방법

## Path Conventions

단일 정적 프로젝트. 저장소 루트 `bali_365/` 기준 `index.html`, `css/`, `data/`, `js/`, `scripts/`, `tests/`,
`assets/` (plan.md "Source Code" 참조).

---

## Phase 1: Setup — 기본 구조

**Purpose**: 파일 골격과 실행·테스트 명령을 만든다.

- [X] T001 `package.json` 생성: `"type":"module"`, scripts `dev`(`python3 -m http.server 3780`), `test`
      (`node --test tests/ && node scripts/contrast.mjs && node scripts/lint-content.mjs`), 의존성 없음
  - 요구: 헌장 II·III · 디자인: — · 확인: `npm run dev`로 3780 포트가 열리고 `npm test`가 실행된다(아직 테스트 0개)
- [X] T002 `index.html` 골격: `<html lang="ko">`, viewport 메타, `<nav aria-label="섹션">` 9링크, 9개
      `<section id>`와 `aria-labelledby` 제목(contracts/dom-contract.md 표), 폰트 `<link>` 2개 + preconnect,
      `<script type="module" src="js/app.js">`
  - 요구: FR-001·FR-002·FR-006 · 디자인: §4.1, §9 · 확인: 브라우저에서 9개 빈 섹션과 nav 링크 이동 동작
- [X] T003 [P] `.gitignore`(`.DS_Store`, `node_modules/`)와 `assets/CREDITS.md` 초안(Hero 이미지 출처·라이선스 기입란)
  - 요구: 헌장 V · 디자인: §9 · 확인: 파일 존재
- [X] T004 [P] `js/app.js` 부트스트랩 뼈대: 섹션 모듈 import 목록, `render → bind → subscribe` 순서(구현은 빈 함수)
  - 요구: contracts/dom-contract.md "섹션 모듈 인터페이스" · 디자인: — · 확인: 콘솔 오류 없이 로드

---

## Phase 2: Foundational — 디자인 토큰 · 콘텐츠 데이터 · 상태/저장 (모든 스토리의 전제)

**Purpose**: 스토리 구현이 공통으로 쓰는 토큰·데이터·스토어·저장소를 먼저 만든다.

**⚠️ CRITICAL**: 이 단계가 끝나기 전에는 사용자 스토리 작업을 시작하지 않는다.

### 디자인 토큰

- [X] T005 [P] `css/tokens.css`: DESIGN §2.1 색 12개, §3.1 타입 스케일(`clamp()`로 Desktop/Tablet/Mobile),
      §4 간격·컨테이너·브레이크포인트·모서리·전환 시간을 커스텀 프로퍼티로. 각 토큰 주석에 DESIGN 절 번호
  - 요구: 헌장 I · 디자인: §2.1, §3.1, §4, §7 · 확인: 토큰 값이 DESIGN 표와 1:1 일치(눈으로 대조 + T007)
- [X] T006 [P] `css/base.css`: 리셋, 서체 스택(Pretendard/Inter + 폴백, `font-display: swap`), 본문 타이포,
      `.container`(1200px, 패딩 24/16), `.grid`(12/8/1열), 섹션 간격, `:focus-visible` 외곽선,
      `@media (prefers-reduced-motion: reduce)`에서 transition 0ms, `html,body{overflow-x:clip}` 금지(가로
      스크롤은 원인 제거로 해결)
  - 요구: FR-005·SC-009 · 디자인: §3, §4, §6.2 focus, §7 · 확인: 빈 섹션 상태에서 5폭 overflow 없음
- [X] T007 `scripts/contrast.mjs`: `css/tokens.css`를 읽어 DESIGN §2.2 표의 조합(Ink/Canvas, ink-muted/Canvas,
      ink-muted/Surface, Palm/Canvas, White/Palm, Ink/Ocean, terracotta-ink/Canvas, ocean-ink/Canvas,
      muted-raw/Surface ≥ 3.0 테두리)을 계산해 기준 미달이면 종료 코드 1. 결과표를 stdout에 출력
  - 요구: SC-009, 헌장 IV · 디자인: §2.2 · 확인: `node scripts/contrast.mjs` 통과. `--ink-muted`를 `#74756F`로
    바꿔 실행하면 실패하는지 확인 후 원복

### 콘텐츠 데이터 (편집 콘텐츠 작성 포함)

- [X] T008 [P] `data/copy.js`: Hero 원문 3구절(contracts/content-schema.md 문자열 그대로), Why Bali 4관점,
      `filterLabels`, `budgetLabels`, `notices`, `rateExample{value, asOf}`
  - 요구: FR-009·FR-012·FR-025 · 디자인: §5.1, §5.2 · 확인: T014 lint 통과
- [X] T009 [P] `data/regions.js`: 4지역의 vibe·scores(4)·tags·recommendedFor·budgetDefaults(7, IDR)·
      workLive(3)·source{label, asOf}. 확인 못 한 값은 `'확인불가'`
  - 요구: FR-016·FR-017·FR-026·FR-030·FR-043 · 디자인: §5.3 · 확인: T014 lint 통과, 모든 수치에 asOf
- [X] T010 [P] `data/months.js`(12) · `data/localLife.js`(6) · `data/checklist.js`(6): 리듬 라벨·완화된
      계절 메모·asOf, "함께 살아가는 사람" 관점의 본문, 체크 항목 제목·이유
  - 요구: FR-013·FR-014·FR-015·FR-036 · 디자인: §5.5, §5.8, §5.9 · 확인: T014 lint 통과
- [X] T011 [P] `data/workLive.js`(5기준: why·checks·compare, timezone offset/overlap, routine examples) ·
      `data/stay.js`(general·remoteWorker: 완화 표현 본문, "변경될 수 있다" 포함, lastUpdated, officialSources에
      imigrasi.go.id)
  - 요구: FR-029·FR-031·FR-033~035 · 디자인: §5.7, §5.8 · 확인: T014 lint 통과, 금지 표현 0건
- [X] T012 `scripts/lint-content.mjs`: contracts/content-schema.md의 개수·필수 필드·수치 범위·금지 표현·
      Hero 원문·officialSources 도메인 검사. 위반 시 종료 코드 1과 위치 출력
  - 요구: SC-007·SC-010, 헌장 V · 디자인: — · 확인: `node scripts/lint-content.mjs` 통과. `stay.js`에
    "가능하다"를 임시로 넣으면 실패하는지 확인 후 원복

### 순수 로직 (테스트 → 구현)

- [X] T013 [P] `tests/format.test.js`: `formatIDR(18500000) === '18,500,000 IDR'`, `formatKRW`, 반올림,
      null → '—', `formatProgress(3,6) === '3 / 6'`
  - 요구: FR-024 · 디자인: §5.6 · 확인: 실행 시 실패(모듈 없음)
- [X] T014 [P] `js/lib/format.js` 구현 → T013 통과
  - 요구: FR-024, R-09 · 디자인: §5.6 · 확인: `node --test tests/format.test.js` pass
- [X] T015 [P] `tests/state.test.js`: `createStore` — dispatch 후 getState 변화, 같은 상태면 구독자 미호출,
      unsubscribe, 10개 액션의 reducer 전이(data-model.md §3 표 전부), `SELECT_AREA` 시 `touched` 보호
  - 요구: FR-008·FR-021·FR-026 · 디자인: — · 확인: 실행 시 실패
- [X] T016 `js/state.js` 구현(`createStore`, `initialState`, `reducer`, 액션 상수) → T015 통과
  - 요구: R-03, data-model.md §3 · 디자인: — · 확인: `node --test tests/state.test.js` pass

### 저장소 (테스트 → 구현) — "Selected area persistence"·"Checklist persistence"의 공통 기반

- [X] T017 [P] `tests/storage.test.js`: contracts/state-schema.md의 8개 케이스(정상 왕복, 손상 JSON, version 0,
      filters 미상 값, items 문자열, rate 음수, setItem throw, getItem throw). 가짜 localStorage 주입
  - 요구: FR-003·FR-004, 헌장 VII · 디자인: — · 확인: 실행 시 실패
- [X] T018 `js/storage.js` 구현(`load/save/clear`, 키 `bali365:plan`, 필드별 검증·부분 복구, 메모리 폴백,
      `available` 플래그, 안내 1회 플래그) → T017 통과
  - 요구: FR-003·FR-004, R-04 · 디자인: — · 확인: `node --test tests/storage.test.js` pass

**Checkpoint**: `npm test` 통과(format·state·storage + contrast + lint-content). 이제 스토리 병렬 가능.

---

## Phase 3: User Story 1 — 나에게 맞는 발리 거주 지역을 찾는다 (Priority: P1) 🎯 MVP

**Goal**: 지역 카드 4장 + 라이프스타일 필터 + 단일 선택 + 저장·복원 + My Bali Year Base 반영.

**Independent Test**: quickstart S-01·S-02·S-03, S-08의 지역·필터 부분.

### 테스트 — "Area lifestyle filtering"

- [X] T019 [P] [US1] `tests/filter.test.js`: 필터 없음 → 전부 neutral · 단일 필터 · AND 두 개 · 매치 0 →
      `none:true` · 다섯 개 전부 · 미상 필터 무시
  - 요구: FR-018·FR-019·FR-020, R-10 · 디자인: — · 확인: 실행 시 실패
- [X] T020 [P] [US1] `js/lib/filter.js` `matchRegions(regions, filters)` 구현 → T019 통과
  - 요구: FR-019·FR-020 · 디자인: — · 확인: `node --test tests/filter.test.js` pass

### 구현

- [X] T021 [US1] `css/components.css`에 카드(`.card`: surface·hairline·18px·24px 패딩·그림자 없음·hover),
      pill(`.pill` 기본/선택/hover, `aria-pressed` 셀렉터), 버튼 3종(`.btn-primary/-secondary/-tertiary`),
      5단 지표(`.meter`), 라벨·태그(`.tag`, `.eyebrow`)
  - 요구: 헌장 I · 디자인: §5.3, §5.4, §6.1~6.3 · 확인: 스타일 가이드 임시 페이지 없이 T022 렌더로 확인
- [X] T022 [US1] `js/sections/areaExplorer.js` `render`: 필터 pill 5개 + "필터 해제" + 카드 4장(지역명·한 문장·
      태그·지표 4개·추천 한 줄·"편집자 평가 · asOf" Caption·선택 버튼). `data-region/data-state/data-selected/
      data-filter/data-action` 부여. `css/sections.css`에 4/2/1열 격자
  - 요구: FR-016·FR-017·FR-043 · 디자인: §5.3, §5.4, §4 · 확인: 4장 렌더, 지표 값이 data와 일치
- [X] T023 [US1] `areaExplorer.js` `bind`: pill 클릭 → `TOGGLE_FILTER`, 해제 → `CLEAR_FILTERS`, 선택 버튼 →
      `SELECT_AREA`(같은 지역이면 해제). 구독으로 `data-state`(highlighted/dimmed/neutral)·`data-selected`·
      `aria-pressed`·"조건에 맞는 지역이 없다" 안내 갱신
  - 요구: FR-019·FR-020·FR-021·SC-002 · 디자인: §5.3 강조/후순위/선택 상태, §5.4 · 확인: S-01·S-02·S-03
- [X] T024 [US1] `js/app.js`: `storage.load()` → `HYDRATE` → 렌더 → `bind` → `store.subscribe(storage.save)`.
      `available=false`면 `copy.notices.storageUnavailable`를 nav 아래 배너로 1회 표시
      — "Selected area persistence"
  - 요구: FR-003·FR-004·FR-022 · 디자인: — · 확인: S-01 후 F5에서 선택·필터 복원(S-08 일부), S-13 배너 1회

**Checkpoint**: US1 단독으로 시연 가능(MVP). `npm test` 통과.

---

## Phase 4: User Story 2 — 월 생활비를 항목별로 입력해 1년 예산을 확인한다 (Priority: P1)

**Goal**: 7항목 IDR 입력, Monthly/Annual 즉시 계산, 환율 수동 입력 → KRW 병기, 지역 기본값·사용자 값 보호, 저장.

**Independent Test**: quickstart S-04·S-05·S-06, S-08의 예산 부분.

### 테스트 — "Budget monthly / annual calculation"

- [X] T025 [P] [US2] `tests/budget.test.js`: `sumMonthly`(null→0, 7항목 합), `annual`(×12), `toKRW`(rate null/0/
      음수 → null, 반올림), `validateAmount`(문자·음수·소수·1e12 초과·빈값), `validateRate`,
      `applyRegionDefaults`(touched 보호, 되돌리기 전부 덮어쓰기). 임의 조합 10개 표 기반 검증(SC-003)
  - 요구: FR-023·FR-025·FR-026·FR-027·SC-003 · 디자인: — · 확인: 실행 시 실패
- [X] T026 [P] [US2] `js/lib/budget.js` 구현 → T025 통과
  - 요구: FR-023·FR-025~027, R-08·R-11 · 디자인: — · 확인: `node --test tests/budget.test.js` pass

### 구현

- [X] T027 [US2] `css/components.css`에 입력(`.field`: 48px·muted-raw 테두리·8px·IDR 접미·focus palm·
      오류 terracotta-ink) 추가, `css/sections.css`에 Budget 2열/1열 editorial calculator 레이아웃과 큰 숫자
      (`--fs-budget`, tabular-nums)
  - 요구: 헌장 I · 디자인: §5.6, §6.4 · 확인: T028 렌더로 확인
- [X] T028 [US2] `js/sections/budget.js` `render`: 7입력 행(영문 라벨 + 국문 Caption, `data-budget-item`,
      `inputmode=numeric`), 지역 기본값 Caption("{지역} 참고값 · {출처} · {asOf}"), "지역 기본값으로 되돌리기",
      결과 영역(MONTHLY/ANNUAL Eyebrow + `data-out` 4개), 환율 입력(`data-rate`, 예시 값·asOf 안내), 빈 상태 안내
  - 요구: FR-023·FR-024·FR-026 · 디자인: §5.6 · 확인: 렌더 구조가 DESIGN §5.6 순서와 일치
- [X] T029 [US2] `budget.js` `bind`: input 이벤트 → `validateAmount` → 통과 시 `SET_BUDGET_ITEM`, 실패 시
      `aria-invalid`+오류 문구; 환율 → `SET_RATE`; 되돌리기 → `RESET_BUDGET_TO_REGION`. 구독으로 지역 변경 시
      기본값 반영(touched 제외), 결과 4값·KRW 안내 갱신. 저장은 T024의 공통 구독이 담당
  - 요구: FR-023·FR-025·FR-027·FR-028·SC-003 · 디자인: §5.6 오류 표시 · 확인: S-04·S-05·S-06, F5 후 복원

**Checkpoint**: US1+US2로 "어디서 살까 → 얼마가 필요할까" 시연 가능.

---

## Phase 5: User Story 3 — 장기 체류 조건을 확인하고 준비 체크리스트를 채운다 (Priority: P2)

**Goal**: Visa & Stay 정보 2영역(Last Updated·공식 출처·완화 표현) + 체크리스트 6항목 저장·진행률.

**Independent Test**: quickstart S-07·S-12, S-08의 체크 부분.

- [X] T030 [P] [US3] `tests/summary.test.js`의 `checklistProgress` 케이스(0/6, 3/6, 6/6 complete)
      — summary 테스트 파일에 함께 둔다(T034에서 확장)
  - 요구: FR-038 · 디자인: — · 확인: 실행 시 실패
- [X] T031 [P] [US3] `js/lib/summary.js`에 `checklistProgress(checklist)` 구현 → T030 통과
  - 요구: FR-038 · 디자인: — · 확인: pass
- [X] T032 [US3] `js/sections/visaStay.js` `render`: 정보 카드 2장(Eyebrow, "Last updated {date}", 본문 단락,
      하단 hairline 위 공식 출처 안내 + 링크; lastUpdated 12개월 초과 시 추가 안내), 체크리스트 6행(네이티브
      checkbox + label, 제목·이유, `data-check`), 진행률(`data-progress`, `aria-live`) + 4px 막대, 초기화 2단계
      버튼. `css/components.css`에 `.check`·`.progress`, `css/sections.css`에 레이아웃
  - 요구: FR-033~FR-036·FR-038 · 디자인: §5.8, §6.1 · 확인: S-12(금지 표현 검색 0건 포함)
- [X] T033 [US3] `visaStay.js` `bind`: change → `TOGGLE_CHECK`, 초기화 확인 → `RESET_CHECKLIST`. 구독으로
      체크 상태·진행률·완료 문구 갱신 — "Checklist persistence"(저장은 공통 구독)
  - 요구: FR-037·FR-038 · 디자인: §5.8 체크 상태 · 확인: S-07, F5 후 3개 유지

---

## Phase 6: User Story 4 — My Bali Year에서 내 계획을 한눈에 본다 (Priority: P2)

**Goal**: 5값 요약 카드, 실시간 갱신, 미선택 안내·이동, 전체 초기화, 텍스트 복사.

**Independent Test**: quickstart S-01·S-04·S-07 뒤 My Bali Year 확인, S-15.

- [X] T034 [P] [US4] `tests/summary.test.js` 확장: `buildSummary` — 미선택 전부 null·lifestyle 라벨 결합
      ("Nature + Quiet")·monthly/annual/KRW·progress, `toText()` 5줄 형식
  - 요구: FR-039·FR-040·FR-042 · 디자인: §5.10 예시 · 확인: 실행 시 실패
- [X] T035 [P] [US4] `js/lib/summary.js` `buildSummary`·`toText` 구현 → T034 통과
  - 요구: FR-039·FR-042 · 디자인: — · 확인: pass
- [X] T036 [US4] `js/sections/myBaliYear.js` `render`: editorial summary card(720px, surface, 20px, 40/24 패딩),
      "YOUR BALI YEAR" Eyebrow, 5행(`data-summary`, 라벨/값, hairline), 미선택 시 "아직 선택하지 않음" + "선택하러
      가기 →" 링크(해당 섹션 앵커), KRW Caption, 액션 2개(`copy-plan`, `reset-all` 2단계). `css/sections.css`
  - 요구: FR-039·FR-040 · 디자인: §5.10 · 확인: 초기 상태 5행 모두 미선택 안내 + 링크
- [X] T037 [US4] `myBaliYear.js` `bind`: `store.subscribe`로 5값 갱신(값 fade 200ms) — "My Bali Year summary
      update"; 복사 → `navigator.clipboard.writeText(toText())`, 실패 시 선택 가능한 `<pre>` 노출; 초기화 →
      `RESET_ALL` + `storage.clear()`
  - 요구: FR-008·FR-041·FR-042·SC-006 · 디자인: §5.10, §7 · 확인: 다른 섹션 변경 시 1초 내 반영, S-15

**Checkpoint**: 완료 조건 1~5·7 시연 가능.

---

## Phase 7: User Story 5 — 일하며 살 때 중요한 기준을 이해하고 지역별로 비교한다 (Priority: P3)

**Goal**: Work & Live 5기준 설명 + 3기준×4지역 비교 표(선택 지역 강조) + Timezone·Routine 블록.

**Independent Test**: Work & Live 섹션 단독 확인, S-09에서 표 컨테이너만 가로 스크롤.

- [X] T038 [P] [US5] `js/sections/workLive.js` `render`: 5기준 카드(Eyebrow·why·checks), 비교 표(`<table>` +
      caption, 5단 막대 `--ocean`, "편집자 평가 · asOf"), Timezone(+8/+9, 겹치는 시간)·Work Routine 예시 2열
      블록. `css/sections.css`에 5/3/1열과 `.table-scroll{overflow-x:auto}`
  - 요구: FR-029·FR-030·FR-031 · 디자인: §5.7 · 확인: 상호 목록 없음, 값이 data와 일치
- [X] T039 [US5] `workLive.js` `bind`: 구독으로 선택 지역 열 강조(`--surface` 배경 + palm 헤더)
  - 요구: FR-032 · 디자인: §5.7 · 확인: S-01 후 Ubud 열 강조

---

## Phase 8: User Story 6 — 발리 1년 살기의 그림을 이해한다 (Priority: P3)

**Goal**: Hero·Why Bali·12 Months·Local Life 정적 콘텐츠와 nav 현재 섹션 표시.

**Independent Test**: quickstart S-16·S-17, Hero 원문 3구절·4관점·12달·6카드 확인.

- [X] T040 [P] [US6] `js/sections/hero.js` + `css/sections.css` Hero: 85vh(min 560/520), `<picture>`
      (assets/hero-1920.jpg · hero-960.jpg, 없으면 `--palm` 배경), Ink 스크림 0→45%, 세 줄 텍스트(`copy.hero`
      원문), CTA "내 베이스 찾기 ↓"(사진 위 밝은 변형) → `#find-your-base` 부드러운 이동
  - 요구: FR-009·FR-010·FR-011 · 디자인: §5.1, §3.1 Hero 크기 · 확인: 원문 일치, 이미지 제거해도 대비 유지
- [X] T041 [P] [US6] `assets/hero-1920.jpg`·`hero-960.jpg` 준비(라이선스 허용 사진, ≤300KB)와
      `assets/CREDITS.md` 출처 기입. 준비 불가 시 단색 폴백 상태로 두고 CREDITS에 "미정" 기록
  - 요구: R-07, 헌장 V · 디자인: §5.1, §9 · 확인: 파일 크기 ≤300KB, CREDITS 기입
- [X] T042 [P] [US6] `js/sections/whyBali.js`(2×2, Eyebrow+제목+본문, hairline 구분) ·
      `js/sections/localLife.js`(6카드 3/2/1열, 아이콘 없음)
  - 요구: FR-012·FR-015 · 디자인: §5.2, §5.9 · 확인: 4관점·6카드 렌더, 관광 문구 없음
- [X] T043 [P] [US6] `js/sections/timeline.js`: 12열/4×3/1열 세로 타임라인, 월 숫자·리듬 라벨(4종 색 규칙)·
      설명·"참고" 계절 메모, `data-month`
  - 요구: FR-013·FR-014 · 디자인: §5.5, §6.3 · 확인: 12달 순서, 라벨 색이 §5.5 규칙과 일치
- [X] T044 [US6] `js/sections/nav.js`: IntersectionObserver로 현재 섹션 → `aria-current` + palm 밑줄, 모바일
      nav 자체만 가로 스크롤
  - 요구: FR-002 · 디자인: §4.1 · 확인: 스크롤 시 현재 섹션 표시 변경, 페이지 overflow 없음

**Checkpoint**: 9개 섹션 전부 렌더. 완료 조건 8개 모두 시연 가능.

---

## Phase 9: Polish — responsive · 접근성 · 최종 검증

**Purpose**: 다섯 폭·키보드·대비·문서 대조를 실제로 수행하고 결과를 기록한다.

- [X] T045 "Mobile overflow test": 320·390·768·1024·1440px에서 `scrollWidth === clientWidth` 확인, 위반 시
      원인(고정 폭·표·긴 단어) 제거. 모바일 격자 1열 확인. 결과를 `specs/001-bali-365-site/verification.md`에 기록
  - 요구: FR-005·SC-005 · 디자인: §4 · 확인: quickstart S-09 다섯 폭 전부 `true`
- [X] T046 "Refresh persistence test": S-08 절차(지역·필터·예산 7·환율·체크 3 → F5 → 탭 닫고 재열기) 수행,
      S-13(저장 차단)·S-14(손상 데이터) 수행. 결과를 verification.md에 기록
  - 요구: FR-003·FR-004·SC-004 · 디자인: — · 확인: 다섯 종류 모두 동일 복원, 배너 1회
- [X] T047 접근성: S-10 Tab 순서·Enter/Space, `aria-pressed/aria-current/aria-live/aria-invalid` 확인, Hero
      텍스트 실제 렌더 색 샘플링 대비 ≥ 4.5, `npm test`의 contrast 통과, S-11 reduced-motion
  - 요구: SC-009, 헌장 IV · 디자인: §8 · 확인: verification.md에 항목별 결과
- [X] T048 [P] 시각 대조(S-16): DESIGN §3·§5·§6 값 vs 렌더(Hero 84/64/48, 섹션 128/96/72, 카드 18px, pill
      선택 Palm/white, 버튼 44px). 차이는 코드가 아니라 문서 우선 원칙에 따라 판단해 기록
  - 요구: 헌장 I · 디자인: 전체 · 확인: verification.md 대조표
- [X] T049 [P] 오프라인 폰트(S-17)·성능: 네트워크 차단 시 동작, 초기 자원 합계 ≤ 1MB(개발자 도구 Network)
  - 요구: SC-008, 헌장 II · 디자인: §9 · 확인: 자원 합계 기록
- [X] T050 최종 검증 보고(노션 §6 프롬프트): spec.md·DESIGN.md 기준으로 Requirement 미충족 / Interaction /
      Visual / Responsive / Accessibility 표(Severity·관련 FR·관련 DESIGN 규칙·수정 방법)를
      `specs/001-bali-365-site/verification.md`에 작성 → High부터 수정 → 재검증 → `npm test` 최종 실행 결과 첨부
  - 요구: 헌장 VIII, 완료 조건 1~8 · 디자인: 전체 · 확인: High 0건, `npm test` pass, S-01~17 전부 기록

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 즉시 시작. T003·T004는 병렬.
- **Foundational (Phase 2)**: Phase 1 완료 후. 토큰(T005~T007)·데이터(T008~T012)·로직(T013~T018)은 세 묶음이
  서로 병렬. 묶음 안에서는 테스트 → 구현 순. **모든 스토리를 차단한다.**
- **User Stories (Phase 3~8)**: Phase 2 완료 후. 우선순위 순(US1 → US2 → US3 → US4 → US5 → US6)이 기본이며,
  파일이 겹치지 않는 렌더 태스크(T022·T028·T032·T036·T038·T040·T042·T043)는 병렬 가능. 단 `css/components.css`
  ·`css/sections.css`는 여러 스토리가 함께 쓰므로 같은 파일을 동시에 편집하지 않는다.
- **Polish (Phase 9)**: 모든 스토리 완료 후. T048·T049 병렬, T050은 마지막.

### User Story Dependencies

- **US1**: Foundational만 의존. MVP.
- **US2**: Foundational 의존. 지역 기본값은 US1의 선택이 있으면 더 풍부하지만 없이도 동작(빈 상태 안내).
- **US3**: Foundational 의존. 독립.
- **US4**: `buildSummary`는 US1·US2·US3의 상태를 읽지만 미선택 상태를 처리하므로 독립 테스트 가능.
- **US5**: Foundational 의존. 선택 강조만 US1 상태를 읽는다.
- **US6**: Foundational 의존. 독립(정적).

### Parallel Opportunities

- Phase 2: `[T005,T006] ∥ [T008,T009,T010,T011] ∥ [T013→T014, T015→T016, T017→T018]` 후 T007·T012.
- Phase 3~8 렌더 태스크 8개는 서로 다른 `js/sections/*.js`이므로 병렬. CSS 두 파일은 순차.
- Phase 9: T048 ∥ T049.

---

## Parallel Example: Phase 2

```bash
# 묶음 A (토큰)          묶음 B (데이터)                묶음 C (로직, 각 줄은 테스트→구현)
Task: T005 tokens.css   Task: T008 copy.js             Task: T013 → T014 format
Task: T006 base.css     Task: T009 regions.js          Task: T015 → T016 state
                        Task: T010 months/localLife/   Task: T017 → T018 storage
                              checklist.js
                        Task: T011 workLive/stay.js
# 세 묶음 완료 후
Task: T007 contrast.mjs   Task: T012 lint-content.mjs
```

---

## Implementation Strategy

### MVP First (US1)

1. Phase 1 → Phase 2(`npm test` 통과) → Phase 3.
2. **STOP and VALIDATE**: S-01·S-02·S-03 + F5 복원. 이 시점에 "지역 선택 → 새로고침 유지"를 시연할 수 있다.

### Incremental Delivery

US1(지역) → US2(예산) → US3(체크리스트) → US4(요약) 순으로 완료 조건 1·2·3·4·5·7이 차례로 충족된다.
US5·US6은 콘텐츠 보강이며 완료 조건 8(비자 안내)은 US3에서 충족된다. 각 스토리 완료 시 기능 단위로 커밋한다.

### 노션 §7 시연 흐름과의 대응

지역 선택(US1) · 예산 변경(US2) · 체크리스트 저장(US3) · 새로고침 후 값 유지(T046) 네 가지가 시연 항목이며,
마지막 검증(T050)이 "spec.md와 DESIGN.md 기준 검토"에 해당한다.

---

## Notes

- 테스트 태스크는 반드시 실패를 먼저 확인한다(헌장 III).
- 브라우저 모달(`alert/confirm`)을 쓰지 않는다(contracts/dom-contract.md).
- 완료 표시(`[x]`)는 "확인" 항목을 실제로 수행한 뒤에만 한다(헌장 VIII).
- 커밋은 Phase 또는 스토리 단위로 묶는다.

---

## Phase 10: v3 사진 중심 개정 (2026-09-13, 사용자 방향 전환)

**Purpose**: 노션 실습(korea-nature) 방식 — Framer DESIGN.md 원본 + 실제 사진 전체 화면 장면 — 으로 재구성한다. spec.md FR-045~050.

- [X] T051 `DESIGN.md`를 Framer DESIGN.md 원본으로 교체하고 이전 안을 `docs/design-variants/tropical-editorial.md`로 보관
  - 요구: FR-050, 헌장 I(1.1.0) · 디자인: 전체 · 확인: `diff ../korea-nature/DESIGN.md DESIGN.md` 없음
- [X] T052 Wikimedia Commons에서 장면 13장 선정·다운로드·WebP 재인코딩, `assets/CREDITS.md` 기록, 이전 Hero JPG 제거
  - 요구: FR-045·046·047 · 디자인: — · 확인: `ls assets/images | wc -l` = 26, CREDITS 표 13행, 외부 이미지 URL 0
- [X] T053 `data/scenes.js`(장면 사진·제목·크레딧) · `data/regions.js` photo 필드 · `js/sections/scene.js` 렌더
  - 요구: FR-045·046·048 · 디자인: — · 확인: 9장면 렌더, 지역 카드 4장 사진, alt 텍스트 존재
- [X] T054 `css/tokens.css` Framer 토큰 + `base/components/sections.css` 다크 캔버스·유리 패널·장면 레이아웃 재작성
  - 요구: FR-050·SC-012 · 디자인: colors·typography·rounded·spacing·components · 확인: `node scripts/contrast.mjs` 15조합 통과
- [X] T055 `js/journey.js`: IO 기반 텍스트 등장 + GSAP(로컬 벤더링) 사진 확대·시차, reduced-motion·JS 없음 폴백
  - 요구: FR-049, 헌장 II 1.1.0 · 디자인: — · 확인: 정지 상태에서 Hero 보임, 실제 스크롤로 `.is-visible` 전환 확인
- [X] T056 반응형·overflow 재검증(320~1440) 및 발견 결함 수정(패널 자식 폭, 내비 리스트, 예산 숫자 크기)
  - 요구: SC-005 · 디자인: — · 확인: `scripts/overflow-check.html` 5폭 `true`
- [X] T057 검증 기록 v3(`verification.md`) · Artifact 미리보기 재발행 · GitHub 푸시
  - 요구: 헌장 VIII · 확인: 아래 verification.md "v3" 절

---

## Phase 11: 장면 9 → 18 분할 (2026-09-13, "정보가 너무 많다" 피드백)

- [X] T058 Commons에서 9장 추가 선정·다운로드·WebP(밤 노트북·논 카페·클링킹·브라탄·사누르 산책·공항 독서 코너·타나롯·트게눙안·테갈랄랑), CREDITS 22행 재생성
  - 요구: FR-045~047 · 확인: `ls assets/images | wc -l` = 44, CREDITS 22행
- [X] T059 `data/scenes.js` 18장면(module/part) · `index.html` 18섹션 · `js/app.js` part 전달 · whyBali/timeline/workLive/visaStay/localLife 모듈 part 분기
  - 요구: FR-045·049 · 확인: 콘솔 오류 0, 18장면 본문 렌더
- [X] T060 5폭 overflow 재검증, "null" 텍스트 결함 수정(timeline 조건부 append), 미리보기·GitHub Pages 재배포
  - 요구: SC-005·SC-011 · 확인: verification.md v3.1
