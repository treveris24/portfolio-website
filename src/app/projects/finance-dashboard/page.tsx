"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

function formatCurrency(num: number): string {
  const abs = Math.abs(num);
  if (abs >= 1000000) return (num < 0 ? "-" : "") + "$" + (abs / 1000000).toFixed(1) + "M";
  if (abs >= 1000) return (num < 0 ? "-" : "") + "$" + (abs / 1000).toFixed(0) + "K";
  return "$" + num.toFixed(0);
}

function formatPct(num: number): string {
  return (num >= 0 ? "+" : "") + num.toFixed(1) + "%";
}

// ── Tab Button ──
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
        active
          ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
          : "text-gray-500 hover:text-gray-300 border border-transparent"
      }`}
    >
      {label}
    </button>
  );
}

// ── KPI Card ──
function KPICard({
  label,
  value,
  change,
  subtitle,
}: {
  label: string;
  value: string;
  change?: number;
  subtitle?: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change !== undefined && (
          <span
            className={`text-sm font-semibold ${
              change >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatPct(change)}
          </span>
        )}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
      )}
    </div>
  );
}

// ── Bar Chart (SVG) ──
function BarChart({
  data,
  labels,
  title,
  color = "#3b82f6",
  showValues = true,
}: {
  data: number[];
  labels: string[];
  title: string;
  color?: string;
  showValues?: boolean;
}) {
  const width = 500;
  const height = 200;
  const pad = { top: 20, right: 10, bottom: 35, left: 55 };
  const iw = width - pad.left - pad.right;
  const ih = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map(Math.abs)) * 1.2;
  const barWidth = iw / data.length - 8;

  return (
    <div>
      <div className="text-sm font-bold text-gray-300 mb-3">{title}</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const val = maxVal * pct;
          const y = pad.top + ih - (val / maxVal) * ih;
          return (
            <g key={pct}>
              <line x1={pad.left} y1={y} x2={pad.left + iw} y2={y} stroke="rgba(255,255,255,0.04)" />
              <text x={pad.left - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-gray-600 font-medium">
                {formatCurrency(val)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((v, i) => {
          const x = pad.left + (i * iw) / data.length + 4;
          const barH = (Math.abs(v) / maxVal) * ih;
          const y = pad.top + ih - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barH} rx={3} fill={color} opacity={0.8} />
              {showValues && (
                <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" className="text-[9px] fill-white font-bold">
                  {formatCurrency(v)}
                </text>
              )}
              <text
                x={x + barWidth / 2}
                y={pad.top + ih + 16}
                textAnchor="middle"
                className="text-[9px] fill-gray-500 font-semibold"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Dual Bar Chart (Actual vs Budget) ──
function DualBarChart({
  actual,
  budget,
  labels,
  title,
}: {
  actual: number[];
  budget: number[];
  labels: string[];
  title: string;
}) {
  const width = 500;
  const height = 220;
  const pad = { top: 30, right: 10, bottom: 35, left: 55 };
  const iw = width - pad.left - pad.right;
  const ih = height - pad.top - pad.bottom;
  const allVals = [...actual, ...budget];
  const maxVal = Math.max(...allVals) * 1.15;
  const groupWidth = iw / labels.length;
  const barW = groupWidth * 0.3;

  return (
    <div>
      <div className="text-sm font-bold text-gray-300 mb-3">{title}</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Legend */}
        <rect x={pad.left} y={5} width={10} height={10} rx={2} fill="#3b82f6" opacity={0.8} />
        <text x={pad.left + 14} y={14} className="text-[9px] fill-gray-400 font-semibold">Actual</text>
        <rect x={pad.left + 60} y={5} width={10} height={10} rx={2} fill="#6b7280" opacity={0.5} />
        <text x={pad.left + 74} y={14} className="text-[9px] fill-gray-400 font-semibold">Budget</text>

        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const val = maxVal * pct;
          const y = pad.top + ih - (val / maxVal) * ih;
          return (
            <g key={pct}>
              <line x1={pad.left} y1={y} x2={pad.left + iw} y2={y} stroke="rgba(255,255,255,0.04)" />
              <text x={pad.left - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-gray-600 font-medium">
                {formatCurrency(val)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {labels.map((label, i) => {
          const gx = pad.left + i * groupWidth;
          const aH = (actual[i] / maxVal) * ih;
          const bH = (budget[i] / maxVal) * ih;
          return (
            <g key={i}>
              <rect
                x={gx + groupWidth * 0.15}
                y={pad.top + ih - aH}
                width={barW}
                height={aH}
                rx={3}
                fill="#3b82f6"
                opacity={0.8}
              />
              <rect
                x={gx + groupWidth * 0.15 + barW + 3}
                y={pad.top + ih - bH}
                width={barW}
                height={bH}
                rx={3}
                fill="#6b7280"
                opacity={0.4}
              />
              <text
                x={gx + groupWidth / 2}
                y={pad.top + ih + 16}
                textAnchor="middle"
                className="text-[9px] fill-gray-500 font-semibold"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Financial Statement Table ──
function StatementTable({
  rows,
  title,
}: {
  rows: { label: string; values: number[]; bold?: boolean; indent?: boolean }[];
  title: string;
}) {
  const quarters = ["Q1", "Q2", "Q3", "Q4", "FY"];

  return (
    <div>
      <div className="text-sm font-bold text-gray-300 mb-3">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 font-bold py-2 pr-4 w-48">
                Line Item
              </th>
              {quarters.map((q) => (
                <th key={q} className="text-right text-gray-400 font-bold py-2 px-3">
                  {q}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-white/5 ${row.bold ? "bg-white/[0.02]" : ""}`}
              >
                <td
                  className={`py-2 pr-4 ${row.bold ? "text-white font-bold" : "text-gray-400"} ${row.indent ? "pl-4" : ""}`}
                >
                  {row.label}
                </td>
                {row.values.map((v, j) => (
                  <td
                    key={j}
                    className={`text-right py-2 px-3 ${
                      row.bold ? "text-white font-bold" : v < 0 ? "text-red-400" : "text-gray-300"
                    }`}
                  >
                    {formatCurrency(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Variance Table ──
function VarianceTable() {
  const items = [
    { item: "Revenue", actual: 48200000, budget: 50000000 },
    { item: "COGS", actual: 28500000, budget: 29000000 },
    { item: "Gross Profit", actual: 19700000, budget: 21000000 },
    { item: "Operating Expenses", actual: 12800000, budget: 13000000 },
    { item: "EBITDA", actual: 6900000, budget: 8000000 },
    { item: "Net Income", actual: 4100000, budget: 5200000 },
  ];

  return (
    <div>
      <div className="text-sm font-bold text-gray-300 mb-3">
        Full Year Variance Analysis — Actual vs. Budget
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 font-bold py-2">Item</th>
              <th className="text-right text-gray-400 font-bold py-2 px-3">Actual</th>
              <th className="text-right text-gray-400 font-bold py-2 px-3">Budget</th>
              <th className="text-right text-gray-400 font-bold py-2 px-3">Variance $</th>
              <th className="text-right text-gray-400 font-bold py-2 px-3">Variance %</th>
              <th className="text-right text-gray-400 font-bold py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const varDollar = row.actual - row.budget;
              const varPct = ((row.actual - row.budget) / row.budget) * 100;
              const isExpense = row.item === "COGS" || row.item === "Operating Expenses";
              const favorable = isExpense ? varDollar <= 0 : varDollar >= 0;

              return (
                <tr key={row.item} className="border-b border-white/5">
                  <td className="py-2 text-gray-300 font-semibold">{row.item}</td>
                  <td className="text-right py-2 px-3 text-white font-semibold">
                    {formatCurrency(row.actual)}
                  </td>
                  <td className="text-right py-2 px-3 text-gray-500">
                    {formatCurrency(row.budget)}
                  </td>
                  <td className={`text-right py-2 px-3 font-semibold ${favorable ? "text-emerald-400" : "text-red-400"}`}>
                    {formatCurrency(varDollar)}
                  </td>
                  <td className={`text-right py-2 px-3 font-semibold ${favorable ? "text-emerald-400" : "text-red-400"}`}>
                    {formatPct(varPct)}
                  </td>
                  <td className="text-right py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        favorable
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {favorable ? "Favorable" : "Unfavorable"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Dashboard ──
export default function FinanceDashboardPage() {
  const [activeView, setActiveView] = useState<"overview" | "pnl" | "balance" | "cashflow" | "variance">("overview");

  const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];
  const revenueActual = [10800000, 11500000, 12900000, 13000000];
  const revenueBudget = [11500000, 12000000, 13000000, 13500000];
  const netIncomeData = [800000, 950000, 1200000, 1150000];
  const cashFlowData = [1200000, 1400000, 1800000, 1600000];

  // P&L Statement
  const pnlRows = [
    { label: "Revenue", values: [10800000, 11500000, 12900000, 13000000, 48200000], bold: true },
    { label: "Cost of Goods Sold", values: [-6800000, -7000000, -7500000, -7200000, -28500000], indent: true },
    { label: "Gross Profit", values: [4000000, 4500000, 5400000, 5800000, 19700000], bold: true },
    { label: "Sales & Marketing", values: [-1200000, -1300000, -1400000, -1350000, -5250000], indent: true },
    { label: "General & Admin", values: [-900000, -950000, -1000000, -1050000, -3900000], indent: true },
    { label: "R&D", values: [-800000, -850000, -950000, -1050000, -3650000], indent: true },
    { label: "Operating Income", values: [1100000, 1400000, 2050000, 2350000, 6900000], bold: true },
    { label: "Interest & Other", values: [-150000, -160000, -170000, -180000, -660000], indent: true },
    { label: "Tax Expense", values: [-150000, -290000, -480000, -520000, -1440000], indent: true },
    { label: "Net Income", values: [800000, 950000, 1400000, 1650000, 4800000], bold: true },
  ];

  // Balance Sheet
  const balanceRows = [
    { label: "Cash & Equivalents", values: [8200000, 9100000, 10400000, 11200000, 11200000] },
    { label: "Accounts Receivable", values: [6500000, 7200000, 7800000, 8100000, 8100000] },
    { label: "Inventory", values: [4200000, 4500000, 4800000, 4600000, 4600000] },
    { label: "Total Current Assets", values: [18900000, 20800000, 23000000, 23900000, 23900000], bold: true },
    { label: "PP&E (net)", values: [12000000, 11500000, 11000000, 10500000, 10500000] },
    { label: "Total Assets", values: [30900000, 32300000, 34000000, 34400000, 34400000], bold: true },
    { label: "Accounts Payable", values: [4500000, 4800000, 5200000, 5000000, 5000000] },
    { label: "Short-term Debt", values: [3000000, 2800000, 2500000, 2200000, 2200000] },
    { label: "Total Current Liabilities", values: [7500000, 7600000, 7700000, 7200000, 7200000], bold: true },
    { label: "Long-term Debt", values: [8000000, 7500000, 7000000, 6500000, 6500000] },
    { label: "Total Equity", values: [15400000, 17200000, 19300000, 20700000, 20700000], bold: true },
  ];

  // Cash Flow
  const cashFlowRows = [
    { label: "Net Income", values: [800000, 950000, 1400000, 1650000, 4800000] },
    { label: "Depreciation", values: [500000, 500000, 500000, 500000, 2000000], indent: true },
    { label: "Working Capital Changes", values: [-200000, -350000, -300000, 250000, -600000], indent: true },
    { label: "Cash from Operations", values: [1100000, 1100000, 1600000, 2400000, 6200000], bold: true },
    { label: "Capital Expenditures", values: [-400000, -350000, -300000, -350000, -1400000], indent: true },
    { label: "Cash from Investing", values: [-400000, -350000, -300000, -350000, -1400000], bold: true },
    { label: "Debt Repayment", values: [-500000, -500000, -500000, -500000, -2000000], indent: true },
    { label: "Cash from Financing", values: [-500000, -500000, -500000, -500000, -2000000], bold: true },
    { label: "Net Cash Change", values: [200000, 250000, 800000, 1550000, 2800000], bold: true },
  ];

  const insights = [
    {
      icon: "📉",
      text: "Revenue came in 3.6% below budget for the full year ($48.2M vs. $50.0M target). The shortfall was concentrated in Q1 and Q2, with Q3-Q4 nearly on track. Investigate seasonal demand patterns and sales pipeline for root cause.",
    },
    {
      icon: "✅",
      text: "COGS was $500K favorable vs. budget, indicating effective procurement and production cost control. Gross margin improved from 37% in Q1 to 44.6% in Q4 — a strong positive trend.",
    },
    {
      icon: "🟡",
      text: "Net income of $4.8M fell short of the $5.2M target primarily due to the revenue miss. However, operating expense discipline partially offset the gap. R&D spending increased as planned.",
    },
    {
      icon: "💰",
      text: "Cash position strengthened significantly from $8.2M to $11.2M through the year. Operating cash flow of $6.2M funded all capex and debt repayment with room to spare. Strong liquidity position.",
    },
    {
      icon: "💡",
      text: "Recommended actions: (1) Deep dive into Q1-Q2 revenue drivers, (2) Continue COGS optimization initiatives, (3) Review R&D spend ROI, (4) Consider accelerating debt repayment given strong cash generation.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Portfolio
          </Link>
          <span className="text-sm text-gray-500">Data Visualization</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs uppercase tracking-wider">
            Interactive Finance Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Corporate Finance Dashboard
          </h1>
          <p className="text-gray-400 max-w-2xl font-medium">
            Full-year financial performance for a fictional mid-market company.
            Explore P&L, Balance Sheet, Cash Flow, and Variance Analysis across
            four quarters. Click the tabs below to switch views.
          </p>
        </div>

        {/* Company Header */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="text-lg font-bold">TechVista Solutions Inc.</div>
            <div className="text-sm text-gray-500">
              SaaS / Enterprise Software — Fiscal Year 2025
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
              Annual Revenue: $48.2M
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              Net Income: $4.8M
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: "overview", label: "Overview" },
            { key: "pnl", label: "P&L Statement" },
            { key: "balance", label: "Balance Sheet" },
            { key: "cashflow", label: "Cash Flow" },
            { key: "variance", label: "Variance Analysis" },
          ].map((tab) => (
            <TabButton
              key={tab.key}
              label={tab.label}
              active={activeView === tab.key}
              onClick={() => setActiveView(tab.key as typeof activeView)}
            />
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeView === "overview" && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <KPICard label="Revenue" value="$48.2M" change={-3.6} subtitle="vs. $50.0M budget" />
              <KPICard label="Gross Margin" value="40.9%" change={3.2} subtitle="Up from 37.0% Q1" />
              <KPICard label="Net Income" value="$4.8M" change={-7.7} subtitle="vs. $5.2M budget" />
              <KPICard label="Cash Position" value="$11.2M" change={36.6} subtitle="Up from $8.2M" />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <DualBarChart
                  actual={revenueActual}
                  budget={revenueBudget}
                  labels={quarterLabels}
                  title="Revenue — Actual vs. Budget"
                />
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <BarChart
                  data={netIncomeData}
                  labels={quarterLabels}
                  title="Net Income by Quarter"
                  color="#22c55e"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <BarChart
                  data={cashFlowData}
                  labels={quarterLabels}
                  title="Operating Cash Flow by Quarter"
                  color="#06b6d4"
                />
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <BarChart
                  data={[37.0, 39.1, 41.9, 44.6]}
                  labels={quarterLabels}
                  title="Gross Margin % Trend"
                  color="#f59e0b"
                  showValues={true}
                />
              </div>
            </div>
          </>
        )}

        {/* ── P&L Tab ── */}
        {activeView === "pnl" && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
            <StatementTable rows={pnlRows} title="Income Statement — FY2025 (in USD)" />
          </div>
        )}

        {/* ── Balance Sheet Tab ── */}
        {activeView === "balance" && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
            <StatementTable rows={balanceRows} title="Balance Sheet — FY2025 (in USD)" />
          </div>
        )}

        {/* ── Cash Flow Tab ── */}
        {activeView === "cashflow" && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
            <StatementTable rows={cashFlowRows} title="Cash Flow Statement — FY2025 (in USD)" />
          </div>
        )}

        {/* ── Variance Tab ── */}
        {activeView === "variance" && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
            <VarianceTable />
          </div>
        )}

        {/* Insights — Always visible */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-widest text-gray-400 mb-2">
            CFO Commentary & Recommendations
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            Key takeaways from the fiscal year performance
          </p>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5"
              >
                <span className="text-lg flex-shrink-0">{insight.icon}</span>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600 text-sm">
          Built by Uwe Anell — Finance Leader & PMP® Professional
        </div>
      </div>
    </main>
  );
}
