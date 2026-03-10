"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Case Study Data ────────────────────────────────────────
interface CaseStudy {
  id: string;
  icon: string;
  tag: string;
  title: string;
  problem: string;
  solution: string;
  result: string;
  beforeTitle: string;
  beforeItems: string[];
  afterTitle: string;
  afterItems: string[];
  metric: string;
  metricLabel: string;
  tools: string[];
}

const cases: CaseStudy[] = [
  {
    id: "contracts",
    icon: "📄",
    tag: "Case A",
    title: "Partner Contract Analysis",
    problem:
      "A regional finance team spent 2 full days every quarter manually reviewing 50+ partner contracts — checking rebate terms, discount tiers, payment conditions, and compliance clauses. Errors and missed terms led to overpayments and audit findings.",
    solution:
      "This workflow uses an LLM to ingest partner contracts (PDF/Word), extracts key commercial terms into a structured table, flags anomalies against the master agreement template, and produces a summary report with exceptions highlighted. The analyst's role shifted from data extraction to exception review.",
    result:
      "What took 2 days now takes 15 minutes. The team catches more anomalies than before because the AI reviews every clause — not just the ones an analyst has time to check. Audit findings related to contract terms dropped to zero in the following two quarters.",
    beforeTitle: "Before: Manual Process",
    beforeItems: [
      "Open each contract PDF individually",
      "Search for rebate %, discount tiers, payment terms",
      "Copy key figures into a master Excel tracker",
      "Cross-check against standard terms manually",
      "Flag exceptions via email to legal/commercial",
      "2 full days · 50+ contracts · high error rate",
    ],
    afterTitle: "After: AI-Assisted Workflow",
    afterItems: [
      "Upload batch of contracts to LLM pipeline",
      "AI extracts all key terms into structured table",
      "Anomalies auto-flagged against master template",
      "Summary report generated with exceptions highlighted",
      "Analyst reviews exceptions only — approves or escalates",
      "15 minutes · 50+ contracts · near-zero errors",
    ],
    metric: "2 days → 15 min",
    metricLabel: "Processing Time",
    tools: ["LLM (Claude)", "PDF parsing", "Structured extraction", "Python automation"],
  },
  {
    id: "variance",
    icon: "📊",
    tag: "Case B",
    title: "Automated Variance Commentary",
    problem:
      "Every month after close, a senior analyst spent 4+ hours writing narrative commentary for the variance report — explaining why each cost center was over or under budget. The commentary was repetitive, formulaic, and the analyst's time was better spent on actual analysis.",
    solution:
      "A prompt pipeline takes the raw variance data (actual vs. budget by cost center), applies business context rules, and generates first-draft commentary for each line item. The output follows the company's standard format and tone. The analyst's role shifted from writing to reviewing and adding judgment where the AI flags uncertainty.",
    result:
      "Commentary generation went from 4 hours to 20 minutes of review time. Quality improved because the AI is consistent — it never forgets to mention a material variance. The analyst now spends that recovered time on forward-looking analysis instead of backward-looking narration.",
    beforeTitle: "Before: Manual Commentary",
    beforeItems: [
      "Export variance report from SAP/BPC",
      "Review each cost center line by line",
      "Write narrative explanation for each material variance",
      "Apply standard formatting and CFO-approved language",
      "Cross-check figures against source data",
      "4+ hours · repetitive · analyst overqualified for task",
    ],
    afterTitle: "After: AI-Generated First Draft",
    afterItems: [
      "Variance data fed into prompt pipeline automatically",
      "AI generates commentary per cost center",
      "Follows company tone, flags materiality thresholds",
      "Analyst reviews, adds judgment, approves",
      "Final report ready for CFO in 20 minutes",
      "20 min review · consistent quality · zero missed items",
    ],
    metric: "4 hrs → 20 min",
    metricLabel: "Analyst Time",
    tools: ["LLM (Claude)", "Prompt engineering", "Template system", "Data pipeline"],
  },
  {
    id: "compliance",
    icon: "🔍",
    tag: "Case C",
    title: "Compliance Document QA",
    problem:
      "Internal audit preparation required manual review of 200+ control documents spread across SharePoint, shared drives, and email archives. The compliance team spent weeks before each audit just locating and verifying documents. New hires took months to learn where everything was stored.",
    solution:
      "A RAG-based (Retrieval-Augmented Generation) system that indexes all internal control documents, SOPs, and policy manuals into a queryable knowledge base. Auditors and finance staff can ask questions in natural language and get specific answers with source document citations. The system explicitly states when a question falls outside the indexed knowledge base.",
    result:
      "Audit preparation time was cut by 60%. New hires became productive in days instead of months because they could query the system instead of asking five colleagues. The system also identified 12 outdated documents that needed updates — gaps that had gone unnoticed for over a year.",
    beforeTitle: "Before: Document Hunting",
    beforeItems: [
      "Search SharePoint, shared drives, email archives",
      "Ask colleagues 'where is the process for X?'",
      "Get different answers from different people",
      "Manually verify document versions and dates",
      "Compile audit binder over 2-3 weeks",
      "Weeks of prep · knowledge trapped in people's heads",
    ],
    afterTitle: "After: AI Knowledge Base",
    afterItems: [
      "Type question in natural language",
      "AI retrieves relevant document sections instantly",
      "Answers include source citations (doc name, section, version)",
      "System flags when question is outside knowledge base",
      "Outdated documents surfaced automatically",
      "Instant answers · 60% less audit prep · zero tribal knowledge risk",
    ],
    metric: "60% faster",
    metricLabel: "Audit Prep Time",
    tools: ["RAG architecture", "Document indexing", "LLM (Claude)", "Vector database"],
  },
];

