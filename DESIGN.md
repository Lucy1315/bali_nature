# BALI 365 — DESIGN.md

**작성일**: 2026-09-13 · **근거**: 노션 "BALI 365" 페이지 §2 DESIGN.md 생성 프롬프트, `specs/001-bali-365-site/spec.md`,
`.specify/memory/constitution.md` v1.0.0 · **지위**: 색·타이포그래피·간격·카드·버튼·반응형의 **단일 출처**.
구현은 이 문서의 값을 그대로 쓴다. 값을 바꾸려면 문서를 먼저 고친다(헌장 원칙 I). 접근성 기준과 시안이
충돌하면 접근성이 이긴다(헌장 원칙 IV). 이 문서가 노션 프롬프트와 다른 지점은 §3.2에 이유를 밝혔다.

---

## 1. 디자인 방향

**Tropical Editorial + Independent Travel Magazine + Modern Digital Nomad Dashboard.**
목표 분위기는 "Notion × Kinfolk × Bali travel journal" 사이이다. 전형적인 여행사 홈페이지가 아니라,
독립 여행 매거진과 원격근무 대시보드 사이에 있는 "발리에서 천천히 살아보는 사람의 여행 저널"이다.

### 1.1 원칙

| # | 원칙 | 적용 |
|---|---|---|
| 1 | 여백이 콘텐츠를 만든다 | 섹션 세로 간격 96~140px, 콘텐츠 밀도를 높이지 않는다 |
| 2 | 사진·큰 타이포·얇은 선·카드·짧은 설명 | 이 다섯 가지 외의 장식 요소를 쓰지 않는다 |
| 3 | 대부분은 warm neutral | Palm·Ocean·Terracotta는 작은 강조 요소에만 쓴다 |
| 4 | 큰 제목은 가볍게 | Display는 font-weight 300, Bold를 쓰지 않는다 |
| 5 | 움직임은 절제 | hover·fade·작은 translate, 200~300ms |

### 1.2 쓰지 않는 것 (DO NOT)

Cheap travel blog 감성 · Boho Instagram 감성 · 강한 컬러의 관광 광고 · 과도한 tropical icon · neon gradient ·
과도한 glassmorphism · 강한 drop shadow · 여행사 스타일 아이콘 · 화면 전체를 tropical green으로 채우기 ·
모든 카드를 동일한 색상 박스로 만들기 · 과도한 rounded UI(카드 20px 초과, pill 외 요소의 full-round).

---

## 2. 색 (Color)

### 2.1 토큰

| 토큰 | 값 | 이름 | 용도 |
|---|---|---|---|
| `--canvas` | `#F5F1E8` | Warm sand | 페이지 배경 |
| `--surface` | `#FFFCF5` | Surface | 카드·입력·요약 카드 배경 |
| `--ink` | `#29302B` | Ink | 본문·제목 텍스트, 체크 표시 |
| `--ink-muted` | `#63655E` | Muted text (AA) | 보조 텍스트·캡션·라벨 **(텍스트용, §3.2 참조)** |
| `--muted-raw` | `#74756F` | Muted (원안) | 24px 이상 큰 텍스트, 입력 테두리, 비활성 아이콘 |
| `--palm` | `#486554` | Palm | 선택 상태 배경, 강조 텍스트, 포커스 링, 진행률 |
| `--ocean` | `#7FAFB3` | Ocean | 비텍스트 강조(막대·점·라벨 배경). 텍스트 색으로 쓰지 않는다 |
| `--ocean-ink` | `#356C72` | Ocean (text) | Ocean 계열이 텍스트로 필요할 때 |
| `--terracotta` | `#C8795B` | Terracotta | 비텍스트 강조(밑줄·점·경고 막대). 텍스트 색으로 쓰지 않는다 |
| `--terracotta-ink` | `#9E5A40` | Terracotta (text) | 오류 문구·주의 라벨 텍스트 |
| `--hairline` | `#DED8CC` | Hairline | 장식용 구분선, 카드 테두리 |
| `--white` | `#FFFFFF` | White | 선택된 pill의 텍스트 |

### 2.2 대비 계산표 (WCAG 2.1, 계산값)

텍스트는 4.5:1 이상, 큰 텍스트(24px 이상 또는 18.66px 700)와 UI 컴포넌트 경계는 3:1 이상이어야 한다.

