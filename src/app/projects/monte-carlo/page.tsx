"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

function formatCurrency(num: number): string {
  const abs = Math.abs(num);
  if (abs >= 1000000) return (num < 0 ? "-" : "") + "$" + (abs / 1000000).toFixed(2) + "M";
  if (abs >= 1000) return (num < 0 ? "-" : "") + "$" + (abs / 1000).toFixed(1) + "K";
  return "$" + num.toFixed(0);
}

function InputField({
  label,
  value,
  onChange,
  prefix = "$",
  tooltip,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  tooltip?: string;
  step?: number;
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
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-white px-2 py-2.5 text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}

// ── Histogram ──
function Histogram({
  data,
  percentiles,
  initialInvestment,
}: {
  data: number[];
  percentiles: { p10: number; p25: number; p50: number; p75: number; p90: number };
  initialInvestment: number;
}) {
  const width = 650;
  const height = 280;
  const pad = { top: 20, right: 15, bottom: 45, left: 55 };
  const iw = width - pad.left - pad.right;
  const ih = height - pad.top - pad.bottom;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const numBins = 40;
  const binWidth = range / numBins;
  const bins = Array(numBins).fill(0);

  data.forEach((v) => {
    const idx = Math.min(Math.floor((v - minVal) / binWidth), numBins - 1);
    bins[idx]++;
  });

  const maxBin = Math.max(...bins);
  const barW = iw / numBins;

  // Find which bin the initial investment falls into
  const breakEvenBin = Math.floor((initialInvestment - minVal) / binWidth);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const val = maxBin * pct;
        const y = pad.top + ih - (pct * ih);
        return (
          <g key={pct}>
            <line x1={pad.left} y1={y} x2={pad.left + iw} y2={y} stroke="rgba(255,255,255,0.04)" />
          </g>
        );
      })}

      {/* Bars */}
      {bins.map((count, i) => {
        const x = pad.left + i * barW;
        const barH = (count / maxBin) * ih;
        const y = pad.top + ih - barH;
        const isLoss = i < breakEvenBin;

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW - 1}
            height={barH}
            rx={1}
            fill={isLoss ? "rgba(239,68,68,0.6)" : "rgba(34,197,94,0.6)"}
          />
        );
      })}

      {/* Percentile lines */}
      {[
        { val: percentiles.p10, label: "P10", color: "#ef4444" },
        { val: percentiles.p50, label: "P50 (Median)", color: "#f59e0b" },
        { val: percentiles.p90, label: "P90", color: "#22c55e" },
      ].map((p) => {
        const x = pad.left + ((p.val - minVal) / range) * iw;
        return (
          <g key={p.label}>
            <line x1={x} y1={pad.top} x2={x} y2={pad.top + ih} stroke={p.color} strokeWidth="1.5" strokeDasharray="4,3" />
            <text x={x} y={pad.top - 5} textAnchor="middle" className="text-[9px] font-bold" fill={p.color}>
              {p.label}: {formatCurrency(p.val)}
            </text>
          </g>
        );
      })}

      {/* Break-even line */}
      {(() => {
        const x = pad.left + ((initialInvestment - minVal) / range) * iw;
        return (
          <g>
            <line x1={x} y1={pad.top} x2={x} y2={pad.top + ih} stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2,2" />
            <text x={x} y={pad.top + ih + 14} textAnchor="middle" className="text-[8px] font-bold" fill="rgba(255,255,255,0.5)">
              Break-Even
            </text>
          </g>
        );
      })()}

      {/* X-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const val = minVal + pct * range;
        const x = pad.left + pct * iw;
        return (
          <text key={pct} x={x} y={pad.top + ih + 30} textAnchor="middle" className="text-[9px] fill-gray-500 font-semibold">
            {formatCurrency(val)}
          </text>
        );
      })}

      {/* Labels */}
      <text x={pad.left + iw / 2} y={height - 3} textAnchor="middle" className="text-[10px] fill-gray-500 font-semibold">
        Final Portfolio Value
      </text>
    </svg>
  );
}

