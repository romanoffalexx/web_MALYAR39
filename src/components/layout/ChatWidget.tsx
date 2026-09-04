"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "expert";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  "Подбор краски для стен",
  "Расчёт расхода",
  "Для фасада",
  "Для ванной комнаты",
];

function expertReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("расход") || q.includes("расчёт") || q.includes("расчет")) {
    return "Расчёт простой: площадь × количество слоёв ÷ расход на литр + 10% запаса.\n\nНапример, для 45 м² в 2 слоя при расходе 11 м²/л понадобится 9 л — это 4 банки по 2.7 л.\n\nНа странице каждого товара есть калькулятор расхода — он посчитает всё автоматически.";
  }
  if (q.includes("фасад")) {
    return "Для фасада рекомендую силиконовые или силикатные краски: MIPA Siliconharz Fassadenfarbe или MIPA Fassaden Silikat.\n\nОни паропроницаемые, стойкие к УФ и осадкам, срок службы — от 10 лет.\n\nПодскажите, какое основание: бетон, штукатурка или кирпич?";
  }
  if (q.includes("ванн") || q.includes("влажных")) {
    return "Для ванной и влажных помещений нужны влагостойкие интерьерные краски с классом мытья 1.\n\nПодойдут MIPA Innenlatex или FEIDAL Innenlatex Matt — покрытие выдерживает частую уборку и конденсат.\n\nОснование обязательно прогрунтуйте перед окраской.";
  }
  if (q.includes("стен")) {
    return "Отлично! Для стен в квартире рекомендую матовые интерьерные краски: они скрывают мелкие дефекты и не бликуют.\n\nУточните, пожалуйста:\n\n• Какой уровень влажности в помещении?\n• Нужна ли повышенная износостойкость?\n• Какой желаемый оттенок или цветовая гамма?";
  }
  return "Спасибо за вопрос! Наш специалист свяжется с вами в ближайшее время и ответит подробно.\n\nА пока могу помочь с подбором материала или расчётом расхода — просто опишите задачу.";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "expert",
      content:
        "Здравствуйте! 👋\nЯ эксперт компании Маляр.\nГотов помочь вам с подбором материалов и ответить на вопросы.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: trimmed, timestamp: new Date() },
    ]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "expert", content: expertReply(trimmed), timestamp: new Date() },
      ]);
      setTyping(false);
    }, 1400);
  };

  return (
    <>
      {open && (
        <div className="chat-enter fixed bottom-24 right-6 z-50 flex h-[600px] max-h-[calc(100vh-140px)] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-xl bg-[#eeece8] shadow-2xl">
          <div className="flex items-center justify-between bg-forest-900 px-4 py-3.5">
            <div className="flex items-center gap-4">
              <span className="font-heading text-sm font-bold text-cream-100">Чат с экспертом</span>
              <span className="flex items-center gap-1.5 text-[11px] text-cream-100/80">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                Онлайн
              </span>
            </div>
            <div className="flex items-center gap-1 text-cream-100">
              <button type="button" className="rounded p-1 transition-colors hover:bg-white/10" aria-label="Ещё">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <circle cx="5" cy="12" r="1.6" />
                  <circle cx="12" cy="12" r="1.6" />
                  <circle cx="19" cy="12" r="1.6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 transition-colors hover:bg-white/10"
                aria-label="Свернуть чат"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="chat-scroll flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "items-start gap-2.5"}`}
              >
                {message.role === "expert" && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-900">
                    <svg width="16" height="12" viewBox="0 0 24 18" aria-hidden>
                      <path d="M12 0 6 9h12L12 0Z" fill="#4a8fd4" />
                      <path d="M6 9 0 18h12L6 9Z" fill="#f2c94c" />
                      <path d="M18 9l-6 9h12l-6-9Z" fill="#eb5757" />
                    </svg>
                  </span>
                )}
                <div
                  className={`max-w-[82%] rounded-lg px-3.5 py-3 text-xs leading-relaxed whitespace-pre-line ${
                    message.role === "user" ? "bg-accent/20 text-ink" : "bg-white text-ink shadow-card"
                  }`}
                >
                  {message.content}
                  <div
                    className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                      message.role === "user" ? "text-moss" : "text-moss/70"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    {message.role === "user" && (
                      <svg width="12" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <path d="m1 6.5 3 3L10 3M7 9.5l1.5 1.5L15 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex">
                <div className="flex gap-1 rounded-lg bg-white px-4 py-3.5 shadow-card">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-moss/60" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-moss/60" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-moss/60" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 pb-3 pt-1">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendMessage(input)}
                  placeholder="Напишите сообщение..."
                  className="w-full rounded-full border border-ink/5 bg-[#f8f6f4] py-3 pl-4 pr-16 text-xs text-ink outline-none transition-colors placeholder:text-moss/70 focus:border-forest-700"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-moss">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                    <path d="m21 12-9 9-9-9V3h9l9 9ZM14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8.5 14a4.5 4.5 0 0 0 7 0M9 10h.01M15 10h.01" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-900 text-cream-100 transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:hover:bg-forest-900"
                aria-label="Отправить сообщение"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="m22 2-11 11M22 2 15 22l-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="mt-3">
              <div className="text-[11px] font-bold text-ink">Быстрые вопросы</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendMessage(question)}
                    className="rounded-full border border-ink/10 bg-white/40 px-3 py-2 text-[11px] font-semibold text-ink transition-colors hover:bg-white/80"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 text-cream-100 shadow-xl transition-colors hover:bg-forest-900"
        aria-label={open ? "Закрыть чат" : "Открыть чат с экспертом"}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <path d="M21 12a8 8 0 0 1-8 8H4l2.4-2.9A8 8 0 1 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  );
}
