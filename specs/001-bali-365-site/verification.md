# Verification: BALI 365 — 구현 검증 기록

**Date**: 2026-09-13 · **기준**: `spec.md`(FR-001~044, SC-001~010), `DESIGN.md`, 헌장 v1.0.1 원칙 VIII ·
**환경**: macOS, Chrome(Claude in Chrome 확장으로 조작, 비활성 창), Node v26.7.0, `python3 -m http.server 3780`

## 1. 자동 검증 (`npm test`)

| ID | 명령 | 결과 |
|---|---|---|
| A-01 | `node --test 'tests/*.test.js'` | **44 pass / 0 fail** (format 3 · budget 9 · state 10 · storage 10 · filter 6 · summary 5) |
| A-02 | `node scripts/contrast.mjs` | **15개 조합 전부 통과** (Muted 원안 4.12 → `--ink-muted` 5.24 등) |
| A-03 | `node scripts/lint-content.mjs` | **통과** (문자열 266개, 금지 표현 0건, Hero 원문 일치, imigrasi.go.id 포함) |

테스트는 구현보다 먼저 작성해 모듈 없음(ERR_MODULE_NOT_FOUND)으로 실패하는 것을 확인한 뒤 구현했다(헌장 III).

## 2. 브라우저 시나리오 (quickstart S-01~S-17)

| ID | 결과 | 관찰 |
|---|---|---|
| S-01 지역 선택 | ✅ | Ubud 선택 → `data-selected=true`, SELECTED 배지, My Bali Year Base "Ubud" 즉시 |
| S-02 필터 | ✅ | Quiet → ubud·sanur·uluwatu highlighted, canggu dimmed(제거되지 않음). +Beach → sanur·uluwatu만(AND). 해제 → 전부 neutral, pressed 0 |
| S-03 조건 없음 | ✅ | 5개 전부 선택 → 전부 dimmed + 안내 표시(`[data-nomatch]` hidden=false) |
| S-04 예산 계산 | ✅ | 지역 선택 시 7항목 기본값 + "Ubud의 참고 생활비 … 편집자 평가 (2026-09 기준)". Housing 10,000,000 입력 → Monthly 20,600,000 · Annual 247,200,000 즉시 |
| S-05 환율 | ✅ | 12 입력 → ≈ 1,716,667 KRW · 참고용 환산 병기, 요약 카드에도 병기. 비우면 IDR만 + 안내 |
| S-06 예산 보호 | ✅ | Food 직접 입력 후 Canggu 선택 → Food 유지, 나머지 교체. 되돌리기 → 7개 전부 Canggu 값, touched [] |
| S-07 체크리스트 | ✅ | 3개 체크 → "3 / 6", My Bali Year Checklist "3 / 6" |
| S-08 새로고침 유지 | ✅ | 새로고침 후 지역 Canggu·7항목·환율 12·체크 3개·요약 동일 복원 |
| S-09 5폭 overflow | ✅ | `scripts/overflow-check.html`: 320·390·768·1024·1440 모두 `scrollWidth === clientWidth`, 넘치는 요소 0. 390px에서 카드·예산·타임라인 1열 확인(스크린샷) |
| S-10 키보드 | ✅(대체 검증) | 포커스 가능 요소 46개가 DOM 순서(nav → Hero CTA → pill 5 → 지역 4 → 예산 8 → 이민청 링크 → 체크 6 → 요약 액션)로 나열됨. 프로그램 포커스 시 `:focus-visible` 매치, 외곽선 Palm `rgb(72,101,84)` 2px solid. `aria-pressed` 5, 네이티브 checkbox 6, `aria-live` 4. **실제 Tab 키 입력은 비활성 창이라 브라우저에 전달되지 않아 수행하지 못했다** — 사용자가 직접 한 번 확인할 것 |
| S-11 모션 | ✅(규칙 확인) | `prefers-reduced-motion` 미디어 규칙이 스타일시트에 존재. OS 설정 토글은 이 환경에서 불가 |
| S-12 비자 안내 | ✅ | 두 영역 모두 "Last updated 2026-09-13", 이민청·대사관 링크, 안내 문구. 렌더된 텍스트에서 금지 표현 0건 |
| S-13 저장 차단 | ✅ | `localStorage` getter가 throw하는 srcdoc 하네스에서 앱 정상 렌더, 배너 1회 표시, 지역 선택·필터 동작 |
| S-14 손상 데이터 | ✅ | `area:"mars", filters:"x"` 주입 → area·filters 초기값, housing 5,000,000·rate 12·visa true 유지, 오류 없음 |
| S-15 초기화·복사 | ✅ | "처음부터 다시" → 인라인 2단계 확인 → 전부 초기값·저장소 초기값. 복사는 이 환경에서 클립보드 불가 → 폴백 `<pre>`에 5줄 텍스트 노출·안내 표시(정상 경로) |
| S-16 시각 대조 | ✅ | Hero 84px/300, 섹션 제목 52px, 카드 18px·그림자 없음, 섹션 간격 128px, 버튼 44px, pill 36px, 본문 17px, Pretendard |
| S-17 오프라인 폰트 | ⚠️ 미수행 | 네트워크 차단을 이 환경에서 할 수 없었다. 폴백 스택은 `--font-ko/--font-en`에 있고 `font-display: swap`. 사용자가 오프라인에서 한 번 확인할 것 |

