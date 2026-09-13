# Quickstart: BALI 365 실행·검증 가이드

## 준비

- Node.js 20 이상(로컬 확인: v26.7.0), Python 3(정적 서버용). 설치할 패키지 없음.
- 저장소 루트 `bali_365/`에서 실행한다.

```bash
npm test          # node --test tests/ + scripts/contrast.mjs + scripts/lint-content.mjs
npm run dev       # python3 -m http.server 3780  →  http://localhost:3780
```

포트 3780은 워크스페이스의 다른 앱(3777·3778·3779·5174·5175)과 겹치지 않는다.

## 자동 검증 (터미널)

| ID | 명령 | 기대 결과 | 대응 |
|---|---|---|---|
| A-01 | `node --test tests/` | 전부 pass. filter·budget·format·summary·state·storage 6파일 | SC-002·003·004, 헌장 III |
| A-02 | `node scripts/contrast.mjs` | DESIGN §2.2 조합 전부 기준 이상, 종료 코드 0 | SC-009, 헌장 IV |
| A-03 | `node scripts/lint-content.mjs` | 필수 필드·개수·금지 표현·Hero 원문 통과 | SC-007·010, 헌장 V |

## 브라우저 시나리오 (http://localhost:3780, 새 시크릿 창에서 시작)

각 시나리오는 독립적으로 수행할 수 있다. "확인"은 눈으로 본 것과 개발자 도구 콘솔에서 확인한 값을 함께
기록한다.

| ID | 단계 | 기대 결과 | 대응 |
|---|---|---|---|
| S-01 지역 선택 | Find Your Base에서 Ubud 카드 "내 베이스로 선택" 클릭 | 카드 `data-selected=true`, SELECTED 표시, My Bali Year Base가 즉시 "Ubud" | 완료 조건 1·7, US1-6 |
| S-02 필터 | Quiet 선택 → Beach 추가 → 필터 해제 | Quiet: 해당 지역 highlighted·나머지 dimmed(사라지지 않음). Beach 추가: AND 결과. 해제: 전부 neutral | 완료 조건 2, US1-2~5 |
| S-03 조건 없음 | 다섯 필터 전부 선택 | "조건에 꼭 맞는 지역이 없다" 안내 + 해제 버튼 | US1-4 |
| S-04 예산 계산 | 지역 선택 상태에서 Monthly Budget 열기 → Housing을 10,000,000으로 변경 | 기본값 7항목 채워짐 + 출처 Caption. 변경 즉시 Monthly=합계, Annual=×12 | 완료 조건 3, US2-1·2 |
| S-05 환율 | 환율 입력 12 → 삭제 | 입력 시 KRW 병기(IDR÷12 반올림). 삭제 시 IDR만 + 안내 | US2-5·6 |
| S-06 예산 보호 | Food 직접 입력 후 다른 지역 선택 → "지역 기본값으로 되돌리기" | Food 유지, 나머지 6개만 교체. 되돌리기 후 7개 전부 새 지역 값 | US2-8 |
| S-07 체크리스트 | 3개 체크 | 각 행 체크 표시, "3 / 6", My Bali Year Checklist "3 / 6" 즉시 | 완료 조건 4, US3-4 |
| S-08 새로고침 유지 | S-01·02·04·05·07 수행 후 F5, 탭 닫고 재열기 | 지역·필터·예산 7항목·환율·체크 3개 모두 동일 | 완료 조건 5, SC-004 |
| S-09 5폭 overflow | `http://localhost:3780/scripts/overflow-check.html`을 열면 같은 출처 iframe 5개(320·390·768·1024·1440px)가 `scrollWidth === clientWidth`와 넘치는 요소를 자동 측정한다. 개발자 도구 기기 모드로 직접 확인해도 된다 | 다섯 폭 모두 `true`. 모바일에서 격자 1열 | 완료 조건 6, SC-005 |
| S-10 키보드 | 페이지 처음부터 Tab만으로 이동 | nav → Hero CTA → 필터 5개 → 지역 선택 4개 → 예산 입력 8개 → 체크 6개 → 요약 액션 순으로 포커스 링(`--palm`) 보임. Enter/Space로 조작됨 | SC-009, DESIGN §8 |
| S-11 모션 | OS 움직임 감소 켜고 새로고침 | 전환 없음(즉시 반영) | DESIGN §7 |
| S-12 비자 안내 | Visa & Stay 두 영역 확인 | 각 영역 Last updated 날짜, 이민청 링크·안내 문구. "가능하다·된다·허용된다" 검색 0건 | 완료 조건 8, SC-007 |
| S-13 저장 차단 | 콘솔에서 `Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})` 후 새로고침 | 오류 없이 동작, "저장되지 않는다" 안내 1회 | FR-004, 헌장 VII |
| S-14 손상 데이터 | 콘솔 `localStorage.setItem('bali365:plan','{"version":1,"area":"mars","filters":"x"}')` 후 새로고침 | 화면 정상, area·filters 초기값, 다른 필드 유지 | Edge Case, 헌장 VII |
| S-15 초기화·복사 | My Bali Year "처음부터 다시"(2단계 확인) → "계획 복사" | 전 섹션 초기 상태. 복사 시 클립보드에 5값 텍스트, 안내 표시 | FR-041·042 |
| S-16 시각 대조 | DESIGN.md(Framer) 토큰과 실제 렌더 비교(canvas #090909, 알약 버튼 흰/검정, 카드 surface-1 20px, eyebrow accent #0099ff, 유리 패널) | 값 일치. 패널 위 텍스트 대비 ≥ 4.5 (`contrast.mjs`) | 헌장 I·IV |
| S-17 오프라인 폰트 | 네트워크 차단 후 새로고침 | 시스템 서체로 대체, 레이아웃 유지, 기능 정상 | 헌장 II |

## 완료 판정

A-01~03 전부 통과 + S-01~17 전부 기대 결과 일치 + 9개 장면 사진이 모두 표시되고 `assets/CREDITS.md`에 기록됨(v3). 하나라도 어긋나면 "완료"로 보고하지 않고 어긋난
시나리오 ID와 관찰 결과를 그대로 기록한다(헌장 VIII).
