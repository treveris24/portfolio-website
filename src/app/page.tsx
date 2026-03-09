"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

// ─── Image paths ────────────────────────────────────────────
const UA_PIC = "/images/UA_pic.png";
const DELL_LOGO = "/images/dell-gray.png";
const PUIG_LOGO = "/images/puig-gray.png";
const DRESDNER_LOGO = "/images/dresdner-gray.png";
const PMP_BADGE = "/images/pmp-badge.png";

// ─── Translations ───────────────────────────────────────────
type Lang = "en" | "es";

const t = {
  nav: {
    solutions: { en: "Solutions", es: "Soluciones" },
    evidence: { en: "Evidence", es: "Evidencia" },
    about: { en: "About", es: "Sobre Mí" },
    contact: { en: "Contact", es: "Contacto" },
  },
  hero: {
    tag: {
      en: "Finance Business Partner · PMP® · Panama City",
      es: "Socio de Negocios Financiero · PMP® · Ciudad de Panamá",
    },
    h1a: {
      en: "Your finance operations",
      es: "Sus operaciones financieras",
    },
    h1b: {
      en: "should run better.",
      es: "deberían funcionar mejor.",
    },
    sub: {
      en: "I partner with CFOs and commercial leaders across Latin America to close the gap between messy data and clear decisions — through sharper reporting, tighter controls, and modern tools.",
      es: "Me asocio con CFOs y líderes comerciales en América Latina para cerrar la brecha entre datos desordenados y decisiones claras — con reportes más precisos, controles más sólidos y herramientas modernas.",
    },
    cta1: { en: "See Real Outcomes", es: "Ver Resultados Reales" },
    cta2: { en: "Contact Me", es: "Contáctame" },
    years: { en: "20+ years", es: "20+ años" },
    tri: { en: "Trilingual", es: "Trilingüe" },
    pmp: { en: "Certified 2026", es: "Certificado 2026" },
  },
  trust: {
    label: { en: "Worked at", es: "Trabajé en" },
    disclaimer: {
      en: "Company logos shown to indicate prior employment experience. No endorsement implied.",
      es: "Logos de empresas mostrados para indicar experiencia laboral previa. No implica patrocinio.",
    },
    pmpText: {
      en: "PMP certified by PMI in Feb 2026",
      es: "PMP certificado por PMI en Feb 2026",
    },
  },
  tiles: {
    heading: { en: "What I Deliver", es: "Lo Que Entrego" },
    title: { en: "Solutions, Not Just Skills", es: "Soluciones, No Solo Habilidades" },
    sub: {
      en: "Each tile is a working deliverable — not a description of what I could do, but proof of what I will do in your organization.",
      es: "Cada módulo es un entregable funcional — no una descripción de lo que podría hacer, sino prueba de lo que haré en su organización.",
    },
    more: { en: "Learn more", es: "Ver más" },
  },
  evidence: {
    heading: { en: "The Proof Layer", es: "La Capa de Evidencia" },
    title: {
      en: "Don't Take My Word For It — Try It",
      es: "No Me Crea — Compruébelo Usted Mismo",
    },
    preview: { en: "Preview coming soon", es: "Vista previa próximamente" },
  },
  about: {
    heading: { en: "About", es: "Sobre Mí" },
    title: {
      en: "German Precision. Panamanian Roots.",
      es: "Precisión Alemana. Raíces Panameñas.",
    },
    p1: {
      en: "German-born finance professional with 20+ years inside multinational organizations across Latin America — managing P&Ls, building reporting systems, and running credit risk portfolios from the inside.",
      es: "Profesional financiero nacido en Alemania con más de 20 años dentro de organizaciones multinacionales en América Latina — gestionando P&Ls, construyendo sistemas de reportes y administrando portafolios de riesgo crediticio desde adentro.",
    },
    p2: {
      en: "Married to a Panamanian, permanent resident, and member of the German-Panamanian Chamber of Commerce (AHK) and PMI Panama.",
      es: "Casado con panameña, residente permanente, y miembro de la Cámara de Comercio Alemana-Panameña (AHK) y PMI Panamá.",
    },
    p3: {
      en: "Today I combine that operational depth with Power BI, AI workflow automation, and PMP-certified project methodology to deliver results faster than traditional approaches allow.",
      es: "Hoy combino esa profundidad operativa con Power BI, automatización de flujos con IA y metodología de proyectos PMP para entregar resultados más rápido que los enfoques tradicionales.",
    },
    p4: {
      en: "I don't advise from the outside. I go in, find the gaps, and fix them.",
      es: "No asesoro desde afuera. Entro, encuentro las brechas y las corrijo.",
    },
  },
  contact: {
    heading: { en: "Get in Touch", es: "Contáctame" },
    title: {
      en: "Let's discuss how I can help.",
      es: "Hablemos de cómo puedo ayudar.",
    },
    sub: {
      en: "Finance business partner, project manager, or consultant — I'm ready to hit the ground running.",
      es: "Socio financiero, gerente de proyectos o consultor — estoy listo para empezar de inmediato.",
    },
  },
  footer: {
    rights: { en: "All rights reserved.", es: "Todos los derechos reservados." },
  },
};

