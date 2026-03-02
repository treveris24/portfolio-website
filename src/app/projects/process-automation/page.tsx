"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Task {
  id: string;
  name: string;
  category: string;
  owner: string;
  dayDue: number;
  estimatedMinutes: number;
  automationStatus: "manual" | "semi-automated" | "fully-automated";
  dependencies: string[];
  description: string;
}

const CLOSE_TASKS: Task[] = [
  // Day 1
  { id: "T01", name: "Cut off AP invoices", category: "Accounts Payable", owner: "AP Team", dayDue: 1, estimatedMinutes: 60, automationStatus: "fully-automated", dependencies: [], description: "System automatically blocks AP invoice entry after midnight on close date. Email notification sent to all vendors." },
  { id: "T02", name: "Cut off AR billing", category: "Accounts Receivable", owner: "AR Team", dayDue: 1, estimatedMinutes: 45, automationStatus: "fully-automated", dependencies: [], description: "Automated billing cutoff with system-generated report of all pending invoices. Exceptions flagged for review." },
  { id: "T03", name: "Download bank statements", category: "Cash Management", owner: "Treasury", dayDue: 1, estimatedMinutes: 30, automationStatus: "fully-automated", dependencies: [], description: "API integration pulls bank statements from all 6 accounts automatically. Reconciliation file prepared." },
  { id: "T04", name: "Run inventory valuation report", category: "Inventory", owner: "Cost Accounting", dayDue: 1, estimatedMinutes: 90, automationStatus: "semi-automated", dependencies: [], description: "ERP generates inventory snapshot. Cost accountant reviews for anomalies and approves adjustments." },

  // Day 2
  { id: "T05", name: "Complete bank reconciliation", category: "Cash Management", owner: "Treasury", dayDue: 2, estimatedMinutes: 120, automationStatus: "semi-automated", dependencies: ["T03"], description: "Auto-matching handles 92% of transactions. Remaining 8% flagged for manual review and matching." },
  { id: "T06", name: "Post depreciation entries", category: "Fixed Assets", owner: "Fixed Assets", dayDue: 2, estimatedMinutes: 15, automationStatus: "fully-automated", dependencies: [], description: "Scheduled job calculates and posts depreciation for all asset classes. Summary report emailed to controller." },
  { id: "T07", name: "Reconcile intercompany balances", category: "Intercompany", owner: "FP&A", dayDue: 2, estimatedMinutes: 180, automationStatus: "semi-automated", dependencies: ["T01", "T02"], description: "System matches IC transactions across 4 entities. Discrepancies auto-escalated to entity controllers." },
  { id: "T08", name: "Accrue payroll & benefits", category: "Payroll", owner: "HR/Payroll", dayDue: 2, estimatedMinutes: 45, automationStatus: "fully-automated", dependencies: [], description: "Payroll system calculates accruals based on pay calendar. Journal entry auto-posted to GL." },

  // Day 3
  { id: "T09", name: "Review revenue recognition", category: "Revenue", owner: "Revenue Accounting", dayDue: 3, estimatedMinutes: 150, automationStatus: "semi-automated", dependencies: ["T02"], description: "ASC 606 engine processes contracts. Revenue accountant reviews exceptions and multi-element arrangements." },
  { id: "T10", name: "Post accruals & prepaids", category: "General Ledger", owner: "GL Team", dayDue: 3, estimatedMinutes: 90, automationStatus: "semi-automated", dependencies: ["T01"], description: "Recurring entries auto-posted. Non-standard accruals calculated by template and reviewed before posting." },
  { id: "T11", name: "Reconcile all BS accounts", category: "General Ledger", owner: "GL Team", dayDue: 3, estimatedMinutes: 240, automationStatus: "semi-automated", dependencies: ["T05", "T06", "T07", "T08"], description: "BlackLine auto-certifies low-risk accounts (65%). Medium/high risk accounts prepared for manual review." },

  // Day 4
  { id: "T12", name: "Prepare variance analysis", category: "FP&A", owner: "FP&A", dayDue: 4, estimatedMinutes: 120, automationStatus: "semi-automated", dependencies: ["T09", "T10", "T11"], description: "Dashboard auto-generates vs. budget/forecast/prior year. FP&A adds commentary for material variances (>5%)." },
  { id: "T13", name: "Generate financial statements", category: "Reporting", owner: "Controller", dayDue: 4, estimatedMinutes: 30, automationStatus: "fully-automated", dependencies: ["T11"], description: "One-click generation of P&L, Balance Sheet, Cash Flow. Formatting and consolidation fully automated." },
  { id: "T14", name: "Run flux analysis & analytics", category: "FP&A", owner: "FP&A", dayDue: 4, estimatedMinutes: 90, automationStatus: "semi-automated", dependencies: ["T13"], description: "Automated trend detection flags unusual movements. Analyst investigates and documents explanations." },

  // Day 5
  { id: "T15", name: "Controller review & sign-off", category: "Review", owner: "Controller", dayDue: 5, estimatedMinutes: 120, automationStatus: "manual", dependencies: ["T12", "T13", "T14"], description: "Controller reviews complete package. Digital sign-off workflow with audit trail." },
  { id: "T16", name: "Prepare board reporting package", category: "Reporting", owner: "FP&A", dayDue: 5, estimatedMinutes: 90, automationStatus: "semi-automated", dependencies: ["T15"], description: "Template auto-populated with actuals. FP&A adds executive summary and forward-looking commentary." },
  { id: "T17", name: "Close period in ERP", category: "General Ledger", owner: "Controller", dayDue: 5, estimatedMinutes: 10, automationStatus: "fully-automated", dependencies: ["T15"], description: "Automated period close locks all sub-ledgers. Confirmation email sent to all stakeholders." },
];

