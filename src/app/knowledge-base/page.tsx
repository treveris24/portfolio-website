"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─── Suggested prompts ──────────────────────────────────────
const suggestions = [
  "What is the approval threshold for partner incentive payments?",
  "Walk me through the month-end close process step by step.",
  "What are the DGI filing deadlines for Q1 2026?",
  "Who needs to sign off on credit limit increases above $500K?",
  "What is the entertainment policy for government officials?",
  "How long do we have to submit expense reports?",
];

// ─── Main Page ──────────────────────────────────────────────
export default function KnowledgeBase() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBehindCurtain, setShowBehindCurtain] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      const assistantText = data.content
        ?.map((block: { type: string; text?: string }) =>
          block.type === "text" ? block.text : ""
        )
        .filter(Boolean)
        .join("\n") || "I was unable to process that request. Please try again.";

      setMessages([...newMessages, { role: "assistant", content: assistantText }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "There was an error connecting to the knowledge base. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F1923] text-[#F0F4F8]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1923]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-6 py-3.5">
          <Link
            href="/"
            className="text-[#2EC4B6] text-xl font-bold tracking-tight no-underline"
          >
            Uwe Anell
          </Link>
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-[#2EC4B6] transition-colors no-underline"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-xs font-bold text-[#2EC4B6] tracking-[0.14em] uppercase mb-3">
              Knowledge Agent
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#F0F4F8] mb-4">
              Corporate Knowledge Base
            </h1>
            <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed">
              Every multinational has thousands of pages of internal policies that nobody
              reads — until something goes wrong. This is a working proof of concept showing
              how I transform static corporate documentation into an interactive, queryable
              intelligence asset.
            </p>
          </div>

          {/* Scenario box */}
          <div className="mb-8 p-5 rounded-xl bg-[#2EC4B6]/[0.06] border border-[#2EC4B6]/[0.15]">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🎭</span>
              <div>
                <div className="text-sm font-bold text-[#2EC4B6] mb-1">Scenario</div>
                <div className="text-sm text-white/60 leading-relaxed">
                  You are a newly arrived Finance Director at{" "}
                  <span className="text-white/80 font-semibold">
                    GlobalTech Solutions
                  </span>
                  , a multinational's Panama hub. You need answers about internal
                  processes — fast. This AI knowledge base contains your company's
                  policy manuals, SOPs, and compliance guidelines. Ask it anything.
                </div>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#162230] overflow-hidden mb-6">
            {/* Messages */}
            <div className="h-[440px] overflow-y-auto p-6 flex flex-col gap-5">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-4">🧠</div>
                  <div className="text-sm text-white/30 mb-6 max-w-sm">
                    Ask a question about internal policies, SOPs, or compliance
                    procedures. The knowledge base covers 6 corporate documents.
                  </div>
                  {/* Suggestion chips */}
                  <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        className="text-xs text-white/50 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 cursor-pointer hover:bg-white/[0.08] hover:text-white/70 transition-all text-left leading-relaxed"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-5 py-3.5 ${
                          msg.role === "user"
                            ? "bg-[#2EC4B6]/15 border border-[#2EC4B6]/20 text-[#F0F4F8]"
                            : "bg-white/[0.03] border border-white/[0.06] text-white/75"
                        }`}
                      >
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-xs">🧠</span>
                            <span className="text-[10px] font-bold text-[#2EC4B6] tracking-wider uppercase">
                              Knowledge Base
                            </span>
                          </div>
                        )}
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-3.5">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-xs">🧠</span>
                          <span className="text-[10px] font-bold text-[#2EC4B6] tracking-wider uppercase">
                            Knowledge Base
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/40">
                          <div className="flex gap-1">
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6]/50 animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6]/50 animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6]/50 animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                          Searching knowledge base...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.06] p-4">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about policies, SOPs, compliance procedures..."
                  disabled={isLoading}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#F0F4F8] placeholder-white/25 outline-none focus:border-[#2EC4B6]/30 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="px-5 py-3 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-sm rounded-xl border-none cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {suggestions.slice(0, 3).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      disabled={isLoading}
                      className="text-[11px] text-white/35 bg-white/[0.03] border border-white/[0.05] rounded-md px-2.5 py-1.5 cursor-pointer hover:bg-white/[0.06] hover:text-white/50 transition-all disabled:opacity-30"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hook text */}
          <div className="mb-8 p-5 rounded-xl bg-[#162230] border border-white/[0.06]">
            <p className="text-sm text-white/50 leading-relaxed">
              In a live deployment, your finance team gets instant, accurate answers from
              your own policy manuals, audit guidelines, and SOPs — without emailing three
              people and waiting two days. The knowledge base indexes your actual corporate
              documents and provides answers with source citations, so your team can trust
              the response and verify it instantly.
            </p>
          </div>

          {/* Behind the curtain */}
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <button
              onClick={() => setShowBehindCurtain(!showBehindCurtain)}
              className="w-full text-left p-5 bg-[#162230] hover:bg-[#1E3244] transition-colors cursor-pointer border-none flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🔧</span>
                <span className="text-sm font-semibold text-white/60">
                  How I Built This
                </span>
              </div>
              <span
                className={`text-white/30 transition-transform duration-300 ${
                  showBehindCurtain ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>
            {showBehindCurtain && (
              <div className="p-5 bg-[#0F1923] border-t border-white/[0.06]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[#2EC4B6] text-sm mt-0.5">→</span>
                    <div>
                      <div className="text-sm font-semibold text-white/70">
                        RAG Architecture
                      </div>
                      <div className="text-xs text-white/40 leading-relaxed mt-1">
                        Documents are chunked and indexed as structured context
                        provided to the LLM at query time. The system retrieves
                        relevant sections based on the question and grounds its
                        answers in the actual document text.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#2EC4B6] text-sm mt-0.5">→</span>
                    <div>
                      <div className="text-sm font-semibold text-white/70">
                        6 Corporate Documents Indexed
                      </div>
                      <div className="text-xs text-white/40 leading-relaxed mt-1">
                        Internal Controls Manual, Month-End Close Checklist,
                        Expense Approval Policy, Partner Payment SOP, Panama DGI
                        Filing Calendar, and Travel & Entertainment Policy. Each
                        with realistic version numbers, approval dates, and
                        section structure.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#2EC4B6] text-sm mt-0.5">→</span>
                    <div>
                      <div className="text-sm font-semibold text-white/70">
                        Powered by Claude (Anthropic)
                      </div>
                      <div className="text-xs text-white/40 leading-relaxed mt-1">
                        Uses Anthropic's Claude API with a carefully engineered
                        system prompt that constrains responses to indexed
                        documents only. The model is instructed to cite sources
                        and explicitly flag when questions fall outside the
                        knowledge base.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#2EC4B6] text-sm mt-0.5">→</span>
                    <div>
                      <div className="text-sm font-semibold text-white/70">
                        Hallucination Prevention
                      </div>
                      <div className="text-xs text-white/40 leading-relaxed mt-1">
                        The system only answers from indexed documents and
                        explicitly states when a question falls outside the
                        knowledge base. This "I don't know" capability is what
                        separates a professional tool from a toy — and it's what
                        a compliance team needs to trust the output.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <div className="p-8 rounded-xl bg-[#162230] border border-white/[0.06]">
              <h3 className="text-xl font-bold text-[#F0F4F8] mb-3">
                Imagine this for a finance team.
              </h3>
              <p className="text-sm text-white/40 mb-6 max-w-md mx-auto leading-relaxed">
                Your policy manuals, SOPs, and compliance documents — queryable in
                seconds. New hires productive in days instead of months. Audit prep
                cut by 60%.
              </p>
              <a
                href="https://wa.me/50766708030?text=Hi%20Uwe%2C%20I%20tried%20the%20Corporate%20Knowledge%20Base%20demo%20on%20your%20website.%20I%E2%80%99d%20like%20to%20discuss%20building%20something%20like%20this%20for%20my%20organization."
                target="_blank"
                rel="noreferrer"
                className="inline-block px-8 py-3.5 bg-[#2EC4B6] hover:bg-[#1FA99C] text-[#0F1923] font-bold text-[15px] rounded-lg no-underline transition-colors"
              >
                Curious how this could work in practice? Happy to discuss.
              </a>
            </div>
          </div>

          {/* Back */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-sm text-white/40 hover:text-[#2EC4B6] transition-colors no-underline"
            >
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