// Tile content per language
function getTiles(lang: Lang) {
  if (lang === "es") {
    return [
      {
        id: "health-check", icon: "🏥", tag: "Herramienta de Diagnóstico",
        title: "Chequeo de Salud Financiera",
        hook: "Autoevaluación de 10 preguntas. Descubra dónde están expuestas sus operaciones financieras.",
        evidence: "Tome una evaluación de 2 minutos y obtenga un puntaje instantáneo de madurez en Reportería, Riesgo y Automatización de Procesos. El mismo marco de diagnóstico que aplico en la primera semana de cualquier compromiso.",
        cta: "Tomar la Evaluación", href: "/health-check",
      },
      {
        id: "dashboard", icon: "📊", tag: "Dashboard en Vivo",
        title: "Demo Manual-a-Automatizado",
        hook: "Dashboard interactivo de Power BI reemplazando una consolidación Excel de 3 días.",
        evidence: "Un dashboard regional de P&L funcional: 5 países, 12 meses, con varianza de ingresos/margen/OPEX y descomposición Precio/Volumen/Mix. Filtre, profundice, explore — exactamente lo que entregaría en el Día 1.",
        cta: "Explorar el Dashboard", href: "/dashboard",
      },
      {
        id: "ai-cases", icon: "🤖", tag: "IA en Acción",
        title: "Casos de Estudio: IA para Finanzas",
        hook: "3 escenarios reales donde la IA eliminó horas de trabajo en finanzas.",
        evidence: "Análisis de contratos automatizado de 2 días a 15 minutos. Comentarios de varianza de 4 horas a solo revisión. QA de documentos de cumplimiento vía RAG. Cada uno con pruebas antes/después.",
        cta: "Ver Casos de Estudio", href: "/ai-cases",
      },
      {
        id: "blueprint", icon: "📋", tag: "Plan de Incorporación",
        title: "Plan 30-60-90 Días",
        hook: "Mi sistema para entrar al caos y producir orden — en 90 días.",
        evidence: "Tres fases: Diagnóstico → Estabilización → Optimización. Cada una con entregables concretos — no alineamiento estratégico vago, sino productos como 'mapa de procesos documentado para cierre mensual' y 'dashboard de Power BI reemplazando consolidación manual.'",
        cta: "Ver el Plan Completo", href: "/blueprint",
      },
      {
        id: "risk-map", icon: "🔥", tag: "Marco de Riesgo",
        title: "Mapa de Calor de Riesgo Panamá",
        hook: "Una página que muestra a su CFO dónde está expuesto — y dónde no.",
        evidence: "Una plantilla lista para usar cubriendo riesgo tributario/reportería, riesgo operacional y riesgo regulatorio para SEMs en Panamá. Puntaje de Impacto × Probabilidad, listo para briefings de gerencia regional.",
        cta: "Ver la Plantilla", href: "/risk-map",
      },
      {
        id: "knowledge-base", icon: "🧠", tag: "Agente de Conocimiento",
        title: "Base de Conocimiento Corporativa",
        hook: "Las políticas y SOPs de su equipo — consultables en segundos en vez de días.",
        evidence: "Un proof of concept funcional: un agente IA entrenado con documentación corporativa realista (manual de controles, checklists de cierre, políticas de aprobación). Escriba una pregunta, obtenga una respuesta específica con citas de fuentes. Pruébelo usted mismo.",
        cta: "Probar el Agente", href: "/knowledge-base",
      },
    ];
  }
  return [
    {
      id: "health-check", icon: "🏥", tag: "Diagnostic Tool",
      title: "Finance Health Check",
      hook: "10-question self-assessment. Find out where your finance operations are exposed.",
      evidence: "Take a 2-minute assessment and get an instant maturity score across Reporting, Risk, and Process Automation. The same diagnostic framework I apply in the first week of any new engagement.",
      cta: "Take the Assessment", href: "/health-check",
    },
    {
      id: "dashboard", icon: "📊", tag: "Live Dashboard",
      title: "Manual-to-Automated Demo",
      hook: "Interactive Power BI dashboard replacing a 3-day Excel consolidation.",
      evidence: "A working regional P&L dashboard: 5 countries, 12 months, with revenue/margin/OPEX variance and Price/Volume/Mix decomposition. Filter, drill down, explore — exactly what I'd deliver on Day 1.",
      cta: "Explore the Dashboard", href: "/dashboard",
    },
    {
      id: "ai-cases", icon: "🤖", tag: "AI in Action",
      title: "AI for Finance Case Studies",
      hook: "3 real scenarios where AI cut hours from finance workflows.",
      evidence: "Contract analysis automated from 2 days to 15 minutes. Variance commentary from 4 hours to review-only. Compliance document QA via RAG-based retrieval. Each with before/after proof.",
      cta: "View Case Studies", href: "/ai-cases",
    },
    {
      id: "blueprint", icon: "📋", tag: "Onboarding Plan",
      title: "30-60-90 Day Blueprint",
      hook: "My system for walking into chaos and producing order — in 90 days.",
      evidence: "Three phases: Diagnostic → Stabilization → Optimization. Each with concrete deliverables — not vague strategic alignment, but outputs like 'documented month-end close process map' and 'Power BI dashboard replacing manual consolidation.'",
      cta: "See the Full Plan", href: "/blueprint",
    },
    {
      id: "risk-map", icon: "🔥", tag: "Risk Framework",
      title: "Panama Risk Heat Map",
      hook: "One page that shows your CFO where you're exposed — and where you're not.",
      evidence: "A ready-to-use heat map template covering tax/reporting risk, operational risk, and regulatory compliance risk for Panama SEMs. Impact × Likelihood scoring, ready for regional management briefings.",
      cta: "View the Template", href: "/risk-map",
    },
    {
      id: "knowledge-base", icon: "🧠", tag: "Knowledge Agent",
      title: "Corporate Knowledge Base",
      hook: "Your team's policies and SOPs — queryable in seconds instead of days.",
      evidence: "A working proof of concept: an AI agent trained on realistic corporate documentation (controls manual, close checklists, approval policies). Type a question, get a specific answer with source citations. Try it yourself.",
      cta: "Try the Agent", href: "/knowledge-base",
    },
  ];
}

