"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

function formatCurrency(num: number): string {
  if (Math.abs(num) >= 1000000)
    return "$" + (num / 1000000).toFixed(2) + "M";
  if (Math.abs(num) >= 1000) return "$" + (num / 1000).toFixed(0) + "K";
  return "$" + num.toFixed(0);
}

// ── Gauge Component ──
function Gauge({
  label,
  value,
  target = 1.0,
  min = 0.5,
  max = 1.5,
  subtitle,
}: {
  label: string;
  value: number;
  target?: number;
  min?: number;
  max?: number;
  subtitle: string;
}) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = -135 + pct * 270;
  const color =
    value >= 0.95
      ? "#22c55e"
      : value >= 0.85
        ? "#f59e0b"
        : "#ef4444";
  const statusText =
    value >= 0.95
      ? "On Track"
      : value >= 0.85
        ? "At Risk"
        : "Critical";

  const r = 52;
  const cx = 65;
  const cy = 65;

  const arcStart = {
    x: cx + r * Math.cos(((-135) * Math.PI) / 180),
    y: cy + r * Math.sin(((-135) * Math.PI) / 180),
  };
  const arcEnd = {
    x: cx + r * Math.cos(((135) * Math.PI) / 180),
    y: cy + r * Math.sin(((135) * Math.PI) / 180),
  };
  const filledEnd = {
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  };

  const largeArcBg = 1;
  const largeArcFill = pct > 0.5 ? 1 : 0;

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 flex flex-col items-center">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </div>
      <svg width="130" height="95" viewBox="0 0 130 95">
        {/* Background arc */}
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${largeArcBg} 1 ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${largeArcFill} 1 ${filledEnd.x} ${filledEnd.y}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Value text */}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          className="text-[22px] font-bold"
          fill={color}
        >
          {value.toFixed(2)}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          className="text-[9px]"
          fill="rgba(255,255,255,0.4)"
        >
          {statusText}
        </text>
      </svg>
      <div className="text-xs text-gray-600 mt-1 text-center">{subtitle}</div>
    </div>
  );
}