// ─── Components ─────────────────────────────────────────────
function CaseCard({ cs, isOpen, onToggle }: { cs: CaseStudy; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-300">
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left p-8 bg-[#162230] hover:bg-[#1E3244] transition-colors cursor-pointer border-none"
      >
        <div className="flex items-start gap-6">
          <div className="text-4xl flex-shrink-0 mt-1">{cs.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-bold text-[#2EC4B6] tracking-[0.1em] uppercase">
                {cs.tag}
              </span>
              <span className="text-[11px] font-bold text-white/20">·</span>
              <span className="text-[11px] font-bold text-white/30 tracking-[0.1em] uppercase">
                {cs.metricLabel}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#F0F4F8] mb-2">
              {cs.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
              {cs.problem}
            </p>
          </div>
          {/* Metric badge */}
          <div className="flex-shrink-0 bg-[#2EC4B6]/10 border border-[#2EC4B6]/25 rounded-xl px-5 py-3 text-center">
            <div className="text-lg font-bold text-[#2EC4B6]">{cs.metric}</div>
            <div className="text-[10px] text-[#2EC4B6]/60 uppercase tracking-wider">{cs.metricLabel}</div>
          </div>
          {/* Expand indicator */}
          <div className={`text-white/30 text-xl flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
            ▾
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="bg-[#0F1923] border-t border-white/[0.06]">
          {/* Problem / Solution / Result */}
          <div className="p-8 grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-[11px] font-bold text-red-400/80 tracking-[0.1em] uppercase mb-3">
                The Problem
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {cs.problem}
              </p>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#2EC4B6] tracking-[0.1em] uppercase mb-3">
                The Solution
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {cs.solution}
              </p>
            </div>
            <div>
              <div className="text-[11px] font-bold text-emerald-400/80 tracking-[0.1em] uppercase mb-3">
                The Result
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {cs.result}
              </p>
            </div>
          </div>

          {/* Before / After */}
          <div className="px-8 pb-8">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Before */}
              <div className="rounded-xl bg-red-500/[0.04] border border-red-500/[0.12] p-6">
                <div className="text-[11px] font-bold text-red-400/70 tracking-[0.1em] uppercase mb-4">
                  {cs.beforeTitle}
                </div>
                <div className="flex flex-col gap-2.5">
                  {cs.beforeItems.map((item, i) => {
                    const isLast = i === cs.beforeItems.length - 1;
                    return (
                      <div key={i} className={`flex items-start gap-2.5 ${isLast ? "mt-2 pt-3 border-t border-red-500/[0.12]" : ""}`}>
                        <span className={`text-xs mt-0.5 ${isLast ? "text-red-400" : "text-red-400/40"}`}>
                          {isLast ? "⏱" : "→"}
                        </span>
                        <span className={`text-sm leading-relaxed ${isLast ? "text-red-400/80 font-semibold" : "text-white/45"}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* After */}
              <div className="rounded-xl bg-emerald-500/[0.04] border border-emerald-500/[0.12] p-6">
                <div className="text-[11px] font-bold text-emerald-400/70 tracking-[0.1em] uppercase mb-4">
                  {cs.afterTitle}
                </div>
                <div className="flex flex-col gap-2.5">
                  {cs.afterItems.map((item, i) => {
                    const isLast = i === cs.afterItems.length - 1;
                    return (
                      <div key={i} className={`flex items-start gap-2.5 ${isLast ? "mt-2 pt-3 border-t border-emerald-500/[0.12]" : ""}`}>
                        <span className={`text-xs mt-0.5 ${isLast ? "text-emerald-400" : "text-emerald-400/40"}`}>
                          {isLast ? "✓" : "→"}
                        </span>
                        <span className={`text-sm leading-relaxed ${isLast ? "text-emerald-400/80 font-semibold" : "text-white/45"}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Tools used */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">
                Tools used:
              </span>
              {cs.tools.map((tool) => (
                <span
                  key={tool}
                  className="text-[11px] text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-md px-2.5 py-1"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function AICaseStudies() {
  const [openId, setOpenId] = useState<string | null>("contracts");

  return (
    <main className="min-h-screen bg-[#0F1923] text-[#F0F4F8]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1923]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-6 py-3.5">
          <Link href="/" className="text-[#2EC4B6] text-xl font-bold tracking-tight no-underline">
            Uwe Anell
          </Link>
          <Link href="/" className="text-sm text-white/50 hover:text-[#2EC4B6] transition-colors no-underline">
            ← Back
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        {/* Header */}
        <div className="max-w-[1100px] mx-auto text-center mb-14">
          <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-3">
            AI in Action
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-4">
            AI for Finance: 3 Real-World Case Studies
          </h1>
          <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            Each case study reflects a common challenge in LatAm finance operations — and shows how AI tools can make a real difference.
          </p>
        </div>

        {/* Case study cards */}
        <div className="max-w-[1100px] mx-auto flex flex-col gap-5">
          {cases.map((cs) => (
            <CaseCard
              key={cs.id}
              cs={cs}
              isOpen={openId === cs.id}
              onToggle={() => setOpenId(openId === cs.id ? null : cs.id)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-[1100px] mx-auto mt-14 text-center">
          <div className="p-8 rounded-xl bg-[#162230] border border-white/[0.06]">
            <h3 className="text-xl font-bold text-[#F0F4F8] mb-3">
              These are the types of challenges I enjoy working on.
            </h3>
            <p className="text-sm text-white/40 mb-6 max-w-md mx-auto leading-relaxed">
              Every finance team has repetitive, time-consuming processes that AI can transform.
              Feel free to reach out if any of this resonates.
            </p>
            <a
              href="https://wa.me/50766708030?text=Hi%20Uwe%2C%20I%20saw%20your%20AI%20case%20studies.%20I%E2%80%99d%20like%20to%20discuss%20how%20AI%20could%20help%20my%20finance%20team."
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-3.5 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg no-underline transition-colors"
            >
              Happy to Connect
            </a>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-white/40 hover:text-[#2EC4B6] transition-colors no-underline">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
