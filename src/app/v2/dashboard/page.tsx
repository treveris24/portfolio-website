"use client";

import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "before">("dashboard");

  return (
    <main className="min-h-screen bg-[#0F1923] text-[#F0F4F8]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1923]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3.5">
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
        <div className="max-w-[1200px] mx-auto text-center mb-10">
          <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-3">
            Live Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-4">
            From 3-Day Excel Consolidation to Real-Time Dashboard
          </h1>
          <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed">
            This interactive Power BI dashboard shows a fictional Latin American regional P&L
            across 5 countries and 12 months. Click, filter, and drill down — exactly how I'd
            present insights to senior leadership on Day 1.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="max-w-[1200px] mx-auto flex justify-center mb-6">
          <div className="flex bg-white/[0.04] rounded-lg p-1 gap-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-2 rounded-md text-sm font-semibold cursor-pointer border-none transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#2EC4B6]/15 text-[#2EC4B6]"
                  : "bg-transparent text-white/40 hover:text-white/60"
              }`}
            >
              📊 The After: Live Dashboard
            </button>
            <button
              onClick={() => setActiveTab("before")}
              className={`px-6 py-2 rounded-md text-sm font-semibold cursor-pointer border-none transition-all ${
                activeTab === "before"
                  ? "bg-red-500/15 text-red-400"
                  : "bg-transparent text-white/40 hover:text-white/60"
              }`}
            >
              📋 The Before: Manual Process
            </button>
          </div>
        </div>

        {activeTab === "dashboard" ? (
          /* ─── DASHBOARD VIEW ─── */
          <div className="max-w-[1200px] mx-auto">
            {/* Context bar */}
            <div className="mb-6 p-4 rounded-xl bg-[#2EC4B6]/[0.06] border border-[#2EC4B6]/[0.15] flex items-center gap-4">
              <span className="text-lg flex-shrink-0">💡</span>
              <div className="text-sm text-white/55">
                <span className="text-white/80 font-semibold">Try it:</span> Use the Country
                slicer to filter by region. Click on chart elements to cross-filter.
                Navigate between pages using the tabs at the bottom of the dashboard.
              </div>
            </div>

            {/* Power BI Embed */}
            <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-[#162230]">
              <iframe
                title="Website_PBI_Dashboard"
                width="100%"
                height="600"
                src="https://app.powerbi.com/view?r=eyJrIjoiNTY4YWRjOGItOTc3OC00MWFiLWJkMWEtZTZiMTE1NTI1ZTk4IiwidCI6ImYwYzBlNmQ2LTE3MjAtNGVmZC1iZTZmLWRkOTM1ZmVmYmE5ZiJ9"
                frameBorder="0"
                allowFullScreen={true}
                style={{ display: "block" }}
              />
            </div>

            {/* Dashboard details */}
            <div className="mt-8 grid md:grid-cols-3 gap-5">
              <div className="p-5 rounded-xl bg-[#162230] border border-white/[0.06]">
                <div className="text-lg mb-2">📈</div>
                <div className="text-sm font-bold text-[#F0F4F8] mb-2">Page 1: Revenue Overview</div>
                <div className="text-xs text-white/40 leading-relaxed">
                  Monthly revenue trends by country with KPI cards. Mexico's growth and Colombia's decline visible at a glance.
                </div>
              </div>
              <div className="p-5 rounded-xl bg-[#162230] border border-white/[0.06]">
                <div className="text-lg mb-2">💰</div>
                <div className="text-sm font-bold text-[#F0F4F8] mb-2">Page 2: Margin & OPEX</div>
                <div className="text-xs text-white/40 leading-relaxed">
                  Margin trends showing Colombia's erosion from 38% to 30%. OPEX actual vs budget with cost center breakdown.
                </div>
              </div>
              <div className="p-5 rounded-xl bg-[#162230] border border-white/[0.06]">
                <div className="text-lg mb-2">🔍</div>
                <div className="text-sm font-bold text-[#F0F4F8] mb-2">Page 3: Product Mix & PVM</div>
                <div className="text-xs text-white/40 leading-relaxed">
                  Revenue by product line revealing Colombia's Hardware dependency. Price/Volume/Mix decomposition per country.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ─── BEFORE VIEW ─── */
          <div className="max-w-[900px] mx-auto">
            <div className="rounded-xl bg-red-500/[0.04] border border-red-500/[0.15] p-8">
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">😩</div>
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  The Manual Reality: 3 Days Every Month
                </h3>
                <p className="text-sm text-white/40 max-w-lg mx-auto">
                  This is what the same reporting looked like before automation.
                  Sound familiar?
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  {
                    day: "Day 1",
                    title: "Data Collection",
                    items: [
                      "Email 5 country controllers requesting their monthly data",
                      "Wait for responses (some arrive in different formats)",
                      "Download reports from 3 different ERP systems",
                      "Copy-paste data into the master Excel consolidation file",
                      "Fix broken formulas from last month's changes",
                    ],
                  },
                  {
                    day: "Day 2",
                    title: "Reconciliation & Analysis",
                    items: [
                      "Reconcile intercompany eliminations manually",
                      "Investigate data discrepancies between systems",
                      "Build variance analysis (Actual vs Budget) from scratch",
                      "Calculate Price/Volume/Mix decomposition in Excel",
                      "Format charts and tables for the executive presentation",
                    ],
                  },
                  {
                    day: "Day 3",
                    title: "Reporting & Revisions",
                    items: [
                      "Present draft to Finance Director — receive revision requests",
                      "Re-pull data for two countries that sent corrections",
                      "Update all affected charts and variance commentary",
                      "Final formatting pass — ensure numbers tie across all tabs",
                      "Submit to HQ 4 hours before deadline, exhausted",
                    ],
                  },
                ].map((day) => (
                  <div
                    key={day.day}
                    className="p-5 rounded-xl bg-[#0F1923] border border-red-500/[0.08]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-red-400/60 bg-red-500/10 px-2.5 py-1 rounded-md">
                        {day.day}
                      </span>
                      <span className="text-sm font-bold text-white/70">
                        {day.title}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {day.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-red-400/40 text-xs mt-0.5">→</span>
                          <span className="text-sm text-white/45 leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-red-500/[0.08] border border-red-500/[0.12] text-center">
                <div className="text-sm text-red-400/80 font-semibold">
                  ⏱ Total: ~24 hours of analyst time · Every single month · High error rate · Zero drill-down capability
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="px-6 py-3 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-sm rounded-lg border-none cursor-pointer transition-colors"
                >
                  Now See the After →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-[1200px] mx-auto mt-10 text-center">
          <div className="p-8 rounded-xl bg-[#162230] border border-white/[0.06]">
            <h3 className="text-xl font-bold text-[#F0F4F8] mb-3">
              Your regional reporting could look like this.
            </h3>
            <p className="text-sm text-white/40 mb-6 max-w-md mx-auto leading-relaxed">
              I build dashboards that replace manual consolidation, surface the insights
              that matter, and give your leadership team self-service access to real-time data.
            </p>
            <a
              href="https://wa.me/50766708030?text=Hi%20Uwe%2C%20I%20saw%20your%20Power%20BI%20dashboard%20demo.%20I%E2%80%99d%20like%20to%20discuss%20how%20you%20could%20build%20something%20similar%20for%20my%20organization."
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-3.5 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg no-underline transition-colors"
            >
              Let's Discuss Your Reporting Needs
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
