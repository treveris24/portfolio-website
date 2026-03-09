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
    label: "Diagnostic",
    tagline: "Understand the terrain before changing it.",
    color: "#F59E0B",
    colorBg: "bg-amber-500/[0.06]",
    colorBorder: "border-amber-500/20",
    colorText: "text-amber-400",
    icon: "🔍",
    summary:
      "The first 30 days are about listening, mapping, and finding quick wins. No major changes — just deep understanding of how things actually work (not how people say they work).",
    deliverables: [
      {
        title: "Current State Process Map",
        description: "Visual documentation of every finance workflow — month-end close, reporting cadence, approval chains, data flows. Identifies bottlenecks, redundancies, and single points of failure.",
      },
      {
        title: "Stakeholder Interviews (8–12)",
        description: "Structured conversations with CFO, controllers, commercial leads, and IT. Goal: understand pain points, political dynamics, and unspoken expectations.",
      },
      {
        title: "Data Audit & Quality Assessment",
        description: "Review of source systems, data integrity checks, reconciliation gaps. Identifies where numbers diverge between systems and why.",
      },
      {
        title: "Quick Wins List (3–5 items)",
        description: "Low-effort, high-impact fixes that can be implemented immediately — often formatting, access, or simple automation fixes that save hours per week.",
      },
    ],
    outcome: "Deliverable: 15-page diagnostic report with findings, risk areas, and prioritized action plan for Phases 2 and 3.",
  },
  {
    id: 2,
    days: "Days 31–60",
    label: "Stabilization",
    tagline: "Fix the foundation before building on top of it.",
    color: "#2EC4B6",
    colorBg: "bg-[#2EC4B6]/[0.06]",
    colorBorder: "border-[#2EC4B6]/20",
    colorText: "text-[#2EC4B6]",
    icon: "🔧",
    summary:
      "Phase 2 is about creating order. Document what needs documenting. Fix what's broken. Establish the reporting cadence and control framework that everything else will run on.",
    deliverables: [
      {
        title: "Month-End Close Process Documentation",
        description: "Step-by-step playbook with owners, deadlines, dependencies, and escalation paths. Eliminates the 'only Maria knows how to do this' problem.",
      },
      {
        title: "Internal Controls Implementation",
        description: "Formal control framework for high-risk areas: partner payments, credit approvals, expense authorization. Audit-ready documentation.",
      },
      {
        title: "Reporting Cadence & Templates",
        description: "Standardized weekly/monthly reporting package. CFO gets the same format every time. No more one-off requests consuming analyst time.",
      },
      {
        title: "Tool Migration Plan",
        description: "Assessment of current tools vs. needs. Roadmap for Power BI deployment, AI workflow pilots, or ERP optimization. Includes cost-benefit analysis.",
      },
    ],
    outcome: "Deliverable: Operating rhythm established — documented processes, working controls, standardized reports running on schedule.",
  },
  {
    id: 3,
    days: "Days 61–90",
    label: "Optimization",
    tagline: "Now we accelerate.",
    color: "#10B981",
    colorBg: "bg-emerald-500/[0.06]",
    colorBorder: "border-emerald-500/20",
    colorText: "text-emerald-400",
    icon: "🚀",
    summary:
      "With stable processes in place, Phase 3 is about leverage — automation, dashboards, and knowledge transfer that make improvements permanent and scalable.",
    deliverables: [
      {
        title: "Power BI Dashboard Deployment",
        description: "Interactive executive dashboard replacing manual consolidation. Regional P&L, variance analysis, KPI tracking — all self-service for leadership.",
      },
      {
        title: "AI Workflow Automation (1–2 pilots)",
        description: "Deploy AI-assisted workflows for highest-ROI use cases identified in Phase 1. Typically: variance commentary, contract review, or document QA.",
      },
      {
        title: "Knowledge Transfer & Training",
        description: "Team training on new tools and processes. Documentation updated. Goal: everything runs without me if I step away for a week.",
      },
      {
        title: "Handoff Report & Roadmap",
        description: "Comprehensive summary of what was done, what changed, metrics before/after, and recommended next steps for the following quarter.",
      },
    ],
    outcome: "Deliverable: Self-sustaining system — automated dashboards, documented processes, trained team, and a roadmap for continuous improvement.",
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
                ringColor: activePhase === p.id ? `${p.color}30` : "transparent",
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
            The 30-60-90 Day Blueprint
          </h1>
          <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            My repeatable system for walking into a new finance organization and producing measurable results in 90 days. Not theory — a structured methodology with concrete deliverables at every stage.
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
                    {p.deliverables.length} deliverables
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6 pt-5 border-t border-white/[0.06]">
              <div className="text-sm text-white/50 mb-1">
                Total: <span className="text-[#F0F4F8] font-semibold">12 concrete deliverables</span> across 3 phases
              </div>
              <div className="text-xs text-white/30">
                Every deliverable is documented, measurable, and designed to outlast my involvement.
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="p-8 rounded-xl bg-[#162230] border border-white/[0.06]">
            <h3 className="text-xl font-bold text-[#F0F4F8] mb-3">
              This is what your first 90 days with me look like.
            </h3>
            <p className="text-sm text-white/40 mb-6 max-w-md mx-auto leading-relaxed">
              Whether it's a new role, a project engagement, or a consulting sprint — I bring this
              structured approach to every engagement. De-risk the hire.
            </p>
            <a
              href="https://wa.me/50766708030?text=Hi%20Uwe%2C%20I%20saw%20your%2030-60-90%20blueprint.%20I%E2%80%99d%20like%20to%20discuss%20how%20this%20approach%20could%20work%20for%20my%20organization."
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-3.5 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg no-underline transition-colors"
            >
              Let's Discuss Your Situation
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
