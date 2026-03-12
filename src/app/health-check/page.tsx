"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────
type Category = "reporting" | "risk" | "automation";

interface Question {
  id: number;
  text: string;
  category: Category;
  options: { label: string; score: number }[];
}

// ─── Questions ──────────────────────────────────────────────
const questions: Question[] = [
  {
    id: 1,
    text: "Do you have a single source of truth for regional P&L reporting?",
    category: "reporting",
    options: [
      { label: "Yes — one consolidated system everyone trusts", score: 3 },
      { label: "Partially — we have a main system but people keep side spreadsheets", score: 2 },
      { label: "No — multiple versions circulate and nobody agrees on the numbers", score: 1 },
    ],
  },
  {
    id: 2,
    text: "Can your team produce a variance analysis within 48 hours of month-end?",
    category: "reporting",
    options: [
      { label: "Yes — it's automated and available within 24 hours", score: 3 },
      { label: "Usually — it takes 3-5 days with manual effort", score: 2 },
      { label: "No — variance analysis takes a week or more", score: 1 },
    ],
  },
  {
    id: 3,
    text: "How does your leadership team access financial KPIs?",
    category: "reporting",
    options: [
      { label: "Interactive dashboards with drill-down capability", score: 3 },
      { label: "Static reports or slide decks sent via email", score: 2 },
      { label: "They have to ask the finance team for any data they need", score: 1 },
    ],
  },
  {
    id: 4,
    text: "Do you have documented internal controls for partner incentive payments?",
    category: "risk",
    options: [
      { label: "Yes — documented, audited, and followed consistently", score: 3 },
      { label: "Partially — controls exist but aren't always followed or updated", score: 2 },
      { label: "No — payments are handled case-by-case without formal controls", score: 1 },
    ],
  },
  {
    id: 5,
    text: "When was your last internal controls or compliance review?",
    category: "risk",
    options: [
      { label: "Within the last 6 months", score: 3 },
      { label: "6-18 months ago", score: 2 },
      { label: "More than 18 months ago or never", score: 1 },
    ],
  },
  {
    id: 6,
    text: "How do you assess credit risk for channel partners or large B2B customers?",
    category: "risk",
    options: [
      { label: "Formal scoring model with regular portfolio reviews", score: 3 },
      { label: "Ad-hoc reviews when issues arise or contracts renew", score: 2 },
      { label: "No structured credit risk assessment in place", score: 1 },
    ],
  },
  {
    id: 7,
    text: "What does your month-end close process look like?",
    category: "automation",
    options: [
      { label: "Documented workflow with automated steps and clear ownership", score: 3 },
      { label: "A checklist exists but most steps are manual and people-dependent", score: 2 },
      { label: "Informal — people know what to do but nothing is documented", score: 1 },
    ],
  },
  {
    id: 8,
    text: "How much manual data manipulation happens between source systems and final reports?",
    category: "automation",
    options: [
      { label: "Minimal — data flows automatically with validation checks", score: 3 },
      { label: "Moderate — some manual steps for reconciliation and formatting", score: 2 },
      { label: "Extensive — heavy copy-paste, reformatting, and manual consolidation", score: 1 },
    ],
  },
  {
    id: 9,
    text: "Do you use any AI or automation tools in your finance workflows?",
    category: "automation",
    options: [
      { label: "Yes — actively using AI/RPA for specific processes", score: 3 },
      { label: "Exploring — piloting or evaluating tools", score: 2 },
      { label: "No — everything is done manually or with basic Excel", score: 1 },
    ],
  },
  {
    id: 10,
    text: "If a key finance team member left tomorrow, how long would it take to recover?",
    category: "risk",
    options: [
      { label: "Minimal disruption — processes are documented and cross-trained", score: 3 },
      { label: "Some disruption — we'd manage but lose speed for a few weeks", score: 2 },
      { label: "Critical impact — key knowledge lives in one person's head", score: 1 },
    ],
  },
];

// ─── Scoring logic ──────────────────────────────────────────
type Answers = Record<number, number>;

function computeScores(answers: Answers) {
  const cats: Record<Category, { total: number; max: number }> = {
    reporting: { total: 0, max: 0 },
    risk: { total: 0, max: 0 },
    automation: { total: 0, max: 0 },
  };

  questions.forEach((q) => {
    cats[q.category].max += 3;
    if (answers[q.id] !== undefined) {
      cats[q.category].total += answers[q.id];
    }
  });

  return Object.entries(cats).map(([key, val]) => {
    const pct = Math.round((val.total / val.max) * 100);
    let level: "green" | "yellow" | "red";
    if (pct >= 78) level = "green";
    else if (pct >= 45) level = "yellow";
    else level = "red";
    return { category: key as Category, pct, level };
  });
}

const categoryLabels: Record<Category, string> = {
  reporting: "Reporting Maturity",
  risk: "Risk Exposure",
  automation: "Process Automation",
};