// ── Path Chart (sample paths) ──
function PathChart({
  paths,
  years,
  initialInvestment,
}: {
  paths: number[][];
  years: number;
  initialInvestment: number;
}) {
  const width = 650;
  const height = 250;
  const pad = { top: 15, right: 15, bottom: 35, left: 60 };
  const iw = width - pad.left - pad.right;
  const ih = height - pad.top - pad.bottom;

  const allVals = paths.flat();
  const minVal = Math.min(...allVals) * 0.9;
  const maxVal = Math.max(...allVals) * 1.05;
  const range = maxVal - minVal || 1;

  const colors = [
    "rgba(59,130,246,0.4)", "rgba(34,197,94,0.4)", "rgba(239,68,68,0.4)",
    "rgba(245,158,11,0.4)", "rgba(168,85,247,0.4)", "rgba(6,182,212,0.4)",
    "rgba(236,72,153,0.4)", "rgba(132,204,22,0.4)", "rgba(251,146,60,0.4)",
    "rgba(99,102,241,0.4)",
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const val = minVal + pct * range;
        const y = pad.top + ih - pct * ih;
        return (
          <g key={pct}>
            <line x1={pad.left} y1={y} x2={pad.left + iw} y2={y} stroke="rgba(255,255,255,0.04)" />
            <text x={pad.left - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-gray-600 font-medium">
              {formatCurrency(val)}
            </text>
          </g>
        );
      })}

      {/* Initial investment line */}
      {(() => {
        const y = pad.top + ih - ((initialInvestment - minVal) / range) * ih;
        return (
          <line x1={pad.left} y1={y} x2={pad.left + iw} y2={y} stroke="rgba(255,255,255,0.2)" strokeDasharray="4,3" />
        );
      })()}

      {/* Paths */}
      {paths.map((path, pi) => {
        const points = path
          .map((v, i) => {
            const x = pad.left + (i / (path.length - 1)) * iw;
            const y = pad.top + ih - ((v - minVal) / range) * ih;
            return `${x},${y}`;
          })
          .join(" ");
        return <polyline key={pi} points={points} fill="none" stroke={colors[pi % colors.length]} strokeWidth="1.5" />;
      })}

      {/* X-axis */}
      {Array.from({ length: Math.min(years + 1, 11) }, (_, i) => {
        const yr = Math.round((i / Math.min(years, 10)) * years);
        const x = pad.left + (yr / years) * iw;
        return (
          <text key={i} x={x} y={pad.top + ih + 18} textAnchor="middle" className="text-[9px] fill-gray-500 font-semibold">
            Yr {yr}
          </text>
        );
      })}

      <text x={pad.left + iw / 2} y={height - 3} textAnchor="middle" className="text-[10px] fill-gray-500 font-semibold">
        Investment Timeline
      </text>
    </svg>
  );
}

