# Contract: localStorage 상태 스키마 v1

**키**: `bali365:plan` (접두어 `bali365:`는 이 사이트 전용, 헌장 VII) · **형식**: JSON 문자열

## 스키마

```json
{
  "version": 1,
  "area": "ubud",
  "filters": ["nature", "quiet"],
  "budget": {
    "items": { "housing": 8000000, "food": 4000000, "coworking": 1500000, "transport": 800000,
               "wellness": 1500000, "insurance": 700000, "other": 1000000 },
    "touched": ["food"],
    "rate": 12
  },
  "checklist": { "visa": true, "insurance": false, "accommodation": true, "workspace": false,
                 "transport": false, "emergency": false }
}
```

## 읽기 규칙 (`storage.load()`)

1. `localStorage.getItem` 호출은 try/catch. 예외·null이면 초기값 반환, `available:false` 플래그.
2. `JSON.parse` 실패 → 초기값, 손상 키는 덮어쓴다.
3. `version !== 1` → 초기값(마이그레이션 지점).
4. 필드별 검증, 실패한 필드만 초기값:
   - `area`: RegionId 목록에 있거나 null
   - `filters`: 배열, 원소가 LifestyleFilter이고 중복 없음(중복·미상 값은 제거)
   - `budget.items`: 7키 각각 null 또는 0 ≤ 정수 ≤ 1e12. 누락 키는 null
   - `budget.touched`: BudgetItemId 배열(미상 값 제거)
   - `budget.rate`: null 또는 0 < 숫자 ≤ 1e6
   - `checklist`: 6키 각각 boolean. 누락은 false
5. 반환: `{ state, available: boolean, recovered: boolean }`. `recovered`가 true면 콘솔 경고만(사용자 안내 없음).

## 쓰기 규칙 (`storage.save(state)`)

- try/catch. 실패(용량·차단)하면 메모리에 보관하고 `available=false`로 전환, 안내는 세션당 1회
  (`sessionStorage['bali365:notice']` 또는 메모리 플래그).
- 저장은 전이마다 동기 호출(입력 연타 시 16ms 디바운스 허용).

## 초기화 (`storage.clear()`)

`removeItem('bali365:plan')` 후 초기값 반환. 실패해도 메모리 상태는 초기화한다.

## 테스트 케이스 (`tests/storage.test.js`)

정상 왕복 · 손상 JSON · version 0 · `filters`에 미상 값 · `items.housing`이 문자열 · `rate` 음수 ·
`setItem`이 throw(차단) · `getItem`이 throw.