const categoryDescriptions: Record<Category, Record<"green" | "yellow" | "red", string>> = {
  reporting: {
    green: "Your reporting infrastructure is solid. You have a single source of truth and leadership can access insights quickly.",
    yellow: "Your reporting has a foundation but relies on manual effort. There are opportunities to automate and centralize.",
    red: "Your reporting is fragmented. Multiple data versions create confusion and slow decision-making. This is a priority fix.",
  },
  risk: {
    green: "Your controls and risk management are well-structured. Regular reviews keep you audit-ready.",
    yellow: "You have some controls but gaps exist. Key-person risk or outdated processes could expose you.",
    red: "Significant risk exposure. Controls are informal, reviews are overdue, and key-person dependency is high.",
  },
  automation: {
    green: "Your finance operations leverage automation effectively. Month-end is efficient and data flows are clean.",
    yellow: "Some processes are automated but manual work still dominates. There's clear ROI in further automation.",
    red: "Heavy manual effort across core processes. Significant time is lost to copy-paste, reformatting, and manual consolidation.",
  },
};

const levelColors = {
  green: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400", bar: "bg-emerald-500", label: "Strong" },
  yellow: { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400", bar: "bg-amber-500", label: "At Risk" },
  red: { bg: "bg-red-500/15", border: "border-red-500/30", text: "text-red-400", bar: "bg-red-500", label: "Critical" },
};

// ─── Components ─────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between text-xs text-white/40 mb-2">
        <span>Question {current} of {total}</span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2EC4B6] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  selectedScore,
  onSelect,
}: {
  question: Question;
  selectedScore: number | undefined;
  onSelect: (score: number) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.1em] uppercase mb-3">
        {categoryLabels[question.category]}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#F0F4F8] mb-8 leading-tight">
        {question.text}
      </h2>
      <div className="flex flex-col gap-3">
        {question.options.map((opt) => {
          const isSelected = selectedScore === opt.score;
          return (
            <button
              key={opt.score}
              onClick={() => onSelect(opt.score)}
              className={`w-full text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-[#2EC4B6]/10 border-[#2EC4B6]/40 text-[#F0F4F8]"
                  : "bg-[#162230] border-white/[0.06] text-white/70 hover:bg-[#1E3244] hover:border-white/[0.12]"
              }`}
            >
              <span className="text-[15px] leading-relaxed">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Results({ answers }: { answers: Answers }) {
  const scores = computeScores(answers);
  const overall = Math.round(scores.reduce((s, c) => s + c.pct, 0) / 3);
  let overallLevel: "green" | "yellow" | "red";
  if (overall >= 78) overallLevel = "green";
  else if (overall >= 45) overallLevel = "yellow";
  else overallLevel = "red";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Overall score */}
      <div className="text-center mb-12">
        <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-3">
          Your Finance Health Score
        </div>
        <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-4 ${levelColors[overallLevel].border} ${levelColors[overallLevel].bg} mb-4`}>
          <span className={`text-4xl font-bold ${levelColors[overallLevel].text}`}>{overall}%</span>
        </div>
        <div className={`text-lg font-bold ${levelColors[overallLevel].text}`}>
          {overallLevel === "green" && "Your finance operations are in good shape."}
          {overallLevel === "yellow" && "There are clear areas for improvement."}
          {overallLevel === "red" && "Your finance operations need immediate attention."}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="flex flex-col gap-5 mb-12">
        {scores.map((s) => {
          const c = levelColors[s.level];
          return (
            <div key={s.category} className={`p-6 rounded-xl border ${c.border} ${c.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-[#F0F4F8]">
                  {categoryLabels[s.category]}
                </h3>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${c.text}`}>{c.label}</span>
                  <span className={`text-xl font-bold ${c.text}`}>{s.pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full ${c.bar} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {categoryDescriptions[s.category][s.level]}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center p-8 rounded-xl bg-[#162230] border border-white/[0.06]">
        <h3 className="text-xl font-bold text-[#F0F4F8] mb-3">
          Want to explore further?
        </h3>
        <p className="text-sm text-white/50 mb-6 max-w-md mx-auto leading-relaxed">
          This assessment gives you a high-level snapshot. Happy to chat if you'd like to explore any of these topics further.
        </p>
        <a
          href="mailto:uweanell@gmail.com"
          
          
          className="inline-block px-8 py-3.5 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg no-underline transition-colors"
        >
          Happy to Connect
          
        </a>
      </div>

      {/* Back link */}
      <div className="text-center mt-8">
        <Link href="/" className="text-sm text-white/40 hover:text-[#2EC4B6] transition-colors no-underline">
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function HealthCheck() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  function handleSelect(score: number) {
    const newAnswers = { ...answers, [question.id]: score };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (isLast) {
        setShowResults(true);
      } else {
        setCurrentQ((prev) => prev + 1);
      }
    }, 350);
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  }

  function handleRestart() {
    setAnswers({});
    setCurrentQ(0);
    setShowResults(false);
  }

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
        {!showResults && (
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-2">
              Self-Assessment
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-3">
              Finance Health Check
            </h1>
            <p className="text-base text-white/40 max-w-lg mx-auto">
              10 questions. 2 minutes. Find out where your finance operations are strong — and where there might be room to improve.
            </p>
          </div>
        )}

        {showResults ? (
          <>
            <Results answers={answers} />
            <div className="text-center mt-4">
              <button
                onClick={handleRestart}
                className="text-sm text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer"
              >
                Retake assessment
              </button>
            </div>
          </>
        ) : (
          <>
            <ProgressBar current={currentQ + 1} total={questions.length} />
            <QuestionCard
              question={question}
              selectedScore={answers[question.id]}
              onSelect={handleSelect}
            />
            {currentQ > 0 && (
              <div className="max-w-2xl mx-auto mt-6">
                <button
                  onClick={handleBack}
                  className="text-sm text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer"
                >
                  ← Previous question
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
