"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Phase Data ─────────────────────────────────────────────
interface Deliverable {
  title: string;
  description: string;
}

interface Phase {
  id: number;
  days: string;
  label: string;
  tagline: string;
  color: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  icon: string;
  summary: string;
  deliverables: Deliverable[];
  outcome: string;
}

const phases: Phase[] = [
  {
    id: 1,
    days: "Days 1–30",
    label: "Listen & Learn",
    tagline: "Understand how things work before suggesting anything.",
    color: "#F59E0B",
    colorBg: "bg-amber-500/[0.06]",
    colorBorder: "border-amber-500/20",
    colorText: "text-amber-400",
    icon: "🔍",
    summary:
      "The first 30 days are about listening, learning, and understanding the team's current workflows. No rushing to change things — just getting a clear picture.",
    deliverables: [
      {
        title: "Process Overview",
        description: "Get familiar with the key finance workflows: month-end close, reporting cadence, approval chains, data flows. Note what's working well and where there might be room to improve.",
      },
      {
        title: "Meet the Team",
        description: "Conversations with colleagues across finance, commercial, and IT to understand priorities, challenges, and how things connect.",
      },
      {
        title: "Data Familiarization",
        description: "Review of source systems, reporting tools, and how data flows between them. Get comfortable with the numbers.",
      },
      {
        title: "Early Contributions",
        description: "Small, practical improvements I can help with right away — often simple fixes in formatting, access, or automation that save the team time.",
      },
    ],
    outcome: "Outcome: A clear understanding of the finance operation and a shared view with my manager on priorities for the coming months.",
  },
  {
    id: 2,
    days: "Days 31–60",
    label: "Strengthen & Document",
    tagline: "Help solidify the team's processes and documentation.",
    color: "#2EC4B6",
    colorBg: "bg-[#2EC4B6]/[0.06]",
    colorBorder: "border-[#2EC4B6]/20",
    colorText: "text-[#2EC4B6]",
    icon: "🔧",
    summary:
      "With a good understanding of how things work, I can start contributing more actively — supporting process documentation, helping standardize reporting, and strengthening controls where needed.",
    deliverables: [
      {
        title: "Month-End Close Support",
        description: "Help document the close process with clear steps, owners, and timelines. Reduce dependency on any single person.",
      },
      {
        title: "Internal Controls Support",
        description: "Help strengthen controls for key areas: partner payments, credit approvals, expense authorization. Ensure documentation is audit-ready.",
      },
      {
        title: "Reporting Templates",
        description: "Help standardize the weekly/monthly reporting package so the team spends less time on formatting and more on analysis.",
      },
      {
        title: "Tool Assessment",
        description: "If there's interest, review current tools and explore whether Power BI, AI workflows, or other improvements could add value. Always with a practical cost-benefit view.",
      },
    ],
    outcome: "Outcome: The team has clearer documentation, more consistent reporting, and stronger processes to build on.",
  },
  {
    id: 3,
    days: "Days 61–90",
    label: "Build & Share",
    tagline: "With solid foundations in place, this is where things get interesting.",
    color: "#10B981",
    colorBg: "bg-emerald-500/[0.06]",
    colorBorder: "border-emerald-500/20",
    colorText: "text-emerald-400",
    icon: "🚀",
    summary:
      "With a good understanding of the team's needs, I can focus on the areas where I add the most value — automation, dashboards, and making sure improvements stick.",
    deliverables: [
      {
        title: "Power BI Dashboards",
        description: "Build or improve interactive dashboards for the team: P&L views, variance analysis, KPI tracking — whatever adds the most value.",
      },
      {
        title: "AI Workflow Support",
        description: "Where it makes sense, introduce AI-assisted tools for repetitive tasks like variance commentary, contract review, or document QA.",
      },
      {
        title: "Knowledge Sharing",
        description: "Make sure any new tools or processes are well-documented and the team is comfortable using them.",
      },
      {
        title: "Summary & Next Steps",
        description: "A clear record of what was accomplished and practical suggestions for what to focus on next.",
      },
    ],
    outcome: "Outcome: The team is better equipped — with stronger tools, clearer documentation, and a good foundation for continuous improvement.",
  },
];

