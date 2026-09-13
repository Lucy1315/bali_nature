// 작은 DOM 헬퍼. 텍스트는 항상 textContent로 넣는다(콘텐츠에 HTML 없음).
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

// 2단계 인라인 확인. 브라우저 모달을 쓰지 않는다(contracts/dom-contract.md).
export function inlineConfirm(trigger, message, onConfirm) {
  const wrap = el('span', { class: 'confirm' });
  const msg = el('span', { class: 'confirm__msg', text: message });
  const yes = el('button', { type: 'button', class: 'btn btn--secondary', text: '확인' });
  const no = el('button', { type: 'button', class: 'btn btn--tertiary', text: '취소' });
  const restore = () => { wrap.replaceWith(trigger); trigger.focus(); };
  yes.addEventListener('click', () => { onConfirm(); restore(); });
  no.addEventListener('click', restore);
  wrap.append(msg, yes, no);
  trigger.replaceWith(wrap);
  yes.focus();
}

export function meter(value, { label, variant = '', max = 5 } = {}) {
  const dots = el('div', { class: 'meter__dots' });
  const n = Number.isFinite(value) ? value : 0;
  for (let i = 1; i <= max; i++) dots.append(el('span', { class: `meter__dot${i <= n ? ' meter__dot--on' : ''}` }));
  const text = Number.isFinite(value) ? `${label}` : `${label} · 확인불가`;
  return el('div', { class: `meter ${variant}`.trim(), role: 'img', 'aria-label': `${label} ${Number.isFinite(value) ? `${value}/${max}` : '확인불가'}` },
    el('span', { text }), dots);
}