// ── Simulation Engine ──
function runSimulation(
  initialInvestment: number,
  annualReturn: number,
  annualVolatility: number,
  years: number,
  numSimulations: number
): { finalValues: number[]; samplePaths: number[][] } {
  const dt = 1;
  const finalValues: number[] = [];
  const samplePaths: number[][] = [];
  const numSamplePaths = 10;

  // Box-Muller transform for normal distribution
  function randn(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  for (let s = 0; s < numSimulations; s++) {
    let value = initialInvestment;
    const path: number[] = [value];

    for (let t = 0; t < years; t++) {
      const drift = (annualReturn - 0.5 * annualVolatility * annualVolatility) * dt;
      const diffusion = annualVolatility * Math.sqrt(dt) * randn();
      value = value * Math.exp(drift + diffusion);
      path.push(value);
    }

    finalValues.push(value);
    if (s < numSamplePaths) {
      samplePaths.push(path);
    }
  }

  return { finalValues, samplePaths };
}

// ── Main Page ──
export default function MonteCarloPage() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [annualVolatility, setAnnualVolatility] = useState(18);
  const [years, setYears] = useState(10);
  const [numSimulations, setNumSimulations] = useState(5000);
  const [seed, setSeed] = useState(0);

  const runSim = useCallback(() => setSeed((s) => s + 1), []);

  const results = useMemo(() => {
    const { finalValues, samplePaths } = runSimulation(
      initialInvestment,
      annualReturn / 100,
      annualVolatility / 100,
      years,
      numSimulations
    );

    const sorted = [...finalValues].sort((a, b) => a - b);
    const percentile = (p: number) => sorted[Math.floor(p * sorted.length)];

    const p10 = percentile(0.1);
    const p25 = percentile(0.25);
    const p50 = percentile(0.5);
    const p75 = percentile(0.75);
    const p90 = percentile(0.9);
    const mean = finalValues.reduce((a, b) => a + b, 0) / finalValues.length;
    const lossCount = finalValues.filter((v) => v < initialInvestment).length;
    const lossProbability = (lossCount / finalValues.length) * 100;
    const maxVal = Math.max(...finalValues);
    const minVal = Math.min(...finalValues);

    return {
      finalValues,
      samplePaths,
      percentiles: { p10, p25, p50, p75, p90 },
      mean,
      lossProbability,
      maxVal,
      minVal,
      lossCount,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialInvestment, annualReturn, annualVolatility, years, numSimulations, seed]);

  const insights: { icon: string; text: string }[] = [];

  if (results.lossProbability < 10) {
    insights.push({
      icon: "🟢",
      text: `Only ${results.lossProbability.toFixed(1)}% probability of losing money over ${years} years. The long time horizon significantly reduces downside risk.`,
    });
  } else if (results.lossProbability < 30) {
    insights.push({
      icon: "🟡",
      text: `${results.lossProbability.toFixed(1)}% probability of losing money. Consider extending the time horizon or reducing volatility exposure to improve risk profile.`,
    });
  } else {
    insights.push({
      icon: "🔴",
      text: `${results.lossProbability.toFixed(1)}% probability of loss is significant. This portfolio carries substantial risk over the ${years}-year period.`,
    });
  }

  const medianReturn = ((results.percentiles.p50 / initialInvestment - 1) * 100);
  insights.push({
    icon: "📊",
    text: `Median outcome: ${formatCurrency(results.percentiles.p50)} (${medianReturn >= 0 ? "+" : ""}${medianReturn.toFixed(0)}% total return). The mean outcome is ${formatCurrency(results.mean)} — skewed higher due to compounding effects.`,
  });

  const spread = results.percentiles.p90 - results.percentiles.p10;
  insights.push({
    icon: "📏",
    text: `The 80% confidence interval ranges from ${formatCurrency(results.percentiles.p10)} to ${formatCurrency(results.percentiles.p90)} — a spread of ${formatCurrency(spread)}. This represents the range of most likely outcomes.`,
  });

  if (annualVolatility > 25) {
    insights.push({
      icon: "⚠️",
      text: `Volatility of ${annualVolatility}% is very high. The wide distribution of outcomes means actual results could vary dramatically from the median. Consider diversification to reduce portfolio volatility.`,
    });
  }

  insights.push({
    icon: "💡",
    text: `This simulation uses Geometric Brownian Motion with ${numSimulations.toLocaleString()} random paths. Click "Run New Simulation" to generate a fresh set of random scenarios and observe how results vary.`,
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Portfolio
          </Link>
          <span className="text-sm text-gray-500">Risk Analysis</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs uppercase tracking-wider">
            Probabilistic Risk Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Monte Carlo Investment Simulator
          </h1>
          <p className="text-gray-400 max-w-2xl font-medium">
            Run thousands of random simulations to model the range of possible
            investment outcomes. Adjust parameters to see how return, volatility,
            and time horizon affect risk and reward probability.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-4">
              Investment
            </h3>
            <div className="space-y-4">
              <InputField
                label="Initial Investment"
                value={initialInvestment}
                onChange={setInitialInvestment}
                tooltip="Starting portfolio value"
              />
              <InputField
                label="Time Horizon"
                value={years}
                onChange={(v) => setYears(Math.max(1, Math.min(30, v)))}
                prefix="Yrs"
                tooltip="Number of years to simulate"
              />
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-4">
              Market Assumptions
            </h3>
            <div className="space-y-4">
              <InputField
                label="Expected Annual Return"
                value={annualReturn}
                onChange={setAnnualReturn}
                prefix="%"
                step={0.5}
                tooltip="Average annual return (e.g., S&P 500 historical ~10%)"
              />
              <InputField
                label="Annual Volatility (Std Dev)"
                value={annualVolatility}
                onChange={setAnnualVolatility}
                prefix="%"
                step={0.5}
                tooltip="Annual standard deviation (e.g., S&P 500 historical ~15-20%)"
              />
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-4">
              Simulation
            </h3>
            <div className="space-y-4">
              <InputField
                label="Number of Simulations"
                value={numSimulations}
                onChange={(v) => setNumSimulations(Math.max(100, Math.min(10000, v)))}
                prefix="#"
                tooltip="More simulations = more stable results (100-10,000)"
              />
              <button
                onClick={runSim}
                className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors mt-2"
              >
                🎲 Run New Simulation
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Median Outcome", value: formatCurrency(results.percentiles.p50), color: "text-white" },
            { label: "Mean Outcome", value: formatCurrency(results.mean), color: "text-white" },
            { label: "Best Case (P90)", value: formatCurrency(results.percentiles.p90), color: "text-emerald-400" },
            { label: "Worst Case (P10)", value: formatCurrency(results.percentiles.p10), color: "text-red-400" },
            { label: "Probability of Loss", value: results.lossProbability.toFixed(1) + "%", color: results.lossProbability < 15 ? "text-emerald-400" : results.lossProbability < 30 ? "text-amber-400" : "text-red-400" },
          ].map((m) => (
            <div key={m.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                {m.label}
              </div>
              <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Histogram */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-2">
            Distribution of Final Portfolio Values
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            {numSimulations.toLocaleString()} simulated outcomes — red bars = loss, green bars = gain vs. initial investment
          </p>
          <Histogram
            data={results.finalValues}
            percentiles={results.percentiles}
            initialInvestment={initialInvestment}
          />
        </div>

        {/* Sample Paths */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-2">
            Sample Investment Paths
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            10 randomly selected portfolio trajectories over the {years}-year period
          </p>
          <PathChart
            paths={results.samplePaths}
            years={years}
            initialInvestment={initialInvestment}
          />
        </div>

        {/* Percentile Table */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-4">
            Outcome Distribution Table
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 font-bold py-2">Percentile</th>
                  <th className="text-right text-gray-400 font-bold py-2 px-4">Portfolio Value</th>
                  <th className="text-right text-gray-400 font-bold py-2 px-4">Total Return</th>
                  <th className="text-right text-gray-400 font-bold py-2 px-4">Annualized</th>
                  <th className="text-right text-gray-400 font-bold py-2">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "P10 (Pessimistic)", val: results.percentiles.p10, desc: "90% chance of doing better" },
                  { label: "P25", val: results.percentiles.p25, desc: "75% chance of doing better" },
                  { label: "P50 (Median)", val: results.percentiles.p50, desc: "Equal chance above/below" },
                  { label: "P75", val: results.percentiles.p75, desc: "25% chance of doing better" },
                  { label: "P90 (Optimistic)", val: results.percentiles.p90, desc: "10% chance of doing better" },
                ].map((row) => {
                  const totalReturn = ((row.val / initialInvestment) - 1) * 100;
                  const annualized = (Math.pow(row.val / initialInvestment, 1 / years) - 1) * 100;
                  return (
                    <tr key={row.label} className="border-b border-white/5">
                      <td className="py-2.5 text-gray-300 font-semibold">{row.label}</td>
                      <td className="text-right py-2.5 px-4 text-white font-bold">{formatCurrency(row.val)}</td>
                      <td className={`text-right py-2.5 px-4 font-semibold ${totalReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(1)}%
                      </td>
                      <td className={`text-right py-2.5 px-4 font-semibold ${annualized >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {annualized >= 0 ? "+" : ""}{annualized.toFixed(1)}%/yr
                      </td>
                      <td className="text-right py-2.5 text-gray-500 text-xs">{row.desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-2">
            Risk Analysis — Insights & Recommendations
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            These insights update as you change assumptions and re-run the simulation
          </p>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                <span className="text-lg flex-shrink-0">{insight.icon}</span>
                <p className="text-sm text-gray-400 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-4">
            Methodology
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-500">
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 font-semibold">Model</span> — Geometric Brownian Motion (GBM), the standard model for financial asset price simulation
              </div>
              <div>
                <span className="text-gray-300 font-semibold">Formula</span> — S(t+1) = S(t) × exp((μ − σ²/2)Δt + σ√Δt × Z) where Z ~ N(0,1)
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 font-semibold">Random Generation</span> — Box-Muller transform for normally distributed random variables
              </div>
              <div>
                <span className="text-gray-300 font-semibold">Application</span> — Portfolio risk analysis, retirement planning, project cost estimation, Value at Risk (VaR)
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
