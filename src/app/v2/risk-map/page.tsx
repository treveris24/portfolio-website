"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Risk Data ──────────────────────────────────────────────
type RiskLevel = "critical" | "high" | "medium" | "low";

interface Risk {
  id: string;
  category: string;
  categoryIcon: string;
  name: string;
  description: string;
  impact: number; // 1-5
  likelihood: number; // 1-5
  mitigations: string[];
  owner: string;
}

const risks: Risk[] = [
  // Tax & Reporting
  {
    id: "r1",
    category: "Tax & Reporting",
    categoryIcon: "📑",
    name: "ITBMS Filing Errors",
    description: "Incorrect or late ITBMS (Panama VAT) filings due to manual data compilation from multiple systems. Penalties range from fines to operational restrictions.",
    impact: 4,
    likelihood: 3,
    mitigations: ["Automated tax data extraction from ERP", "Monthly reconciliation checklist", "External tax advisor quarterly review"],
    owner: "Tax Manager / Controller",
  },
  {
    id: "r2",
    category: "Tax & Reporting",
    categoryIcon: "📑",
    name: "Transfer Pricing Non-Compliance",
    description: "Intercompany transactions not properly documented per Panama DGI transfer pricing regulations (Report 930). Risk of double taxation and penalties.",
    impact: 5,
    likelihood: 3,
    mitigations: ["Annual TP study by external firm", "Intercompany pricing policy documented", "Quarterly benchmarking reviews"],
    owner: "Regional Tax Director",
  },
  {
    id: "r3",
    category: "Tax & Reporting",
    categoryIcon: "📑",
    name: "Statutory Reporting Delays",
    description: "Local statutory financial statements not filed on time due to dependency on HQ consolidation timelines that don't align with Panama deadlines.",
    impact: 3,
    likelihood: 4,
    mitigations: ["Parallel local close process", "HQ alignment on LatAm deadlines", "Local auditor engaged early"],
    owner: "Finance Director",
  },
  // Operational
  {
    id: "r4",
    category: "Operational Risk",
    categoryIcon: "⚙️",
    name: "Key-Person Dependency",
    description: "Critical finance processes depend on 1-2 individuals with no backup or documentation. Departure or absence causes immediate operational disruption.",
    impact: 5,
    likelihood: 4,
    mitigations: ["Process documentation initiative", "Cross-training program", "Knowledge base deployment"],
    owner: "Finance Director",
  },
  {
    id: "r5",
    category: "Operational Risk",
    categoryIcon: "⚙️",
    name: "Manual Process Errors",
    description: "Heavy reliance on manual Excel-based consolidation and copy-paste workflows. Error rate increases during high-volume periods (month-end, quarter-end).",
    impact: 4,
    likelihood: 4,
    mitigations: ["Power BI automated reporting", "Data validation layer", "Reduced manual touchpoints"],
    owner: "BI / Reporting Lead",
  },
  {
    id: "r6",
    category: "Operational Risk",
    categoryIcon: "⚙️",
    name: "System Integration Gaps",
    description: "Multiple disconnected systems (ERP, CRM, local tools) require manual reconciliation. Data discrepancies between systems erode trust in reporting.",
    impact: 3,
    likelihood: 3,
    mitigations: ["Data integration roadmap", "Single source of truth initiative", "API-based data flows"],
    owner: "IT / Finance Joint",
  },
  // Regulatory & Compliance
  {
    id: "r7",
    category: "Regulatory & Compliance",
    categoryIcon: "⚖️",
    name: "HQ vs. Local Policy Gaps",
    description: "Global corporate policies don't account for Panama-specific requirements (labor law, DGI regulations, banking rules). Local team follows HQ policy and unknowingly violates local law.",
    impact: 5,
    likelihood: 3,
    mitigations: ["Local policy addendum for each global SOP", "Annual legal review of local compliance", "Escalation matrix for conflicts"],
    owner: "Compliance / Legal",
  },
  {
    id: "r8",
    category: "Regulatory & Compliance",
    categoryIcon: "⚖️",
    name: "Internal Controls Weakness",
    description: "Approval workflows, segregation of duties, and payment controls are informal or bypassed under time pressure. Audit findings recurring.",
    impact: 4,
    likelihood: 3,
    mitigations: ["Formal controls framework", "Quarterly self-assessment", "Automated approval workflows"],
    owner: "Internal Audit / Controller",
  },
  {
    id: "r9",
    category: "Regulatory & Compliance",
    categoryIcon: "⚖️",
    name: "Anti-Money Laundering (AML) Exposure",
    description: "Panama's position as a financial hub requires strict AML/KYC procedures. Insufficient due diligence on partners or vendors could trigger regulatory action.",
    impact: 5,
    likelihood: 2,
    mitigations: ["Enhanced due diligence for new partners", "Annual AML training", "Third-party screening tool"],
    owner: "Compliance Officer",
  },
];