| 전경 → 배경 | Canvas | Surface | Palm | Ocean | Terracotta | 판정 |
|---|---|---|---|---|---|---|
| Ink | 12.00 | 13.21 | 2.10 | 5.60 | 4.09 | Canvas·Surface·Ocean 위 텍스트 가능. Terracotta 위는 큰 텍스트만 |
| Muted 원안 `#74756F` | **4.12** | 4.54 | — | — | — | **Canvas 위 본문 크기 불가** → `--ink-muted`로 대체 |
| Muted AA `#63655E` | 5.24 | 5.77 | — | — | — | 통과 |
| Palm | 5.71 | 6.28 | — | — | — | 강조 텍스트 가능 |
| Ocean | **2.14** | **2.36** | — | — | — | 텍스트 불가 → `--ocean-ink` 5.26 사용 |
| Terracotta | **2.94** | **3.23** | — | — | — | 텍스트 불가(큰 텍스트도 Canvas에서 불가) → `--terracotta-ink` 4.67 사용 |
| White | — | — | 6.43 | **2.42** | **3.31** | Palm 위만 본문 크기 가능 |
| Hairline | 1.26 | 1.38 | — | — | — | 장식 전용. 입력·체크박스 테두리에는 쓰지 않는다 |

**입력·체크박스 테두리**는 `--muted-raw`(Surface 위 4.54, Canvas 위 4.12 → 3:1 통과) 이상을 쓴다.
**포커스 링**은 `--palm` 2px 외곽선(Canvas 위 5.71).

### 2.3 사용 규칙

- 페이지의 80% 이상은 `--canvas`·`--surface`·`--ink`·`--ink-muted`·`--hairline`으로만 구성한다.
- Palm은 "선택됨·현재·진행"의 의미로만 쓴다(선택된 pill, 선택된 지역 카드 테두리, 현재 내비 항목, 진행률 막대).
- Ocean은 12 Months의 Recharge/Explore 라벨 배경, Work & Live 등급 막대처럼 **텍스트가 아닌 면**에만 쓴다.
  Ocean 면 위의 텍스트는 `--ink`(5.60).
- Terracotta는 Community 라벨 점, 오류·주의 막대처럼 **텍스트가 아닌 면**에만 쓴다. 오류 문구 텍스트는
  `--terracotta-ink`.
- 배경 그라데이션·네온·글래스 효과를 쓰지 않는다. Hero 사진 위 텍스트 가독을 위한 단색 스크림(Ink 0~45%)만 허용한다.

---

## 3. 타이포그래피 (Typography)

### 3.1 서체와 크기

| 역할 | 서체 | 굵기 | Desktop | Tablet | Mobile | 행간 | 자간 |
|---|---|---|---|---|---|---|---|
| Hero Title ("BALI 365") | Inter | 300 | 84px | 64px | 48px | 1.0 | -0.02em |
| Hero Subtitle | Pretendard | 300 | 28px | 24px | 20px | 1.3 | 0 |
| Section Title | Pretendard | 300 | 52px | 44px | 36px | 1.1 | -0.01em |
| Section Eyebrow (영문 라벨 "FIND YOUR BASE") | Inter | 500 | 12px | 12px | 12px | 1.0 | 0.12em, 대문자 |
| Card Title / 지역명 | Inter(영문)·Pretendard(국문) | 400 | 24px | 22px | 20px | 1.2 | 0 |
| Body | Pretendard | 400 | 17px | 17px | 16px | 1.7 | 0 |
| Caption / 출처 | Pretendard | 400 | 13px | 13px | 12px | 1.5 | 0 |
| Budget 숫자 (Monthly/Annual) | Inter | 300 | 56px | 48px | 40px | 1.0 | -0.02em, tabular-nums |
| Summary 값 (My Bali Year) | Inter/Pretendard | 300 | 32px | 28px | 24px | 1.2 | 0 |

- 한글은 **Pretendard**, 영문·숫자는 **Inter**. 웹폰트가 로드되지 않으면 시스템 산세리프로 대체하고
  레이아웃이 깨지지 않게 `font-display: swap`과 폴백 스택을 둔다(헌장 원칙 II).
- 큰 제목에 Bold(600 이상)를 쓰지 않는다. 강조는 굵기가 아니라 크기·색(`--palm`)·여백으로 한다.
- 본문 최대 행 길이 68자(약 640px).

### 3.2 노션 프롬프트와 다른 점

| 항목 | 프롬프트 | 이 문서 | 이유 |
|---|---|---|---|
| Muted Text | `#74756F` | 텍스트는 `#63655E`, 원안은 큰 텍스트·테두리 | Canvas 위 4.12:1로 AA(4.5:1) 미달. 계산값 §2.2 |
| Terracotta·Ocean 텍스트 | 명시 없음 | 텍스트 색으로 금지, `-ink` 변형 추가 | 각각 2.94·2.14로 큰 텍스트 기준 3:1도 미달 |
| Hero 크기 | 64~84px | 84/64/48 (데스크톱/태블릿/모바일) | 모바일 390px에서 64px "BALI 365"는 한 줄에 들어가지만 여백이 사라져 48px로 정함 |

