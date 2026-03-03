"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════

const COMPANY = "NovaTech Industries";
const PERIOD = "December 2025 (FY2025)";

// Monthly actuals (Jan-Dec)
const MONTHLY_REVENUE = [8.1, 7.8, 9.2, 8.9, 9.5, 10.1, 9.8, 10.4, 11.2, 10.8, 11.5, 12.8];
const MONTHLY_REVENUE_PY = [7.5, 7.2, 8.4, 8.1, 8.7, 9.2, 9.0, 9.5, 10.1, 9.8, 10.3, 11.2];
const MONTHLY_FORECAST = [8.5, 8.0, 9.5, 9.2, 9.8, 10.5, 10.2, 10.8, 11.5, 11.0, 12.0, 13.2];
const MONTHLY_COGS = [4.9, 4.7, 5.5, 5.3, 5.6, 5.9, 5.7, 6.1, 6.5, 6.3, 6.7, 7.4];
const MONTHLY_OPEX = [2.1, 2.0, 2.3, 2.2, 2.4, 2.5, 2.4, 2.6, 2.8, 2.7, 2.9, 3.2];

// Quarterly aggregation helper
function sumQ(arr: number[], q: number): number {
  const start = q * 3;
  return arr.slice(start, start + 3).reduce((a, b) => a + b, 0);
}
function sumFY(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

// Sales data
interface SalesAgent {
  name: string;
  region: string;
  manager: string;
  quota: number;
  actual: number;
  pipelineValue: number;
  deals: number;
  winRate: number;
  avgDealSize: number;
  trend: number[]; // last 6 months
}

interface SalesManager {
  name: string;
  region: string;
  quota: number;
  actual: number;
  agents: SalesAgent[];
}

const SALES_DATA: SalesManager[] = [
  {
    name: "Sarah Chen",
    region: "Americas",
    quota: 42.0,
    actual: 45.2,
    agents: [
      { name: "Mike Rodriguez", region: "Americas", manager: "Sarah Chen", quota: 9.5, actual: 11.2, pipelineValue: 4.8, deals: 28, winRate: 34, avgDealSize: 0.40, trend: [1.5, 1.7, 1.8, 1.9, 2.1, 2.2] },
      { name: "Jennifer Walsh", region: "Americas", manager: "Sarah Chen", quota: 9.0, actual: 10.1, pipelineValue: 3.5, deals: 24, winRate: 31, avgDealSize: 0.42, trend: [1.4, 1.5, 1.6, 1.7, 1.8, 1.9] },
      { name: "David Kim", region: "Americas", manager: "Sarah Chen", quota: 8.5, actual: 9.3, pipelineValue: 4.2, deals: 22, winRate: 29, avgDealSize: 0.42, trend: [1.3, 1.4, 1.5, 1.5, 1.6, 1.8] },
      { name: "Lisa Thompson", region: "Americas", manager: "Sarah Chen", quota: 8.0, actual: 8.4, pipelineValue: 3.1, deals: 20, winRate: 27, avgDealSize: 0.42, trend: [1.2, 1.3, 1.4, 1.4, 1.5, 1.6] },
      { name: "Carlos Mendez", region: "Americas", manager: "Sarah Chen", quota: 7.0, actual: 6.2, pipelineValue: 2.1, deals: 15, winRate: 22, avgDealSize: 0.41, trend: [1.2, 1.1, 1.0, 1.0, 0.9, 1.0] },
    ],
  },
  {
    name: "Thomas Weber",
    region: "EMEA",
    quota: 38.0,
    actual: 34.5,
    agents: [
      { name: "Anna Schmidt", region: "EMEA", manager: "Thomas Weber", quota: 8.5, actual: 9.1, pipelineValue: 3.8, deals: 21, winRate: 32, avgDealSize: 0.43, trend: [1.3, 1.4, 1.5, 1.5, 1.6, 1.7] },
      { name: "James Morrison", region: "EMEA", manager: "Thomas Weber", quota: 8.0, actual: 7.8, pipelineValue: 3.2, deals: 19, winRate: 28, avgDealSize: 0.41, trend: [1.2, 1.3, 1.3, 1.3, 1.3, 1.4] },
      { name: "Sophie Dubois", region: "EMEA", manager: "Thomas Weber", quota: 7.5, actual: 7.2, pipelineValue: 2.8, deals: 17, winRate: 26, avgDealSize: 0.42, trend: [1.1, 1.2, 1.2, 1.2, 1.2, 1.3] },
      { name: "Raj Patel", region: "EMEA", manager: "Thomas Weber", quota: 7.5, actual: 5.8, pipelineValue: 1.9, deals: 13, winRate: 20, avgDealSize: 0.45, trend: [1.1, 1.0, 1.0, 0.9, 0.9, 0.9] },
      { name: "Elena Volkov", region: "EMEA", manager: "Thomas Weber", quota: 6.5, actual: 4.6, pipelineValue: 1.5, deals: 10, winRate: 18, avgDealSize: 0.46, trend: [1.0, 0.9, 0.8, 0.8, 0.7, 0.7] },
    ],
  },
  {
    name: "Akiko Tanaka",
    region: "APAC",
    quota: 30.0,
    actual: 32.4,
    agents: [
      { name: "Wei Zhang", region: "APAC", manager: "Akiko Tanaka", quota: 7.0, actual: 8.5, pipelineValue: 4.1, deals: 25, winRate: 36, avgDealSize: 0.34, trend: [1.1, 1.2, 1.3, 1.4, 1.5, 1.8] },
      { name: "Priya Sharma", region: "APAC", manager: "Akiko Tanaka", quota: 6.5, actual: 7.3, pipelineValue: 3.4, deals: 22, winRate: 33, avgDealSize: 0.33, trend: [1.0, 1.1, 1.2, 1.2, 1.3, 1.5] },
      { name: "Kenji Nakamura", region: "APAC", manager: "Akiko Tanaka", quota: 6.0, actual: 6.8, pipelineValue: 2.9, deals: 20, winRate: 30, avgDealSize: 0.34, trend: [1.0, 1.0, 1.1, 1.1, 1.2, 1.4] },
      { name: "Min-Jun Park", region: "APAC", manager: "Akiko Tanaka", quota: 5.5, actual: 5.6, pipelineValue: 2.2, deals: 16, winRate: 25, avgDealSize: 0.35, trend: [0.9, 0.9, 0.9, 0.9, 1.0, 1.0] },
      { name: "Tom Nguyen", region: "APAC", manager: "Akiko Tanaka", quota: 5.0, actual: 4.2, pipelineValue: 1.6, deals: 11, winRate: 19, avgDealSize: 0.38, trend: [0.8, 0.8, 0.7, 0.7, 0.6, 0.6] },
    ],
  },
];

// Products
const PRODUCTS = [
  { name: "Cloud Platform", revenue: 38.5, revenuePY: 32.1, margin: 68, forecast: 40.0 },
  { name: "Data Analytics Suite", revenue: 28.2, revenuePY: 24.8, margin: 72, forecast: 29.0 },
  { name: "Security Solutions", revenue: 22.8, revenuePY: 19.5, margin: 64, forecast: 24.5 },
  { name: "IoT & Edge", revenue: 15.3, revenuePY: 14.2, margin: 45, forecast: 16.0 },
  { name: "Legacy Services", revenue: 7.3, revenuePY: 8.3, margin: 38, forecast: 8.0 },
];

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

function fmt(n: number, prefix = "$"): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1000) return sign + prefix + (abs / 1000).toFixed(1) + "B";
  if (abs >= 1) return sign + prefix + abs.toFixed(1) + "M";
  return sign + prefix + (abs * 1000).toFixed(0) + "K";
}

