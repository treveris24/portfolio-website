import Link from "next/link";

const portfolioItems = [
  {
    title: "Working Capital & Cash Conversion Cycle Analyzer",
    description:
      "Interactive tool analyzing DSO, DIO, DPO with what-if scenarios to optimize cash flow management.",
    category: "Finance App",
    status: "Live",
    href: "/projects/working-capital",
    icon: "💰",
    color: "blue",
  },
  {
    title: "Break-Even Analysis Tool",
    description:
      "Dynamic break-even calculator with visual cost-revenue chart, sensitivity analysis, and margin of safety.",
    category: "Finance App",
    status: "Live",
    href: "/projects/break-even",
    icon: "📊",
    color: "emerald",
  },
  {
    title: "EVM Project Tracker",
    description:
      "Earned Value Management dashboard with SPI/CPI gauges, trend charts, Gantt view, and project health insights.",
    category: "Project Management",
    status: "Live",
    href: "/projects/evm-tracker",
    icon: "📋",
    color: "purple",
  },
  {
    title: "Corporate Finance Dashboard",
    description:
      "Full-year P&L, Balance Sheet, Cash Flow, and Variance Analysis for a fictional mid-market company.",
    category: "Data Visualization",
    status: "Live",
    href: "/projects/finance-dashboard",
    icon: "📈",
    color: "cyan",
  },
  {
    title: "Monte Carlo Investment Simulator",
    description:
      "Probabilistic risk analysis running thousands of simulated scenarios to model investment outcomes.",
    category: "Risk Analysis",
    status: "Live",
    href: "/projects/monte-carlo",
    icon: "🎲",
    color: "orange",
  },
  {
    title: "AI Finance Assistant",
    description:
      "AI-powered chatbot that answers questions about my professional background, skills, and experience.",
    category: "AI Agent",
    status: "Live",
    href: "/projects/ai-assistant",
    icon: "🤖",
    color: "violet",
  },
  {
    title: "Month-End Close Automation",
    description:
      "Automated 5-day close workflow with 17 tasks, dependency chains, and before/after impact analysis.",
    category: "Process Automation",
    status: "Live",
    href: "/projects/process-automation",
    icon: "⚙️",
    color: "teal",
  },
  {
    title: "Executive Dashboard",
    description:
      "CEO/CFO command center with sales hierarchy drill-down, variance analysis (Y/Y, Q/Q, M/M), and critical KPI alerts.",
    category: "Executive Reporting",
    status: "Live",
    href: "/projects/executive-dashboard",
    icon: "🏢",
    color: "blue",
  },
];

