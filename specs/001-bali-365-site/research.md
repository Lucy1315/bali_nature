# Research: BALI 365 기술 결정

**Date**: 2026-09-13 · **Feature**: `specs/001-bali-365-site` · Technical Context의 미정 항목은 없었고, 아래는
각 기술 선택의 결정·근거·기각한 대안이다.

## R-01. 스크립트 로드 방식: ES 모듈 + 정적 서버

- **Decision**: `<script type="module" src="js/app.js">`로 ES 모듈을 쓰고, 개발·시연은 정적 서버
  (`python3 -m http.server 3780`)로 연다.
- **Rationale**: 로직 모듈을 Node `node --test`에서 그대로 import해 테스트할 수 있다(헌장 III). 번들러 없이
  파일 분리가 된다(헌장 VI). Chrome은 `file://`에서 모듈 import를 차단하므로 서버가 필요하며, 이는 헌장 II
  1.0.1 문구("정적 서버로 서빙")와 부합한다.
- **Alternatives considered**: (a) 전역 네임스페이스 classic script — `file://` 더블클릭이 되지만 Node 테스트
  시 전역 오염과 이중 로딩 코드가 필요해 기각. (b) 번들러(esbuild) — 빌드 단계 금지(헌장 II)로 기각.

## R-02. 콘텐츠 데이터 형식: JS 모듈(`data/*.js`)

- **Decision**: JSON 파일 대신 `export const regions = [...]` 형태의 JS 모듈.
- **Rationale**: `fetch()` 없이 import로 읽어 헌장 II(외부 호출 없음)와 R-01을 만족한다. 스키마
  (`contracts/content-schema.md`)를 `scripts/lint-content.mjs`가 Node에서 검사할 수 있다. 화면 코드와 분리되어
  FR-014·FR-044(교체 가능 구조)를 충족한다.
- **Alternatives**: JSON + fetch — 서버 필요는 같지만 lint 스크립트에서 import가 불편하고 `file://`에서
  fetch가 막힌다. 기각.

## R-03. 상태 관리: 단일 스토어 + 순수 reducer + 구독

- **Decision**: `state.js`에 `createStore(initialState, reducer)`를 두고 `dispatch/subscribe/getState` 세
  메서드만 제공한다. 액션은 `SELECT_AREA`, `TOGGLE_FILTER`, `CLEAR_FILTERS`, `SET_BUDGET_ITEM`,
  `RESET_BUDGET_TO_REGION`, `SET_RATE`, `TOGGLE_CHECK`, `RESET_CHECKLIST`, `RESET_ALL`, `HYDRATE` 열 개.
- **Rationale**: FR-008(My Bali Year 실시간 반영)은 "한 곳에서 바뀌면 여러 곳이 갱신"이므로 구독 모델이
  가장 단순하다. reducer가 순수 함수라 Node 테스트가 된다.
- **Alternatives**: 섹션 간 직접 DOM 참조 — 결합도가 높아 기각. 프레임워크 — 헌장 II·VI 위반으로 기각.

## R-04. 저장: localStorage 단일 키, 버전, 부분 복구, 메모리 폴백

- **Decision**: 키 `bali365:plan`, 값은 `{version:1, area, filters, budget:{items,touched,rate}, checklist}`.
  읽을 때 필드별 타입 검증을 하고 실패한 필드만 초기값으로 되돌린다. `localStorage` 접근은 try/catch로 감싸고
  실패 시 메모리 저장소로 대체하며 안내를 1회 표시한다(세션 플래그).
- **Rationale**: 헌장 VII, FR-003·FR-004, Edge Case(손상·차단). 단일 키는 원자적 저장·초기화(FR-041)가 쉽다.
- **Alternatives**: 필드별 키 — 초기화·버전 관리가 흩어져 기각. IndexedDB — 과잉.

## R-05. 테스트: Node 내장 러너, DOM 테스트는 브라우저 시나리오

- **Decision**: `node --test tests/`(node:test, node:assert/strict). `storage.test.js`는 가짜
  `localStorage`(정상·`setItem`이 throw·손상 JSON 반환)를 주입한다. DOM·반응형·키보드는 `quickstart.md`
  시나리오를 브라우저에서 실제 수행하고 결과를 보고한다.
- **Rationale**: 설치 없이 실행(헌장 III SHOULD). jsdom 같은 의존은 헌장 VI와 "의존 없음" 방침에 어긋난다.
- **Alternatives**: Playwright 자동화 — 가치는 있으나 의존 추가·설치 시간이 20분 시연 목적과 맞지 않아
  1차에서 제외. 후속 과제로 기록.

## R-06. 웹폰트: Pretendard(jsDelivr CSS) + Inter(Google Fonts), 폴백 스택

