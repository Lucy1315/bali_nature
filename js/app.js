// BALI 365 부트스트랩. 순서: 저장소 복원 → 스토어 → 섹션 render → bind → 저장 구독.
// 섹션 모듈 계약: contracts/dom-contract.md
import * as storage from './storage.js';
import { createStore, reducer, ACTIONS } from './state.js';
import { copy } from '../data/copy.js';
import { regions } from '../data/regions.js';
import { months } from '../data/months.js';
import { workLive } from '../data/workLive.js';
import { stay } from '../data/stay.js';
import { checklist } from '../data/checklist.js';
import { localLife } from '../data/localLife.js';

import * as nav from './sections/nav.js';
import * as hero from './sections/hero.js';
import * as whyBali from './sections/whyBali.js';
import * as areaExplorer from './sections/areaExplorer.js';
import * as timeline from './sections/timeline.js';
import * as budget from './sections/budget.js';
import * as workLiveSection from './sections/workLive.js';
import * as visaStay from './sections/visaStay.js';
import * as localLifeSection from './sections/localLife.js';
import * as myBaliYear from './sections/myBaliYear.js';

const data = { copy, regions, months, workLive, stay, checklist, localLife };

const sections = [
  ['hero', hero],
  ['why-bali', whyBali],
  ['find-your-base', areaExplorer],
  ['twelve-months', timeline],
  ['monthly-budget', budget],
  ['work-live', workLiveSection],
  ['visa-stay', visaStay],
  ['local-life', localLifeSection],
  ['my-bali-year', myBaliYear],
];

function boot() {
  const loaded = storage.load();
  const store = createStore(loaded.state, reducer, data);
  store.dispatch({ type: ACTIONS.HYDRATE, payload: loaded.state });

  for (const [id, mod] of sections) {
    const root = document.getElementById(id);
    if (!root) continue;
    mod.render(root, data, store.getState());
  }
  for (const [id, mod] of sections) {
    const root = document.getElementById(id);
    if (!root) continue;
    mod.bind(root, store, data);
  }
  nav.init(document.querySelector('.site-nav'));

  store.subscribe((state) => {
    const result = storage.save(state);
    if (!result.available) showStorageNotice();
  });
  if (!loaded.available) showStorageNotice();
}

let noticeShown = false;
function showStorageNotice() {
  if (noticeShown) return;
  noticeShown = true;
  const el = document.querySelector('[data-notice]');
  if (!el) return;
  el.textContent = copy.notices.storageUnavailable;
  el.hidden = false;
}

boot();