---

## 4. 레이아웃 (Layout)

| 항목 | 값 |
|---|---|
| 콘텐츠 최대 폭 | 1200px (좌우 패딩 24px, 모바일 16px 이상) |
| 격자 | Desktop 12열, gutter 24px · Tablet 8열 · Mobile 1열 |
| 섹션 세로 간격 | Desktop 128px(96~140 범위 안) · Tablet 96px · Mobile 72px |
| 섹션 안 제목 → 본문 | 40px · 24px(모바일) |
| 카드 간격 | 24px(20~28 범위 안) · 모바일 16px |
| 구분선 | 1px `--hairline` |
| 브레이크포인트 | Mobile ≤ 767px · Tablet 768~1023px · Desktop ≥ 1024px |

- 모바일에서는 **모든 격자를 한 열**로 바꾸고, `overflow-x`가 페이지에 생기지 않게 한다. 표만 자기 영역
  안에서 가로 스크롤한다(FR-005, SC-005).
- 320px에서도 가로 스크롤이 없어야 한다. 고정 폭(min-width)을 화면보다 크게 두지 않는다.

### 4.1 상단 내비게이션

높이 64px, `--canvas` 95% 불투명 + 하단 hairline. 좌측 "BALI 365"(Inter 500 14px, 0.12em), 우측 섹션 링크
9개(Inter 400 13px). 현재 섹션은 `--palm` 텍스트 + 2px 밑줄. 모바일은 링크를 가로 스크롤 가능한 한 줄
(nav 자체만 overflow-x: auto, 페이지 아님)로 둔다. 애니메이션 없음.

---

## 5. 섹션별 규칙

### 5.1 Hero

- 높이 뷰포트의 85%(80~90 범위 안), 최소 560px, 모바일 최소 520px.
- 배경: rice field / tropical vegetation / ocean / villa workspace / remote working 중 하나를 연상시키는
  고해상도 editorial photography. 로컬 파일로 두며 외부 URL 로드는 하지 않는다. 사진 위 Ink 스크림 0→45%.
  사진이 없을 때는 `--palm` 단색 배경으로 대비를 지킨다(FR-010).