function fmtPct(n: number): string {
  return (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
}

function varianceColor(val: number, inverse = false): string {
  const check = inverse ? -val : val;
  if (check > 2) return "text-emerald-400";
  if (check > 0) return "text-emerald-400/70";
  if (check > -2) return "text-red-400/70";
  return "text-red-400";
}

function statusBadge(val: number, inverse = false): string {
  const check = inverse ? -val : val;
  if (check >= 0) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
}

// ══════════════════════════════════════════════════════════════
// MINI SPARKLINE COMPONENT
// ══════════════════════════════════════════════════════════════

function Sparkline({ data, color = "#3b82f6", width = 80, height = 24 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="2" fill={color} />
    </svg>
  );
}

// Mini bar component
function MiniBar({ pct, color = "bg-blue-500" }: { pct: number; color?: string }) {
  return (
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }} />
    </div>
  );
}

// Gauge component
function GaugeRing({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = (value / max) * 100;
  const displayPct = Math.min(pct, 100);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (displayPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="88" height="88" className="transform -rotate-90">
          <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="44" cy="44" r="36" fill="none" stroke={color} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">{pct.toFixed(0)}%</div>
      </div>
      <div className="text-sm text-white font-bold mt-2">{label}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 1: EXECUTIVE OVERVIEW
// ══════════════════════════════════════════════════════════════

function ExecutiveOverview() {
  const totalRevenue = sumFY(MONTHLY_REVENUE);
  const totalRevenuePY = sumFY(MONTHLY_REVENUE_PY);
  const totalForecast = sumFY(MONTHLY_FORECAST);
  const totalCOGS = sumFY(MONTHLY_COGS);
  const totalOpex = sumFY(MONTHLY_OPEX);
  const grossProfit = totalRevenue - totalCOGS;
  const grossMarginPct = (grossProfit / totalRevenue) * 100;
  const ebitda = grossProfit - totalOpex;
  const netIncome = ebitda * 0.72; // ~28% tax rate
  const yoyGrowth = ((totalRevenue - totalRevenuePY) / totalRevenuePY) * 100;
  const fcfForecastVar = ((totalRevenue - totalForecast) / totalForecast) * 100;

  const criticalKPIs = [
    {
      severity: "high",
      icon: "🔴",
      title: "EMEA Region Below Quota",
      detail: `EMEA at $34.5M vs $38.0M quota (${((34.5 / 38.0 - 1) * 100).toFixed(1)}%). Manager Thomas Weber's team has 2 agents significantly underperforming. Raj Patel at 77% and Elena Volkov at 71% of quota.`,
      action: "Schedule pipeline review with EMEA leadership. Consider territory rebalancing.",
    },
    {
      severity: "high",
      icon: "🔴",
      title: "Revenue vs. Forecast Gap — Q4",
      detail: `Q4 revenue of $${sumQ(MONTHLY_REVENUE, 3).toFixed(1)}M missed forecast of $${sumQ(MONTHLY_FORECAST, 3).toFixed(1)}M by ${(((sumQ(MONTHLY_REVENUE, 3) / sumQ(MONTHLY_FORECAST, 3)) - 1) * 100).toFixed(1)}%. December showed recovery but was not enough to close the gap.`,
      action: "Review Q1 2026 forecast assumptions. Adjust pipeline weighting.",
    },
    {
      severity: "medium",
      icon: "🟡",
      title: "Legacy Services Revenue Declining",
      detail: "Legacy Services at $7.3M vs $8.3M prior year (−12.0%). Margin compression to 38%. Migration pipeline needs acceleration.",
      action: "Fast-track customer migration program. Target 40% reduction in legacy book by Q2 2026.",
    },
    {
      severity: "medium",
      icon: "🟡",
      title: "DSO Increasing — Cash Collection Slowing",
      detail: "Days Sales Outstanding increased from 42 to 48 days Y/Y. Approximately $3.2M in incremental working capital tied up.",
      action: "Review AR aging >60 days. Implement early payment discount program.",
    },
    {
      severity: "low",
      icon: "🟢",
      title: "APAC Exceeding Targets",
      detail: "APAC at $32.4M vs $30.0M quota (+8.0%). Wei Zhang and Priya Sharma driving outperformance. Strong pipeline indicates continued momentum.",
      action: "Replicate APAC go-to-market playbook in underperforming regions.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Revenue (FY)", value: fmt(totalRevenue), sub: `${fmtPct(yoyGrowth)} Y/Y`, spark: MONTHLY_REVENUE, color: yoyGrowth >= 0 ? "text-emerald-400" : "text-red-400" },
          { label: "Gross Margin", value: grossMarginPct.toFixed(1) + "%", sub: "vs 42.1% PY", spark: MONTHLY_REVENUE.map((r, i) => ((r - MONTHLY_COGS[i]) / r) * 100), color: "text-emerald-400" },
          { label: "EBITDA", value: fmt(ebitda), sub: `${((ebitda / totalRevenue) * 100).toFixed(1)}% margin`, spark: MONTHLY_REVENUE.map((r, i) => r - MONTHLY_COGS[i] - MONTHLY_OPEX[i]), color: "text-white" },
          { label: "Net Income", value: fmt(netIncome), sub: `${fmtPct(fcfForecastVar)} vs Forecast`, spark: MONTHLY_REVENUE.map((r, i) => (r - MONTHLY_COGS[i] - MONTHLY_OPEX[i]) * 0.72), color: fcfForecastVar >= 0 ? "text-emerald-400" : "text-red-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{kpi.label}</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xl font-bold text-white">{kpi.value}</div>
                <div className={`text-xs font-semibold mt-1 ${kpi.color}`}>{kpi.sub}</div>
              </div>
              <Sparkline data={kpi.spark} color={kpi.color.includes("emerald") ? "#34d399" : kpi.color.includes("red") ? "#f87171" : "#60a5fa"} />
            </div>
          </div>
        ))}
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sales Quota", value: "$110.0M", attainment: "101.9%", actual: "$112.1M" },
          { label: "Cash Position", value: "$18.4M", attainment: null, actual: "Up from $14.2M" },
          { label: "Headcount", value: "847", attainment: null, actual: "Rev/Employee: $132K" },
          { label: "Customer NRR", value: "112%", attainment: null, actual: "Target: 110%" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{kpi.label}</div>
            <div className="text-xl font-bold text-white">{kpi.value}</div>
            <div className="text-xs font-semibold text-gray-400 mt-1">{kpi.actual}</div>
          </div>
        ))}
      </div>

      {/* Quota Attainment Gauges */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Regional Quota Attainment</h3>
        <div className="grid grid-cols-3 gap-6">
          {SALES_DATA.map((mgr) => (
            <div key={mgr.region} className="text-center">
              <GaugeRing value={mgr.actual} max={mgr.quota} label={mgr.region} color={mgr.actual >= mgr.quota ? "#34d399" : mgr.actual >= mgr.quota * 0.9 ? "#fbbf24" : "#f87171"} />
              <div className="text-xs text-gray-400 font-semibold mt-1">{fmt(mgr.actual)} / {fmt(mgr.quota)}</div>
              <div className="text-xs text-gray-300 font-bold">{mgr.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Product */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Revenue by Product Line</h3>
        <div className="flex items-center gap-4 mb-3 text-xs text-gray-600 font-semibold">
          <div className="w-36">Product</div>
          <div className="flex-1"></div>
          <div className="w-16 text-right">Revenue</div>
          <div className="w-16 text-right">Y/Y %</div>
          <div className="w-14 text-right">Gross Margin</div>
        </div>
        <div className="space-y-3">
          {PRODUCTS.map((p) => {
            const yoy = ((p.revenue - p.revenuePY) / p.revenuePY) * 100;
            const pctOfTotal = (p.revenue / sumFY(MONTHLY_REVENUE)) * 100;
            return (
              <div key={p.name} className="flex items-center gap-4">
                <div className="w-36 text-sm text-gray-300 font-semibold truncate">{p.name}</div>
                <div className="flex-1"><MiniBar pct={pctOfTotal * 2.5} color={yoy >= 0 ? "bg-emerald-500/60" : "bg-red-500/60"} /></div>
                <div className="w-16 text-right text-sm text-white font-bold">{fmt(p.revenue)}</div>
                <div className={`w-16 text-right text-xs font-bold ${varianceColor(yoy)}`}>{fmtPct(yoy)}</div>
                <div className="w-14 text-right text-xs text-gray-400 font-semibold">{p.margin}% GM</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CRITICAL KPIs - ACTION NEEDED */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">⚠️</span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Critical KPIs — Action Needed</h3>
        </div>
        <div className="space-y-3">
          {criticalKPIs.map((item, i) => (
            <div key={i} className={`p-4 rounded-lg border ${
              item.severity === "high" ? "bg-red-500/5 border-red-500/15" :
              item.severity === "medium" ? "bg-amber-500/5 border-amber-500/15" :
              "bg-emerald-500/5 border-emerald-500/15"
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed mb-2">{item.detail}</div>
                  <div className="text-xs font-semibold text-blue-400">→ {item.action}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 2: P&L & MARGINS
// ══════════════════════════════════════════════════════════════

function PLTab() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Build quarterly + FY P&L
  const quarters = [0, 1, 2, 3].map((q) => ({
    label: `Q${q + 1}`,
    revenue: sumQ(MONTHLY_REVENUE, q),
    revenuePY: sumQ(MONTHLY_REVENUE_PY, q),
    forecast: sumQ(MONTHLY_FORECAST, q),
    cogs: sumQ(MONTHLY_COGS, q),
    opex: sumQ(MONTHLY_OPEX, q),
  }));

  const fy = {
    label: "FY2025",
    revenue: sumFY(MONTHLY_REVENUE),
    revenuePY: sumFY(MONTHLY_REVENUE_PY),
    forecast: sumFY(MONTHLY_FORECAST),
    cogs: sumFY(MONTHLY_COGS),
    opex: sumFY(MONTHLY_OPEX),
  };

  const rows = [
    { name: "Revenue", getData: (d: typeof fy) => d.revenue, bold: true },
    { name: "COGS", getData: (d: typeof fy) => -d.cogs, bold: false },
    { name: "Gross Profit", getData: (d: typeof fy) => d.revenue - d.cogs, bold: true },
    { name: "Gross Margin %", getData: (d: typeof fy) => ((d.revenue - d.cogs) / d.revenue) * 100, bold: false, isPct: true },
    { name: "Operating Expenses", getData: (d: typeof fy) => -d.opex, bold: false },
    { name: "EBITDA", getData: (d: typeof fy) => d.revenue - d.cogs - d.opex, bold: true },
    { name: "EBITDA Margin %", getData: (d: typeof fy) => ((d.revenue - d.cogs - d.opex) / d.revenue) * 100, bold: false, isPct: true },
    { name: "D&A", getData: () => -1.8, bold: false },
    { name: "Interest & Tax", getData: (d: typeof fy) => -(d.revenue - d.cogs - d.opex - 1.8) * 0.28, bold: false },
    { name: "Net Income", getData: (d: typeof fy) => (d.revenue - d.cogs - d.opex - 1.8) * 0.72, bold: true },
  ];

  // Revenue trend chart
  const chartW = 600;
  const chartH = 180;
  const pad = { top: 15, right: 15, bottom: 25, left: 45 };
  const iw = chartW - pad.left - pad.right;
  const ih = chartH - pad.top - pad.bottom;
  const allVals = [...MONTHLY_REVENUE, ...MONTHLY_REVENUE_PY, ...MONTHLY_FORECAST];
  const maxV = Math.max(...allVals) * 1.1;
  const minV = Math.min(...allVals) * 0.85;
  const rangeV = maxV - minV;

  function linePoints(data: number[]): string {
    return data.map((v, i) => {
      const x = pad.left + (i / 11) * iw;
      const y = pad.top + ih - ((v - minV) / rangeV) * ih;
      return `${x},${y}`;
    }).join(" ");
  }

  return (
    <div className="space-y-6">
      {/* Revenue Trend Chart */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Monthly Revenue — Actual vs Prior Year vs Forecast</h3>
        <div className="flex gap-4 mb-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block"></span> <span className="text-gray-400 font-semibold">Actual</span></span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-gray-600 inline-block"></span> <span className="text-gray-400 font-semibold">Prior Year</span></span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 inline-block" style={{ borderTop: "1px dashed" }}></span> <span className="text-gray-400 font-semibold">Forecast</span></span>
        </div>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full">
          {[0, 0.25, 0.5, 0.75, 1].map((p) => {
            const y = pad.top + ih - p * ih;
            const val = minV + p * rangeV;
            return (
              <g key={p}>
                <line x1={pad.left} y1={y} x2={pad.left + iw} y2={y} stroke="rgba(255,255,255,0.04)" />
                <text x={pad.left - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-gray-500 font-semibold">{fmt(val)}</text>
              </g>
            );
          })}
          <polyline points={linePoints(MONTHLY_REVENUE_PY)} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <polyline points={linePoints(MONTHLY_FORECAST)} fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeDasharray="4,3" />
          <polyline points={linePoints(MONTHLY_REVENUE)} fill="none" stroke="#3b82f6" strokeWidth="2" />
          {MONTHLY_REVENUE.map((v, i) => {
            const x = pad.left + (i / 11) * iw;
            const y = pad.top + ih - ((v - minV) / rangeV) * ih;
            return <circle key={i} cx={x} cy={y} r="2.5" fill="#3b82f6" />;
          })}
          {months.map((m, i) => (
            <text key={m} x={pad.left + (i / 11) * iw} y={chartH - 5} textAnchor="middle" className="text-[8px] fill-gray-500 font-semibold">{m}</text>
          ))}
        </svg>
      </div>

      {/* P&L Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Income Statement Summary (in $M)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 font-bold py-2 pr-4">Line Item</th>
                {quarters.map((q) => <th key={q.label} className="text-right text-gray-400 font-bold py-2 px-3">{q.label}</th>)}
                <th className="text-right text-gray-300 font-bold py-2 px-3 border-l border-white/10">FY2025</th>
                <th className="text-right text-gray-400 font-bold py-2 px-3">Y/Y %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const fyVal = row.getData(fy);
                let fyPYVal = 0;
                if (row.name === "Revenue") fyPYVal = fy.revenuePY;
                else if (row.name === "Gross Profit") fyPYVal = fy.revenuePY - fy.cogs * 0.95;
                else fyPYVal = fyVal * 0.88;

                const yoy = row.isPct ? 0 : ((fyVal - fyPYVal) / Math.abs(fyPYVal)) * 100;

                return (
                  <tr key={row.name} className={`border-b border-white/5 ${row.bold ? "bg-white/[0.02]" : ""}`}>
                    <td className={`py-2 pr-4 text-gray-300 ${row.bold ? "font-bold" : "font-medium"}`}>{row.name}</td>
                    {quarters.map((q) => {
                      const val = row.getData(q);
                      return (
                        <td key={q.label} className={`text-right py-2 px-3 ${row.bold ? "font-bold text-white" : "text-gray-400 font-medium"}`}>
                          {row.isPct ? val.toFixed(1) + "%" : (val < 0 ? "(" + Math.abs(val).toFixed(1) + ")" : val.toFixed(1))}
                        </td>
                      );
                    })}
                    <td className={`text-right py-2 px-3 border-l border-white/10 ${row.bold ? "font-bold text-white" : "text-gray-300 font-semibold"}`}>
                      {row.isPct ? fyVal.toFixed(1) + "%" : (fyVal < 0 ? "(" + Math.abs(fyVal).toFixed(1) + ")" : fyVal.toFixed(1))}
                    </td>
                    <td className={`text-right py-2 px-3 text-xs font-bold ${row.isPct ? "text-gray-600" : varianceColor(yoy)}`}>
                      {row.isPct ? "—" : fmtPct(yoy)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 3: SALES PERFORMANCE
// ══════════════════════════════════════════════════════════════

function SalesTab() {
  const [expandedManager, setExpandedManager] = useState<string | null>(SALES_DATA[0].name);

  const allAgents = SALES_DATA.flatMap((m) => m.agents);
  const topPerformers = [...allAgents].sort((a, b) => (b.actual / b.quota) - (a.actual / a.quota)).slice(0, 5);
  const bottomPerformers = [...allAgents].sort((a, b) => (a.actual / a.quota) - (b.actual / b.quota)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Regional Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        {SALES_DATA.map((mgr) => {
          const attPct = (mgr.actual / mgr.quota) * 100;
          const isAbove = attPct >= 100;
          return (
            <div key={mgr.region} className={`bg-white/[0.03] border rounded-xl p-5 ${isAbove ? "border-emerald-500/15" : "border-red-500/15"}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{mgr.region}</div>
                  <div className="text-sm text-gray-400 font-semibold">{mgr.name}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isAbove ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                  {attPct.toFixed(0)}%
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{fmt(mgr.actual)}</div>
              <div className="text-xs text-gray-400 font-semibold mb-3">Quota: {fmt(mgr.quota)}</div>
              <MiniBar pct={attPct} color={isAbove ? "bg-emerald-500/60" : "bg-red-500/60"} />
              <div className="text-xs text-gray-400 font-semibold mt-2">{mgr.agents.length} agents · {mgr.agents.filter(a => a.actual >= a.quota).length} on target</div>
            </div>
          );
        })}
      </div>

      {/* Manager Drill-down */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Sales Agent Detail — Click Region to Expand</h3>
        <div className="space-y-3">
          {SALES_DATA.map((mgr) => {
            const isExpanded = expandedManager === mgr.name;
            return (
              <div key={mgr.name}>
                <button
                  onClick={() => setExpandedManager(isExpanded ? null : mgr.name)}
                  className="w-full text-left p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{isExpanded ? "▼" : "▶"}</span>
                      <div>
                        <span className="text-sm font-bold text-white">{mgr.region}</span>
                        <span className="text-sm text-gray-500 ml-2">— {mgr.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-white">{fmt(mgr.actual)}</span>
                      <span className={`text-xs font-bold ${mgr.actual >= mgr.quota ? "text-emerald-400" : "text-red-400"}`}>
                        {((mgr.actual / mgr.quota) * 100).toFixed(0)}% of quota
                      </span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-2 ml-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-gray-400 font-bold py-2">Agent</th>
                          <th className="text-right text-gray-400 font-bold py-2">Quota</th>
                          <th className="text-right text-gray-400 font-bold py-2">Actual</th>
                          <th className="text-right text-gray-400 font-bold py-2">Attainment</th>
                          <th className="text-right text-gray-400 font-bold py-2">Pipeline</th>
                          <th className="text-right text-gray-400 font-bold py-2">Win Rate</th>
                          <th className="text-right text-gray-400 font-bold py-2">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mgr.agents.map((agent) => {
                          const att = (agent.actual / agent.quota) * 100;
                          return (
                            <tr key={agent.name} className="border-b border-white/5">
                              <td className="py-2 text-gray-300 font-semibold">{agent.name}</td>
                              <td className="text-right py-2 text-gray-400 font-medium">{fmt(agent.quota)}</td>
                              <td className="text-right py-2 text-white font-bold">{fmt(agent.actual)}</td>
                              <td className="text-right py-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${att >= 100 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : att >= 85 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                  {att.toFixed(0)}%
                                </span>
                              </td>
                              <td className="text-right py-2 text-gray-400 font-medium">{fmt(agent.pipelineValue)}</td>
                              <td className="text-right py-2 text-gray-400 font-medium">{agent.winRate}%</td>
                              <td className="text-right py-2">
                                <Sparkline data={agent.trend} color={agent.trend[5] >= agent.trend[0] ? "#34d399" : "#f87171"} width={60} height={20} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top & Bottom Performers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">🏆 Top 5 Performers</h3>
          <div className="space-y-2">
            {topPerformers.map((a, i) => (
              <div key={a.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 w-4">{i + 1}.</span>
                  <span className="text-sm text-gray-300 font-semibold">{a.name}</span>
                  <span className="text-xs text-gray-500 font-medium">({a.region})</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">{((a.actual / a.quota) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-3">⚠️ Bottom 5 — Needs Attention</h3>
          <div className="space-y-2">
            {bottomPerformers.map((a, i) => (
              <div key={a.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-400 w-4">{i + 1}.</span>
                  <span className="text-sm text-gray-300 font-semibold">{a.name}</span>
                  <span className="text-xs text-gray-500 font-medium">({a.region})</span>
                </div>
                <span className="text-xs font-bold text-red-400">{((a.actual / a.quota) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 4: VARIANCE ANALYSIS
// ══════════════════════════════════════════════════════════════

function VarianceTab() {
  const [view, setView] = useState<"yoy" | "qoq" | "mom" | "forecast">("yoy");

  // Build variance data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function getVarianceData() {
    if (view === "yoy") {
      return {
        title: "Year-over-Year Variance (FY2025 vs FY2024)",
        items: [
          { name: "Revenue", actual: sumFY(MONTHLY_REVENUE), compare: sumFY(MONTHLY_REVENUE_PY) },
          { name: "COGS", actual: sumFY(MONTHLY_COGS), compare: sumFY(MONTHLY_COGS) * 0.95, inverse: true },
          { name: "Gross Profit", actual: sumFY(MONTHLY_REVENUE) - sumFY(MONTHLY_COGS), compare: sumFY(MONTHLY_REVENUE_PY) - sumFY(MONTHLY_COGS) * 0.95 },
          { name: "OpEx", actual: sumFY(MONTHLY_OPEX), compare: sumFY(MONTHLY_OPEX) * 0.92, inverse: true },
          { name: "EBITDA", actual: sumFY(MONTHLY_REVENUE) - sumFY(MONTHLY_COGS) - sumFY(MONTHLY_OPEX), compare: (sumFY(MONTHLY_REVENUE_PY) - sumFY(MONTHLY_COGS) * 0.95 - sumFY(MONTHLY_OPEX) * 0.92) },
          { name: "Net Income", actual: (sumFY(MONTHLY_REVENUE) - sumFY(MONTHLY_COGS) - sumFY(MONTHLY_OPEX) - 1.8) * 0.72, compare: (sumFY(MONTHLY_REVENUE_PY) - sumFY(MONTHLY_COGS) * 0.95 - sumFY(MONTHLY_OPEX) * 0.92 - 1.6) * 0.72 },
        ],
      };
    }
    if (view === "qoq") {
      return {
        title: "Quarter-over-Quarter Variance (Q4 vs Q3 2025)",
        items: [
          { name: "Revenue", actual: sumQ(MONTHLY_REVENUE, 3), compare: sumQ(MONTHLY_REVENUE, 2) },
          { name: "COGS", actual: sumQ(MONTHLY_COGS, 3), compare: sumQ(MONTHLY_COGS, 2), inverse: true },
          { name: "Gross Profit", actual: sumQ(MONTHLY_REVENUE, 3) - sumQ(MONTHLY_COGS, 3), compare: sumQ(MONTHLY_REVENUE, 2) - sumQ(MONTHLY_COGS, 2) },
          { name: "OpEx", actual: sumQ(MONTHLY_OPEX, 3), compare: sumQ(MONTHLY_OPEX, 2), inverse: true },
          { name: "EBITDA", actual: sumQ(MONTHLY_REVENUE, 3) - sumQ(MONTHLY_COGS, 3) - sumQ(MONTHLY_OPEX, 3), compare: sumQ(MONTHLY_REVENUE, 2) - sumQ(MONTHLY_COGS, 2) - sumQ(MONTHLY_OPEX, 2) },
        ],
      };
    }
    if (view === "mom") {
      return {
        title: "Month-over-Month Variance (Dec vs Nov 2025)",
        items: [
          { name: "Revenue", actual: MONTHLY_REVENUE[11], compare: MONTHLY_REVENUE[10] },
          { name: "COGS", actual: MONTHLY_COGS[11], compare: MONTHLY_COGS[10], inverse: true },
          { name: "Gross Profit", actual: MONTHLY_REVENUE[11] - MONTHLY_COGS[11], compare: MONTHLY_REVENUE[10] - MONTHLY_COGS[10] },
          { name: "OpEx", actual: MONTHLY_OPEX[11], compare: MONTHLY_OPEX[10], inverse: true },
          { name: "EBITDA", actual: MONTHLY_REVENUE[11] - MONTHLY_COGS[11] - MONTHLY_OPEX[11], compare: MONTHLY_REVENUE[10] - MONTHLY_COGS[10] - MONTHLY_OPEX[10] },
        ],
      };
    }
    // forecast
    return {
      title: "Actual vs Forecast Variance (FY2025)",
      items: [
        { name: "Revenue", actual: sumFY(MONTHLY_REVENUE), compare: sumFY(MONTHLY_FORECAST) },
        { name: "COGS", actual: sumFY(MONTHLY_COGS), compare: sumFY(MONTHLY_COGS) * 1.02, inverse: true },
        { name: "Gross Profit", actual: sumFY(MONTHLY_REVENUE) - sumFY(MONTHLY_COGS), compare: sumFY(MONTHLY_FORECAST) - sumFY(MONTHLY_COGS) * 1.02 },
        { name: "OpEx", actual: sumFY(MONTHLY_OPEX), compare: sumFY(MONTHLY_OPEX) * 1.03, inverse: true },
        { name: "EBITDA", actual: sumFY(MONTHLY_REVENUE) - sumFY(MONTHLY_COGS) - sumFY(MONTHLY_OPEX), compare: sumFY(MONTHLY_FORECAST) - sumFY(MONTHLY_COGS) * 1.02 - sumFY(MONTHLY_OPEX) * 1.03 },
      ],
    };
  }

  const vData = getVarianceData();
  const viewLabels = { yoy: "Y/Y", qoq: "Q/Q", mom: "M/M", forecast: "vs Forecast" };

  // Waterfall chart for revenue variance
  const chartW = 600;
  const chartH = 200;

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex gap-2">
        {(["yoy", "qoq", "mom", "forecast"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              view === v ? "bg-blue-500/15 text-blue-400 border border-blue-500/20" : "bg-white/[0.03] text-gray-500 border border-white/5 hover:text-gray-300"
            }`}
          >
            {viewLabels[v]}
          </button>
        ))}
      </div>

      {/* Variance Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">{vData.title}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 font-bold py-2">Line Item</th>
              <th className="text-right text-gray-400 font-bold py-2">Actual</th>
              <th className="text-right text-gray-400 font-bold py-2">{view === "forecast" ? "Forecast" : "Prior Period"}</th>
              <th className="text-right text-gray-400 font-bold py-2">Variance $</th>
              <th className="text-right text-gray-400 font-bold py-2">Variance %</th>
              <th className="text-right text-gray-400 font-bold py-2">Status</th>
              <th className="text-right text-gray-400 font-bold py-2">Impact</th>
            </tr>
          </thead>
          <tbody>
            {vData.items.map((item) => {
              const varDollar = item.actual - item.compare;
              const varPct = item.compare !== 0 ? (varDollar / Math.abs(item.compare)) * 100 : 0;
              const isGood = item.inverse ? varDollar <= 0 : varDollar >= 0;
              const impact = Math.abs(varPct) > 10 ? "High" : Math.abs(varPct) > 5 ? "Medium" : "Low";

              return (
                <tr key={item.name} className="border-b border-white/5">
                  <td className="py-3 text-gray-300 font-semibold">{item.name}</td>
                  <td className="text-right py-3 text-white font-bold">{fmt(item.actual)}</td>
                  <td className="text-right py-3 text-gray-400 font-medium">{fmt(item.compare)}</td>
                  <td className={`text-right py-3 font-bold ${isGood ? "text-emerald-400" : "text-red-400"}`}>
                    {varDollar >= 0 ? "+" : ""}{fmt(varDollar)}
                  </td>
                  <td className={`text-right py-3 font-bold ${isGood ? "text-emerald-400" : "text-red-400"}`}>
                    {fmtPct(varPct)}
                  </td>
                  <td className="text-right py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isGood ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                      {isGood ? "Favorable" : "Unfavorable"}
                    </span>
                  </td>
                  <td className="text-right py-3">
                    <span className={`text-[10px] font-bold ${impact === "High" ? "text-red-400" : impact === "Medium" ? "text-amber-400" : "text-gray-500"}`}>
                      {impact}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Product Variance */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Revenue Variance by Product — vs Prior Year</h3>
        <div className="space-y-3">
          {PRODUCTS.map((p) => {
            const varDollar = p.revenue - p.revenuePY;
            const varPct = ((p.revenue - p.revenuePY) / p.revenuePY) * 100;
            const fcstVar = ((p.revenue - p.forecast) / p.forecast) * 100;
            return (
              <div key={p.name} className="flex items-center gap-4 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                <div className="w-36 text-sm text-gray-300 font-semibold">{p.name}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MiniBar pct={(p.revenue / 40) * 100} color={varPct >= 0 ? "bg-emerald-500/60" : "bg-red-500/60"} />
                  </div>
                </div>
                <div className="text-sm text-white font-bold w-16 text-right">{fmt(p.revenue)}</div>
                <div className={`w-14 text-right text-xs font-bold ${varianceColor(varPct)}`}>
                  {fmtPct(varPct)} Y/Y
                </div>
                <div className={`w-18 text-right text-xs font-bold ${varianceColor(fcstVar)}`}>
                  {fmtPct(fcstVar)} vs Fcst
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regional Variance */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Revenue Variance by Region — vs Quota</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 font-bold py-2">Region</th>
              <th className="text-right text-gray-400 font-bold py-2">Manager</th>
              <th className="text-right text-gray-400 font-bold py-2">Quota</th>
              <th className="text-right text-gray-400 font-bold py-2">Actual</th>
              <th className="text-right text-gray-400 font-bold py-2">Variance $</th>
              <th className="text-right text-gray-400 font-bold py-2">Attainment</th>
            </tr>
          </thead>
          <tbody>
            {SALES_DATA.map((mgr) => {
              const varD = mgr.actual - mgr.quota;
              const att = (mgr.actual / mgr.quota) * 100;
              return (
                <tr key={mgr.region} className="border-b border-white/5">
                  <td className="py-2 text-gray-300 font-bold">{mgr.region}</td>
                  <td className="text-right py-2 text-gray-400 font-medium">{mgr.name}</td>
                  <td className="text-right py-2 text-gray-400 font-medium">{fmt(mgr.quota)}</td>
                  <td className="text-right py-2 text-white font-bold">{fmt(mgr.actual)}</td>
                  <td className={`text-right py-2 font-bold ${varD >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {varD >= 0 ? "+" : ""}{fmt(varD)}
                  </td>
                  <td className="text-right py-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${att >= 100 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : att >= 90 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                      {att.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              );
            })}
            <tr className="border-t border-white/10 bg-white/[0.02]">
              <td className="py-2 text-white font-bold">Total</td>
              <td></td>
              <td className="text-right py-2 text-gray-300 font-bold">{fmt(SALES_DATA.reduce((s, m) => s + m.quota, 0))}</td>
              <td className="text-right py-2 text-white font-bold">{fmt(SALES_DATA.reduce((s, m) => s + m.actual, 0))}</td>
              <td className={`text-right py-2 font-bold text-emerald-400`}>
                +{fmt(SALES_DATA.reduce((s, m) => s + m.actual - m.quota, 0))}
              </td>
              <td className="text-right py-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  {((SALES_DATA.reduce((s, m) => s + m.actual, 0) / SALES_DATA.reduce((s, m) => s + m.quota, 0)) * 100).toFixed(0)}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 5: CASH & OPERATIONS
// ══════════════════════════════════════════════════════════════

function CashOpsTab() {
  const cashMetrics = [
    { label: "Cash & Equivalents", value: "$18.4M", change: "+29.6%", positive: true, detail: "Up from $14.2M at FY start" },
    { label: "Operating Cash Flow", value: "$12.8M", change: "+18.5%", positive: true, detail: "Strong collections in Q3-Q4" },
    { label: "Free Cash Flow", value: "$9.2M", change: "+22.1%", positive: true, detail: "After $3.6M CAPEX" },
    { label: "Days Cash on Hand", value: "68 days", change: "+12 days", positive: true, detail: "vs 56 days prior year" },
  ];

  const efficiencyMetrics = [
    { label: "DSO (Days Sales Outstanding)", value: "48", target: "42", status: "warning", detail: "Increasing — collection slowdown" },
    { label: "DPO (Days Payable Outstanding)", value: "38", target: "35", status: "good", detail: "Leveraging payment terms" },
    { label: "Inventory Turnover", value: "6.2x", target: "6.0x", status: "good", detail: "Above target" },
    { label: "Current Ratio", value: "2.1x", target: "1.5x", status: "good", detail: "Strong liquidity" },
    { label: "Quick Ratio", value: "1.6x", target: "1.0x", status: "good", detail: "Healthy short-term position" },
    { label: "SG&A as % of Revenue", value: "24.8%", target: "25.0%", status: "good", detail: "Under target" },
    { label: "Revenue per Employee", value: "$132K", target: "$125K", status: "good", detail: "Productivity improving" },
    { label: "CAPEX as % of Revenue", value: "3.2%", target: "4.0%", status: "good", detail: "Below budget — watchlist" },
  ];

  const cashFlowMonthly = [1.0, 0.8, 1.2, 0.9, 1.1, 1.3, 1.0, 1.2, 1.4, 1.1, 1.3, 1.5];
  const cashBalance = cashFlowMonthly.reduce((acc: number[], v, i) => {
    acc.push((acc[i - 1] || 14.2) + v - 0.3); // 0.3M avg capex/month
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Cash KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cashMetrics.map((m) => (
          <div key={m.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-xl font-bold text-white">{m.value}</div>
            <div className={`text-xs font-semibold mt-1 ${m.positive ? "text-emerald-400" : "text-red-400"}`}>{m.change}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">{m.detail}</div>
          </div>
        ))}
      </div>

      {/* Cash Balance Trend */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Cash Balance Trend (FY2025)</h3>
        <svg viewBox="0 0 600 160" className="w-full">
          {[0, 0.25, 0.5, 0.75, 1].map((p) => {
            const min = 12;
            const max = 20;
            const val = min + p * (max - min);
            const y = 140 - p * 120;
            return (
              <g key={p}>
                <line x1="45" y1={y} x2="585" y2={y} stroke="rgba(255,255,255,0.04)" />
                <text x="40" y={y + 3} textAnchor="end" className="text-[9px] fill-gray-500 font-semibold">${val.toFixed(0)}M</text>
              </g>
            );
          })}
          {/* Area fill */}
          <path
            d={`M ${45 + 0} ${140 - ((cashBalance[0] - 12) / 8) * 120} ${cashBalance.map((v, i) => `L ${45 + (i / 11) * 540} ${140 - ((v - 12) / 8) * 120}`).join(" ")} L ${45 + 540} 140 L 45 140 Z`}
            fill="rgba(59,130,246,0.1)"
          />
          <polyline
            points={cashBalance.map((v, i) => `${45 + (i / 11) * 540},${140 - ((v - 12) / 8) * 120}`).join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          {cashBalance.map((v, i) => (
            <circle key={i} cx={45 + (i / 11) * 540} cy={140 - ((v - 12) / 8) * 120} r="3" fill="#3b82f6" />
          ))}
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
            <text key={m} x={45 + (i / 11) * 540} y={155} textAnchor="middle" className="text-[8px] fill-gray-500 font-semibold">{m}</text>
          ))}
        </svg>
      </div>

      {/* Efficiency Metrics */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Operational Efficiency Metrics</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {efficiencyMetrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <div>
                <div className="text-sm text-gray-300 font-semibold">{m.label}</div>
                <div className="text-xs text-gray-500 font-medium">{m.detail}</div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <div className="text-sm text-white font-bold">{m.value}</div>
                  <div className="text-xs text-gray-500 font-medium">Target: {m.target}</div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${m.status === "good" ? "bg-emerald-500" : m.status === "warning" ? "bg-amber-500" : "bg-red-500"}`}></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════

const TABS = [
  { id: "overview", label: "Executive Overview" },
  { id: "pnl", label: "P&L & Margins" },
  { id: "sales", label: "Sales Performance" },
  { id: "variance", label: "Variance Analysis" },
  { id: "cash", label: "Cash & Operations" },
];

export default function ExecutiveDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Portfolio
          </Link>
          <span className="text-sm text-gray-500">Executive Dashboard</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Title */}
        <div className="mb-6">
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs uppercase tracking-wider">
            CEO / CFO Command Center
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Executive Dashboard
          </h1>
          <p className="text-gray-400 max-w-3xl font-medium">
            Comprehensive financial performance view for {COMPANY}. Full-year actuals with
            variance analysis, sales hierarchy drill-down, and critical KPI monitoring.
            Period: {PERIOD}.
          </p>
        </div>

        {/* Company Bar */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold">{COMPANY}</div>
            <div className="text-sm text-gray-500 font-medium">B2B Technology · {PERIOD}</div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">Revenue: $112.1M</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">Quota Attainment: 102%</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">2 Critical Alerts</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "bg-white/[0.03] text-gray-500 border border-white/5 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && <ExecutiveOverview />}
        {activeTab === "pnl" && <PLTab />}
        {activeTab === "sales" && <SalesTab />}
        {activeTab === "variance" && <VarianceTab />}
        {activeTab === "cash" && <CashOpsTab />}

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600 text-sm">
          Built by Uwe Anell — Finance Leader & PMP® Professional
        </div>
      </div>
    </main>
  );
}
