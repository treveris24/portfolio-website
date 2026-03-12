"use client";

import { useState, useEffect, useRef } from "react";

const UA_PIC = "/images/UA_pic.png";
const DELL_LOGO = "/images/dell-gray.png";
const PUIG_LOGO = "/images/puig-gray.png";
const DRESDNER_LOGO = "/images/dresdner-gray.png";
const PMP_BADGE = "/images/pmp-badge.png";

type Lang = "en" | "es";

const t = {
  nav: {
    solutions: { en: "Solutions", es: "Soluciones" },
    evidence: { en: "See It In Action", es: "Véalo en Acción" },
    about: { en: "About", es: "Sobre Mí" },
    contact: { en: "Contact", es: "Contacto" },
  },
  hero: {
    tag: { en: "Uwe Anell | Panama City", es: "Uwe Anell | Ciudad de Panamá" },
    tag2: { en: "Supporting Multinational Operations Through:", es: "Apoyando Operaciones Multinacionales Mediante:" },
    h1a: { en: "Operational Stability | Finance BI", es: "Estabilidad Operativa | Finance BI" },
    h1b: { en: "PMP® Project Delivery", es: "Entrega de Proyectos PMP®" },
    sub: { en: "Transforming complex financial data into stable, automated, and audit-ready operations.", es: "Transformando datos financieros complejos en operaciones estables, automatizadas y listas para auditoría." },
    cta1: { en: "See Real Outcomes", es: "Ver Resultados Reales" },
    cta2: { en: "Contact Me", es: "Contáctame" },
    years: { en: "20+ years", es: "20+ años" },
    tri: { en: "Trilingual", es: "Trilingüe" },
    pmp: { en: "Certified 2026", es: "Certificado 2026" },
  },
  trust: {
    label: { en: "Worked at", es: "Trabajé en" },
    disclaimer: { en: "Company logos shown to indicate prior employment experience. No endorsement implied.", es: "Logos de empresas mostrados para indicar experiencia laboral previa. No implica patrocinio." },
    pmpText: { en: "PMP certified by PMI in Feb 2026", es: "PMP certificado por PMI en Feb 2026" },
  },
  tiles: {
    heading: { en: "What I Bring", es: "Lo Que Aporto" },
    title: { en: "Skills in Action", es: "Habilidades en Acción" },
    sub: { en: "Each tile is a working example — not a description, but a practical demonstration of how I can contribute to a finance team.", es: "Cada módulo es un ejemplo funcional — no una descripción, sino una demostración práctica de cómo puedo contribuir a un equipo financiero." },
    more: { en: "Learn more", es: "Ver más" },
  },
  evidence: {
    heading: { en: "See It In Action", es: "Véalo en Acción" },
    title: { en: "See It In Action", es: "Véalo en Acción" },
  },
  about: {
    heading: { en: "About", es: "Sobre Mí" },
    title: { en: "German Precision. Panamanian Roots.", es: "Precisión Alemana. Raíces Panameñas." },
    p1: { en: "German-born finance professional with deep experience inside multinational organizations across Latin America — working with P&Ls, helping build reporting systems, and supporting credit risk portfolios from the inside.", es: "Profesional financiero nacido en Alemania con amplia experiencia dentro de organizaciones multinacionales en América Latina — trabajando con P&Ls, ayudando a construir sistemas de reportes y apoyando portafolios de riesgo crediticio desde adentro." },
    p2: { en: "Married to a Panamanian, permanent resident, and member of the Cámara de Comercio e Industria Panameña Alemana and PMI Panama.", es: "Casado con panameña, residente permanente, y miembro de la Cámara de Comercio e Industria Panameña Alemana y PMI Panamá." },
    p3: { en: "Today I combine that operational experience with Power BI, AI-assisted workflows, and PMP-based project practices to help teams improve reporting and processes in a pragmatic way.", es: "Hoy combino esa experiencia operativa con Power BI, flujos de trabajo asistidos por IA y prácticas de gestión de proyectos PMP para ayudar a los equipos a mejorar sus reportes y procesos de manera pragmática." },
    p4: { en: "I like to work alongside existing teams, understand where they need support, and then quietly help close gaps in reporting, controls, or processes.", es: "Me gusta trabajar junto a los equipos existentes, entender dónde necesitan apoyo, y luego ayudar discretamente a cerrar brechas en reportes, controles o procesos." },
  },
  contact: {
    heading: { en: "Get in Touch", es: "Contáctame" },
    title: { en: "Let's connect.", es: "Conectemos." },
    sub: { en: "I'm always happy to connect — whether it's about a specific role, a project, or just exchanging ideas on finance operations in LatAm.", es: "Siempre estoy abierto a conectar — ya sea sobre un rol específico, un proyecto, o simplemente intercambiar ideas sobre operaciones financieras en Latinoamérica." },
  },
  footer: {
    rights: { en: "All rights reserved.", es: "Todos los derechos reservados." },
  },
};

