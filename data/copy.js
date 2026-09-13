// BALI 365 콘텐츠 데이터 — 계약: specs/001-bali-365-site/contracts/content-schema.md
export const copy = {
  hero: {
    title: 'BALI 365',
    subtitle: '디지털노마드로 발리에서 1년 살기',
    tagline: '여행보다 길고, 이민보다 가볍게. 일하고, 머물고, 살아보는 발리의 365일.',
  },
  heroCta: '내 베이스 찾기',

  whyBali: [
    {
      id: 'work',
      eyebrow: 'WORK',
      title: '일이 끊기지 않는 곳',
      body: '발리에는 원격근무자를 위한 코워킹 공간과 오래 앉아 일하기 좋은 카페가 여러 해에 걸쳐 자리 잡아 왔다. 한국과의 시차가 한 시간이라 한국 팀의 근무 시간에 맞춰 일하기에 부담이 적다. 매일 같은 자리에서 같은 리듬으로 일하는 생활이 여행지가 아닌 일터로서의 발리를 만든다.',
    },
    {
      id: 'life',
      eyebrow: 'LIFE',
      title: '관광객의 소비에서 거주자의 소비로',
      body: '장기 체류의 생활비는 지역과 생활 방식에 따라 폭이 넓지만, 월 단위 계약과 동네 식당을 활용하면 예산을 스스로 조절할 여지가 크다. 한 달을 넘기면 소비의 성격이 관광에서 생활로 바뀐다. 이 사이트는 그 전환을 숫자로 가늠해 보는 데서 출발한다.',
    },
    {
      id: 'nature',
      eyebrow: 'NATURE',
      title: '퇴근 뒤 한 시간이면 풍경이 바뀐다',
      body: '바다와 논, 화산과 숲이 한 섬 안에 있어 일과가 끝난 뒤 짧은 이동만으로 다른 풍경 속에 선다. 매일 보는 일몰과 아침 산책이 관광이 아니라 일상의 일부가 된다. 자연이 가까운 만큼 우기와 습도 같은 계절의 조건도 생활 계획에 넣어야 한다.',
    },
    {
      id: 'community',
      eyebrow: 'COMMUNITY',
      title: '혼자 와도 혼자 살지 않는다',
      body: '발리에는 여러 나라에서 온 원격근무자와 장기 체류자가 모여 있어 정보와 관계가 코워킹의 행사와 동네 모임에서 자연스럽게 쌓인다. 동시에 현지 이웃과 함께 살아가는 태도가 1년 살기의 밀도를 정한다. 두 공동체에 한 발씩 두는 것이 이 섬에서 오래 사는 방법이다.',
    },
  ],

  filterLabels: {
    work: 'Work',
    nature: 'Nature',
    beach: 'Beach',
    quiet: 'Quiet',
    community: 'Community',
  },
  filterHints: {
    work: '안정적인 작업 환경',
    nature: '논·숲·바다가 가까운 곳',
    beach: '걸어서 닿는 해변',
    quiet: '느리고 조용한 리듬',
    community: '사람과 모임이 있는 곳',
  },

  budgetLabels: {
    housing: { en: 'Housing', ko: '주거' },
    food: { en: 'Food', ko: '식비' },
    coworking: { en: 'Coworking / Cafe', ko: '코워킹·카페' },
    transport: { en: 'Transport', ko: '교통' },
    wellness: { en: 'Wellness & Activities', ko: '웰니스·활동' },
    insurance: { en: 'Insurance', ko: '보험' },
    other: { en: 'Other', ko: '기타' },
  },

  notices: {
    storageUnavailable: '이 브라우저에서는 선택이 저장되지 않는다. 페이지를 닫으면 입력한 내용이 사라진다.',
    rateHint: '환율을 입력하면 원화(KRW) 환산을 함께 보여준다. 환산은 참고용이며 외부 환율을 조회하지 않는다.',
    emptyBudget: '항목별 월 생활비를 입력하면 연간 예산이 계산된다.',
    notSelected: '아직 선택하지 않음',
    official: '이 정보는 안내 목적이며 법률 자문이 아니다. 최신 내용은 공식 인도네시아 이민청(Direktorat Jenderal Imigrasi)에서 확인해야 한다.',
    noMatch: '조건에 꼭 맞는 지역이 없다. 필터를 줄이거나 해제해 다시 살펴본다.',
    regionDefault: '{region}의 참고 생활비를 기본값으로 채웠다. 출처: {source} ({asOf} 기준). 직접 입력한 항목은 그대로 둔다.',
    copied: '계획을 클립보드에 복사했다.',
    copyFallback: '이 환경에서는 클립보드 복사를 지원하지 않는다. 아래 텍스트를 직접 선택해 복사한다.',
    resetConfirm: '체크리스트의 체크를 모두 해제한다. 이 작업은 되돌릴 수 없다.',
    resetAllConfirm: '지역·필터·예산·환율·체크리스트를 모두 초기화한다. 이 작업은 되돌릴 수 없다.',
    checklistDone: '준비 체크리스트를 모두 완료했다. 발리의 1년이 한 걸음 가까워졌다.',
    staleInfo: '이 정보는 갱신한 지 12개월이 지났다. 내용이 오래되었을 수 있으니 공식 출처에서 다시 확인해야 한다.',
  },

  rateExample: {
    value: 12,
    asOf: '2026-09',
    note: '예시 값이다. 실제 환율은 은행·환전소에서 확인한다.',
  },

  sectionIntros: {
    findYourBase: '발리의 네 지역은 성격이 서로 다르다. 중요하게 여기는 라이프스타일을 고르면 맞는 지역이 드러나고, 그중 하나를 내 베이스로 정한다.',
    twelveMonths: '1년은 열두 번의 리듬으로 흐른다. 일에 몰입하는 달, 섬을 돌아보는 달, 쉬어 가는 달, 사람을 만나는 달을 미리 그려 본다.',
    monthlyBudget: '일곱 항목의 월 생활비를 인도네시아 루피아(IDR)로 입력하면 월 예산과 연간 예산이 바로 계산된다. 지역을 골랐다면 참고 값이 먼저 채워진다.',
    workLive: '장소 목록이 아니라 실제로 일하며 살 때 중요한 기준을 정리했다. 기준마다 왜 중요한지, 무엇을 확인할지를 적었다.',
    visaStay: '장기 체류에는 확인할 제도가 있다. 여기서는 안내만 하며, 최종 확인은 공식 출처에서 해야 한다.',
    localLife: '관광객이 아니라 함께 살아가는 사람의 눈으로 여섯 가지를 적었다. 작은 예의가 1년의 관계를 만든다.',
    myBaliYear: '앞에서 정한 선택이 한 장의 계획으로 모인다. 이 카드는 이 브라우저에만 저장된다.',
  },
};
