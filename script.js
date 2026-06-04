const LANG = (() => {
  const l = (
    Intl.DateTimeFormat().resolvedOptions().locale ||
    navigator?.languages[0] ||
    navigator.language ||
    ""
  )
    .split("-")[0]
    .toLowerCase();
  // alert("Datetime:" + Intl.DateTimeFormat().resolvedOptions().locale);
  // alert("Languages:" + navigator.languages);
  // alert("Language:" + navigator.language);
  // alert("Language (split):" + l);
  return ["ja", "id", "ko"].includes(l) ? l : null;
})();

const loadingOverlay = document.getElementById("loading-overlay");
const loadingText = document.getElementById("loading-text");
const dotStates = ["Loading", "Loading.", "Loading..", "Loading..."];
let dotIndex = 0;
let dotInterval = null;

const allImgs = Array.from(document.images);
const totalImgs = allImgs.length;
let loadedImgs = 0;
const fill =
  loadingOverlay && loadingOverlay.querySelector(".loading-bar-fill");

function updateBar() {
  if (!fill || !totalImgs) return;
  fill.style.transition = "width 0.2s ease";
  fill.style.width = (loadedImgs / totalImgs) * 100 + "%";
}

allImgs.forEach((img) => {
  if (img.complete) {
    loadedImgs++;
  } else {
    img.addEventListener(
      "load",
      () => {
        loadedImgs++;
        updateBar();
      },
      { once: true },
    );
    img.addEventListener(
      "error",
      () => {
        loadedImgs++;
        updateBar();
      },
      { once: true },
    );
  }
});
updateBar();

setTimeout(() => {
  if (loadingOverlay) {
    loadingOverlay.classList.add("visible");
    dotInterval = setInterval(() => {
      dotIndex = (dotIndex + 1) % dotStates.length;
      if (loadingText) loadingText.textContent = dotStates[dotIndex];
    }, 400);
  }
}, 1000);