interface TileData { id: string; icon: string; tag: string; title: string; hook: string; evidence: string; cta: string; href: string; }

function getTiles(lang: Lang): TileData[] {
  if (lang === "es") {
    return [
      { id: "health-check", icon: "🏥", tag: "Autoevaluación", title: "Chequeo de Salud Financiera", hook: "Autoevaluación de 10 preguntas. Descubra dónde sus operaciones financieras podrían mejorar.", evidence: "Una evaluación rápida de las áreas comunes donde los equipos financieros pueden fortalecer sus operaciones.", cta: "Tomar la Evaluación", href: "/health-check" },
      { id: "dashboard", icon: "📊", tag: "Dashboard en Vivo", title: "Demo Manual-a-Automatizado", hook: "Dashboard interactivo de Power BI que muestra cómo una consolidación Excel de 3 días podría simplificarse.", evidence: "Un dashboard regional de P&L funcional: 5 países, 12 meses, con varianza de ingresos/margen/OPEX y descomposición Precio/Volumen/Mix. Un ejemplo práctico de cómo se ven los datos regionales consolidados cuando se automatizan.", cta: "Explorar el Dashboard", href: "/dashboard" },
      { id: "ai-cases", icon: "🤖", tag: "IA en Acción", title: "Casos de Estudio: IA para Finanzas", hook: "3 escenarios reales donde la IA eliminó horas de trabajo en finanzas.", evidence: "Cada caso refleja un desafío común en operaciones financieras de LatAm — y muestra cómo las herramientas de IA pueden hacer una diferencia real.", cta: "Ver Casos de Estudio", href: "/ai-cases" },
      { id: "blueprint", icon: "📋", tag: "Mi Enfoque de Incorporación", title: "Plan 30-60-90 Días", hook: "Un enfoque estructurado para integrarse rápidamente y entregar resultados en 90 días.", evidence: "Tres fases: Escuchar y Aprender → Fortalecer y Documentar → Construir y Compartir.", cta: "Ver el Plan Completo", href: "/blueprint" },
      { id: "risk-map", icon: "🔥", tag: "Herramienta de Ejemplo de Riesgo", title: "Mapa de Calor de Riesgo Panamá", hook: "Una vista práctica de áreas comunes de riesgo para subsidiarias multinacionales en Panamá.", evidence: "Una plantilla lista para usar que cubre los principales riesgos en Panamá, para uso en discusiones internas y reportes del equipo financiero.", cta: "Ver la Plantilla", href: "/risk-map" },
      { id: "knowledge-base", icon: "🧠", tag: "Agente de Conocimiento", title: "Base de Conocimiento Corporativa", hook: "Las políticas internas y SOPs se hacen consultables, para que las respuestas sean más fáciles de encontrar.", evidence: "Un proof of concept funcional: una base de conocimiento asistida por IA entrenada con documentación corporativa realista. Puede escribir una pregunta y ver el tipo de respuestas que esta herramienta podría ofrecer.", cta: "Probar el Agente", href: "/knowledge-base" },
    ];
  }
  return [
    { id: "health-check", icon: "🏥", tag: "Self-Assessment", title: "Finance Health Check", hook: "10-question self-assessment. Find out where your finance operations might have room to improve.", evidence: "A quick snapshot of common areas where finance teams can strengthen their operations.", cta: "Take the Assessment", href: "/health-check" },
    { id: "dashboard", icon: "📊", tag: "Live Dashboard", title: "Manual-to-Automated Demo", hook: "Interactive Power BI dashboard that shows how a 3-day Excel consolidation could be simplified.", evidence: "A working regional P&L dashboard: 5 countries, 12 months, with revenue/margin/OPEX variance and Price/Volume/Mix decomposition. A practical example of how consolidated regional data can look when automated.", cta: "Explore the Dashboard", href: "/dashboard" },
    { id: "ai-cases", icon: "🤖", tag: "AI in Action", title: "AI for Finance Case Studies", hook: "3 real scenarios where AI cut hours from finance workflows.", evidence: "Each case study reflects a common challenge in LatAm finance operations — and shows how AI tools can make a real difference.", cta: "View Case Studies", href: "/ai-cases" },
    { id: "blueprint", icon: "📋", tag: "My Onboarding Approach", title: "How I Get Up to Speed", hook: "Three phases: Listen → Strengthen → Build. Each with clear outcomes.", evidence: "Three phases: Listen & Learn → Strengthen & Document → Build & Share.", cta: "See the Full Plan", href: "/blueprint" },
    { id: "risk-map", icon: "🔥", tag: "Risk Example Tool", title: "Panama Risk Heat Map", hook: "A practical overview of common risk areas for multinational subsidiaries in Panama.", evidence: "A ready-to-use heat map template covering key Panama risks that finance teams can use in their own internal discussions and reports.", cta: "View the Template", href: "/risk-map" },
    { id: "knowledge-base", icon: "🧠", tag: "Knowledge Agent", title: "Corporate Knowledge Base", hook: "Internal policies and SOPs are made searchable, so answers are easier to find.", evidence: "A working proof of concept: an AI-assisted knowledge base trained on realistic corporate documentation. You can type a question and see the kind of answers such a tool could provide.", cta: "Try the Agent", href: "/knowledge-base" },
  ];
}