- **Decision**: `<link rel="preconnect">` 후 두 CSS를 로드하고 `font-display: swap`. 폴백은 DESIGN §9.
- **Rationale**: DESIGN §3이 두 서체를 지정. 로드 실패 시 시스템 서체로 동작해 헌장 II(외부 자원 없이도
  동작)를 지킨다. 네트워크가 없는 시연 환경에서도 레이아웃이 유지된다.
- **Alternatives**: 폰트 파일 자체 호스팅 — Pretendard 가변 폰트 약 2MB로 성능 목표(1MB) 초과. 기각.

## R-07. Hero 이미지: 로컬 자산, 라이선스 명시, 없으면 단색 폴백

- **Decision**: `assets/hero-1920.jpg`(≤300KB)·`hero-960.jpg`를 `<picture>`로 제공. 출처·라이선스는
  `assets/CREDITS.md`. 이미지 준비 전이나 로드 실패 시 `--palm` 단색 배경(FR-010, DESIGN §5.1).
- **Rationale**: 외부 URL 핫링크는 헌장 II와 성능 목표에 어긋난다. 라이선스 확인은 콘텐츠 신뢰성(원칙 V)의
  일부이다.
- **Alternatives**: CSS 그라데이션 배경 — DESIGN §1.2가 금지. 기각.

## R-08. 환율 입력 형식: "1 KRW = N IDR", KRW = IDR ÷ N

- **Decision**: 환율 입력란은 하나, 의미는 "원화 1원당 루피아". 환산은 `Math.round(idr / n)`.
  예시 값은 `data/copy.js`에 두고 "예시 · 기준 시점"을 병기하며 실제 환율을 단정하지 않는다.
- **Rationale**: 스펙 Assumptions가 한 가지 방식으로 고정했다. 사용자가 은행 앱에서 보는 "1원 = 약 N루피아"
  표기와 같아 이해가 쉽다. 외부 환율 조회 없음(FR-025).
- **Alternatives**: "100 IDR = N KRW" — 소수점 입력이 필요해 검증이 복잡. 기각.

## R-09. 숫자 표기: 쉼표 천 단위, "IDR"·"KRW" 접미

- **Decision**: `Intl.NumberFormat('ko-KR')`로 쉼표 구분, 접미로 통화 코드. 소수점은 반올림해 정수 표시.
- **Rationale**: 대상이 한국어 사용자(쉼표에 익숙). 인도네시아 로케일(마침표 구분)은 혼동 위험.
- **Alternatives**: `currency` 스타일("Rp") — DESIGN §5.6이 "IDR" 접미를 지정. 기각.

## R-10. 필터 의미: 태그 AND 매칭, 강조/후순위, 제거 없음

- **Decision**: `matchRegions(regions, filters)`는 `filters`가 비면 전부 `neutral`, 아니면 모든 필터가
  `region.tags`에 포함된 지역만 `highlighted`, 나머지 `dimmed`. 하나도 없으면 `none: true`.
- **Rationale**: FR-019·FR-020, 스펙 Assumptions.

## R-11. 예산 기본값 병합: `touched` 집합으로 사용자 값 보호

- **Decision**: 지역 선택 시 `applyRegionDefaults(items, touched, regionDefaults)`가 `touched`에 없는 항목만
  덮어쓴다. "지역 기본값으로 되돌리기"는 `touched`를 비우고 전부 덮어쓴다.
- **Rationale**: FR-026, US2 시나리오 8.

## R-12. 내비게이션 현재 섹션: IntersectionObserver

- **Decision**: 각 `<section>`을 관찰해 뷰포트 40% 이상 보이는 섹션을 현재로 표시. 스크롤 이벤트 미사용.
- **Rationale**: FR-002. 스크롤 핸들러보다 단순하고 성능이 낫다.

## R-13. 대비·콘텐츠 자동 검사 스크립트

- **Decision**: `scripts/contrast.mjs`는 `css/tokens.css`에서 색 토큰을 정규식으로 읽어 DESIGN §2.2의
  조합을 계산하고 기준 미달이면 종료 코드 1. `scripts/lint-content.mjs`는 `data/*.js`를 import해 필수 필드와
  금지 표현(비자·계절 영역의 "가능하다|된다|허용된다")을 검사한다. 둘 다 `npm test`에 포함한다.
- **Rationale**: 헌장 IV("대비는 계산으로"), V(금지 표현 0건, SC-007·SC-010). 워크스페이스에서 실제로 겪은
  4.45:1 사례의 재발 방지.

## R-14. 반응형 검증: 5개 폭 overflow 확인 절차

- **Decision**: quickstart S-08에 `document.documentElement.scrollWidth === document.documentElement.clientWidth`
  확인을 320·390·768·1024·1440px에서 수행하도록 명시. 자동화는 후속 과제.
- **Rationale**: SC-005, 헌장 IV.

## 후속 과제(1차 범위 밖)

- Playwright 기반 5폭 overflow·키보드 자동 검증.
- 탭 간 실시간 동기화(`storage` 이벤트).
- 콘텐츠 데이터의 실제 출처 갱신 절차 문서화.
