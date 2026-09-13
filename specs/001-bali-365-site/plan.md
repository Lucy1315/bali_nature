# Implementation Plan: BALI 365 — 디지털노마드로 발리에서 1년 살기

**Branch**: `001-bali-365-site` | **Date**: 2026-09-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-bali-365-site/spec.md`, 시각 기준 `/DESIGN.md`, 헌장
`.specify/memory/constitution.md` v1.0.1. 노션 "BALI 365" 페이지 §3 `/speckit.plan` 프롬프트를 지시로 삼았다.

## Summary

하나의 정적 페이지에 9개 섹션(Hero, Why Bali, Find Your Base, 12 Months, Monthly Budget, Work & Live,
Visa & Stay, Local Life, My Bali Year)을 독립 모듈로 구현한다. 필터·예산·체크리스트·요약은 UI와 분리된
순수 함수(`js/lib/`)로 만들어 Node 내장 테스트 러너로 먼저 검증하고, 상태는 단일 스토어(`js/state.js`)가
관리하며 `js/storage.js`가 버전 있는 스키마로 localStorage에 저장·복원한다. My Bali Year는 스토어를 구독해
실시간 갱신된다. 시각 값은 `css/tokens.css`가 DESIGN.md §2~§4를 그대로 옮기며, 대비 계산 스크립트가 테스트
단계에서 토큰 조합을 검증한다. 콘텐츠(지역·월·비자·Local Life·체크리스트)는 `data/*.js`로 분리해 화면
코드를 바꾸지 않고 교체할 수 있게 한다.

## Technical Context

**Language/Version**: HTML5, CSS3(커스텀 프로퍼티·Grid·`clamp()`), JavaScript ES2022(ES 모듈, 바닐라).
테스트·검증 스크립트는 Node.js 26(로컬 확인: v26.7.0), 최소 요구 Node 20.

**Primary Dependencies**: 런타임 의존 없음. 웹폰트(Pretendard·Inter)만 외부 CSS로 로드하며 실패 시 시스템
서체로 대체한다. 개발 의존도 없음(`node --test`, `python3 -m http.server`).

**Storage**: `localStorage` 단일 키 `bali365:plan`(스키마 v1, `contracts/state-schema.md`). 서버·DB 없음.

**Testing**: 로직은 `node --test tests/`(node:test + node:assert). 대비는 `scripts/contrast.mjs`가 토큰을
읽어 계산·단언. UI·반응형·저장 복원은 `quickstart.md` 시나리오를 브라우저(390px 포함)에서 수행.

**Target Platform**: 최신 Chrome·Safari·Firefox·Edge, iOS Safari·Android Chrome 최근 2개 버전. 정적 파일
서버(개발: `python3 -m http.server 3780`, 배포: 임의의 정적 호스팅).

**Project Type**: 단일 정적 웹 페이지(single page, no backend).

**Performance Goals**: 초기 로드 자원 총 1MB 이하(Hero 이미지 300KB 이하), 필터·계산 반응 100ms 이내
(SC-002·SC-003·SC-006의 1초 기준을 여유 있게), 보통 모바일 회선 첫 화면 3초 이내(SC-008).

**Constraints**: 빌드 단계 없음, 외부 API 호출 없음, 로그인 없음, 320~1440px 가로 스크롤 없음(SC-005),
텍스트 대비 4.5:1(SC-009), `prefers-reduced-motion` 준수, 콘텐츠 수치에 출처·기준 시점 병기(SC-010).

**Scale/Scope**: 섹션 9개, 지역 4개, 월 12개, 예산 항목 7개, 체크리스트 6개, 비자 정보 영역 2개, Local
Life 카드 6개. 사용자 규모 제약 없음(정적).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 검토 기준 | 계획 반영 | 상태 |
|---|---|---|---|
| I. 명세·디자인 문서 우선 | 태스크마다 FR/SC/DESIGN 참조 | tasks.md 형식에 "관련 FR/SC · DESIGN §" 필드를 강제. `css/tokens.css` 주석에 DESIGN 절 번호 병기 | ✅ |
| II. 정적·무서버 | fetch/외부 스크립트/저장 경로 | 콘텐츠를 JS 모듈로 두어 fetch 없음. 외부 로드는 폰트 CSS 2개뿐, 폴백 스택 | ✅ |
| III. 테스트 우선 | 로직 모듈별 테스트, 브라우저 검증 보고 | `js/lib/*`·`state.js`·`storage.js`는 테스트 선행. UI는 quickstart 시나리오 | ✅ |
| IV. 접근성·반응형 | 대비 계산표, 5개 폭, 키보드 | `scripts/contrast.mjs` 자동 검증, quickstart에 5폭 overflow 체크·Tab 순서 시나리오 | ✅ |
| V. 콘텐츠 신뢰성 | 출처·기준 시점, 금지 표현 0건, 데이터 분리 | `data/*.js` 스키마에 `source`·`asOf`·`lastUpdated` 필수. `scripts/lint-content.mjs`가 금지 표현 검사 | ✅ |
| VI. 단순성 | 스펙 밖 기능 없음, 섹션 독립 | 섹션별 파일 1개, 공용은 state/storage/lib/format만. 프레임워크·번들러 없음 | ✅ |
| VII. 상태 저장 견고성 | 손상 JSON·차단 환경 | `storage.js`: version 검증, 부분 복구, try/catch, 메모리 폴백, 안내 1회 | ✅ |
| VIII. 검증 전 완료 선언 금지 | 완료 보고에 실행 결과 | tasks.md 각 태스크에 "완료 확인" 명령·시나리오 번호. 최종 검증 태스크 별도 | ✅ |

**Post-design re-check (Phase 1 이후)**: data-model·contracts·quickstart가 위 반영 사항과 어긋나지 않음을
확인했다. 위반 없음 → Complexity Tracking 비움.

## Project Structure

### Documentation (this feature)

```text
specs/001-bali-365-site/
├── plan.md              # 이 문서
├── research.md          # Phase 0: 기술 결정과 근거
├── data-model.md        # Phase 1: 상태·콘텐츠 엔티티
├── quickstart.md        # Phase 1: 실행·검증 시나리오
├── contracts/
│   ├── state-schema.md  # localStorage 스키마 v1과 복구 규칙
│   ├── content-schema.md# data/*.js 콘텐츠 계약(필수 필드·금지 표현)
│   └── dom-contract.md  # 섹션 id·data 속성·커스텀 이벤트·상태 구독 계약
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks 산출
```

### Source Code (repository root)

```text
bali_365/
├── index.html                 # 단일 페이지. 9개 <section id="..."> 골격과 <nav>
├── DESIGN.md                  # 시각 단일 출처
├── package.json               # scripts: dev / test / check (의존성 없음)
├── assets/
│   ├── hero-1920.jpg          # Hero 배경(≤300KB) — 라이선스·출처는 assets/CREDITS.md
│   ├── hero-960.jpg           # 모바일 변형
│   └── CREDITS.md
├── css/
│   ├── tokens.css             # DESIGN §2 색, §3 타입 스케일, §4 간격·브레이크포인트 (커스텀 프로퍼티)
│   ├── base.css               # 리셋, 서체 로드·폴백, 본문 타이포, 컨테이너·격자, reduced-motion
│   ├── components.css         # 카드·버튼·pill·라벨·입력·체크박스·진행률 (DESIGN §6)
│   └── sections.css           # 섹션별 레이아웃 (DESIGN §5), 반응형
├── data/                      # 콘텐츠 데이터(ES 모듈). 화면 코드와 분리 (FR-044)
│   ├── regions.js             # Region ×4: 등급·태그·항목별 참고 생활비·Work&Live 등급·출처·asOf
│   ├── months.js              # MonthRhythm ×12
│   ├── workLive.js            # 5기준 설명, Timezone, Work Routine
│   ├── stay.js                # StayInfo ×2 (general, remoteWorker) + lastUpdated + 공식 출처
│   ├── checklist.js           # ChecklistItem ×6
│   ├── localLife.js           # LocalLifeCard ×6
│   └── copy.js                # Hero 문구, Why Bali 4관점, 안내 문구
├── js/
│   ├── app.js                 # 부트스트랩: 상태 복원 → 섹션 렌더 → 이벤트 바인딩 → 구독
│   ├── state.js               # createStore(initial, reducers) + 액션 (순수 reducer, 구독)
│   ├── storage.js             # load/save/clear: 키 접두어, version, 검증·부분 복구, 예외 처리
│   ├── lib/
│   │   ├── filter.js          # matchRegions(regions, activeFilters) → {highlighted[], none:boolean}
│   │   ├── budget.js          # sumMonthly, annual, toKRW, validateAmount, validateRate, applyRegionDefaults
│   │   ├── summary.js         # buildSummary(state, data) → 5 값 + toText()
│   │   └── format.js          # formatIDR, formatKRW, formatProgress
│   └── sections/
│       ├── nav.js             # 스크롤 스파이(IntersectionObserver), 현재 섹션 표시
│       ├── hero.js
│       ├── whyBali.js
│       ├── areaExplorer.js    # 카드 렌더, 필터 pill, 선택
│       ├── timeline.js
│       ├── budget.js          # 7항목 입력, 환율, 결과
│       ├── workLive.js
│       ├── visaStay.js        # 정보 2영역 + 체크리스트
│       ├── localLife.js
│       └── myBaliYear.js      # 구독 → 실시간 갱신, 복사, 초기화
├── scripts/
│   ├── contrast.mjs           # tokens.css 파싱 → DESIGN §2.2 조합 대비 단언
│   └── lint-content.mjs       # data/*.js 필수 필드·금지 표현("가능하다|된다|허용된다") 검사
└── tests/
    ├── filter.test.js
    ├── budget.test.js
    ├── format.test.js
    ├── summary.test.js
    ├── state.test.js
    └── storage.test.js        # 가짜 localStorage(정상·손상·차단) 주입
```

**Structure Decision**: 단일 정적 프로젝트. 폴더는 역할(css/data/js/scripts/tests) 다섯 개로만 나누고
`js/sections/`가 9개 섹션에 1:1 대응한다(헌장 원칙 VI). `js/lib/`와 `state.js`·`storage.js`는 DOM을 참조하지
않아 Node에서 그대로 테스트된다(원칙 III).

## DESIGN.md 연결표 (노션 §3 프롬프트 요구: color·typography·spacing·card·button·responsive를 계획에 명시)

| DESIGN 절 | 구현 위치 | 검증 |
|---|---|---|
| §2 색 토큰·§2.2 대비표 | `css/tokens.css` `--canvas … --terracotta-ink` | `scripts/contrast.mjs`가 표의 조합을 계산해 실패 시 `npm test` 실패 |
| §3 타이포 스케일 | `css/tokens.css` `--fs-hero … --fs-caption`(clamp), `css/base.css` 서체·폴백 | quickstart S-10 시각 대조 |
| §4 레이아웃·간격·브레이크포인트 | `css/tokens.css` `--space-section`, `--gap-card`, `--bp-*`; `css/base.css` `.container`·`.grid-12` | quickstart S-08 5폭 overflow |
| §5 섹션별 규칙 | `css/sections.css` + `js/sections/*.js` | 섹션별 quickstart 시나리오 |
| §6 카드·버튼·pill·입력 | `css/components.css` `.card .btn .pill .field .check` | quickstart S-09 키보드·상태 |
| §7 모션 | `css/base.css` transition 토큰, `@media (prefers-reduced-motion)` | quickstart S-11 |
| §8 접근성 체크 | `aria-pressed`, 네이티브 checkbox, `aria-live` | quickstart S-09 |

## 섹션 모듈 계약 (공통 인터페이스)

각 `js/sections/<name>.js`는 다음 두 함수를 내보낸다. 세부는 `contracts/dom-contract.md`.

- `render(root: HTMLElement, data, state) → void` — 최초 DOM 생성. 데이터와 상태만 읽는다.
- `bind(root, store) → void` — 이벤트를 `store.dispatch`에 연결하고, 필요하면 `store.subscribe`로 부분 갱신.

상태 변경 흐름: 사용자 입력 → `store.dispatch(action)` → 순수 reducer → 새 상태 → `storage.save` → 구독자
(해당 섹션 + My Bali Year) 갱신. My Bali Year는 렌더 시 `buildSummary(state, data)`만 호출한다.

## Complexity Tracking

> Constitution Check 위반 없음. 기록할 항목 없음.