const stats = [
  { value: "PMP®", label: "Certified 2026" },
  { value: "$160M", label: "P&L Managed" },
  { value: "8", label: "Live Projects" },
  { value: "3", label: "Languages" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-[#3b82f6]">UA</span> — Uwe Anell
          </span>
          <div className="hidden md:flex gap-8 text-sm text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#portfolio" className="hover:text-white transition-colors">
              Portfolio
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-[#0a0a0a]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm">
            Finance Business Partner • Project Management • BI & Automation
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Uwe Anell
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-4 font-light">
            Finance Business Partner & PMP® Project Manager
          </p>

          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Bridging the gap between financial strategy and operational execution.
            Specializing in long-range planning, risk management, and data-driven
            decision making for multinational organizations in Panama and Latin America.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href="#portfolio"
              className="px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg text-sm font-medium transition-colors"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-white/10 hover:border-white/25 text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-blue-400 mb-4">
            About
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-8">
            Strategic Vision. Financial Discipline. Local Expertise.
          </h3>

          <div className="grid md:grid-cols-2 gap-12 text-gray-400 leading-relaxed">
            <div>
              <p className="mb-4">
                With over 20 years of experience in the financial sectors of
                Europe and Latin America, I help organizations navigate complex
                projects by providing a &quot;Safe Hands&quot; approach to financial
                planning and risk.
              </p>
              <p>
                As a PMP® certified professional and long-term resident of
                Panama, I understand the unique intersection of international
                corporate standards and local market dynamics. My career has been
                defined by a commitment to data integrity, internal control, and
                strategic partnership — transforming raw financial data into clear
                roadmaps for growth and stability.
              </p>
            </div>
            <div>
              <p className="mb-2 text-white font-semibold">What I bring to the table:</p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-white font-semibold">Financial Planning & Analysis</span>
                  <span className="text-gray-500"> — Expert-level modeling of P&L, Cash Flow, and long-range projections.</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-white font-semibold">Project Governance</span>
                  <span className="text-gray-500"> — Driving results through structured PMP methodology and stakeholder alignment.</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-white font-semibold">Risk & Compliance</span>
                  <span className="text-gray-500"> — A bank-grade approach to internal controls and regulatory requirements.</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-white font-semibold">Modern Toolset</span>
                  <span className="text-gray-500"> — Leveraging Power BI and AI-driven workflows to enhance reporting accuracy and efficiency.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Focus & Impact */}
          <div className="mt-16 mb-12">
            <h4 className="text-sm uppercase tracking-widest text-blue-400 mb-6">
              Recent Focus & Impact
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl mb-3">📊</div>
                <div className="text-white font-semibold mb-2">Financial Transformation</div>
                <div className="text-gray-500 text-sm leading-relaxed">
                  Led the migration from manual reporting to automated BI environments,
                  reducing reporting latency by 40%.
                </div>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl mb-3">🌎</div>
                <div className="text-white font-semibold mb-2">Regional P&L Stewardship</div>
                <div className="text-gray-500 text-sm leading-relaxed">
                  Managed $160M+ portfolios across 15+ countries, ensuring 100%
                  compliance with statutory and audit standards.
                </div>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl mb-3">🎯</div>
                <div className="text-white font-semibold mb-2">Strategic Advisory</div>
                <div className="text-gray-500 text-sm leading-relaxed">
                  Partnering with GMs and Directors to determine investment capacity,
                  pricing structures, and long-term business viability.
                </div>
              </div>
            </div>
          </div>

          {/* Experience Highlights */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                company: "Dell Technologies",
                role: "Project Manager / BI & Reporting, FP&A, Risk",
                years: "19 years · Panama",
              },
              {
                company: "Puig (Carolina Herrera, Prada)",
                role: "Regional Finance & Admin Business Partner",
                years: "Regional · Panama",
              },
              {
                company: "Dresdner Bank",
                role: "Senior Credit Risk Specialist",
                years: "Banking · Hamburg / Panama",
              },
            ].map((exp) => (
              <div
                key={exp.company}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="text-white font-semibold mb-1">
                  {exp.company}
                </div>
                <div className="text-gray-400 text-sm mb-2">{exp.role}</div>
                <div className="text-gray-600 text-xs uppercase tracking-wider">
                  {exp.years}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-blue-400 mb-4">
            Portfolio
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Built to demonstrate, not just describe.
          </h3>
          <p className="text-gray-500 mb-12 max-w-2xl">
            Each project is a working application — interactive, functional, and
            designed to solve real business problems. Click any project to
            explore it live.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="text-xs text-blue-400 uppercase tracking-wider mb-2">
                  {item.category}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    {item.status}
                  </span>
                  <span className="text-gray-600 text-sm group-hover:text-blue-400 transition-colors">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-widest text-blue-400 mb-4">
            Contact
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Let&apos;s connect.
          </h3>
          <p className="text-gray-500 mb-12">
            Open to Finance Business Partner, Project Manager, and Strategic Advisory
            opportunities in Panama and Latin America.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:uweanell@gmail.com"
              className="px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Email Me
            </a>
            <a
              href="https://linkedin.com/in/uwe-anell"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/10 hover:border-white/25 text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Uwe Anell. Finance Business Partner & PMP® Project Manager.
        Built with Next.js and AI-assisted development.
      </footer>
    </main>
  );
}
