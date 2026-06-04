/* matsuokengo.com UI kit — components */
const { useRef: useRefC, useEffect: useEffectC, useState: useStateC } = React;

/* ── Nav with EN/JA language toggle ── */
function Nav({ t, lang, setLang }) {
  const [scrolled, setScrolled] = useStateC(false);
  useEffectC(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={"mk-nav" + (scrolled ? " scrolled" : "")}>
      <a href="#" className="nav-logo">MK</a>
      <div className="nav-right">
        <ul className="nav-links">
          <li><a href="#personal">{t.nav.personal}</a></li>
          <li><a href="#client-work">{t.nav.work}</a></li>
          <li><a href="#school">{t.nav.school}</a></li>
          <li><a href="#research">{t.nav.research}</a></li>
          <li><a href="#contact">{t.nav.contact}</a></li>
        </ul>
        <div className="lang-toggle" role="group" aria-label="Language">
          <button className={lang==="en"?"active":""} onClick={() => setLang("en")}>EN</button>
          <button className={lang==="ja"?"active":""} onClick={() => setLang("ja")}>日本</button>
        </div>
      </div>
    </nav>
  );
}

/* ── Glow button (hero) ── */
function GlowButton({ children, href, accent }) {
  const ref = useGlowTilt({ tilt: false });
  return (
    <a ref={ref} href={href} className="hero-btn glow-border" target="_blank" rel="noopener"
       style={accent ? { color: "var(--accent)" } : null}>
      {children}
    </a>
  );
}

/* ── Hero ── retypes name-alias + sub on locale change ── */
function Hero({ t, lang }) {
  const aliasRef = useRefC(null);
  const subRef = useRefC(null);
  const first = useRefC(true);
  useEffectC(() => {
    const alias = aliasRef.current, sub = subRef.current;
    if (first.current) { first.current = false; if(alias) alias.textContent = t.hero.alias; if(sub) sub.textContent = t.hero.sub; return; }
    if (lang === "ja") {
      imeRetype(alias, MK_DATA.ime.alias, t.hero.alias);
      typeOut(sub, t.hero.sub);
    } else {
      typeOut(alias, t.hero.alias);
      typeOut(sub, t.hero.sub);
    }
  }, [lang]);
  return (
    <section id="hero">
      <div className="hero-inner">
        <h1 className="appear visible">{t.hero.name}</h1>
        <p className="hero-alias appear visible" ref={aliasRef}></p>
        <p className="hero-sub appear visible" ref={subRef}></p>
        <div className="hero-links appear visible">
          <GlowButton href="https://github.com/kengomatsuo"><GitHubIcon/> {t.hero.github}</GlowButton>
          <GlowButton href="mailto:kenneth@matsuokengo.com"><MailIcon/> {t.hero.email}</GlowButton>
        </div>
      </div>
    </section>
  );
}

/* ── Card image (icon tile, text fallback, or placeholder) ── */
function CardImage({ p, featured }) {
  const [failed, setFailed] = useStateC(false);
  if (p.placeholder) {
    return <div className="card-image text placeholder">{p._placeholderLabel}</div>;
  }
  if (failed || !p.icon) {
    const [bg, fg] = (MK_DATA.fallback[p.title] || ["#f0f0f0", "#111"]);
    return <div className="card-image text" style={{ background: bg, color: fg }}>{p.title}</div>;
  }
  return (
    <div className="card-image icon">
      <img src={"../../assets/" + p.icon} alt={p.title} onError={() => setFailed(true)} />
    </div>
  );
}

/* ── Project card ── */
function ProjectCard({ p, t, lang, featured }) {
  const ref = useGlowTilt({ tilt: true });
  const desc = lang === "ja" && p.descJa ? p.descJa : p.desc;
  const placeholderLabel = p.placeholder ? t.badge[p.placeholder] : null;
  return (
    <div className={"card-wrap" + (featured ? " featured" : "")}>
      <article ref={ref} className="project-card glow-border">
        <CardImage p={{ ...p, _placeholderLabel: placeholderLabel }} featured={featured} />
        <div className="card-body">
          <div className="card-meta">
            {p.tag && <span className="card-tag">{p.tag}</span>}
            {p.badge && <span className="card-badge">{t.badge[p.badge]}</span>}
          </div>
          <h3 className="card-title">{p.title}</h3>
          <p className="card-desc">{desc}</p>
          <div className="card-actions">
            {p.actions.map((a, i) => a.static
              ? <span key={i} className="card-link muted">{t.links[a.label]}</span>
              : <a key={i} href="#" className={"card-link" + (a.muted ? " muted" : "")}>{t.links[a.label]}</a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

/* ── Section band + grid ── */
function Section({ id, title, alt, slim, items, t, lang, imeKey }) {
  const ref = useAppear();
  const titleRef = useRefC(null);
  const firstT = useRefC(true);
  useEffectC(() => {
    if (firstT.current) { firstT.current = false; return; }
    const el = titleRef.current; if (!el) return;
    if (lang === "ja" && imeKey && MK_DATA.ime[imeKey]) imeRetype(el, MK_DATA.ime[imeKey], title);
    else typeOut(el, title);
  }, [lang]);
  return (
    <section id={id} className={"band" + (alt ? " alt" : "")}>
      <div className="section-inner">
        <h2 className="section-title appear" ref={(n)=>{ref.current=n; titleRef.current=n;}}>{title}</h2>
        <div className={"project-grid" + (slim ? " slim" : "")}>
          {items.map((p, i) => <ProjectCard key={p.title + lang} p={p} t={t} lang={lang} featured={p.featured} />)}
        </div>
      </div>
    </section>
  );
}

/* ── Research ── */
function Research({ t }) {
  const ref = useAppear();
  return (
    <section id="research" className="band alt">
      <div className="section-inner">
        <h2 className="section-title">{t.sections.research}</h2>
        <div className="pub appear" ref={ref}>
          <h3 className="pub-title">{t.research.title}</h3>
          <p className="pub-authors">{t.research.authors}</p>
          <p className="pub-venue">{t.research.venue}</p>
          <a className="card-link" href="https://ieeexplore.ieee.org/document/11291883" target="_blank" rel="noopener">{t.research.link}</a>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  const ref = useAppear();
  return (
    <footer id="contact" className="mk-footer appear" ref={ref}>
      <div className="footer-inner">
        <span>Kenneth Fang</span>
        <div className="footer-links">
          <a href="https://github.com/kengomatsuo" target="_blank" rel="noopener">GitHub</a>
          <a href="mailto:kenneth@matsuokengo.com">Email</a>
        </div>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

/* ── Back to top ── */
function BackToTop() {
  const [vis, setVis] = useStateC(false);
  useEffectC(() => {
    const onScroll = () => setVis(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button id="back-to-top" className={vis ? "visible" : ""} aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <ChevronUp/>
    </button>
  );
}

Object.assign(window, { Nav, Hero, GlowButton, ProjectCard, Section, Research, Footer, BackToTop });
