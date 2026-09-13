// BALI 365 부트스트랩. 순서: 저장소 복원 → 스토어 → 장면 골격 → 섹션 모듈 render(part) → bind → 저장 구독.
import * as storage from './storage.js';
import { createStore, reducer, ACTIONS } from './state.js';
import { copy } from '../data/copy.js';
import { regions } from '../data/regions.js';
import { months } from '../data/months.js';
import { workLive } from '../data/workLive.js';
import { stay } from '../data/stay.js';
import { checklist } from '../data/checklist.js';
import { localLife } from '../data/localLife.js';
import { scenes } from '../data/scenes.js';
import { renderScene } from './sections/scene.js';
import * as journey from './journey.js';
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

const data = { copy, regions, months, workLive, stay, checklist, localLife, scenes };
const modules = { hero, whyBali, areaExplorer, timeline, budget, workLive: workLiveSection, visaStay, localLife: localLifeSection, myBaliYear };

function boot() {
  const loaded = storage.load();
  const store = createStore(loaded.state, reducer, data);
  store.dispatch({ type: ACTIONS.HYDRATE, payload: loaded.state });

  const mounted = [];
  for (const scene of scenes) {
    const root = document.getElementById(scene.id);
    if (!root) continue;
    renderScene(root, scene);
    const mod = modules[scene.module];
    if (!mod) continue;
    mod.render(root, data, store.getState(), scene.part);
    mounted.push([root, mod, scene.part]);
  }
  for (const [root, mod, part] of mounted) mod.bind(root, store, data, part);
  nav.init(document.querySelector('.site-nav'));
  journey.init();

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