- 텍스트는 사진 위에 **세 줄만**: 제목 "BALI 365", 부제, 카피. 그 외 텍스트를 올리지 않는다.
- 사진 위 텍스트 색은 `--surface`(#FFFCF5). 스크림 45% 위 대비를 계산으로 확인한다(구현 시 검증 항목).
- 행동 유도 1개: "내 베이스 찾기 ↓" 텍스트 버튼(§6.2 Secondary, 밝은 변형).

### 5.2 Why Bali

2×2 격자(모바일 1열). 각 셀: Eyebrow(WORK / LIFE / NATURE / COMMUNITY) + 국문 제목(Card Title) + 두세
문장(Body). 셀 배경 없음, 셀 사이는 hairline. 아이콘 없음.

### 5.3 Find Your Base — Area Card

- 4장, Desktop 4열 · Tablet 2열 · Mobile 1열.
- 카드: 배경 `--surface`, 테두리 1px `--hairline`, 모서리 **18px**(16~20 범위 안), 패딩 24px, 그림자 없음.
- 내용 순서: 지역명(Inter 400 24px) → 한 문장(Body, `--ink-muted`) → 라이프스타일 태그(작은 pill, §6.3) →
  간단한 지표 4개(원격근무·자연·편의·조용함↔활기; 5칸 점 또는 5단 막대, 채움 `--palm`, 빈칸 `--hairline`)
  → 추천 라이프스타일 한 줄(Caption) → "내 베이스로 선택" 버튼(§6.2 Secondary).
- **강조 상태**(필터 충족): 테두리 `--palm` 1px, 그대로 불투명. **후순위 상태**: 카드 전체 opacity 0.45.
  화면에서 제거하지 않는다.
- **선택 상태**: 테두리 `--palm` 2px + 우상단 "SELECTED" Eyebrow(`--palm`). 버튼 문구는 "선택됨 · 해제".
- 지표 옆에 Caption으로 "편집자 평가 · 2026-09" 표기(FR-043).

### 5.4 Filter (Lifestyle pill)

- Work · Nature · Beach · Quiet · Community 다섯 개, 가로 wrap.
- 기본: 배경 투명, 테두리 1px `--muted-raw`, 텍스트 `--ink`, 높이 36px, 좌우 패딩 16px, full-round.
- 선택: 배경 `--palm`, 텍스트 `--white`(6.43). hover: 테두리 `--palm`. 전환 200ms.
- `aria-pressed`로 상태를 노출한다. 옆에 "필터 해제" 텍스트 버튼.

### 5.5 12 Months Timeline

- Desktop: 가로 12열 격자(각 열 1달), Tablet 4열×3행, Mobile 1열 세로 타임라인(좌측 hairline 세로선).
- 각 달: 월 숫자(Inter 300 32px) + 리듬 라벨(§6.3 small label: Work=`--palm` 배경·white / Explore=`--ocean`
  배경·`--ink` / Recharge=`--surface` 배경·`--palm` 테두리·`--palm` 텍스트 / Community=`--terracotta` 점 +
  `--ink` 텍스트) + 한두 줄 설명(Caption~Body 14px) + 계절 메모(Caption, `--ink-muted`, "참고" 접두).
- 배경색 면을 달마다 칠하지 않는다. 구분은 hairline.

### 5.6 Monthly Budget — editorial calculator

- 2열: 좌 입력(7항목), 우 결과. Tablet 이하 1열(입력 → 결과).
- 입력 행: 라벨(Body, 영문 항목명 + 국문 보조 Caption) · 숫자 입력(높이 48px, 테두리 1px `--muted-raw`,
  배경 `--surface`, 모서리 8px, 우측 "IDR" 접미) · 지역 기본값이면 Caption "Ubud 참고값 · 출처 · 2026-09".
- 결과: "MONTHLY BUDGET" Eyebrow → 숫자(56px, tabular) → "ANNUAL BUDGET" Eyebrow → 숫자 → 환율 입력
  ("1 KRW = [ ] IDR", 비어 있으면 안내 Caption) → KRW 환산(Summary 값 크기, `--ink-muted`) + "참고용 환산"
  Caption.
- 여행 가격 비교 사이트처럼 보이지 않게: 배경면·컬러 박스·아이콘 없이, 큰 숫자와 hairline만.
- 오류: 입력 테두리 `--terracotta-ink`, 오류 문구 Caption `--terracotta-ink`, `aria-describedby` 연결.

### 5.7 Work & Live

- 5기준 카드(Desktop 5열 → Tablet 2~3열 → Mobile 1열). 각 카드: Eyebrow(INTERNET…) → 왜 중요한가(Body) →
  확인할 점(Caption 목록).
- 지역 비교: 3기준(Internet·Coworking·Cafe) × 4지역 표. 값은 5단 막대(`--ocean` 채움). 선택 지역 열 배경
  `--surface` + 헤더 `--palm`. 모바일에서는 표 컨테이너만 `overflow-x: auto`.
- Timezone·Work Routine은 표 밖의 2열 텍스트 블록.

### 5.8 Visa & Stay + Checklist

- 정보 영역 2개(일반 장기 체류 / Remote Worker 비자)를 각각 카드(§5.3 카드 규격, 패딩 32px)로 둔다.
  카드 상단에 Eyebrow + 우측 Caption "Last updated 2026-09-13". 카드 하단에 hairline 위 안내 문구(Body 15px,
  `--ink-muted`) "제도는 변경될 수 있다. 출국 전 인도네시아 이민청(imigrasi.go.id)에서 최신 정보를 확인한다."
- 체크리스트: 6항목 세로 목록. 각 행: 체크박스(24px, 테두리 2px `--muted-raw`, 체크 시 배경 `--palm` +
  white 체크 표시) · 제목(Body) · 이유(Caption `--ink-muted`). 체크된 행은 제목에 `--ink-muted` + 취소선
  없이 좌측 `--palm` 2px 바. 상단에 "N / 6" (Summary 값 크기) + 진행률 막대(높이 4px, `--palm`/`--hairline`).
- 초기화는 텍스트 버튼(§6.2 Tertiary) + 확인 단계.

### 5.9 Local Life

6카드(Desktop 3열 → Tablet 2열 → Mobile 1열). §5.3 카드 규격, 내용: Eyebrow(LOCAL CULTURE…) → 국문 제목 →
두세 문장. 이미지·아이콘 없음.

### 5.10 My Bali Year — editorial summary card

- 최대 폭 720px 중앙, 배경 `--surface`, 테두리 hairline, 모서리 20px, 패딩 40px(모바일 24px).
- 상단 Eyebrow "YOUR BALI YEAR". 아래 5행(Base / Lifestyle / Monthly / Year / Checklist): 좌측 라벨(Eyebrow
  스타일), 우측 값(Summary 값 32px, 300). 행 사이 hairline.
- 예시: Base **Ubud** · Lifestyle **Nature + Quiet** · Monthly **18,500,000 IDR** · Year **222,000,000 IDR**
  · Checklist **5 / 6**. KRW가 있으면 값 아래 Caption으로 병기.
- 미선택 값: `--ink-muted` "아직 선택하지 않음" + 우측 작은 텍스트 링크 "선택하러 가기 →"(`--palm`).
- 하단 액션 2개: "계획 복사"(Secondary), "처음부터 다시"(Tertiary + 확인).
- 값 변경 시 해당 값만 fade(200ms). 다른 애니메이션 없음.

---

## 6. 컴포넌트

### 6.1 카드 공통

배경 `--surface` · 테두리 1px `--hairline` · 모서리 16~20px(기본 18) · 패딩 24px · 그림자 없음 · hover 시
테두리 `--muted-raw`(200ms). 모든 카드를 같은 색 박스로 만들지 않기 위해, 정보 카드(Why Bali·Local Life)는
배경 없이 hairline 구분만 쓰고, 상호작용 카드(Area·Visa·Summary)만 `--surface` 배경을 쓴다.

### 6.2 버튼

| 종류 | 모양 | 용도 |
|---|---|---|
| Primary | 배경 `--palm`, 텍스트 white, 높이 44px, 패딩 0 20px, 모서리 10px | Hero 행동 유도(사진 위에서는 배경 `--surface`·텍스트 `--ink` 변형) |
| Secondary | 배경 투명, 테두리 1px `--ink`, 텍스트 `--ink`, 44px | 지역 선택, 계획 복사 |
| Tertiary | 텍스트만 `--ink-muted` + 밑줄, hover `--ink` | 필터 해제, 초기화, 처음부터 다시 |

hover: 배경/테두리 1단계 진하게(200ms). active: translateY(1px). focus-visible: 2px `--palm` 외곽선, 오프셋 2px.
disabled는 쓰지 않는다(대신 안내 문구).

### 6.3 라벨·태그

- Lifestyle 태그(카드 안): 높이 24px, 패딩 0 10px, 테두리 1px `--hairline`, 텍스트 Caption `--ink-muted`, full-round.
- 리듬 라벨(12 Months): 높이 22px, Inter 500 11px 대문자 0.08em. 색은 §5.5.
- 출처·기준 시점 Caption: `--ink-muted`, 앞에 "·" 없이 줄 바꿈으로 구분.

### 6.4 입력

숫자 입력은 `inputmode="numeric"`, 천 단위 구분은 표시 시에만. 높이 48px, 테두리 `--muted-raw`, focus 시
`--palm` 2px. 라벨은 항상 보이는 텍스트(placeholder를 라벨로 쓰지 않는다).

---

## 7. 모션

- 허용: hover 색 전환, 요소 fade-in, 8px 이하 translate. 전환 200~300ms, ease-out.
- 스크롤 진입 애니메이션은 fade + translateY(8px) 한 종류만, 섹션 제목에만.
- `prefers-reduced-motion: reduce`에서는 모든 전환을 0ms로 한다.
- 자동 재생·패럴랙스·무한 루프 애니메이션 금지.

---

## 8. 접근성 체크 (구현 시 확인)

1. §2.2 표의 조합만 쓴다. 새 조합이 생기면 계산해 표에 추가한다.
2. Hero 사진 위 텍스트: 스크림 포함 실제 렌더 색을 샘플링해 4.5:1을 확인한다.
3. 모든 버튼·pill·체크박스·입력은 Tab 순서로 도달하고 Enter/Space로 조작된다.
4. pill은 `aria-pressed`, 체크박스는 네이티브 `<input type="checkbox">`, 진행률은 `aria-live="polite"`.
5. 320·390·768·1024·1440px에서 `document.documentElement.scrollWidth === clientWidth`.

---

## 9. 자산

- `assets/hero.jpg`: 1920×1200 이하, 300KB 이하 목표, `<picture>`로 모바일용 960px 변형 제공.
- 폰트: Pretendard(국문)·Inter(영문). 외부 CDN 로드 실패 시 `system-ui, -apple-system, "Apple SD Gothic Neo",
  "Malgun Gothic", sans-serif`로 대체.
- 아이콘은 쓰지 않는다. 필요한 기호(체크·화살표)는 유니코드 또는 인라인 SVG 1색(`currentColor`).