function getStatusColor(status: string): string {
  switch (status) {
    case "fully-automated": return "text-emerald-400";
    case "semi-automated": return "text-amber-400";
    case "manual": return "text-red-400";
    default: return "text-gray-400";
  }
}

function getStatusBg(status: string): string {
  switch (status) {
    case "fully-automated": return "bg-emerald-500/10 border-emerald-500/20";
    case "semi-automated": return "bg-amber-500/10 border-amber-500/20";
    case "manual": return "bg-red-500/10 border-red-500/20";
    default: return "bg-gray-500/10 border-gray-500/20";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "fully-automated": return "Fully Automated";
    case "semi-automated": return "Semi-Automated";
    case "manual": return "Manual";
    default: return status;
  }
}

function getCompletionStatus(taskDay: number, currentDay: number, progress: Record<string, boolean>): "complete" | "in-progress" | "upcoming" {
  if (progress[`day-${taskDay}`] && taskDay < currentDay) return "complete";
  if (taskDay === currentDay) return "in-progress";
  if (taskDay < currentDay) return "complete";
  return "upcoming";
}

// ── Timeline Visualization ──
function TimelineView({ tasks, currentDay }: { tasks: Task[]; currentDay: number }) {
  const days = [1, 2, 3, 4, 5];
  const dayLabels = ["Day 1: Cutoffs & Data", "Day 2: Reconciliations", "Day 3: Reviews & GL", "Day 4: Analysis & Reporting", "Day 5: Sign-off & Close"];

  return (
    <div className="space-y-6">
      {days.map((day, di) => {
        const dayTasks = tasks.filter((t) => t.dayDue === day);
        const isActive = day === currentDay;
        const isComplete = day < currentDay;

        return (
          <div key={day} className="relative">
            {/* Connector line */}
            {di < days.length - 1 && (
              <div className={`absolute left-[18px] top-[44px] bottom-[-24px] w-0.5 ${isComplete ? "bg-emerald-500/40" : "bg-white/5"}`} />
            )}

            {/* Day header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                isComplete ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                isActive ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                "bg-white/5 text-gray-500 border border-white/10"
              }`}>
                {isComplete ? "✓" : day}
              </div>
              <div>
                <div className={`text-sm font-bold ${isActive ? "text-blue-400" : isComplete ? "text-emerald-400" : "text-gray-500"}`}>
                  {dayLabels[di]}
                </div>
                <div className="text-xs text-gray-300">
                  {dayTasks.length} tasks · {dayTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)} min estimated
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="ml-12 space-y-2">
              {dayTasks.map((task) => {
                const status = day < currentDay ? "complete" : day === currentDay ? "in-progress" : "upcoming";
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border transition-all ${
                      status === "complete" ? "bg-emerald-500/5 border-emerald-500/10" :
                      status === "in-progress" ? "bg-blue-500/5 border-blue-500/10" :
                      "bg-white/[0.02] border-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold ${
                            status === "complete" ? "text-emerald-400" :
                            status === "in-progress" ? "text-blue-400" :
                            "text-gray-600"
                          }`}>
                            {task.id}
                          </span>
                          <span className={`text-sm font-semibold ${
                            status === "upcoming" ? "text-gray-500" : "text-gray-200"
                          }`}>
                            {task.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">{task.description}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBg(task.automationStatus)} ${getStatusColor(task.automationStatus)}`}>
                          {getStatusLabel(task.automationStatus)}
                        </span>
                        <span className="text-[11px] text-gray-300 font-semibold">{task.owner} · {task.estimatedMinutes}m</span>
                      </div>
                    </div>
                    {task.dependencies.length > 0 && (
                      <div className="mt-1.5 text-[11px] text-gray-400 font-medium">
                        Depends on: {task.dependencies.join(", ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ──
export default function ProcessAutomationPage() {
  const [currentDay, setCurrentDay] = useState(3);
  const [viewMode, setViewMode] = useState<"timeline" | "matrix">("timeline");

  const stats = useMemo(() => {
    const total = CLOSE_TASKS.length;
    const fullyAuto = CLOSE_TASKS.filter((t) => t.automationStatus === "fully-automated").length;
    const semiAuto = CLOSE_TASKS.filter((t) => t.automationStatus === "semi-automated").length;
    const manual = CLOSE_TASKS.filter((t) => t.automationStatus === "manual").length;

    const totalMinutes = CLOSE_TASKS.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const autoMinutes = CLOSE_TASKS.filter((t) => t.automationStatus === "fully-automated").reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const manualMinutesBefore = totalMinutes * 2.5; // Estimated manual time before automation

    const completedTasks = CLOSE_TASKS.filter((t) => t.dayDue < currentDay).length;
    const inProgressTasks = CLOSE_TASKS.filter((t) => t.dayDue === currentDay).length;

    const categories = [...new Set(CLOSE_TASKS.map((t) => t.category))];
    const categoryStats = categories.map((cat) => {
      const catTasks = CLOSE_TASKS.filter((t) => t.category === cat);
      return {
        name: cat,
        count: catTasks.length,
        autoCount: catTasks.filter((t) => t.automationStatus === "fully-automated").length,
        minutes: catTasks.reduce((s, t) => s + t.estimatedMinutes, 0),
      };
    });

    return {
      total,
      fullyAuto,
      semiAuto,
      manual,
      totalMinutes,
      autoMinutes,
      manualMinutesBefore,
      completedTasks,
      inProgressTasks,
      automationRate: ((fullyAuto + semiAuto * 0.5) / total) * 100,
      timeSaved: manualMinutesBefore - totalMinutes,
      categoryStats,
    };
  }, [currentDay]);

  const insights: { icon: string; text: string }[] = [
    {
      icon: "⚡",
      text: `Automation reduces the month-end close from an estimated ${Math.round(stats.manualMinutesBefore / 60)} hours (fully manual) to ${Math.round(stats.totalMinutes / 60)} hours — a ${Math.round((stats.timeSaved / stats.manualMinutesBefore) * 100)}% time reduction. This frees the finance team to focus on analysis rather than data processing.`,
    },
    {
      icon: "🤖",
      text: `${stats.fullyAuto} of ${stats.total} tasks (${Math.round((stats.fullyAuto / stats.total) * 100)}%) are fully automated, requiring zero manual intervention. ${stats.semiAuto} tasks are semi-automated (system does the heavy lifting, human reviews). Only ${stats.manual} task remains fully manual.`,
    },
    {
      icon: "📋",
      text: `The 5-day close cycle follows a dependency chain: cutoffs (Day 1) → reconciliations (Day 2) → GL review (Day 3) → analysis & reporting (Day 4) → sign-off (Day 5). Each task's prerequisites must be complete before it can begin.`,
    },
    {
      icon: "🎯",
      text: `Key automation wins: bank reconciliation auto-matches 92% of transactions, BlackLine auto-certifies 65% of balance sheet accounts, and the reporting package is generated with one click. These were the highest-ROI automation investments.`,
    },
    {
      icon: "💡",
      text: `Next improvement opportunities: (1) Implement AI-powered anomaly detection for variance analysis, (2) Add predictive accruals using ML, (3) Target 3-day close by parallelizing Day 2-3 activities. Goal: virtual close capability within 12 months.`,
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
          <span className="text-sm text-gray-500">Process Automation</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-xs uppercase tracking-wider">
            Finance Process Automation
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Month-End Close Automation
          </h1>
          <p className="text-gray-400 max-w-2xl font-medium">
            A demonstration of how finance process automation transforms the
            month-end close from a 5+ day manual marathon into an efficient,
            controlled 5-day workflow. Use the day slider to step through the
            close process and see task status, dependencies, and automation levels.
          </p>
        </div>

        {/* Process Overview Bar */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold">5-Day Accelerated Close</div>
            <div className="text-sm text-gray-500">
              {stats.total} tasks · {stats.completedTasks} complete · {stats.inProgressTasks} in progress
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              {stats.automationRate.toFixed(0)}% Automated
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
              Day {currentDay} of 5
            </span>
          </div>
        </div>

        {/* Day Slider */}
        <div className="bg-white/[0.03] border border-teal-500/10 rounded-xl p-5 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-teal-400 uppercase tracking-wider">
              Close Progress
            </span>
            <span className="text-sm text-white font-semibold">
              Day {currentDay} of 5
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={currentDay}
            onChange={(e) => setCurrentDay(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-teal-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-300 font-semibold mt-1">
            <span>Cutoffs</span>
            <span>Reconciliation</span>
            <span>GL Review</span>
            <span>Reporting</span>
            <span>Sign-off</span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time Saved</div>
            <div className="text-2xl font-bold text-emerald-400">{Math.round(stats.timeSaved / 60)}hrs</div>
            <div className="text-xs text-gray-300 font-semibold mt-1">vs. fully manual process</div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fully Automated</div>
            <div className="text-2xl font-bold text-emerald-400">{stats.fullyAuto} / {stats.total}</div>
            <div className="text-xs text-gray-300 font-semibold mt-1">{Math.round((stats.fullyAuto / stats.total) * 100)}% of all tasks</div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Semi-Automated</div>
            <div className="text-2xl font-bold text-amber-400">{stats.semiAuto} / {stats.total}</div>
            <div className="text-xs text-gray-300 font-semibold mt-1">Human review + system prep</div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Manual</div>
            <div className="text-2xl font-bold text-red-400">{stats.manual} / {stats.total}</div>
            <div className="text-xs text-gray-300 font-semibold mt-1">Controller sign-off only</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-gray-300">Overall Close Progress</span>
            <span className="text-sm font-semibold text-teal-400">
              {Math.round((stats.completedTasks / stats.total) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(stats.completedTasks / stats.total) * 100}%` }}
            />
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(stats.inProgressTasks / stats.total) * 100}%` }}
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-300">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Complete ({stats.completedTasks})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> In Progress ({stats.inProgressTasks})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/10"></span> Upcoming ({stats.total - stats.completedTasks - stats.inProgressTasks})</span>
          </div>
        </div>

        {/* Automation Breakdown */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-4">
            Automation by Category
          </h3>
          <div className="space-y-3">
            {stats.categoryStats.map((cat) => {
              const autoPct = cat.count > 0 ? (cat.autoCount / cat.count) * 100 : 0;
              return (
                <div key={cat.name} className="flex items-center gap-4">
                  <div className="w-40 text-sm text-gray-400 font-semibold truncate">{cat.name}</div>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500/60 rounded-full"
                      style={{ width: `${autoPct}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-xs text-gray-300 font-bold">
                    {cat.autoCount}/{cat.count} auto
                  </div>
                  <div className="w-16 text-right text-xs text-gray-300">
                    {cat.minutes}m
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline View */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-4">
            Close Workflow — Task Timeline
          </h3>
          <TimelineView tasks={CLOSE_TASKS} currentDay={currentDay} />
        </div>

        {/* Insights */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-2">
            Automation Impact & Recommendations
          </h3>
          <p className="text-xs text-gray-400 font-medium mb-4">
            Analysis of the automation strategy and next improvement opportunities
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

        {/* Before / After Comparison */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400 mb-4">
            Before vs. After Automation
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
              <div className="text-sm font-bold text-red-400 mb-3">❌ Before (Manual Process)</div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between"><span>Close duration</span><span className="font-semibold text-red-400">8-10 days</span></div>
                <div className="flex justify-between"><span>Total labor hours</span><span className="font-semibold text-red-400">{Math.round(stats.manualMinutesBefore / 60)}+ hrs</span></div>
                <div className="flex justify-between"><span>Error rate</span><span className="font-semibold text-red-400">5-8%</span></div>
                <div className="flex justify-between"><span>Spreadsheet dependency</span><span className="font-semibold text-red-400">High</span></div>
                <div className="flex justify-between"><span>Audit trail</span><span className="font-semibold text-red-400">Limited</span></div>
                <div className="flex justify-between"><span>Scalability</span><span className="font-semibold text-red-400">Poor</span></div>
              </div>
            </div>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
              <div className="text-sm font-bold text-emerald-400 mb-3">✅ After (Automated Process)</div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between"><span>Close duration</span><span className="font-semibold text-emerald-400">5 days</span></div>
                <div className="flex justify-between"><span>Total labor hours</span><span className="font-semibold text-emerald-400">{Math.round(stats.totalMinutes / 60)} hrs</span></div>
                <div className="flex justify-between"><span>Error rate</span><span className="font-semibold text-emerald-400">&lt;1%</span></div>
                <div className="flex justify-between"><span>Spreadsheet dependency</span><span className="font-semibold text-emerald-400">Minimal</span></div>
                <div className="flex justify-between"><span>Audit trail</span><span className="font-semibold text-emerald-400">Complete</span></div>
                <div className="flex justify-between"><span>Scalability</span><span className="font-semibold text-emerald-400">Excellent</span></div>
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