window.addEventListener("load", () => {
  if (loadingOverlay) {
    clearInterval(dotInterval);
    if (fill) {
      fill.style.transition = "width 0.3s ease";
      fill.style.width = "100%";
    }
    // Don't lift the overlay until the webfonts are parsed and ready, so no
    // text is ever painted in a fallback font first.
    const fontsReady =
      (document.fonts && document.fonts.ready) || Promise.resolve();
    fontsReady.then(() => {
      setTimeout(() => {
        loadingOverlay.classList.add("done");
        loadingOverlay.addEventListener(
          "transitionend",
          () => loadingOverlay.remove(),
          { once: true },
        );
      }, 300);
    });
  }
  const localeReady = LANG ? import(`/locales/${LANG}.js`) : null;
  // alert("Locale ready:" + localeReady);

  const loadTime = Date.now();
  // Hero sequence ends at ~100ms settle + 280ms last element + 900ms animation
  const HERO_DONE = 550;

  // Groups card wrappers by section grid so whole section fires together
  const cardGroups = new Map();

  const appearObserver = new IntersectionObserver(
    (entries) => {
      const toShow = [];
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        const group = cardGroups.get(target);
        if (group) {
          // First card in this section seen — fire entire group
          group.forEach((t) => {
            appearObserver.unobserve(t);
            toShow.push(t);
          });
          cardGroups.delete(target);
          group.forEach((t) => cardGroups.delete(t));
        } else {
          appearObserver.unobserve(target);
          toShow.push(target);
        }
      });
      if (!toShow.length) return;
      const wait = Math.max(0, HERO_DONE - (Date.now() - loadTime));
      setTimeout(
        () =>
          requestAnimationFrame(() => {
            toShow.forEach((t) => t.classList.add("visible"));
          }),
        wait,
      );
    },
    { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
  );

  function appear(el, delay = 0, y = 18) {
    if (!el) return;
    if (!el.classList.contains("appear")) {
      el.classList.add("appear");
      if (y !== 18) el.style.setProperty("--appear-y", y + "px");
    }
    if (delay) el.style.setProperty("--appear-delay", delay + "s");
    appearObserver.observe(el);
  }

  const orientationTargets = [];

  document.querySelectorAll(".project-card").forEach((card, index) => {
    // +90 converts JS atan2 (0=right) to CSS angle convention (0=top)
    function cornerAngle() {
      const r = card.getBoundingClientRect();
      return (
        ((Math.atan2(-r.height / 2, -r.width / 2) * 180) / Math.PI + 90 + 360) %
        360
      );
    }

    let home = cornerAngle();
    let current = home,
      target = home;
    let tiltX = 0,
      tiltY = 0,
      targetTiltX = 0,
      targetTiltY = 0;
    let hovered = false;
    let intro = false;
    let rafId = null;

    card.style.setProperty("--card-light-angle", current + "deg");

    setTimeout(
      () => {
        home = cornerAngle();
        current = home - 90;
        target = home;
        card.style.setProperty("--card-light-angle", current + "deg");
        card.style.setProperty("--card-glow", "1");
        intro = true;
        if (!rafId) rafId = requestAnimationFrame(tick);
      },
      400 + index * 250,
    );

    function applyTransform() {
      const lift = hovered ? "translateY(-6px) scale(1.02)" : "";
      card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) ${lift}`;
    }

    function tick() {
      const lerpFactor = intro ? 0.04 : 0.18;
      const angleDiff = target - current;
      if (Math.abs(angleDiff) > 0.2) current += angleDiff * lerpFactor;
      else {
        current = target;
        intro = false;
      }
      card.style.setProperty("--card-light-angle", current + "deg");

      tiltX += (targetTiltX - tiltX) * 0.7;
      tiltY += (targetTiltY - tiltY) * 0.7;
      applyTransform();

      const stillMoving =
        Math.abs(angleDiff) > 0.2 ||
        Math.abs(targetTiltX - tiltX) > 0.05 ||
        Math.abs(targetTiltY - tiltY) > 0.05;

      if (stillMoving) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (!hovered) card.style.removeProperty("transform");
        rafId = null;
      }
    }

    function setTargetNorm(relX, relY) {
      const r = card.getBoundingClientRect();
      // Sweep from top-left corner angle to top-right corner angle
      const rightAngle =
        ((Math.atan2(-r.height / 2, r.width / 2) * 180) / Math.PI + 90 + 360) %
        360;
      const span = ((rightAngle - home + 180 + 360) % 360) - 180;
      const raw = home + relX * span;
      const delta = ((((raw - target + 180) % 360) + 360) % 360) - 180;
      target += delta;
      const sizeScale = Math.min(1, 200 / r.width);
      targetTiltY = (relX - 0.5) * 12 * sizeScale;
      targetTiltX = -(relY - 0.5) * 6 * sizeScale;
      hovered = true;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function setTarget(x, y) {
      const r = card.getBoundingClientRect();
      setTargetNorm((x - r.left) / r.width, (y - r.top) / r.height);
    }

    function reset() {
      home = cornerAngle();
      const delta = ((((home - target + 180) % 360) + 360) % 360) - 180;
      target += delta;
      targetTiltX = 0;
      targetTiltY = 0;
      hovered = false;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    new ResizeObserver(() => {
      home = cornerAngle();
      current = home;
      target = home;
      card.style.setProperty("--card-light-angle", home + "deg");
    }).observe(card);

    const gridIndex = Array.from(card.parentNode.children).indexOf(card);
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    if (card.classList.contains("project-card--featured"))
      wrapper.classList.add("project-card--featured");
    card.parentNode.insertBefore(wrapper, card);
    wrapper.appendChild(card);
    card.style.flex = "1";
    appear(wrapper, 0.15 + gridIndex * 0.1, 22);

    if (!window.matchMedia("(hover: none)").matches) {
      wrapper.addEventListener("mousemove", (e) =>
        setTarget(e.clientX, e.clientY),
      );
      wrapper.addEventListener("mouseleave", reset);
    } else {
      orientationTargets.push(setTargetNorm);
    }
  });

  document.body.classList.remove("loading");

  // Device-orientation highlight for mobile
  if (
    window.matchMedia("(hover: none)").matches &&
    window.DeviceOrientationEvent
  ) {
    const TILT_RANGE = 25;
    let baseGamma = null,
      baseBeta = null;

    function handleOrientation(e) {
      if (e.gamma === null) return;
      if (baseGamma === null) {
        baseGamma = e.gamma;
        baseBeta = e.beta ?? 45;
      }
      const relX = Math.min(
        1,
        Math.max(0, 0.5 + (e.gamma - baseGamma) / (TILT_RANGE * 2)),
      );
      const relY = Math.min(
        1,
        Math.max(0, 0.5 + ((e.beta ?? 45) - baseBeta) / (TILT_RANGE * 2)),
      );
      orientationTargets.forEach((fn) => fn(relX, relY));
    }

    if (typeof DeviceOrientationEvent.requestPermission !== "function") {
      window.addEventListener("deviceorientation", handleOrientation);
    }
  }

  // Map each wrapper to its full grid group so the whole section fires at once
  document.querySelectorAll(".project-grid").forEach((grid) => {
    const wrappers = Array.from(grid.children);
    wrappers.forEach((w) => cardGroups.set(w, wrappers));
  });

  document.querySelectorAll(".hero-btn").forEach((btn, index) => {
    function cornerAngle() {
      const r = btn.getBoundingClientRect();
      return (
        ((Math.atan2(-r.height / 2, -r.width / 2) * 180) / Math.PI + 90 + 360) %
        360
      );
    }

    let home = cornerAngle();
    let current = home - 90,
      target = home;
    let intro = false;
    let rafId = null;

    btn.style.setProperty("--card-light-angle", current + "deg");
    setTimeout(
      () => {
        btn.style.setProperty("--card-glow", "1");
        intro = true;
        if (!rafId) rafId = requestAnimationFrame(tick);
      },
      100 + index * 250,
    );

    function tick() {
      const lerpFactor = intro ? 0.04 : 0.18;
      const diff = target - current;
      if (Math.abs(diff) > 0.2) current += diff * lerpFactor;
      else {
        current = target;
        intro = false;
      }
      btn.style.setProperty("--card-light-angle", current + "deg");
      if (Math.abs(diff) > 0.2) rafId = requestAnimationFrame(tick);
      else rafId = null;
    }

    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const relX = (e.clientX - r.left) / r.width;
      const rightAngle =
        ((Math.atan2(-r.height / 2, r.width / 2) * 180) / Math.PI + 90 + 360) %
        360;
      const span = ((rightAngle - home + 180 + 360) % 360) - 180;
      const raw = home + relX * span;
      const delta = ((((raw - target + 180) % 360) + 360) % 360) - 180;
      target += delta;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    btn.addEventListener("mouseleave", () => {
      home = cornerAngle();
      const delta = ((((home - target + 180) % 360) + 360) % 360) - 180;
      target += delta;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });
  });

  // Wait for first paint before triggering appear animations
  requestAnimationFrame(() =>
    setTimeout(() => {
      // Nav slides down, then hero content rises up
      setTimeout(
        () => document.querySelector("nav").classList.add("visible"),
        0,
      );
      setTimeout(
        () => document.querySelector("#hero h1").classList.add("visible"),
        60,
      );
      setTimeout(
        () => document.querySelector(".hero-alias").classList.add("visible"),
        120,
      );
      setTimeout(
        () => document.querySelector(".hero-sub").classList.add("visible"),
        200,
      );
      setTimeout(
        () => document.querySelector(".hero-links").classList.add("visible"),
        310,
      );
      setTimeout(async () => {
        if (!localeReady) return;
        const { default: apply } = await localeReady;
        apply();
      }, 310 + 950);

      // Section titles — already have appear in HTML, just observe
      document.querySelectorAll(".section-title").forEach((el) => appear(el));

      // Research pub — appears after its section title
      document.querySelectorAll(".pub").forEach((el) => appear(el, 0.15));

      // Footer — already has appear in HTML, just observe
      appear(document.querySelector("footer"));

      // Navbar scroll class + back-to-top visibility
      const nav = document.querySelector("nav");
      const backToTop = document.getElementById("back-to-top");
      const onScroll = () => {
        nav.classList.toggle("scrolled", window.scrollY > 60);
        backToTop.classList.toggle("visible", window.scrollY > 300);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }, 100),
  );
});
