"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

function MetricCard({
  label,
  value,
  unit,
  color,
  subtitle,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${color}`}>
          {value.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      {subtitle && (
        <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  prefix = "$",
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  tooltip?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">
        {label}
        {tooltip && (
          <span className="ml-1 text-gray-600 cursor-help" title={tooltip}>
            ⓘ
          </span>
        )}
      </label>
      <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden focus-within:border-blue-500/40 transition-colors">
        <span className="text-gray-500 text-sm pl-3">{prefix}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-white px-2 py-2.5 text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}

function WhatIfSlider({
  label,
  value,
  onChange,
  min,
  max,
  unit = "days",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-semibold text-white">
          {value.toFixed(0)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-0.5">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function CycleVisualization({
  dso,
  dio,
  dpo,
}: {
  dso: number;
  dio: number;
  dpo: number;
}) {
  const ccc = dio + dso - dpo;
  const totalSpan = Math.max(dio + dso, dpo, 1);

  const dioWidth = (dio / totalSpan) * 100;
  const dsoWidth = (dso / totalSpan) * 100;
  const dpoWidth = (dpo / totalSpan) * 100;

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
      <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">
        Cash Conversion Timeline
      </h3>

      <div className="space-y-6">
        {/* DIO Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Inventory Period (DIO)</span>
            <span>{dio.toFixed(0)} days</span>
          </div>
          <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500/70 to-amber-500/40 rounded-lg flex items-center px-3 transition-all duration-500"
              style={{ width: `${Math.min(dioWidth, 100)}%` }}
            >
              <span className="text-xs text-white/80 font-medium truncate">
                DIO: {dio.toFixed(0)}d
              </span>
            </div>
          </div>
        </div>

        {/* DSO Bar (starts after DIO) */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Collection Period (DSO)</span>
            <span>{dso.toFixed(0)} days</span>
          </div>
          <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
            <div className="h-full flex">
              <div
                style={{ width: `${Math.min(dioWidth, 100)}%` }}
                className="h-full bg-transparent flex-shrink-0"
              />
              <div
                className="h-full bg-gradient-to-r from-blue-500/70 to-blue-500/40 rounded-lg flex items-center px-3 transition-all duration-500"
                style={{
                  width: `${Math.min(dsoWidth, 100 - dioWidth)}%`,
                }}
              >
                <span className="text-xs text-white/80 font-medium truncate">
                  DSO: {dso.toFixed(0)}d
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DPO Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Payment Period (DPO)</span>
            <span>{dpo.toFixed(0)} days</span>
          </div>
          <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500/70 to-emerald-500/40 rounded-lg flex items-center px-3 transition-all duration-500"
              style={{ width: `${Math.min(dpoWidth, 100)}%` }}
            >
              <span className="text-xs text-white/80 font-medium truncate">
                DPO: {dpo.toFixed(0)}d
              </span>
            </div>
          </div>
        </div>

        {/* CCC Result */}
        <div className="border-t border-white/5 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">
                Cash Conversion Cycle
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                DIO ({dio.toFixed(0)}) + DSO ({dso.toFixed(0)}) − DPO (
                {dpo.toFixed(0)})
              </div>
            </div>
            <div
              className={`text-4xl font-bold ${ccc > 60 ? "text-red-400" : ccc > 30 ? "text-amber-400" : "text-emerald-400"}`}
            >
              {ccc.toFixed(0)}
              <span className="text-lg text-gray-500 ml-1">days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightPanel({
  ccc,
  dso,
  dio,
  dpo,
  workingCapital,
  dailyCost,
}: {
  ccc: number;
  dso: number;
  dio: number;
  dpo: number;
  workingCapital: number;
  dailyCost: number;
}) {
  const insights: { icon: string; text: string; type: string }[] = [];

  if (ccc > 60) {
    insights.push({
      icon: "🔴",
      text: `Cash cycle of ${ccc.toFixed(0)} days is critically high. Cash is locked for over 2 months before returning. Urgent optimization needed.`,
      type: "critical",
    });
  } else if (ccc > 30) {
    insights.push({
      icon: "🟡",
      text: `Cash cycle of ${ccc.toFixed(0)} days is moderate. There is room to improve working capital efficiency.`,
      type: "warning",
    });
  } else if (ccc > 0) {
    insights.push({
      icon: "🟢",
      text: `Cash cycle of ${ccc.toFixed(0)} days is efficient. Cash is recovered relatively quickly.`,
      type: "good",
    });
  } else {
    insights.push({
      icon: "⭐",
      text: `Negative cash cycle of ${ccc.toFixed(0)} days — the company receives cash before paying suppliers. Excellent position.`,
      type: "excellent",
    });
  }

  if (dso > 45) {
    insights.push({
      icon: "📋",
      text: `DSO of ${dso.toFixed(0)} days suggests slow collections. Consider tightening credit terms or improving collection processes.`,
      type: "action",
    });
  }

  if (dio > 60) {
    insights.push({
      icon: "📦",
      text: `DIO of ${dio.toFixed(0)} days means inventory sits for over 2 months. Review inventory management and demand forecasting.`,
      type: "action",
    });
  }

  if (dpo < 30) {
    insights.push({
      icon: "💳",
      text: `DPO of ${dpo.toFixed(0)} days — paying suppliers quickly. Consider negotiating longer payment terms to preserve cash.`,
      type: "action",
    });
  }

  const cashLocked = ccc * dailyCost;
  insights.push({
    icon: "💰",
    text: `Approximately $${(cashLocked / 1000000).toFixed(1)}M in cash is locked in the operating cycle at any given time.`,
    type: "info",
  });

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
      <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
        Key Insights & Recommendations
      </h3>
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
  );
}

const industryBenchmarks = [
  { name: "Technology", dso: 55, dio: 25, dpo: 45, ccc: 35 },
  { name: "Retail", dso: 5, dio: 45, dpo: 35, ccc: 15 },
  { name: "Manufacturing", dso: 42, dio: 65, dpo: 40, ccc: 67 },
  { name: "Healthcare", dso: 55, dio: 10, dpo: 35, ccc: 30 },
  { name: "Consumer Goods", dso: 35, dio: 50, dpo: 45, ccc: 40 },
];

export default function WorkingCapitalPage() {
  // Financial inputs
  const [revenue, setRevenue] = useState(50000000);
  const [cogs, setCogs] = useState(32000000);
  const [accountsReceivable, setAccountsReceivable] = useState(8000000);
  const [inventory, setInventory] = useState(5500000);
  const [accountsPayable, setAccountsPayable] = useState(4500000);
  const [currentAssets, setCurrentAssets] = useState(22000000);
  const [currentLiabilities, setCurrentLiabilities] = useState(14000000);

  // What-if adjustments
  const [dsoAdjust, setDsoAdjust] = useState(0);
  const [dioAdjust, setDioAdjust] = useState(0);
  const [dpoAdjust, setDpoAdjust] = useState(0);

  const metrics = useMemo(() => {
    const dailyRevenue = revenue / 365;
    const dailyCOGS = cogs / 365;

    const baseDSO = accountsReceivable / dailyRevenue;
    const baseDIO = inventory / dailyCOGS;
    const baseDPO = accountsPayable / dailyCOGS;
    const baseCCC = baseDIO + baseDSO - baseDPO;

    const adjDSO = Math.max(0, baseDSO + dsoAdjust);
    const adjDIO = Math.max(0, baseDIO + dioAdjust);
    const adjDPO = Math.max(0, baseDPO + dpoAdjust);
    const adjCCC = adjDIO + adjDSO - adjDPO;

    const workingCapital = currentAssets - currentLiabilities;
    const currentRatio = currentAssets / currentLiabilities;
    const quickRatio = (currentAssets - inventory) / currentLiabilities;

    const cashImpact = (baseCCC - adjCCC) * dailyCOGS;

    return {
      baseDSO,
      baseDIO,
      baseDPO,
      baseCCC,
      adjDSO,
      adjDIO,
      adjDPO,
      adjCCC,
      workingCapital,
      currentRatio,
      quickRatio,
      dailyCOGS,
      cashImpact,
    };
  }, [
    revenue,
    cogs,
    accountsReceivable,
    inventory,
    accountsPayable,
    currentAssets,
    currentLiabilities,
    dsoAdjust,
    dioAdjust,
    dpoAdjust,
  ]);

  const hasAdjustments = dsoAdjust !== 0 || dioAdjust !== 0 || dpoAdjust !== 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Portfolio
          </Link>
          <span className="text-sm text-gray-500">Finance App</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Title */}
        <div className="mb-10">
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs uppercase tracking-wider">
            Interactive Finance Tool
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Working Capital & Cash Conversion Cycle Analyzer
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Analyze how efficiently a company converts its investments in
            inventory and receivables into cash. Adjust inputs and use the
            what-if sliders to model optimization scenarios.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Income Statement
            </h3>
            <div className="space-y-4">
              <InputField
                label="Annual Revenue"
                value={revenue}
                onChange={setRevenue}
                tooltip="Total annual sales revenue"
              />
              <InputField
                label="Cost of Goods Sold (COGS)"
                value={cogs}
                onChange={setCogs}
                tooltip="Direct costs of producing goods sold"
              />
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Balance Sheet Items
            </h3>
            <div className="space-y-4">
              <InputField
                label="Accounts Receivable"
                value={accountsReceivable}
                onChange={setAccountsReceivable}
                tooltip="Money owed by customers"
              />
              <InputField
                label="Inventory"
                value={inventory}
                onChange={setInventory}
                tooltip="Value of goods held for sale"
              />
              <InputField
                label="Accounts Payable"
                value={accountsPayable}
                onChange={setAccountsPayable}
                tooltip="Money owed to suppliers"
              />
            </div>
          </div>
        </div>

        {/* Liquidity Inputs */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-10">
          <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Liquidity Metrics
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Total Current Assets"
              value={currentAssets}
              onChange={setCurrentAssets}
              tooltip="Cash + Receivables + Inventory + Other current assets"
            />
            <InputField
              label="Total Current Liabilities"
              value={currentLiabilities}
              onChange={setCurrentLiabilities}
              tooltip="Payables + Short-term debt + Other current liabilities"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <MetricCard
            label="DSO"
            value={metrics.adjDSO}
            unit="days"
            color="text-blue-400"
            subtitle="Days Sales Outstanding"
          />
          <MetricCard
            label="DIO"
            value={metrics.adjDIO}
            unit="days"
            color="text-amber-400"
            subtitle="Days Inventory Outstanding"
          />
          <MetricCard
            label="DPO"
            value={metrics.adjDPO}
            unit="days"
            color="text-emerald-400"
            subtitle="Days Payable Outstanding"
          />
          <MetricCard
            label="CCC"
            value={metrics.adjCCC}
            unit="days"
            color={
              metrics.adjCCC > 60
                ? "text-red-400"
                : metrics.adjCCC > 30
                  ? "text-amber-400"
                  : "text-emerald-400"
            }
            subtitle="Cash Conversion Cycle"
          />
        </div>

        {/* Liquidity Ratios */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <MetricCard
            label="Working Capital"
            value={metrics.workingCapital / 1000000}
            unit="M"
            color="text-white"
            subtitle="Current Assets − Current Liabilities"
          />
          <MetricCard
            label="Current Ratio"
            value={metrics.currentRatio}
            unit="x"
            color={
              metrics.currentRatio >= 1.5
                ? "text-emerald-400"
                : metrics.currentRatio >= 1.0
                  ? "text-amber-400"
                  : "text-red-400"
            }
            subtitle="Target: > 1.5x"
          />
          <MetricCard
            label="Quick Ratio"
            value={metrics.quickRatio}
            unit="x"
            color={
              metrics.quickRatio >= 1.0
                ? "text-emerald-400"
                : metrics.quickRatio >= 0.7
                  ? "text-amber-400"
                  : "text-red-400"
            }
            subtitle="Target: > 1.0x"
          />
        </div>

        {/* Cash Conversion Timeline Visualization */}
        <div className="mb-10">
          <CycleVisualization
            dso={metrics.adjDSO}
            dio={metrics.adjDIO}
            dpo={metrics.adjDPO}
          />
        </div>

        {/* What-If Scenario Sliders */}
        <div className="bg-white/[0.03] border border-blue-500/10 rounded-xl p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm uppercase tracking-widest text-blue-400 mb-1">
                What-If Scenario Analysis
              </h3>
              <p className="text-xs text-gray-600">
                Drag the sliders to model improvements to your cash cycle
              </p>
            </div>
            {hasAdjustments && (
              <button
                onClick={() => {
                  setDsoAdjust(0);
                  setDioAdjust(0);
                  setDpoAdjust(0);
                }}
                className="text-xs text-gray-500 hover:text-white px-3 py-1.5 border border-white/10 rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <WhatIfSlider
              label="Adjust DSO"
              value={dsoAdjust}
              onChange={setDsoAdjust}
              min={-30}
              max={30}
            />
            <WhatIfSlider
              label="Adjust DIO"
              value={dioAdjust}
              onChange={setDioAdjust}
              min={-30}
              max={30}
            />
            <WhatIfSlider
              label="Adjust DPO"
              value={dpoAdjust}
              onChange={setDpoAdjust}
              min={-30}
              max={30}
            />
          </div>

          {/* Cash Impact */}
          {hasAdjustments && (
            <div className="mt-6 p-4 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">
                    Cash Impact of Adjustments
                  </div>
                  <div className="text-xs text-gray-600">
                    CCC change: {metrics.baseCCC.toFixed(0)} →{" "}
                    {metrics.adjCCC.toFixed(0)} days (
                    {metrics.adjCCC - metrics.baseCCC > 0 ? "+" : ""}
                    {(metrics.adjCCC - metrics.baseCCC).toFixed(0)} days)
                  </div>
                </div>
                <div
                  className={`text-2xl font-bold ${metrics.cashImpact >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  {metrics.cashImpact >= 0 ? "+" : ""}$
                  {(Math.abs(metrics.cashImpact) / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="mb-10">
          <InsightPanel
            ccc={metrics.adjCCC}
            dso={metrics.adjDSO}
            dio={metrics.adjDIO}
            dpo={metrics.adjDPO}
            workingCapital={metrics.workingCapital}
            dailyCost={metrics.dailyCOGS}
          />
        </div>

        {/* Industry Benchmarks */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-10">
          <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Industry Benchmarks
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-gray-500 font-medium py-3 pr-4">
                    Industry
                  </th>
                  <th className="text-right text-gray-500 font-medium py-3 px-4">
                    DSO
                  </th>
                  <th className="text-right text-gray-500 font-medium py-3 px-4">
                    DIO
                  </th>
                  <th className="text-right text-gray-500 font-medium py-3 px-4">
                    DPO
                  </th>
                  <th className="text-right text-gray-500 font-medium py-3 pl-4">
                    CCC
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 bg-blue-500/5">
                  <td className="py-3 pr-4 text-blue-400 font-medium">
                    Your Company
                  </td>
                  <td className="text-right py-3 px-4 text-white">
                    {metrics.adjDSO.toFixed(0)}
                  </td>
                  <td className="text-right py-3 px-4 text-white">
                    {metrics.adjDIO.toFixed(0)}
                  </td>
                  <td className="text-right py-3 px-4 text-white">
                    {metrics.adjDPO.toFixed(0)}
                  </td>
                  <td className="text-right py-3 pl-4 text-white font-semibold">
                    {metrics.adjCCC.toFixed(0)}
                  </td>
                </tr>
                {industryBenchmarks.map((b) => (
                  <tr
                    key={b.name}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="py-3 pr-4 text-gray-400">{b.name}</td>
                    <td className="text-right py-3 px-4 text-gray-400">
                      {b.dso}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-400">
                      {b.dio}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-400">
                      {b.dpo}
                    </td>
                    <td className="text-right py-3 pl-4 text-gray-400">
                      {b.ccc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Methodology
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-500">
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 font-medium">DSO</span> = (Accounts
                Receivable ÷ Revenue) × 365
              </div>
              <div>
                <span className="text-gray-300 font-medium">DIO</span> = (Inventory
                ÷ COGS) × 365
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 font-medium">DPO</span> = (Accounts
                Payable ÷ COGS) × 365
              </div>
              <div>
                <span className="text-gray-300 font-medium">CCC</span> = DIO + DSO
                − DPO
              </div>
            </div>
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