// ─── Scoring logic ──────────────────────────────────────────
function getRiskLevel(impact: number, likelihood: number): RiskLevel {
  const score = impact * likelihood;
  if (score >= 16) return "critical";
  if (score >= 10) return "high";
  if (score >= 5) return "medium";
  return "low";
}

const levelConfig: Record<RiskLevel, { label: string; color: string; bg: string; border: string; cellBg: string }> = {
  critical: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/25", cellBg: "bg-red-500/30" },
  high: { label: "High", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/25", cellBg: "bg-orange-500/25" },
  medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25", cellBg: "bg-amber-500/20" },
  low: { label: "Low", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", cellBg: "bg-emerald-500/15" },
};

// ─── Components ─────────────────────────────────────────────

function HeatMapGrid({ onCellClick, selectedRisk }: { onCellClick: (r: Risk) => void; selectedRisk: string | null }) {
  // Build 5x5 grid
  const grid: (Risk | null)[][][] = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => [] as Risk[])
  );

  risks.forEach((r) => {
    grid[5 - r.likelihood][r.impact - 1].push(r);
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Header */}
        <div className="flex items-end mb-2 pl-20">
          <div className="flex-1 text-center text-[11px] font-bold text-white/30 tracking-[0.1em] uppercase">
            Impact →
          </div>
        </div>

        <div className="flex">
          {/* Y-axis label */}
          <div className="w-6 flex items-center justify-center mr-2">
            <div className="text-[11px] font-bold text-white/30 tracking-[0.1em] uppercase -rotate-90 whitespace-nowrap">
              Likelihood →
            </div>
          </div>

          {/* Y-axis numbers */}
          <div className="flex flex-col gap-1 mr-2 justify-between py-1">
            {[5, 4, 3, 2, 1].map((n) => (
              <div key={n} className="h-[72px] flex items-center justify-center">
                <span className="text-xs text-white/30 font-semibold w-6 text-center">{n}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-5 gap-1">
              {grid.flat().map((cell, i) => {
                const row = Math.floor(i / 5);
                const col = i % 5;
                const impact = col + 1;
                const likelihood = 5 - row;
                const level = getRiskLevel(impact, likelihood);
                const config = levelConfig[level];

                return (
                  <div
                    key={i}
                    className={`${config.cellBg} rounded-lg h-[72px] p-1.5 flex flex-col gap-0.5 overflow-hidden transition-all`}
                  >
                    {cell.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => onCellClick(r)}
                        className={`text-[9px] leading-tight font-semibold px-1.5 py-1 rounded text-left cursor-pointer border-none truncate w-full transition-all ${
                          selectedRisk === r.id
                            ? "bg-white/20 text-white"
                            : "bg-white/[0.06] text-white/70 hover:bg-white/[0.12]"
                        }`}
                        title={r.name}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* X-axis numbers */}
            <div className="grid grid-cols-5 gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="text-center text-xs text-white/30 font-semibold">{n}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-6">
          {(["critical", "high", "medium", "low"] as RiskLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${levelConfig[level].cellBg}`} />
              <span className={`text-[11px] font-semibold ${levelConfig[level].color}`}>
                {levelConfig[level].label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskDetail({ risk }: { risk: Risk }) {
  const level = getRiskLevel(risk.impact, risk.likelihood);
  const config = levelConfig[level];
  const score = risk.impact * risk.likelihood;

  return (
    <div className={`rounded-xl ${config.bg} border ${config.border} p-6 transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{risk.categoryIcon}</span>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
              {risk.category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#F0F4F8]">{risk.name}</h3>
        </div>
        <div className={`px-3 py-1.5 rounded-lg ${config.bg} border ${config.border} text-center`}>
          <div className={`text-lg font-bold ${config.color}`}>{score}</div>
          <div className={`text-[9px] font-bold uppercase ${config.color}`}>{config.label}</div>
        </div>
      </div>

      <p className="text-sm text-white/55 leading-relaxed mb-5">
        {risk.description}
      </p>

      {/* Scoring */}
      <div className="flex gap-6 mb-5">
        <div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Impact</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                  n <= risk.impact ? `${config.cellBg} ${config.color}` : "bg-white/[0.04] text-white/15"
                }`}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Likelihood</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                  n <= risk.likelihood ? `${config.cellBg} ${config.color}` : "bg-white/[0.04] text-white/15"
                }`}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mitigations */}
      <div>
        <div className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">
          Recommended Mitigations
        </div>
        <div className="flex flex-col gap-2">
          {risk.mitigations.map((m, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#2EC4B6] text-xs mt-0.5">→</span>
              <span className="text-sm text-white/50 leading-relaxed">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Owner */}
      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <span className="text-[10px] text-white/25 uppercase tracking-wider">Risk Owner: </span>
        <span className="text-xs text-white/50 font-semibold">{risk.owner}</span>
      </div>
    </div>
  );
}

function RiskTable() {
  const sorted = [...risks].sort((a, b) => b.impact * b.likelihood - a.impact * a.likelihood);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/[0.08]">
            <th className="text-left py-3 px-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">Risk</th>
            <th className="text-left py-3 px-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">Category</th>
            <th className="text-center py-3 px-2 text-[10px] font-bold text-white/30 uppercase tracking-wider">Impact</th>
            <th className="text-center py-3 px-2 text-[10px] font-bold text-white/30 uppercase tracking-wider">Likelihood</th>
            <th className="text-center py-3 px-2 text-[10px] font-bold text-white/30 uppercase tracking-wider">Score</th>
            <th className="text-center py-3 px-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">Level</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const level = getRiskLevel(r.impact, r.likelihood);
            const config = levelConfig[level];
            return (
              <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="py-3 px-3 text-white/70 font-semibold">{r.name}</td>
                <td className="py-3 px-3 text-white/40">{r.category}</td>
                <td className="py-3 px-2 text-center text-white/50">{r.impact}</td>
                <td className="py-3 px-2 text-center text-white/50">{r.likelihood}</td>
                <td className="py-3 px-2 text-center font-bold text-white/70">{r.impact * r.likelihood}</td>
                <td className="py-3 px-3 text-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${config.bg} ${config.border} border ${config.color}`}>
                    {config.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function RiskHeatMap() {
  const [selectedRisk, setSelectedRisk] = useState<string | null>("r4");
  const [view, setView] = useState<"grid" | "table">("grid");
  const activeRisk = risks.find((r) => r.id === selectedRisk) || null;

  return (
    <main className="min-h-screen bg-[#0F1923] text-[#F0F4F8]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1923]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-6 py-3.5">
          <Link href="/v2" className="text-[#2EC4B6] text-xl font-bold tracking-tight no-underline">
            Uwe Anell
          </Link>
          <Link href="/v2" className="text-sm text-white/50 hover:text-[#2EC4B6] transition-colors no-underline">
            ← Back
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        {/* Header */}
        <div className="max-w-[1100px] mx-auto text-center mb-10">
          <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-3">
            Risk Framework
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-4">
            Panama SEM Risk Heat Map
          </h1>
          <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            One page that shows your CFO where you're exposed. Covers tax/reporting,
            operational, and regulatory risk for multinational subsidiaries operating in Panama.
          </p>
        </div>

        {/* Context box */}
        <div className="max-w-[1100px] mx-auto mb-8">
          <div className="p-5 rounded-xl bg-[#162230] border border-white/[0.06] flex items-start gap-4">
            <span className="text-xl flex-shrink-0">ℹ️</span>
            <div>
              <div className="text-sm text-white/60 leading-relaxed">
                <span className="text-white/80 font-semibold">Scenario:</span> This heat map represents a fictional multinational's Panama subsidiary
                with $80M+ revenue, 150 employees, and intercompany transactions with HQ and 3 regional affiliates.
                Risks are scored on a 1–5 scale for Impact and Likelihood. Click any risk on the grid to see details and recommended mitigations.
              </div>
            </div>
          </div>
        </div>

        {/* View toggle */}
        <div className="max-w-[1100px] mx-auto flex justify-end mb-4">
          <div className="flex bg-white/[0.04] rounded-lg p-1 gap-1">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer border-none transition-all ${
                view === "grid" ? "bg-[#2EC4B6]/15 text-[#2EC4B6]" : "bg-transparent text-white/40 hover:text-white/60"
              }`}
            >
              Heat Map
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer border-none transition-all ${
                view === "table" ? "bg-[#2EC4B6]/15 text-[#2EC4B6]" : "bg-transparent text-white/40 hover:text-white/60"
              }`}
            >
              Risk Register
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1100px] mx-auto">
          {view === "grid" ? (
            <div className="grid md:grid-cols-[1fr_380px] gap-6">
              {/* Heat map grid */}
              <div className="p-6 rounded-xl bg-[#162230] border border-white/[0.06]">
                <HeatMapGrid
                  onCellClick={(r) => setSelectedRisk(r.id)}
                  selectedRisk={selectedRisk}
                />
              </div>

              {/* Risk detail panel */}
              <div>
                {activeRisk ? (
                  <RiskDetail risk={activeRisk} />
                ) : (
                  <div className="rounded-xl bg-[#162230] border border-white/[0.06] p-8 text-center">
                    <div className="text-3xl mb-3">👈</div>
                    <div className="text-sm text-white/40">
                      Click a risk on the heat map to see details
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#162230] border border-white/[0.06] p-6">
              <RiskTable />
            </div>
          )}
        </div>

        {/* Category summary */}
        <div className="max-w-[1100px] mx-auto mt-8 grid md:grid-cols-3 gap-5">
          {[
            {
              icon: "📑", title: "Tax & Reporting",
              count: risks.filter((r) => r.category === "Tax & Reporting").length,
              topRisk: "Transfer Pricing Non-Compliance",
              description: "ITBMS, transfer pricing, statutory deadlines — where most Panama SEMs get caught off guard.",
            },
            {
              icon: "⚙️", title: "Operational Risk",
              count: risks.filter((r) => r.category === "Operational Risk").length,
              topRisk: "Key-Person Dependency",
              description: "Manual processes, system gaps, and tribal knowledge — the silent killers of operational efficiency.",
            },
            {
              icon: "⚖️", title: "Regulatory & Compliance",
              count: risks.filter((r) => r.category === "Regulatory & Compliance").length,
              topRisk: "HQ vs. Local Policy Gaps",
              description: "Global policies vs. local law, internal controls, AML — where non-compliance becomes expensive.",
            },
          ].map((cat) => (
            <div key={cat.title} className="p-5 rounded-xl bg-[#162230] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-bold text-[#F0F4F8]">{cat.title}</span>
                <span className="text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-md ml-auto">
                  {cat.count} risks
                </span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-2">{cat.description}</p>
              <div className="text-[10px] text-white/25">
                <span className="text-white/40 font-semibold">Top risk:</span> {cat.topRisk}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-[1100px] mx-auto mt-10 text-center">
          <div className="p-8 rounded-xl bg-[#162230] border border-white/[0.06]">
            <h3 className="text-xl font-bold text-[#F0F4F8] mb-3">
              Want this customized for your organization?
            </h3>
            <p className="text-sm text-white/40 mb-6 max-w-md mx-auto leading-relaxed">
              This template shows the methodology. A real engagement starts with your specific risk
              landscape — your systems, your regulatory exposure, your operational reality.
            </p>
            <a
              href="https://wa.me/50766708030?text=Hi%20Uwe%2C%20I%20saw%20your%20Risk%20Heat%20Map%20template.%20I%E2%80%99d%20like%20to%20discuss%20a%20risk%20assessment%20for%20my%20organization."
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-3.5 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg no-underline transition-colors"
            >
              Request a Custom Risk Assessment
            </a>
          </div>
        </div>

        {/* Back */}
        <div className="text-center mt-8">
          <Link href="/v2" className="text-sm text-white/40 hover:text-[#2EC4B6] transition-colors no-underline">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
