// BALI 365 장면 데이터 — 18장면. 각 장면 = 사진 1장 + 짧은 글. module/part는 js/app.js가 어떤 섹션 모듈의 어느 부분을 그릴지 정한다. 출처: assets/CREDITS.md
const C = (artist, license, file) => ({ artist, license, url: `https://commons.wikimedia.org/wiki/File:${file}` });
export const scenes = [
  { id: 'hero', module: 'hero', layout: 'center', image: 'hero-uluwatu', alt: '울루와뚜 절벽 위 사원 산책로와 그 아래로 부서지는 인도양의 파도', credit: C('Emma THERY', 'CC BY-SA 4.0', 'Cliff_at_Uluwatu_temple,_Bali.jpg') },

  { id: 'why-work', module: 'whyBali', part: 'work', layout: 'left', eyebrow: 'Why Bali · Work', title: '일이 끊기지 않는 곳', tagline: '한국 팀과 한 시간 차이, 카페와 코워킹이 동네마다', image: 'why-work-night', alt: '밤의 카페 창가에서 노트북을 켜고 일하는 두 사람', credit: C('Muhammad Raufan Yusup', 'CC0', 'Working_Late_(Unsplash).jpg') },
  { id: 'why-life', module: 'whyBali', part: 'life', layout: 'right', eyebrow: 'Why Bali · Life', title: '관광객의 소비에서 거주자의 소비로', tagline: '한 달을 넘기면 생활의 리듬이 바뀐다', image: 'why-life-cafe', alt: '논 위에 지은 초가 지붕 카페 좌석과 흐린 하늘', credit: C('Tigerente', 'CC BY-SA 4.0', 'Karsa_Cafe_Bangkiang_Sidem_Bali_20120827a.jpg') },
  { id: 'why-nature', module: 'whyBali', part: 'nature', layout: 'left', eyebrow: 'Why Bali · Nature', title: '퇴근 뒤 한 시간이면 풍경이 바뀐다', tagline: '바다와 논, 화산과 숲이 한 섬 안에', image: 'why-nature-terrace', alt: '테갈랄랑의 계단식 논과 야자수', credit: C('Vyacheslav Argenberg', 'CC BY 4.0', 'Rice_terraces,_Bali.jpg') },
  { id: 'why-community', module: 'whyBali', part: 'community', layout: 'right', eyebrow: 'Why Bali · Community', title: '혼자 와도 혼자 살지 않는다', tagline: '노마드 커뮤니티와 현지 마을, 두 개의 공동체', image: 'local-kecak', alt: '해질녘 케착 공연, 횃불 주위에 둘러앉은 무용수와 관객', credit: C('Cindy Chen', 'CC BY 3.0', 'Kecak_Dance_(52116626).jpeg') },

  { id: 'find-your-base', module: 'areaExplorer', layout: 'wide', eyebrow: 'Find Your Base', title: '나에게 맞는 베이스 찾기', tagline: '네 지역, 네 가지 리듬', image: 'base-jimbaran', alt: '짐바란 해변의 잔잔한 저녁 파도와 흐린 하늘', credit: C('Akmaie Ajam', 'CC BY-SA 4.0', 'Jimbaran_sunset_2.jpg') },

  { id: 'months-1', module: 'timeline', part: [1, 2, 3], layout: 'wide', eyebrow: '12 Months · Jan – Mar', title: '도착, 그리고 첫 리듬', tagline: '우기의 오전에 일하고, 비 그친 오후에 동네를 익힌다', image: 'why-ubud-fields', alt: '우붓 외곽의 계단식 논과 야자수, 구름 낀 오후 하늘', credit: C('Jakub Hałun', 'CC BY-SA 4.0', 'Fields_in_Ubud,_Bali,_Indonesia,_20220822_1344_0125.jpg') },
  { id: 'months-2', module: 'timeline', part: [4, 5, 6], layout: 'wide', eyebrow: '12 Months · Apr – Jun', title: '건기가 오면 밖으로', tagline: '일출을 보러 가고, 사람을 만나고, 다시 집중한다', image: 'months-batur', alt: '바투르 산 정상에서 본 일출, 구름 아래로 이어지는 능선', credit: C('Aaron Rentfrew', 'CC BY-SA 4.0', 'Sunrise_from_Mount_Batur.jpg') },
  { id: 'months-3', module: 'timeline', part: [7, 8, 9], layout: 'wide', eyebrow: '12 Months · Jul – Sep', title: '섬 밖으로, 그리고 느린 8월', tagline: '성수기의 소음을 피해 옆 섬으로 건너간다', image: 'months-q3-penida', alt: '누사페니다 클링킹 절벽과 그 아래 하얀 모래 해변', credit: C('Chainwit.', 'CC BY 4.0', 'Kelingking_Beach_(T-Rex_Bay)_of_Nusa_Penida,_Bali_(2025)_-_img_07.jpg') },
  { id: 'months-4', module: 'timeline', part: [10, 11, 12], layout: 'wide', eyebrow: '12 Months · Oct – Dec', title: '한 해를 돌아보는 마무리', tagline: '비가 돌아오고, 남길 것과 정리할 것을 나눈다', image: 'months-q4-bratan', alt: '브라탄 호수 위에 떠 있는 울룬 다누 사원과 안개 낀 산', credit: C('CEphoto, Uwe Aranas', 'CC BY-SA 3.0', 'Brantan_Bali_Pura-Ulun-Danu-Bratan-01.jpg') },

  { id: 'monthly-budget', module: 'budget', layout: 'wide', eyebrow: 'Monthly Budget', title: '월 생활비와 연간 예산', tagline: '루피아로 적고, 원화로 가늠한다', image: 'budget-ubud-market', alt: '우붓 시장 좌판에 걸린 화려한 전통 연과 장식품', credit: C('Jorge Láscar', 'CC BY 2.0', 'Ubud_market_(16435596274).jpg') },

  { id: 'work', module: 'workLive', part: 'work', layout: 'wide', eyebrow: 'Work & Live · Work', title: '일하기 위한 세 가지 기준', tagline: '인터넷, 코워킹, 카페 — 지역마다 다르다', image: 'work-laptop', alt: '유리창 옆 나무 테이블에서 노트북을 펴고 일하는 사람', credit: C('Muhammad Raufan Yusup', 'CC0', 'Man_sitting_with_laptop_(Unsplash).jpg') },
  { id: 'rhythm', module: 'workLive', part: 'rhythm', layout: 'left', eyebrow: 'Work & Live · Rhythm', title: '한국 시간에 맞춘 하루', tagline: '시차 한 시간이 만드는 오후의 여백', image: 'rhythm-sanur-walk', alt: '이른 아침 사누르 해변의 긴 모래 산책로', credit: C('Aspere', 'CC0', '250217_Sanur_Beach_08.jpg') },

  { id: 'visa-stay', module: 'visaStay', part: 'info', layout: 'wide', eyebrow: 'Visa & Stay', title: '장기 체류와 준비', tagline: '제도는 바뀐다. 확인은 공식 출처에서', image: 'visa-airport', alt: '응우라라이 국제공항 입구의 발리 전통 양식 문과 야자수', credit: C('Pinterpandai.com', 'CC BY-SA 3.0', 'Bali_Airport_(DPS)_I_Gusti_Ngurah_Rai_International_Airport.jpg') },
  { id: 'checklist', module: 'visaStay', part: 'checklist', layout: 'left', eyebrow: 'Checklist', title: '출국 전 여섯 가지', tagline: '체크한 상태는 이 브라우저에 남는다', image: 'checklist-airport', alt: '응우라라이 공항 독서 코너에서 책을 읽으며 기다리는 사람', credit: C('Jorge Franganillo', 'CC BY 2.0', 'Ngurah_Rai_International_Airport-_reading_corner.jpg') },

  { id: 'local-1', module: 'localLife', part: ['culture', 'temple', 'community'], layout: 'wide', eyebrow: 'Local Life · People', title: '이웃의 눈으로', tagline: '문화, 사원, 공동체', image: 'local-tanah-lot', alt: '바다 위 바위섬에 자리한 타나롯 사원과 파도', credit: C('Jakub Hałun', 'CC BY-SA 4.0', 'Bali_-_Pura_Tanah_Lot,_20220827_0958_1114.jpg') },
  { id: 'local-2', module: 'localLife', part: ['transport', 'health', 'waste'], layout: 'wide', eyebrow: 'Local Life · Daily', title: '매일의 규칙', tagline: '길, 몸, 쓰레기', image: 'local-tegenungan', alt: '숲 사이로 떨어지는 트게눙안 폭포와 바위 위의 사람들', credit: C('Magul', 'CC BY-SA 4.0', 'Tegenungan_Waterfall_2017-08-18_(2).jpg') },

  { id: 'my-bali-year', module: 'myBaliYear', layout: 'center', eyebrow: 'My Bali Year', title: '나의 발리 1년', tagline: '앞에서 정한 선택이 한 장으로 모인다', image: 'year-sunset', alt: '석양이 비친 발리 해변의 젖은 모래와 사람들 실루엣', credit: C('Simon_sees', 'CC BY 2.0', 'Bali_sunset_(6924455664).jpg') },
];
