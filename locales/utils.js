export function scrambleEl(el, target, pool, isScramblable) {
  const duration = Math.min(900, Math.max(500, target.length * 5));
  const start = performance.now();

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) * (1 - t);
    const resolved = Math.floor(eased * target.length);
    let out = "";
    for (let i = 0; i < target.length; i++) {
      if (i < resolved) {
        out += target[i];
      } else if (isScramblable(target[i])) {
        out += pool[Math.floor(Math.random() * pool.length)];
      } else {
        out += target[i];
      }
    }
    el.textContent = out;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = target;
  }

  requestAnimationFrame(frame);
}