// ─── Components ─────────────────────────────────────────────
function PhaseTimeline({ activePhase, setActivePhase }: { activePhase: number; setActivePhase: (id: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-14">
      {phases.map((p, i) => (
        <div key={p.id} className="flex items-center">
          <button
            onClick={() => setActivePhase(p.id)}
            className={`flex flex-col items-center cursor-pointer border-none bg-transparent transition-all duration-300 px-6 py-4 rounded-xl ${
              activePhase === p.id
                ? `${p.colorBg} ${p.colorBorder} border`
                : "hover:bg-white/[0.02]"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3 transition-all duration-300 ${
                activePhase === p.id
                  ? `ring-4 shadow-lg`
                  : "opacity-50"
              }`}
              style={{
                background: activePhase === p.id ? `${p.color}20` : "rgba(255,255,255,0.04)",
        
                boxShadow: activePhase === p.id ? `0 0 20px ${p.color}15` : "none",
              }}
            >
              {p.icon}
            </div>
            <div className={`text-[11px] font-bold tracking-[0.1em] uppercase mb-1 transition-colors ${
              activePhase === p.id ? p.colorText : "text-white/30"
            }`}>
              {p.days}
            </div>
            <div className={`text-base font-bold transition-colors ${
              activePhase === p.id ? "text-[#F0F4F8]" : "text-white/40"
            }`}>
              {p.label}
            </div>
          </button>

          {/* Connector line */}
          {i < phases.length - 1 && (
            <div className="w-16 h-px bg-white/[0.08] mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}

function PhaseDetail({ phase }: { phase: Phase }) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Phase header */}
      <div className="mb-10">
        <div className={`text-[11px] font-bold tracking-[0.1em] uppercase mb-2 ${phase.colorText}`}>
          {phase.days} · {phase.label}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#F0F4F8] mb-3">
          {phase.tagline}
        </h2>
        <p className="text-[15px] text-white/55 leading-relaxed max-w-2xl">
          {phase.summary}
        </p>
      </div>

      {/* Deliverables grid */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {phase.deliverables.map((d, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl ${phase.colorBg} border ${phase.colorBorder} transition-all duration-200 hover:bg-opacity-80`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: `${phase.color}20`, color: phase.color }}
              >
                {i + 1}
              </div>
              <h4 className="text-base font-bold text-[#F0F4F8] leading-tight pt-0.5">
                {d.title}
              </h4>
            </div>
            <p className="text-sm text-white/50 leading-relaxed pl-10">
              {d.description}
            </p>
          </div>
        ))}
      </div>

      {/* Phase outcome */}
      <div className={`p-5 rounded-xl border ${phase.colorBorder} bg-[#162230]`}>
        <div className="flex items-start gap-3">
          <span className={`text-lg ${phase.colorText}`}>📋</span>
          <p className={`text-sm font-semibold leading-relaxed ${phase.colorText}`}>
            {phase.outcome}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function Blueprint() {
  const [activePhase, setActivePhase] = useState(1);
  const currentPhase = phases.find((p) => p.id === activePhase)!;

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
            Onboarding Plan
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-4">
            My First 90 Days
          </h1>
          <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            I'm someone who likes to have a clear plan when joining a new team. Here's how I'd approach it.
          </p>
        </div>

        {/* Timeline selector */}
        <PhaseTimeline activePhase={activePhase} setActivePhase={setActivePhase} />

        {/* Active phase detail */}
        <PhaseDetail phase={currentPhase} />

        {/* Summary bar */}
        <div className="max-w-4xl mx-auto mt-14">
          <div className="p-6 rounded-xl bg-[#162230] border border-white/[0.06]">
            <div className="text-[11px] font-bold text-white/25 tracking-[0.1em] uppercase mb-4">
              90-Day Summary
            </div>
            <div className="grid grid-cols-3 gap-6">
              {phases.map((p) => (
                <div key={p.id} className="text-center">
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <div className={`text-sm font-bold mb-1 ${p.colorText}`}>{p.label}</div>
                  <div className="text-xs text-white/35">
                    {p.deliverables.length} focus areas
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="p-8 rounded-xl bg-[#162230] border border-white/[0.06]">
            <p className="text-sm text-white/40 mb-6 max-w-md mx-auto leading-relaxed">
              I'm happy to talk through any of this — just reach out.
            </p>
            <a
              href="mailto:uweanell@gmail.com"
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
