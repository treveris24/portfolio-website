"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What is Uwe's experience in FP&A?",
  "Tell me about his PMP certification",
  "What languages does Uwe speak?",
  "What makes Uwe stand out?",
  "Describe his experience at Dell",
  "What tools has Uwe built?",
];

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput("");
    setError("");

    const userMessage: Message = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantText =
        data.content
          ?.filter((block: { type: string }) => block.type === "text")
          .map((block: { text: string }) => block.text)
          .join("\n") || "Sorry, I could not generate a response.";

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: assistantText },
      ]);
    } catch (err) {
      setError(
        "Unable to connect to the AI assistant. Please try again in a moment."
      );
      setMessages(updatedMessages);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Portfolio
          </Link>
          <span className="text-sm text-gray-500">AI Assistant</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-6 flex flex-col" style={{ height: "100vh" }}>
        {/* Title */}
        <div className="mb-6">
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs uppercase tracking-wider">
            AI-Powered Assistant
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Ask Me Anything
          </h1>
          <p className="text-gray-400 max-w-2xl font-medium">
            Chat with an AI assistant that knows Uwe&apos;s professional background,
            skills, and experience. Powered by Claude — built and deployed by Uwe
            as a demonstration of AI integration capabilities.
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden min-h-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-4xl mb-4">💬</div>
                <div className="text-lg font-bold text-gray-300 mb-2">
                  Welcome! Ask me about Uwe&apos;s background.
                </div>
                <div className="text-sm text-gray-600 mb-6 max-w-md">
                  I can tell you about his experience, skills, certifications,
                  portfolio projects, and what makes him a strong candidate.
                </div>

                {/* Suggested Questions */}
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-400 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.06] hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-500/15 border border-blue-500/20 text-white"
                      : "bg-white/[0.04] border border-white/5 text-gray-300"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="text-xs font-bold text-violet-400 mb-1">
                      AI Assistant
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
                <div className="bg-white/[0.04] border border-white/5 rounded-xl px-4 py-3">
                  <div className="text-xs font-bold text-violet-400 mb-1">
                    AI Assistant
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-violet-400/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-violet-400/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-violet-400/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/5 p-4">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Uwe's experience, skills, or background..."
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="px-5 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-500/30 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition-colors"
              >
                Send
              </button>
            </div>
            <div className="text-xs text-gray-700 mt-2 text-center">
              Powered by Claude AI — Responses are generated based on Uwe&apos;s professional profile
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