// ─── Fade-in hook ───────────────────────────────────────────
function useFade(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    } as React.CSSProperties,
  };
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── NAVBAR ─────────────────────────────────────────────────
function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: t.nav.solutions[lang], target: "tiles" },
    { label: t.nav.evidence[lang], target: "evidence" },
    { label: t.nav.about[lang], target: "about" },
    { label: t.nav.contact[lang], target: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F1923]/95 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1100px] mx-auto flex items-center justify-between px-6 py-3.5">
        <div
          className="text-[#2EC4B6] text-xl font-bold tracking-tight cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Uwe Anell
        </div>

        <div className="flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l.target}
              onClick={() => scrollTo(l.target)}
              className="hidden md:block bg-transparent border-none cursor-pointer text-[13px] font-semibold text-white/60 uppercase tracking-wider hover:text-[#2EC4B6] transition-colors"
            >
              {l.label}
            </button>
          ))}

          {/* Language toggle */}
          <div className="flex items-center gap-1 ml-2 bg-white/[0.05] rounded-lg p-1">
            <button
              onClick={() => setLang("en")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer border-none transition-all ${
                lang === "en"
                  ? "bg-[#2EC4B6]/15 text-[#2EC4B6]"
                  : "bg-transparent text-white/40 hover:text-white/70"
              }`}
            >
              🇺🇸 EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer border-none transition-all ${
                lang === "es"
                  ? "bg-[#2EC4B6]/15 text-[#2EC4B6]"
                  : "bg-transparent text-white/40 hover:text-white/70"
              }`}
            >
              🇵🇦 ES
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ───────────────────────────────────────────────────
function Hero({ lang }: { lang: Lang }) {
  const f = useFade();
  return (
    <section className="relative min-h-[76vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0F1923] via-[#0D2137] to-[#1A2A3A]">
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full border border-[#2EC4B6]/[0.12] opacity-30" />
      <div className="absolute bottom-[8%] -left-[3%] w-[260px] h-[260px] rounded-full border border-[#2EC4B6]/[0.06]" />
      <div className="absolute top-[30%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#2EC4B6] opacity-25" />
      <div className="absolute top-[20%] right-[25%] w-1 h-1 rounded-full bg-[#2EC4B6] opacity-20" />

      <div
        ref={f.ref}
        style={f.style}
        className="max-w-[1100px] mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_300px] gap-14 items-center px-6 pt-28 pb-10"
      >
        <div>
          <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-5">
            {t.hero.tag[lang]}
          </div>
          <h1 className="text-4xl md:text-[48px] font-bold text-[#F0F4F8] leading-[1.18] tracking-tight mb-6">
            {t.hero.h1a[lang]}<br />
            <span className="text-[#2EC4B6]">{t.hero.h1b[lang]}</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-[520px] mb-9">
            {t.hero.sub[lang]}
          </p>
          <div className="flex gap-3.5">
            <button
              onClick={() => scrollTo("tiles")}
              className="px-7 py-3.5 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg border-none cursor-pointer transition-all hover:-translate-y-px"
            >
              {t.hero.cta1[lang]}
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-7 py-3.5 bg-transparent text-white font-semibold text-[15px] rounded-lg border border-white/10 hover:border-[#2EC4B6] cursor-pointer transition-colors"
            >
              {t.hero.cta2[lang]}
            </button>
          </div>
        </div>

        <div className="text-center">
          <div
            className="w-[200px] h-[200px] rounded-full mx-auto mb-5 border-[3px] border-[#2EC4B6] shadow-[0_0_0_8px_rgba(46,196,182,0.12)]"
            style={{ background: `url(${UA_PIC}) center/cover` }}
          />
          <div className="text-[13px] text-white/40 leading-[1.8]">
            <span className="text-white/65 font-semibold">{t.hero.years[lang]}</span> · Dell, Puig, Dresdner Bank<br />
            <span className="text-white/65 font-semibold">{t.hero.tri[lang]}</span> · EN · ES · DE<br />
            <span className="text-white/65 font-semibold">PMP®</span> {t.hero.pmp[lang]}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TRUST BAR ──────────────────────────────────────────────
function TrustBar({ lang }: { lang: Lang }) {
  const f = useFade();
  return (
    <section
      ref={f.ref}
      style={f.style}
      className="bg-[#162230] border-y border-white/[0.06] py-6 px-6"
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Main row: label + logos + divider + PMP */}
        <div className="flex items-center justify-center gap-8 flex-wrap">

          {/* "Worked at" label */}
          <span className="text-[11px] text-white/40 font-semibold tracking-[0.1em] uppercase">
            {t.trust.label[lang]}
          </span>

          {/* Company logos + disclaimer grouped together */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-10">
              {/* Dell + Dresdner stacked, left-aligned */}
              <div className="flex flex-col items-start gap-2">
                <img
                  src={DELL_LOGO}
                  alt="Dell Technologies"
                  className="h-auto opacity-50 grayscale brightness-[1.8] hover:opacity-90 hover:grayscale-0 hover:brightness-100 transition-all duration-300"
                  style={{ width: 190 }}
                />
                <img
                  src={DRESDNER_LOGO}
                  alt="Dresdner Bank"
                  className="h-auto opacity-50 grayscale brightness-[1.8] hover:opacity-90 hover:grayscale-0 hover:brightness-100 transition-all duration-300"
                  style={{ width: 200 }}
                />
              </div>
              {/* Puig beside */}
              <img
                src={PUIG_LOGO}
                alt="Puig"
                className="h-auto opacity-50 grayscale brightness-[1.8] hover:opacity-90 hover:grayscale-0 hover:brightness-100 transition-all duration-300"
                style={{ width: 70 }}
              />
            </div>
            {/* Disclaimer centered under logos only */}
            <span className="text-[11px] text-white/25 italic mt-3">
              {t.trust.disclaimer[lang]}
            </span>
          </div>

          {/* Vertical divider */}
          <div className="w-px h-16 bg-white/[0.1] mx-2" />

          {/* PMP badge — full color, with text */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={PMP_BADGE}
              alt="PMP Certified"
              className="h-auto hover:scale-105 transition-transform duration-300"
              style={{ width: 72 }}
            />
            <span className="text-[11px] text-[#2EC4B6] font-semibold tracking-wide text-center leading-tight">
              {t.trust.pmpText[lang]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TILE CARD ──────────────────────────────────────────────
interface TileData {
  id: string;
  icon: string;
  tag: string;
  title: string;
  hook: string;
  evidence: string;
  cta: string;
  href: string;
}

function TileCard({ tile, index, lang }: { tile: TileData; index: number; lang: Lang }) {
  const f = useFade(index * 80);
  return (
    <div ref={f.ref} style={f.style}>
      <div
        onClick={() => scrollTo(`ev-${tile.id}`)}
        className="bg-[#162230] border border-white/[0.06] rounded-xl p-7 cursor-pointer min-h-[220px] flex flex-col transition-all duration-250 hover:bg-[#1E3244] hover:border-[#2EC4B6]/[0.18] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] group"
      >
        <div className="text-[28px] mb-3.5">{tile.icon}</div>
        <div className="text-[11px] font-bold text-[#2EC4B6] tracking-[0.1em] uppercase mb-2">
          {tile.tag}
        </div>
        <h3 className="text-[19px] font-bold text-[#F0F4F8] mb-2.5 leading-tight">
          {tile.title}
        </h3>
        <p className="text-sm text-white/40 leading-relaxed flex-1">
          {tile.hook}
        </p>
        <div className="text-[13px] font-semibold text-[#2EC4B6] mt-4 flex items-center gap-1.5">
          {t.tiles.more[lang]}{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1">↓</span>
        </div>
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
          <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-2.5">
            {t.tiles.heading[lang]}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-3.5 tracking-tight">
            {t.tiles.title[lang]}
          </h2>
          <p className="text-base text-white/40 max-w-[560px] mx-auto leading-relaxed">
            {t.tiles.sub[lang]}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {tiles.map((tile, i) => (
            <TileCard key={tile.id} tile={tile} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EVIDENCE BLOCKS ────────────────────────────────────────
function EvidenceBlock({ tile, index, lang }: { tile: TileData; index: number; lang: Lang }) {
  const f = useFade();
  const isEven = index % 2 === 0;
  return (
    <div
      id={`ev-${tile.id}`}
      ref={f.ref}
      style={f.style}
      className={`rounded-2xl border border-white/[0.06] p-8 md:p-11 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${
        isEven ? "bg-[#162230]" : "bg-[#0F1923]"
      }`}
    >
      <div className={isEven ? "md:order-1" : "md:order-2"}>
        <div className="text-[11px] font-bold text-[#2EC4B6] tracking-[0.1em] uppercase mb-2">
          {tile.tag}
        </div>
        <h3 className="text-2xl font-bold text-[#F0F4F8] mb-4 leading-tight">
          {tile.title}
        </h3>
        <p className="text-[15px] text-white/65 leading-relaxed mb-7">
          {tile.evidence}
        </p>
        <a
          href={tile.href}
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg no-underline transition-colors"
        >
          {tile.cta} →
        </a>
      </div>
      <div className={`${isEven ? "md:order-2" : "md:order-1"} bg-[#2EC4B6]/[0.04] border border-[#2EC4B6]/[0.15] rounded-xl min-h-[220px] flex items-center justify-center p-8`}>
        <div className="text-center">
          <div className="text-5xl mb-3">{tile.icon}</div>
          <div className="text-[13px] text-white/40">{t.evidence.preview[lang]}</div>
        </div>
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
          <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-2.5">
            {t.evidence.heading[lang]}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] tracking-tight">
            {t.evidence.title[lang]}
          </h2>
        </div>
        <div className="flex flex-col gap-7">
          {tiles.map((tile, i) => (
            <EvidenceBlock key={tile.id} tile={tile} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ──────────────────────────────────────────────────
function About({ lang }: { lang: Lang }) {
  const f = useFade();
  return (
    <section id="about" className="py-24 px-6 bg-[#0F1923]">
      <div ref={f.ref} style={f.style} className="max-w-[780px] mx-auto text-center">
        <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-2.5">
          {t.about.heading[lang]}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-7">
          {t.about.title[lang]}
        </h2>
        <div
          className="w-[140px] h-[140px] rounded-full mx-auto mb-7 border-2 border-[#2EC4B6] shadow-[0_0_0_6px_rgba(46,196,182,0.12)]"
          style={{ background: `url(${UA_PIC}) center/cover` }}
        />
        <p className="text-[17px] text-white/65 leading-[1.75] mb-3">{t.about.p1[lang]}</p>
        <p className="text-[17px] text-white/65 leading-[1.75] mb-3">{t.about.p2[lang]}</p>
        <p className="text-[17px] text-white/65 leading-[1.75] mb-3">{t.about.p3[lang]}</p>
        <p className="text-[17px] text-white/65 leading-[1.75]">{t.about.p4[lang]}</p>
      </div>
    </section>
  );
}

// ─── CONTACT ────────────────────────────────────────────────
function Contact({ lang }: { lang: Lang }) {
  const f = useFade();
  const channels = [
    { icon: "✉️", label: "Email", value: "uweanell@gmail.com", href: "mailto:uweanell@gmail.com" },
    { icon: "💬", label: "WhatsApp", value: "+507 6670-8030", href: "https://wa.me/50766708030" },
    { icon: "🔗", label: "LinkedIn", value: "linkedin.com/in/uwe-anell", href: "https://linkedin.com/in/uwe-anell" },
  ];
  return (
    <section id="contact" className="py-24 px-6 bg-[#162230] border-t border-white/[0.06]">
      <div ref={f.ref} style={f.style} className="max-w-[1100px] mx-auto text-center">
        <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-2.5">
          {t.contact.heading[lang]}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-3.5">
          {t.contact.title[lang]}
        </h2>
        <p className="text-base text-white/40 max-w-[480px] mx-auto mb-10 leading-relaxed">
          {t.contact.sub[lang]}
        </p>
        <div className="flex justify-center gap-5 flex-wrap">
          {channels.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="bg-[#1A2A3A] border border-white/[0.06] rounded-xl px-8 py-5 no-underline flex items-center gap-3.5 transition-all hover:border-[#2EC4B6]/[0.18] hover:bg-[#1E3244]"
            >
              <span className="text-[22px]">{c.icon}</span>
              <div className="text-left">
                <div className="text-[11px] text-white/40 font-semibold tracking-wider uppercase mb-0.5">
                  {c.label}
                </div>
                <div className="text-[15px] font-semibold text-[#F0F4F8]">
                  {c.value}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────
function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="bg-[#0F1923] border-t border-white/[0.06] py-7 px-6">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center">
        <div className="text-xs text-white/40">
          © 2026 Uwe Anell. {t.footer.rights[lang]}
        </div>
        <div className="text-xs text-white/40">
          Panama City, Panama
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function V2Home() {
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
