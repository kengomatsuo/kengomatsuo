/* matsuokengo.com UI kit — app root */
const { useState: useStateA } = React;

function App() {
  const [lang, setLang] = useStateA("en");
  const t = MK_DATA[lang];
  const P = MK_DATA.projects;
  return (
    <React.Fragment>
      <Nav t={t} lang={lang} setLang={setLang} />
      <main>
        <Hero t={t} lang={lang} />
        <Section id="personal" title={t.sections.personal} items={P.personal} t={t} lang={lang} />
        <Section id="client-work" title={t.sections.work} alt items={P.work} t={t} lang={lang} imeKey="sections.work" />
        <Section id="school" title={t.sections.school} slim items={P.school} t={t} lang={lang} />
        <Research t={t} />
      </main>
      <BackToTop />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
