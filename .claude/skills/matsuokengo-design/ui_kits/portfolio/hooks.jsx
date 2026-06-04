/* matsuokengo.com UI kit — hooks + components.
   Faithful recreation of the portfolio's signature motion:
   conic glow-border that tracks the cursor + 3D card tilt. */
const { useRef, useEffect, useState, useCallback } = React;

/* ── useGlowTilt ───────────────────────────────────────────
   Ports script.js: a rAF lerp loop that sweeps the conic
   highlight toward the pointer's X and tilts the element in 3D.
   `tilt` toggles the perspective rotation (cards yes, buttons no). */
function useGlowTilt({ tilt = true } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cornerAngle = () => {
      const r = el.getBoundingClientRect();
      return ((Math.atan2(-r.height/2, -r.width/2) * 180/Math.PI) + 90 + 360) % 360;
    };
    let home = cornerAngle();
    let current = home - 90, target = home, intro = true;
    let tiltX = 0, tiltY = 0, tTiltX = 0, tTiltY = 0, hovered = false, raf = null;
    el.style.setProperty("--card-light-angle", current + "deg");

    const apply = () => {
      if (!tilt) return;
      const lift = hovered ? "translateY(-6px) scale(1.02)" : "";
      el.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) ${lift}`;
    };
    const tick = () => {
      const lf = intro ? 0.04 : 0.18;
      const d = target - current;
      if (Math.abs(d) > 0.2) current += d * lf; else { current = target; intro = false; }
      el.style.setProperty("--card-light-angle", current + "deg");
      tiltX += (tTiltX - tiltX) * 0.7; tiltY += (tTiltY - tiltY) * 0.7; apply();
      const moving = Math.abs(d) > 0.2 || Math.abs(tTiltX - tiltX) > 0.05 || Math.abs(tTiltY - tiltY) > 0.05;
      if (moving) raf = requestAnimationFrame(tick);
      else { if (!hovered && tilt) el.style.removeProperty("transform"); raf = null; }
    };
    // power-on sweep
    const introT = setTimeout(() => {
      home = cornerAngle(); current = home - 90; target = home;
      el.style.setProperty("--card-glow", "1"); intro = true;
      if (!raf) raf = requestAnimationFrame(tick);
    }, 120);

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const relX = (e.clientX - r.left) / r.width, relY = (e.clientY - r.top) / r.height;
      const rightAngle = ((Math.atan2(-r.height/2, r.width/2)*180/Math.PI) + 90 + 360) % 360;
      const span = ((rightAngle - home + 180 + 360) % 360) - 180;
      const raw = home + relX * span;
      target += ((((raw - target + 180) % 360) + 360) % 360) - 180;
      if (tilt) { const s = Math.min(1, 200 / r.width); tTiltY = (relX-0.5)*12*s; tTiltX = -(relY-0.5)*6*s; }
      hovered = true; if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      home = cornerAngle();
      target += ((((home - target + 180) % 360) + 360) % 360) - 180;
      tTiltX = 0; tTiltY = 0; hovered = false; if (!raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { clearTimeout(introT); cancelAnimationFrame(raf); el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [tilt]);
  return ref;
}

/* ── useAppear ── IntersectionObserver reveal ── */
function useAppear() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add("visible"); io.unobserve(target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ── IME retype: animates an element through Live-Conversion frames ── */
function imeRetype(el, frames, finalText, onDone) {
  let i = 0;
  const show = (done, comp) => {
    el.innerHTML = "";
    el.appendChild(document.createTextNode(done));
    if (comp) { const s = document.createElement("span"); s.className = "ime-composing"; s.textContent = comp; el.appendChild(s); }
    const c = document.createElement("span"); c.className = "ime-cursor"; c.textContent = "|"; el.appendChild(c);
  };
  const step = () => {
    if (i >= frames.length) { el.textContent = finalText; onDone && onDone(); return; }
    const [done, comp] = frames[i];
    show(done, comp);
    const kanji = /[一-鿿]/.test(comp), kata = /[゠-ヿ]/.test(comp), romaji = /[a-z]$/.test(comp);
    let delay = 35 + Math.random()*35;
    if (kanji) delay = 70 + Math.random()*70;
    else if (kata) delay = 42 + Math.random()*28;
    else if (comp && !romaji) delay = 28 + Math.random()*28;
    i++; setTimeout(step, delay);
  };
  step();
}

/* simple typewriter for non-IME strings */
function typeOut(el, target, onDone) {
  let n = 0; const total = Math.max(1, target.length); const per = 360 / total;
  const show = (t) => { el.innerHTML = ""; el.appendChild(document.createTextNode(t)); const c=document.createElement("span"); c.className="ime-cursor"; c.textContent="|"; el.appendChild(c); };
  const tick = () => {
    if (n < target.length) { n++; show(target.slice(0,n)); setTimeout(tick, per*(0.3+Math.random()*1.2)); }
    else { el.textContent = target; onDone && onDone(); }
  };
  tick();
}

/* ── Icons (inline, currentColor — the brand's whole UI icon set) ── */
const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/></svg>
);
const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,9 7,4 12,9"/></svg>
);

Object.assign(window, { useGlowTilt, useAppear, imeRetype, typeOut, GitHubIcon, MailIcon, ChevronUp });