// ── Mini Trend Chart ──
function TrendChart({
  data,
  label,
  color,
}: {
  data: number[];
  label: string;
  color: string;
}) {
  const width = 280;
  const height = 100;
  const pad = { top: 15, right: 10, bottom: 25, left: 35 };
  const iw = width - pad.left - pad.right;
  const ih = height - pad.top - pad.bottom;

  const minVal = Math.min(...data, 0.7);
  const maxVal = Math.max(...data, 1.3);
  const range = maxVal - minVal || 1;

  const points = data
    .map((v, i) => {
      const x = pad.left + (i / (data.length - 1)) * iw;
      const y = pad.top + ih - ((v - minVal) / range) * ih;
      return `${x},${y}`;
    })
    .join(" ");

  const targetY = pad.top + ih - ((1.0 - minVal) / range) * ih;

  return (
    <div>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        {label} Trend
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Target line */}
        <line
          x1={pad.left}
          y1={targetY}
          x2={pad.left + iw}
          y2={targetY}
          stroke="rgba(255,255,255,0.15)"
          strokeDasharray="4,4"
        />
        <text x={pad.left - 4} y={targetY + 3} textAnchor="end" className="text-[8px] fill-gray-600">
          1.00
        </text>

        {/* Data line */}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
        {data.map((v, i) => {
          const x = pad.left + (i / (data.length - 1)) * iw;
          const y = pad.top + ih - ((v - minVal) / range) * ih;
          return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
        })}

        {/* Month labels */}
        {data.map((_, i) => {
          const x = pad.left + (i / (data.length - 1)) * iw;
          return (
            <text key={i} x={x} y={height - 5} textAnchor="middle" className="text-[8px] fill-gray-600">
              M{i + 1}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ── Gantt Chart ──
interface Task {
  id: number;
  name: string;
  start: number;
  duration: number;
  progress: number;
  status: "complete" | "in-progress" | "behind" | "upcoming";
}

function GanttChart({ tasks, currentMonth }: { tasks: Task[]; currentMonth: number }) {
  const totalMonths = 12;
  const barHeight = 24;
  const rowHeight = 36;
  const labelWidth = 180;
  const chartWidth = 500;
  const monthWidth = chartWidth / totalMonths;

  return (
    <div className="overflow-x-auto">
      <svg
        width={labelWidth + chartWidth + 20}
        height={tasks.length * rowHeight + 40}
        viewBox={`0 0 ${labelWidth + chartWidth + 20} ${tasks.length * rowHeight + 40}`}
        className="w-full min-w-[600px]"
      >
        {/* Month headers */}
        {Array.from({ length: totalMonths }, (_, i) => (
          <g key={i}>
            <text
              x={labelWidth + i * monthWidth + monthWidth / 2}
              y={15}
              textAnchor="middle"
              className="text-[9px] fill-gray-500"
            >
              M{i + 1}
            </text>
            <line
              x1={labelWidth + i * monthWidth}
              y1={22}
              x2={labelWidth + i * monthWidth}
              y2={tasks.length * rowHeight + 30}
              stroke="rgba(255,255,255,0.03)"
            />
          </g>
        ))}

        {/* Current month indicator */}
        <rect
          x={labelWidth + (currentMonth - 1) * monthWidth}
          y={22}
          width={monthWidth}
          height={tasks.length * rowHeight + 8}
          fill="rgba(59,130,246,0.05)"
        />

        {/* Tasks */}
        {tasks.map((task, i) => {
          const y = 28 + i * rowHeight;
          const barX = labelWidth + (task.start - 1) * monthWidth;
          const barW = task.duration * monthWidth;
          const progressW = barW * task.progress;

          const colors = {
            complete: { bg: "rgba(34,197,94,0.15)", fill: "#22c55e" },
            "in-progress": { bg: "rgba(59,130,246,0.15)", fill: "#3b82f6" },
            behind: { bg: "rgba(239,68,68,0.15)", fill: "#ef4444" },
            upcoming: { bg: "rgba(255,255,255,0.05)", fill: "rgba(255,255,255,0.2)" },
          };

          const c = colors[task.status];

          return (
            <g key={task.id}>
              {/* Task label */}
              <text x={8} y={y + barHeight / 2 + 4} className="text-[10px] fill-gray-400">
                {task.name}
              </text>
              {/* Background bar */}
              <rect x={barX} y={y} width={barW} height={barHeight} rx={4} fill={c.bg} />
              {/* Progress bar */}
              <rect x={barX} y={y} width={progressW} height={barHeight} rx={4} fill={c.fill} opacity={0.7} />
              {/* Progress text */}
              <text
                x={barX + barW + 6}
                y={y + barHeight / 2 + 4}
                className="text-[9px] fill-gray-500"
              >
                {Math.round(task.progress * 100)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Status Badge ──
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Red: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Yellow}`}>
      {status}
    </span>
  );
}

// ── Main Page ──
export default function EVMTrackerPage() {
  const [currentMonth, setCurrentMonth] = useState(7);

  // Project: ERP Implementation — 12 months, $2.4M budget
  const projectData = useMemo(() => {
    const totalBudget = 2400000;
    const monthlyBudgets = [
      150000, 180000, 220000, 250000, 280000, 300000,
      280000, 250000, 200000, 150000, 80000, 60000,
    ];

    // Cumulative planned value
    const pvCumulative = monthlyBudgets.reduce<number[]>((acc, v) => {
      acc.push((acc[acc.length - 1] || 0) + v);
      return acc;
    }, []);

    // Simulated actual data (some months over budget, some behind schedule)
    const evMultipliers = [0.95, 0.88, 0.85, 0.90, 0.92, 0.88, 0.91];
    const acMultipliers = [1.02, 1.08, 1.12, 1.05, 1.03, 1.10, 1.06];

    const evCumulative: number[] = [];
    const acCumulative: number[] = [];
    const spiHistory: number[] = [];
    const cpiHistory: number[] = [];

    for (let i = 0; i < currentMonth; i++) {
      const ev = pvCumulative[i] * evMultipliers[Math.min(i, evMultipliers.length - 1)];
      const ac = pvCumulative[i] * acMultipliers[Math.min(i, acMultipliers.length - 1)];
      evCumulative.push(ev);
      acCumulative.push(ac);
      spiHistory.push(ev / pvCumulative[i]);
      cpiHistory.push(ev / ac);
    }

    const pv = pvCumulative[currentMonth - 1];
    const ev = evCumulative[currentMonth - 1];
    const ac = acCumulative[currentMonth - 1];

    const spi = ev / pv;
    const cpi = ev / ac;
    const sv = ev - pv;
    const cv = ev - ac;

    const bac = totalBudget;
    const eac = bac / cpi;
    const etc = eac - ac;
    const vac = bac - eac;
    const tcpi = (bac - ev) / (bac - ac);
    const percentComplete = ev / bac;
    const percentSpent = ac / bac;

    return {
      totalBudget,
      pv,
      ev,
      ac,
      spi,
      cpi,
      sv,
      cv,
      bac,
      eac,
      etc,
      vac,
      tcpi,
      percentComplete,
      percentSpent,
      spiHistory,
      cpiHistory,
      pvCumulative,
      evCumulative,
      acCumulative,
    };
  }, [currentMonth]);

  const tasks: Task[] = [
    { id: 1, name: "Requirements & Planning", start: 1, duration: 2, progress: 1.0, status: "complete" },
    { id: 2, name: "System Design", start: 2, duration: 2, progress: 1.0, status: "complete" },
    { id: 3, name: "Infrastructure Setup", start: 3, duration: 2, progress: 1.0, status: "complete" },
    { id: 4, name: "Core Module Dev", start: 4, duration: 4, progress: currentMonth >= 7 ? 0.85 : Math.min((currentMonth - 4) / 4, 1), status: currentMonth >= 8 ? "complete" : currentMonth >= 4 ? "behind" : "upcoming" },
    { id: 5, name: "Integration & APIs", start: 6, duration: 3, progress: currentMonth >= 6 ? Math.min((currentMonth - 6) / 3, 0.6) : 0, status: currentMonth >= 6 ? "in-progress" : "upcoming" },
    { id: 6, name: "Data Migration", start: 7, duration: 2, progress: currentMonth >= 7 ? 0.3 : 0, status: currentMonth >= 7 ? "in-progress" : "upcoming" },
    { id: 7, name: "UAT & Testing", start: 8, duration: 2, progress: 0, status: "upcoming" },
    { id: 8, name: "Training & Change Mgmt", start: 9, duration: 2, progress: 0, status: "upcoming" },
    { id: 9, name: "Go-Live & Support", start: 11, duration: 2, progress: 0, status: "upcoming" },
  ];

  const overallStatus =
    projectData.spi >= 0.95 && projectData.cpi >= 0.95
      ? "Green"
      : projectData.spi >= 0.85 && projectData.cpi >= 0.85
        ? "Yellow"
        : "Red";

  const insights: { icon: string; text: string }[] = [];

  if (projectData.spi < 0.9) {
    insights.push({
      icon: "🔴",
      text: `Schedule Performance Index at ${projectData.spi.toFixed(2)} indicates the project is significantly behind schedule. For every $1 of work planned, only $${projectData.spi.toFixed(2)} has been completed.`,
    });
  } else if (projectData.spi < 0.95) {
    insights.push({
      icon: "🟡",
      text: `Schedule Performance Index at ${projectData.spi.toFixed(2)} — slightly behind schedule. Monitor closely and consider fast-tracking or adding resources to critical path activities.`,
    });
  }

  if (projectData.cpi < 0.9) {
    insights.push({
      icon: "🔴",
      text: `Cost Performance Index at ${projectData.cpi.toFixed(2)} means the project is significantly over budget. For every $1 spent, only $${projectData.cpi.toFixed(2)} of value was earned. Estimated cost overrun: ${formatCurrency(Math.abs(projectData.vac))}.`,
    });
  } else if (projectData.cpi < 0.95) {
    insights.push({
      icon: "🟡",
      text: `Cost Performance Index at ${projectData.cpi.toFixed(2)} — trending over budget. Review upcoming work packages for cost optimization opportunities.`,
    });
  }

  if (projectData.tcpi > 1.1) {
    insights.push({
      icon: "⚠️",
      text: `To-Complete Performance Index is ${projectData.tcpi.toFixed(2)} — the remaining work must be performed at ${((projectData.tcpi - 1) * 100).toFixed(0)}% better efficiency than budgeted to finish on budget. This is very challenging.`,
    });
  }

  insights.push({
    icon: "📊",
    text: `Project is ${(projectData.percentComplete * 100).toFixed(1)}% complete with ${(projectData.percentSpent * 100).toFixed(1)}% of budget spent. Estimate at Completion: ${formatCurrency(projectData.eac)} vs. budget of ${formatCurrency(projectData.bac)}.`,
  });

  insights.push({
    icon: "💡",
    text: `Recommended actions: (1) Conduct root cause analysis on cost variances, (2) Review resource allocation on behind-schedule tasks, (3) Update risk register with current performance trends.`,
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Portfolio
          </Link>
          <span className="text-sm text-gray-500">Project Management</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs uppercase tracking-wider">
            PMP® — Earned Value Management
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            EVM Project Tracker
          </h1>
          <p className="text-gray-400 max-w-2xl font-medium">
            Monitor project health using Earned Value Management metrics. This
            dashboard tracks a fictional 12-month ERP implementation project
            ($2.4M budget). Use the month slider to see how performance evolves
            over time.
          </p>
        </div>

        {/* Project Overview Bar */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold">ERP System Implementation</div>
            <div className="text-sm text-gray-500">
              Acme Corp — 12 Months — {formatCurrency(projectData.bac)} Budget
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={overallStatus} />
            <div className="text-right">
              <div className="text-sm text-gray-500">Month</div>
              <div className="text-xl font-bold text-white">{currentMonth} / 12</div>
            </div>
          </div>
        </div>

        {/* Month Slider */}
        <div className="bg-white/[0.03] border border-blue-500/10 rounded-xl p-5 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">
              Project Timeline
            </span>
            <span className="text-sm text-white font-semibold">
              Month {currentMonth} of 12
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Month 1</span>
            <span>Month 7 (current)</span>
          </div>
        </div>

        {/* SPI / CPI Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Gauge
            label="SPI"
            value={projectData.spi}
            subtitle="Schedule Performance"
          />
          <Gauge
            label="CPI"
            value={projectData.cpi}
            subtitle="Cost Performance"
          />
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Schedule Variance
            </div>
            <div className={`text-2xl font-bold ${projectData.sv >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {formatCurrency(projectData.sv)}
            </div>
            <div className="text-xs text-gray-600 mt-1">EV − PV</div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Cost Variance
            </div>
            <div className={`text-2xl font-bold ${projectData.cv >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {formatCurrency(projectData.cv)}
            </div>
            <div className="text-xs text-gray-600 mt-1">EV − AC</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-gray-300">Work Completed</span>
              <span className="text-sm font-semibold text-blue-400">
                {(projectData.percentComplete * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${projectData.percentComplete * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-gray-300">Budget Spent</span>
              <span className={`text-sm font-semibold ${projectData.percentSpent > projectData.percentComplete ? "text-red-400" : "text-emerald-400"}`}>
                {(projectData.percentSpent * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${projectData.percentSpent > projectData.percentComplete ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: `${projectData.percentSpent * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* EVM Financial Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Budget at Completion", value: formatCurrency(projectData.bac), color: "text-white" },
            { label: "Estimate at Completion", value: formatCurrency(projectData.eac), color: projectData.eac > projectData.bac ? "text-red-400" : "text-emerald-400" },
            { label: "Estimate to Complete", value: formatCurrency(projectData.etc), color: "text-amber-400" },
            { label: "Variance at Completion", value: formatCurrency(projectData.vac), color: projectData.vac >= 0 ? "text-emerald-400" : "text-red-400" },
          ].map((m) => (
            <div key={m.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{m.label}</div>
              <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* TCPI */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-gray-300">
                To-Complete Performance Index (TCPI)
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Required efficiency for remaining work to finish on budget
              </div>
            </div>
            <div className={`text-3xl font-bold ${projectData.tcpi > 1.1 ? "text-red-400" : projectData.tcpi > 1.0 ? "text-amber-400" : "text-emerald-400"}`}>
              {projectData.tcpi.toFixed(2)}
            </div>
          </div>
        </div>

        {/* SPI/CPI Trend Charts */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <TrendChart
              data={projectData.spiHistory}
              label="SPI"
              color="#3b82f6"
            />
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <TrendChart
              data={projectData.cpiHistory}
              label="CPI"
              color="#f59e0b"
            />
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-widest text-gray-400 mb-4">
            Project Schedule — Gantt View
          </h3>
          <GanttChart tasks={tasks} currentMonth={currentMonth} />
        </div>

        {/* Insights */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-widest text-gray-400 mb-2">
            Project Health — Insights & Recommendations
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            These insights update as you move the month slider above
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

        {/* Methodology */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-bold uppercase tracking-widest text-gray-400 mb-4">
            EVM Methodology
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-500">
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 font-semibold">PV (Planned Value)</span> — Budgeted cost of work scheduled
              </div>
              <div>
                <span className="text-gray-300 font-semibold">EV (Earned Value)</span> — Budgeted cost of work performed
              </div>
              <div>
                <span className="text-gray-300 font-semibold">AC (Actual Cost)</span> — Actual cost of work performed
              </div>
              <div>
                <span className="text-gray-300 font-semibold">SPI</span> = EV ÷ PV (schedule efficiency)
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 font-semibold">CPI</span> = EV ÷ AC (cost efficiency)
              </div>
              <div>
                <span className="text-gray-300 font-semibold">EAC</span> = BAC ÷ CPI (estimated total cost)
              </div>
              <div>
                <span className="text-gray-300 font-semibold">VAC</span> = BAC − EAC (projected cost variance)
              </div>
              <div>
                <span className="text-gray-300 font-semibold">TCPI</span> = (BAC − EV) ÷ (BAC − AC) (required future efficiency)
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