## 3. 노션 §6 검토표 (spec.md·DESIGN.md 기준 문제와 처리)

| # | 범주 | Severity | 문제 | 관련 요구 | 관련 DESIGN | 처리 |
|---|---|---|---|---|---|---|
| 1 | Accessibility | **High** | Hero 사진 밝은 잎 위 텍스트 대비 미달 — 제목 2.79:1(큰 텍스트 3:1 미달), 태그라인 4.05:1(4.5 미달). 픽셀 샘플링 계산 | SC-009, 헌장 IV | §5.1, §8.2 | 좌측 가로 스크림(62%→0%) 추가. 재측정 최악값 제목 5.08 · 부제 6.61 · 태그라인 6.70 · CTA 8.77. DESIGN §5.1에 값과 이유 기록 |
| 2 | Visual | Medium | 12 Months 데스크톱 12열이 너무 좁아 라벨·본문이 깨짐 | FR-013 | §5.5 "responsive grid timeline" | 6열×2행(태블릿 4열, 모바일 1열 세로)로 변경 |
| 3 | Visual | Medium | 한국어 단어가 줄 중간에서 끊김("살/아보는") | — | §3 editorial 가독 | `body { word-break: keep-all }` |
| 4 | Interaction | Medium | My Bali Year 값 갱신을 rAF에 의존 → 비활성 탭에서 빈 값 | FR-008 | §5.10 | 동기 갱신 + CSS 애니메이션으로 교체 |
| 5 | Visual | Low | 환율 placeholder(예시 12)가 입력값처럼 보임 | FR-025 | §6.4 | placeholder 색을 `--muted-raw` 70%로 |
| 6 | Responsive | — | 없음 (5폭 통과) | SC-005 | §4 | — |
| 7 | Requirement | — | FR-001~044 대응 화면 요소 전부 확인. 미충족 없음 | — | — | — |

High 0건 남음. 수정 후 `npm test` 재실행 통과, S-01~S-16 재확인 통과.

## 4. 성능·자원

- 디스크 기준 초기 자원(HTML+CSS+JS+데이터+Hero 2장) **약 560KB** (Hero 1920→1440px 재압축 288KB, 960px 116KB). 목표 1MB 이하 충족.
- 외부 자원은 Pretendard·Inter CSS 2개뿐. transferSize는 캐시·CORS로 0으로 보고되어 디스크 크기로 대체 측정했다.

## 5. 완료 조건 대응

| 완료 조건 | 근거 |
|---|---|
| 1 지역 선택 | S-01 |
| 2 라이프스타일 기준 비교 | S-02·S-03, `tests/filter.test.js` |
| 3 월 생활비 → 연간 예산 | S-04·S-05, `tests/budget.test.js`(SC-003 표 10개) |
| 4 체크리스트 저장 | S-07·S-08 |
| 5 새로고침 유지 | S-08·S-13·S-14, `tests/storage.test.js` |
| 6 모바일 가로 스크롤 없음 | S-09 (320~1440) |
| 7 My Bali Year 확인 | S-01·S-05·S-07·S-15 |
| 8 비자 공식 출처 안내 | S-12, `scripts/lint-content.mjs` |

## 6. 남은 항목 (사용자 확인 권장)

- S-10 실제 Tab 키 조작, S-11 OS 움직임 감소, S-17 오프라인 — 이 환경에서 수행하지 못한 세 가지.
- 클립보드 복사의 정상 경로(권한 있는 활성 탭)는 폴백만 확인했다.
- 후속 과제(research.md): Playwright 자동화, 탭 간 동기화, 콘텐츠 출처 갱신 절차.
