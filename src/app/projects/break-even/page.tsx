"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

function formatNumber(num: number): string {
  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatCurrency(num: number): string {
  return "$" + num.toLocaleString("en-US", { maximumFractionDigits: 0 });
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
      <label className="block text-sm font-semibold text-gray-300 mb-1.5">
        {label}
        {tooltip && (
          <span className="ml-1 text-gray-600 cursor-help font-normal" title={tooltip}>
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

function MetricCard({
  label,
  value,
  color,
  subtitle,
}: {
  label: string;
  value: string;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      {subtitle && (
        <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
      )}
    </div>
  );
}

function BreakEvenChart({
  fixedCosts,
  variableCostPerUnit,
  pricePerUnit,
  breakEvenUnits,
  maxUnits,
}: {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  breakEvenUnits: number;
  maxUnits: number;
}) {
  const chartWidth = 700;
  const chartHeight = 350;
  const padding = { top: 20, right: 30, bottom: 50, left: 70 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const displayMax = Math.max(maxUnits, breakEvenUnits * 2, 100);
  const maxRevenue = pricePerUnit * displayMax;
  const maxTotalCost = fixedCosts + variableCostPerUnit * displayMax;
  const yMax = Math.max(maxRevenue, maxTotalCost) * 1.1;

  const xScale = (v: number) => (v / displayMax) * innerWidth;
  const yScale = (v: number) => innerHeight - (v / yMax) * innerHeight;

  const steps = 100;
  const revenueLine = Array.from({ length: steps + 1 }, (_, i) => {
    const units = (i / steps) * displayMax;
    return `${padding.left + xScale(units)},${padding.top + yScale(pricePerUnit * units)}`;
  }).join(" ");

  const totalCostLine = Array.from({ length: steps + 1 }, (_, i) => {
    const units = (i / steps) * displayMax;
    return `${padding.left + xScale(units)},${padding.top + yScale(fixedCosts + variableCostPerUnit * units)}`;
  }).join(" ");

  const fixedCostLine = `${padding.left},${padding.top + yScale(fixedCosts)} ${padding.left + innerWidth},${padding.top + yScale(fixedCosts)}`;

  const breakEvenRevenue = pricePerUnit * breakEvenUnits;
  const bx = padding.left + xScale(breakEvenUnits);
  const by = padding.top + yScale(breakEvenRevenue);

  // Profit area (above break-even)
  const profitArea = Array.from({ length: steps + 1 }, (_, i) => {
    const units = (i / steps) * displayMax;
    if (units < breakEvenUnits) return null;
    return {
      x: padding.left + xScale(units),
      rev: padding.top + yScale(pricePerUnit * units),
      cost: padding.top + yScale(fixedCosts + variableCostPerUnit * units),
    };
  }).filter(Boolean) as { x: number; rev: number; cost: number }[];

  const profitAreaPath =
    profitArea.length > 1
      ? `M ${profitArea[0].x},${profitArea[0].rev} ` +
        profitArea.map((p) => `L ${p.x},${p.rev}`).join(" ") +
        ` L ${profitArea[profitArea.length - 1].x},${profitArea[profitArea.length - 1].cost} ` +
        [...profitArea].reverse().map((p) => `L ${p.x},${p.cost}`).join(" ") +
        " Z"
      : "";

  // Loss area (below break-even)
  const lossArea = Array.from({ length: steps + 1 }, (_, i) => {
    const units = (i / steps) * displayMax;
    if (units > breakEvenUnits) return null;
    return {
      x: padding.left + xScale(units),
      rev: padding.top + yScale(pricePerUnit * units),
      cost: padding.top + yScale(fixedCosts + variableCostPerUnit * units),
    };
  }).filter(Boolean) as { x: number; rev: number; cost: number }[];

  const lossAreaPath =
    lossArea.length > 1
      ? `M ${lossArea[0].x},${lossArea[0].cost} ` +
        lossArea.map((p) => `L ${p.x},${p.cost}`).join(" ") +
        ` L ${lossArea[lossArea.length - 1].x},${lossArea[lossArea.length - 1].rev} ` +
        [...lossArea].reverse().map((p) => `L ${p.x},${p.rev}`).join(" ") +
        " Z"
      : "";

  const yTicks = 5;
  const xTicks = 5;

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
        Break-Even Chart
      </h3>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full max-w-[700px] mx-auto"
        >
          {/* Grid lines */}
          {Array.from({ length: yTicks + 1 }, (_, i) => {
            const val = (i / yTicks) * yMax;
            const y = padding.top + yScale(val);
            return (
              <g key={`y-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-gray-600 text-[10px]"
                >
                  {val >= 1000000
                    ? `$${(val / 1000000).toFixed(1)}M`
                    : val >= 1000
                      ? `$${(val / 1000).toFixed(0)}K`
                      : `$${val.toFixed(0)}`}
                </text>
              </g>
            );
          })}

          {Array.from({ length: xTicks + 1 }, (_, i) => {
            const val = (i / xTicks) * displayMax;
            const x = padding.left + xScale(val);
            return (
              <g key={`x-${i}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + innerHeight}
                  stroke="rgba(255,255,255,0.05)"
                />
                <text
                  x={x}
                  y={padding.top + innerHeight + 20}
                  textAnchor="middle"
                  className="fill-gray-600 text-[10px]"
                >
                  {formatNumber(Math.round(val))}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={padding.left + innerWidth / 2}
            y={chartHeight - 5}
            textAnchor="middle"
            className="fill-gray-500 text-[11px]"
          >
            Units Sold
          </text>

          {/* Profit area */}
          {profitAreaPath && (
            <path d={profitAreaPath} fill="rgba(34,197,94,0.08)" />
          )}

          {/* Loss area */}
          {lossAreaPath && (
            <path d={lossAreaPath} fill="rgba(239,68,68,0.08)" />
          )}

          {/* Fixed cost line */}
          <polyline
            points={fixedCostLine}
            fill="none"
            stroke="rgba(168,85,247,0.5)"
            strokeWidth="1.5"
            strokeDasharray="6,4"
          />

          {/* Total cost line */}
          <polyline
            points={totalCostLine}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          />

          {/* Revenue line */}
          <polyline
            points={revenueLine}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Break-even point */}
          {breakEvenUnits > 0 && isFinite(breakEvenUnits) && (
            <>
              <line
                x1={bx}
                y1={padding.top}
                x2={bx}
                y2={padding.top + innerHeight}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="4,4"
              />
              <circle cx={bx} cy={by} r="6" fill="#22c55e" />
              <circle cx={bx} cy={by} r="3" fill="#0a0a0a" />
              <text
                x={bx}
                y={by - 14}
                textAnchor="middle"
                className="fill-emerald-400 text-[10px] font-semibold"
              >
                Break-Even
              </text>
            </>
          )}

          {/* Legend */}
          <g transform={`translate(${padding.left + 10}, ${padding.top + 10})`}>
            <line x1="0" y1="0" x2="16" y2="0" stroke="#3b82f6" strokeWidth="2" />
            <text x="22" y="4" className="fill-gray-400 text-[10px]">Revenue</text>
            <line x1="0" y1="16" x2="16" y2="16" stroke="#f59e0b" strokeWidth="2" />
            <text x="22" y="20" className="fill-gray-400 text-[10px]">Total Costs</text>
            <line x1="0" y1="32" x2="16" y2="32" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" strokeDasharray="6,4" />
            <text x="22" y="36" className="fill-gray-400 text-[10px]">Fixed Costs</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

function SensitivityTable({
  fixedCosts,
  variableCostPerUnit,
  pricePerUnit,
}: {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
}) {
  const priceVariations = [-20, -10, -5, 0, 5, 10, 20];

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
        Price Sensitivity Analysis
      </h3>
      <p className="text-xs text-gray-600 mb-4">
        How break-even changes with different pricing
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-gray-500 font-semibold py-3 pr-4">
                Price Change
              </th>
              <th className="text-right text-gray-500 font-semibold py-3 px-4">
                Unit Price
              </th>
              <th className="text-right text-gray-500 font-semibold py-3 px-4">
                Margin/Unit
              </th>
              <th className="text-right text-gray-500 font-semibold py-3 px-4">
                BE Units
              </th>
              <th className="text-right text-gray-500 font-semibold py-3 pl-4">
                BE Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {priceVariations.map((pct) => {
              const adjPrice = pricePerUnit * (1 + pct / 100);
              const margin = adjPrice - variableCostPerUnit;
              const beUnits = margin > 0 ? fixedCosts / margin : Infinity;
              const beRevenue = beUnits * adjPrice;
              const isBase = pct === 0;

              return (
                <tr
                  key={pct}
                  className={`border-b border-white/5 ${isBase ? "bg-blue-500/5" : "hover:bg-white/[0.02]"}`}
                >
                  <td
                    className={`py-3 pr-4 ${pct > 0 ? "text-emerald-400" : pct < 0 ? "text-red-400" : "text-blue-400 font-semibold"}`}
                  >
                    {pct > 0 ? "+" : ""}
                    {pct}%{isBase ? " (current)" : ""}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">
                    {formatCurrency(adjPrice)}
                  </td>
                  <td
                    className={`text-right py-3 px-4 ${margin > 0 ? "text-gray-300" : "text-red-400"}`}
                  >
                    {formatCurrency(margin)}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">
                    {isFinite(beUnits) ? formatNumber(Math.ceil(beUnits)) : "N/A"}
                  </td>
                  <td className="text-right py-3 pl-4 text-gray-300">
                    {isFinite(beRevenue)
                      ? formatCurrency(Math.ceil(beRevenue))
                      : "N/A"}
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

export default function BreakEvenPage() {
  const [fixedCosts, setFixedCosts] = useState(250000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(35);
  const [pricePerUnit, setPricePerUnit] = useState(85);
  const [actualUnits, setActualUnits] = useState(6000);

  const metrics = useMemo(() => {
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    const contributionMarginPct =
      pricePerUnit > 0 ? (contributionMargin / pricePerUnit) * 100 : 0;
    const breakEvenUnits =
      contributionMargin > 0 ? fixedCosts / contributionMargin : Infinity;
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;

    const actualRevenue = actualUnits * pricePerUnit;
    const actualCosts = fixedCosts + variableCostPerUnit * actualUnits;
    const actualProfit = actualRevenue - actualCosts;

    const marginOfSafety = actualUnits - breakEvenUnits;
    const marginOfSafetyPct =
      actualUnits > 0 ? (marginOfSafety / actualUnits) * 100 : 0;

    const operatingLeverage =
      actualProfit !== 0
        ? (actualRevenue - variableCostPerUnit * actualUnits) / actualProfit
        : 0;

    return {
      contributionMargin,
      contributionMarginPct,
      breakEvenUnits,
      breakEvenRevenue,
      actualRevenue,
      actualCosts,
      actualProfit,
      marginOfSafety,
      marginOfSafetyPct,
      operatingLeverage,
    };
  }, [fixedCosts, variableCostPerUnit, pricePerUnit, actualUnits]);

  const insights: { icon: string; text: string }[] = [];

  if (metrics.actualProfit > 0) {
    insights.push({
      icon: "🟢",
      text: `At ${formatNumber(actualUnits)} units, the company generates a profit of ${formatCurrency(metrics.actualProfit)}. This is ${formatNumber(Math.round(metrics.marginOfSafety))} units above break-even.`,
    });
  } else if (metrics.actualProfit < 0) {
    insights.push({
      icon: "🔴",
      text: `At ${formatNumber(actualUnits)} units, the company is losing ${formatCurrency(Math.abs(metrics.actualProfit))}. It needs ${formatNumber(Math.ceil(metrics.breakEvenUnits - actualUnits))} more units to break even.`,
    });
  }

  if (metrics.marginOfSafetyPct > 0 && metrics.marginOfSafetyPct < 15) {
    insights.push({
      icon: "⚠️",
      text: `Margin of safety is only ${metrics.marginOfSafetyPct.toFixed(1)}%. A small drop in sales volume could push the company into losses. Consider reducing fixed costs or increasing prices.`,
    });
  } else if (metrics.marginOfSafetyPct >= 30) {
    insights.push({
      icon: "💪",
      text: `Strong margin of safety at ${metrics.marginOfSafetyPct.toFixed(1)}%. The company can absorb significant volume decreases before becoming unprofitable.`,
    });
  }

  if (metrics.contributionMarginPct < 25) {
    insights.push({
      icon: "📋",
      text: `Contribution margin of ${metrics.contributionMarginPct.toFixed(1)}% is thin. Even small increases in variable costs could significantly impact profitability. Explore cost reduction or price optimization.`,
    });
  }

  if (metrics.operatingLeverage > 5) {
    insights.push({
      icon: "📊",
      text: `High operating leverage (${metrics.operatingLeverage.toFixed(1)}x) means profits are very sensitive to volume changes. A 10% increase in sales would boost profits by ~${(10 * metrics.operatingLeverage).toFixed(0)}%.`,
    });
  }

  insights.push({
    icon: "💡",
    text: `Each additional unit sold beyond break-even generates ${formatCurrency(metrics.contributionMargin)} in profit. Use the sensitivity table below to see how pricing changes affect the break-even point.`,
  });

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
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs uppercase tracking-wider">
            Interactive Finance Tool
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Break-Even Analysis Tool
          </h1>
          <p className="text-gray-400 max-w-2xl font-medium">
            Calculate the exact point where revenue covers all costs. Adjust the
            inputs below and watch how break-even, margins, and profitability
            change in real time. Scroll down to see dynamic insights and
            sensitivity analysis.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Cost Structure
            </h3>
            <div className="space-y-4">
              <InputField
                label="Total Fixed Costs (annual)"
                value={fixedCosts}
                onChange={setFixedCosts}
                tooltip="Rent, salaries, insurance, depreciation — costs that don't change with volume"
              />
              <InputField
                label="Variable Cost per Unit"
                value={variableCostPerUnit}
                onChange={setVariableCostPerUnit}
                tooltip="Materials, labor, shipping — costs per unit produced"
              />
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Revenue & Volume
            </h3>
            <div className="space-y-4">
              <InputField
                label="Selling Price per Unit"
                value={pricePerUnit}
                onChange={setPricePerUnit}
                tooltip="Price charged to customers per unit"
              />
              <InputField
                label="Actual / Planned Units Sold"
                value={actualUnits}
                onChange={setActualUnits}
                prefix="#"
                tooltip="Current or projected sales volume"
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <MetricCard
            label="Break-Even Units"
            value={
              isFinite(metrics.breakEvenUnits)
                ? formatNumber(Math.ceil(metrics.breakEvenUnits))
                : "N/A"
            }
            color="text-emerald-400"
            subtitle="Units to cover all costs"
          />
          <MetricCard
            label="Break-Even Revenue"
            value={
              isFinite(metrics.breakEvenRevenue)
                ? formatCurrency(Math.ceil(metrics.breakEvenRevenue))
                : "N/A"
            }
            color="text-blue-400"
            subtitle="Revenue needed to break even"
          />
          <MetricCard
            label="Contribution Margin"
            value={`${formatCurrency(metrics.contributionMargin)} (${metrics.contributionMarginPct.toFixed(1)}%)`}
            color="text-amber-400"
            subtitle="Revenue minus variable cost/unit"
          />
          <MetricCard
            label="Margin of Safety"
            value={`${metrics.marginOfSafetyPct.toFixed(1)}%`}
            color={
              metrics.marginOfSafetyPct > 20
                ? "text-emerald-400"
                : metrics.marginOfSafetyPct > 0
                  ? "text-amber-400"
                  : "text-red-400"
            }
            subtitle={`${formatNumber(Math.round(metrics.marginOfSafety))} units above BE`}
          />
        </div>

        {/* Actual Performance */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <MetricCard
            label="Actual Revenue"
            value={formatCurrency(metrics.actualRevenue)}
            color="text-white"
            subtitle={`${formatNumber(actualUnits)} units × ${formatCurrency(pricePerUnit)}`}
          />
          <MetricCard
            label="Total Costs"
            value={formatCurrency(metrics.actualCosts)}
            color="text-white"
            subtitle={`${formatCurrency(fixedCosts)} fixed + ${formatCurrency(variableCostPerUnit * actualUnits)} variable`}
          />
          <MetricCard
            label="Net Profit / Loss"
            value={
              (metrics.actualProfit >= 0 ? "+" : "") +
              formatCurrency(metrics.actualProfit)
            }
            color={metrics.actualProfit >= 0 ? "text-emerald-400" : "text-red-400"}
            subtitle={`Operating leverage: ${metrics.operatingLeverage.toFixed(1)}x`}
          />
        </div>

        {/* Chart */}
        <div className="mb-10">
          <BreakEvenChart
            fixedCosts={fixedCosts}
            variableCostPerUnit={variableCostPerUnit}
            pricePerUnit={pricePerUnit}
            breakEvenUnits={metrics.breakEvenUnits}
            maxUnits={actualUnits}
          />
        </div>

        {/* Insights */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Key Insights & Recommendations
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            These insights update automatically as you change the input values
            above
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

        {/* Sensitivity Table */}
        <div className="mb-10">
          <SensitivityTable
            fixedCosts={fixedCosts}
            variableCostPerUnit={variableCostPerUnit}
            pricePerUnit={pricePerUnit}
          />
        </div>

        {/* Methodology */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Methodology
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-500">
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 font-medium">
                  Contribution Margin
                </span>{" "}
                = Selling Price − Variable Cost per Unit
              </div>
              <div>
                <span className="text-gray-300 font-medium">
                  Break-Even Units
                </span>{" "}
                = Fixed Costs ÷ Contribution Margin
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 font-medium">
                  Margin of Safety
                </span>{" "}
                = (Actual Units − BE Units) ÷ Actual Units × 100
              </div>
              <div>
                <span className="text-gray-300 font-medium">
                  Operating Leverage
                </span>{" "}
                = Contribution Margin Total ÷ Net Profit
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