function useFade(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, style: { opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` } as React.CSSProperties };
}

function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const links = [{ label: t.nav.solutions[lang], target: "tiles" }, { label: t.nav.evidence[lang], target: "evidence" }, { label: t.nav.about[lang], target: "about" }, { label: t.nav.contact[lang], target: "contact" }];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0F1923]/95 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent border-b border-transparent"}`}>
      <div className="max-w-[1100px] mx-auto flex items-center justify-between px-6 py-3.5">
        <div className="text-[#2EC4B6] text-xl font-bold tracking-tight cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Uwe Anell</div>
        <div className="flex items-center gap-7">
          {links.map((l) => (<button key={l.target} onClick={() => scrollTo(l.target)} className="hidden md:block bg-transparent border-none cursor-pointer text-[13px] font-semibold text-white/60 uppercase tracking-wider hover:text-[#2EC4B6] transition-colors">{l.label}</button>))}
          <div className="flex items-center gap-1 ml-2 bg-white/[0.05] rounded-lg p-1">
            <button onClick={() => setLang("en")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer border-none transition-all ${lang === "en" ? "bg-[#2EC4B6]/15 text-[#2EC4B6]" : "bg-transparent text-white/40 hover:text-white/70"}`}>🇺🇸 EN</button>
            <button onClick={() => setLang("es")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer border-none transition-all ${lang === "es" ? "bg-[#2EC4B6]/15 text-[#2EC4B6]" : "bg-transparent text-white/40 hover:text-white/70"}`}>🇵🇦 ES</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const f = useFade();
  return (
    <section className="relative min-h-[76vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0F1923] via-[#0D2137] to-[#1A2A3A]">
      <div ref={f.ref} style={f.style} className="max-w-[1100px] mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_300px] gap-14 items-center px-6 pt-28 pb-10">
        <div>
          <div className="text-base font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-1">{t.hero.tag[lang]}</div>
          <div className="text-base font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-5">{t.hero.tag2[lang]}</div>
          <h1 className="text-3xl md:text-[42px] font-bold text-[#F0F4F8] leading-[1.18] tracking-tight mb-6">{t.hero.h1a[lang]}<br /><span className="text-[#2EC4B6]">{t.hero.h1b[lang]}</span></h1>
          <p className="text-xl text-white/70 leading-relaxed max-w-[520px] mb-9">{t.hero.sub[lang]}</p>
          <div className="flex gap-3.5">
            <button onClick={() => scrollTo("tiles")} className="px-7 py-3.5 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg border-none cursor-pointer transition-all hover:-translate-y-px">{t.hero.cta1[lang]}</button>
            <button onClick={() => scrollTo("contact")} className="px-7 py-3.5 bg-transparent text-white font-semibold text-[15px] rounded-lg border border-white/10 hover:border-[#2EC4B6] cursor-pointer transition-colors">{t.hero.cta2[lang]}</button>
          </div>
        </div>
        <div className="text-center">
          <div className="w-[200px] h-[200px] rounded-full mx-auto mb-5 border-[3px] border-[#2EC4B6] shadow-[0_0_0_8px_rgba(46,196,182,0.12)]" style={{ background: `url(${UA_PIC}) center/cover` }} />
          <div className="text-[15px] text-white/40 leading-[1.9]">
            <span className="text-white/65 font-semibold">{t.hero.years[lang]}</span> · Dell, Puig, Dresdner Bank<br />
            <span className="text-white/65 font-semibold">{t.hero.tri[lang]}</span> · EN · ES · DE<br />
            <span className="text-white/65 font-semibold">PMP®</span> {t.hero.pmp[lang]}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar({ lang }: { lang: Lang }) {
  const f = useFade();
  return (
    <section ref={f.ref} style={f.style} className="bg-[#162230] border-y border-white/[0.06] py-6 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <span className="text-[11px] text-white/40 font-semibold tracking-[0.1em] uppercase">{t.trust.label[lang]}</span>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-10">
              <div className="flex flex-col items-start gap-2">
                <img src={DELL_LOGO} alt="Dell Technologies" className="h-auto opacity-50 grayscale brightness-[1.8] hover:opacity-90 hover:grayscale-0 hover:brightness-100 transition-all duration-300" style={{ width: 190 }} />
                <img src={DRESDNER_LOGO} alt="Dresdner Bank" className="h-auto opacity-50 grayscale brightness-[1.8] hover:opacity-90 hover:grayscale-0 hover:brightness-100 transition-all duration-300" style={{ width: 200 }} />
              </div>
              <img src={PUIG_LOGO} alt="Puig" className="h-auto opacity-50 grayscale brightness-[1.8] hover:opacity-90 hover:grayscale-0 hover:brightness-100 transition-all duration-300" style={{ width: 55 }} />
            </div>
            <span className="text-[11px] text-white/25 italic mt-3">{t.trust.disclaimer[lang]}</span>
          </div>
          <div className="w-px h-16 bg-white/[0.1] mx-2" />
          <div className="flex flex-col items-center gap-2">
            <img src={PMP_BADGE} alt="PMP Certified" className="h-auto hover:scale-105 transition-transform duration-300" style={{ width: 85 }} />
            <span className="text-[11px] text-[#2EC4B6] font-semibold tracking-wide text-center leading-tight">{t.trust.pmpText[lang]}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TileCard({ tile, index, lang }: { tile: TileData; index: number; lang: Lang }) {
  const f = useFade(index * 80);
  return (
    <div ref={f.ref} style={f.style}>
      <div onClick={() => scrollTo(`ev-${tile.id}`)} className="bg-[#162230] border border-white/[0.06] rounded-xl p-7 cursor-pointer min-h-[220px] flex flex-col transition-all duration-250 hover:bg-[#1E3244] hover:border-[#2EC4B6]/[0.18] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] group">
        <div className="text-[28px] mb-3.5">{tile.icon}</div>
        <div className="text-sm font-bold text-[#2EC4B6] tracking-[0.1em] uppercase mb-2">{tile.tag}</div>
        <h3 className="text-[19px] font-bold text-[#F0F4F8] mb-2.5 leading-tight">{tile.title}</h3>
        <p className="text-[15px] text-white/40 leading-relaxed flex-1">{tile.hook}</p>
        <div className="text-[15px] font-semibold text-[#2EC4B6] mt-4 flex items-center gap-1.5">{t.tiles.more[lang]} <span className="inline-block transition-transform group-hover:translate-x-1">↓</span></div>
      </div>
    </div>
  );
}

function TileGrid({ lang }: { lang: Lang }) {
  const f = useFade();
  const tiles = getTiles(lang);
  return (
    <section id="tiles" className="py-24 px-6 bg-[#0F1923]">
      <div ref={f.ref} style={f.style} className="max-w-[1100px] mx-auto">
        <div className="text-center mb-14">
          <div className="text-base font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-2.5">{t.tiles.heading[lang]}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-3.5 tracking-tight">{t.tiles.title[lang]}</h2>
          <p className="text-base text-white/40 max-w-[560px] mx-auto leading-relaxed">{t.tiles.sub[lang]}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">{tiles.map((tile, i) => <TileCard key={tile.id} tile={tile} index={i} lang={lang} />)}</div>
      </div>
    </section>
  );
}

function EvidenceBlock({ tile, index }: { tile: TileData; index: number }) {
  const f = useFade();
  return (
    <div id={`ev-${tile.id}`} ref={f.ref} style={f.style} className={`rounded-2xl border border-white/[0.06] p-8 md:p-11 ${index % 2 === 0 ? "bg-[#162230]" : "bg-[#0F1923]"}`}>
      <div className="text-base font-bold text-[#2EC4B6] tracking-[0.1em] uppercase mb-3">{tile.tag}</div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#F0F4F8] mb-4 leading-tight">{tile.title}</h3>
          <p className="text-[15px] text-white/65 leading-relaxed max-w-2xl">{tile.evidence}</p>
        </div>
        <a href={tile.href} className="inline-flex items-center gap-2 px-7 py-3 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg no-underline transition-colors whitespace-nowrap flex-shrink-0">{tile.cta} →</a>
      </div>
    </div>
  );
}

function EvidenceSection({ lang }: { lang: Lang }) {
  const f = useFade();
  const tiles = getTiles(lang);
  return (
    <section id="evidence" className="py-24 px-6 bg-[#1A2A3A]">
      <div ref={f.ref} style={f.style} className="max-w-[1100px] mx-auto">
        <div className="text-center mb-14">
          <div className="text-base font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-2.5">{t.evidence.heading[lang]}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] tracking-tight">{t.evidence.title[lang]}</h2>
        </div>
        <div className="flex flex-col gap-7">{tiles.map((tile, i) => <EvidenceBlock key={tile.id} tile={tile} index={i} />)}</div>
      </div>
    </section>
  );
}

function About({ lang }: { lang: Lang }) {
  const f = useFade();
  return (
    <section id="about" className="py-24 px-6 bg-[#0F1923]">
      <div ref={f.ref} style={f.style} className="max-w-[780px] mx-auto text-center">
        <div className="text-base font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-2.5">{t.about.heading[lang]}</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-7">{t.about.title[lang]}</h2>
        <div className="w-[140px] h-[140px] rounded-full mx-auto mb-7 border-2 border-[#2EC4B6] shadow-[0_0_0_6px_rgba(46,196,182,0.12)]" style={{ background: `url(${UA_PIC}) center/cover` }} />
        <p className="text-[17px] text-white/65 leading-[1.75] mb-3">{t.about.p1[lang]}</p>
        <p className="text-[17px] text-white/65 leading-[1.75] mb-3">{t.about.p2[lang]}</p>
        <p className="text-[17px] text-white/65 leading-[1.75] mb-3">{t.about.p3[lang]}</p>
        <p className="text-[17px] text-white/65 leading-[1.75]">{t.about.p4[lang]}</p>
      </div>
    </section>
  );
}

function Contact({ lang }: { lang: Lang }) {
  const f = useFade();
  const channels = [
    { icon: "✉️", label: "Email", value: "uweanell@gmail.com", href: "mailto:uweanell@gmail.com" },
    { icon: "🔗", label: "LinkedIn", value: "linkedin.com/in/uwe-anell", href: "https://linkedin.com/in/uwe-anell" },
  ];
  return (
    <section id="contact" className="py-24 px-6 bg-[#162230] border-t border-white/[0.06]">
      <div ref={f.ref} style={f.style} className="max-w-[1100px] mx-auto text-center">
        <div className="text-base font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-2.5">{t.contact.heading[lang]}</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-3.5">{t.contact.title[lang]}</h2>
        <p className="text-[17px] text-white/65 max-w-[520px] mx-auto mb-10 leading-relaxed">{t.contact.sub[lang]}</p>
        <div className="flex justify-center gap-5 flex-wrap">
          {channels.map((c, i) => (
            <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="bg-[#1A2A3A] border border-white/[0.06] rounded-xl px-8 py-5 no-underline flex items-center gap-3.5 transition-all hover:border-[#2EC4B6]/[0.18] hover:bg-[#1E3244]">
              <span className="text-[22px]">{c.icon}</span>
              <div className="text-left">
                <div className="text-sm text-white/40 font-semibold tracking-wider uppercase mb-0.5">{c.label}</div>
                <div className="text-[15px] font-semibold text-[#F0F4F8]">{c.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="bg-[#0F1923] border-t border-white/[0.06] py-7 px-6">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center">
        <div className="text-xs text-white/40">© 2026 Uwe Anell. {t.footer.rights[lang]}</div>
        <div className="text-xs text-white/40">Panama City, Panama</div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <main className="min-h-screen bg-[#0F1923] text-[#F0F4F8]">
      <Navbar lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <TrustBar lang={lang} />
      <TileGrid lang={lang} />
      <EvidenceSection lang={lang} />
      <About lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
