"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const paintObjects = [
  "Стены в квартире",
  "Фасад дома",
  "Потолок офиса",
  "Металлоконструкции",
  "Полы и паркинг",
  "Другое",
];

const surfaceTypes = [
  "Бетон",
  "Штукатурка",
  "Металл",
  "Дерево",
  "Кирпич",
  "Защита от влаги",
  "Другое",
];

const messengers = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.1 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.6-.1.3.1 1.6.8 1.9.9.3.2.5.2.5.4.1.1.1.6-.1 1.2Z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#2AABEE]" aria-hidden>
        <path d="M21.9 4.4 18.9 19c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.6L18.2 6c.4-.3-.1-.5-.6-.2L7.3 12.3l-4.4-1.4c-1-.3-1-1 .2-1.4l17.5-6.7c.8-.3 1.5.2 1.3 1.6Z" />
      </svg>
    ),
  },
  {
    id: "viber",
    name: "Viber",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#7360F2]" aria-hidden>
        <path d="M12 2c4.9 0 8.9 3.6 8.9 8.1 0 4.5-4 8.1-8.9 8.1-.8 0-1.6-.1-2.4-.3L6 21l.6-3.1c-2.1-1.5-3.5-3.8-3.5-6.4C3.1 5.6 7.1 2 12 2Zm-2.6 5.2c-.2 0-.5.1-.7.3-.8.7-1 1.7-.6 2.8.4 1.2 1.2 2.4 2.3 3.4 1.1 1 2.3 1.7 3.4 2 1.1.3 2.1 0 2.8-.8.2-.2.3-.5.3-.7 0-.3-.2-.6-.5-.7l-1.5-.8c-.3-.1-.6-.1-.8.1l-.6.6c-.1.1-.3.2-.4.1-.6-.3-1.2-.7-1.8-1.2-.5-.5-.9-1.1-1.2-1.7-.1-.2 0-.3.1-.4l.6-.6c.2-.2.2-.5.1-.8l-.8-1.5c-.1-.3-.4-.5-.7-.5Z" />
      </svg>
    ),
  },
  {
    id: "email",
    name: "E-mail",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-ink" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 6.5 8.5 6.5 8.5-6.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ConsultationPage() {
  const [paintObject, setPaintObject] = useState("");
  const [surfaceType, setSurfaceType] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [messenger, setMessenger] = useState("whatsapp");
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: { name?: string; contact?: string } = {};
    if (!name.trim()) nextErrors.name = "Укажите имя";
    if (!contact.trim()) nextErrors.contact = "Укажите телефон или e-mail";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setFailed(false);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paintObject: paintObject || undefined,
          surfaceType: surfaceType || undefined,
          comment: comment || undefined,
          name: name.trim(),
          contact: contact.trim(),
          messenger,
        }),
      });
      const data = await response.json();
      if (data.success) setSubmitted(true);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <nav className="flex items-center gap-1.5 text-xs text-moss" aria-label="Хлебные крошки">
          <Link href="/" className="transition-colors hover:text-ink">Главная</Link>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss/50" aria-hidden>
            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-ink/70">Консультация</span>
        </nav>

        <div className="mt-6 grid overflow-hidden rounded-lg shadow-card lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="bg-cream-100 p-8">
            <h1 className="font-heading text-[26px] font-bold leading-snug text-forest-900">
              Получите бесплатную консультацию эксперта
            </h1>
            <p className="mt-3 text-xs leading-relaxed text-moss">
              Подберём оптимальные материалы и рассчитаем расход под ваш объект и бюджет.
            </p>
            <img
              src="/images/consultation/can.jpg"
              alt="Краска Маляр, валик и кисть"
              className="mt-6 w-full mix-blend-multiply"
            />
            <div className="mt-6 flex gap-3 rounded-md bg-accent/10 p-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-0.5 shrink-0 text-forest-800" aria-hidden>
                <path d="M12 3 5 5.5v5.2c0 4.4 2.9 8.4 7 9.8 4.1-1.4 7-5.4 7-9.8V5.5L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m9 11.5 2.2 2.2L15.5 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="text-xs font-bold text-ink">Это бесплатно и ни к чему не обязывает</div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-moss">
                  Наш специалист свяжется с вами в ближайшее время и поможет подобрать решение.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h2 className="mt-5 font-heading text-xl font-bold text-forest-900">Заявка отправлена!</h2>
                <p className="mt-3 max-w-sm text-xs leading-relaxed text-moss">
                  Наш эксперт свяжется с вами в ближайшее время в выбранном мессенджере и поможет подобрать материалы.
                </p>
                <Link href="/" className="btn-outline mt-6">
                  Вернуться на главную
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex items-center">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-900 text-xs font-bold text-cream-100">1</span>
                  <span className="h-px w-14 bg-ink/15" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-xs font-bold text-moss">2</span>
                  <span className="h-px w-14 bg-ink/15" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-xs font-bold text-moss">3</span>
                </div>

                <div className="mt-6">
                  <label htmlFor="paint-object" className="text-xs font-bold text-ink">
                    1. Что необходимо покрасить?
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="paint-object"
                      value={paintObject}
                      onChange={(event) => setPaintObject(event.target.value)}
                      className="w-full appearance-none rounded-md border border-ink/15 bg-white px-4 py-3 text-[13px] text-ink outline-none transition-colors focus:border-forest-700"
                    >
                      <option value="">Выберите объект</option>
                      {paintObjects.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                  <p className="mt-2 text-[11px] text-moss">Например: стены в квартире, фасад дома, потолок офиса</p>
                </div>

                <div className="mt-5">
                  <label htmlFor="surface-type" className="text-xs font-bold text-ink">
                    2. Тип поверхности / задача
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="surface-type"
                      value={surfaceType}
                      onChange={(event) => setSurfaceType(event.target.value)}
                      className="w-full appearance-none rounded-md border border-ink/15 bg-white px-4 py-3 text-[13px] text-ink outline-none transition-colors focus:border-forest-700"
                    >
                      <option value="">Выберите поверхность / задачу</option>
                      {surfaceTypes.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                  <p className="mt-2 text-[11px] text-moss">Например: бетон, металл, штукатурка, защита от влаги</p>
                </div>

                <div className="mt-5">
                  <label htmlFor="comment" className="text-xs font-bold text-ink">
                    3. Комментарий <span className="font-medium text-moss">(необязательно)</span>
                  </label>
                  <div className="relative mt-2">
                    <textarea
                      id="comment"
                      value={comment}
                      maxLength={300}
                      onChange={(event) => setComment(event.target.value)}
                      rows={3}
                      placeholder="Опишите детали: площадь, состояние поверхности, пожелания по цвету и срокам..."
                      className="w-full resize-none rounded-md border border-ink/15 bg-white px-4 py-3 pb-6 text-[13px] text-ink outline-none transition-colors placeholder:text-moss/70 focus:border-forest-700"
                    />
                    <span className="pointer-events-none absolute bottom-2.5 right-3 text-[10px] text-moss">
                      {comment.length} / 300
                    </span>
                  </div>
                </div>

                <h2 className="mt-6 text-[13px] font-bold text-ink">Ваши контактные данные</h2>

                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="lead-name" className="text-xs font-bold text-ink">4. Ваше имя</label>
                    <input
                      id="lead-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Введите имя"
                      className={`mt-2 w-full rounded-md border bg-white px-4 py-3 text-[13px] text-ink outline-none transition-colors placeholder:text-moss/70 focus:border-forest-700 ${
                        errors.name ? "border-red-400" : "border-ink/15"
                      }`}
                    />
                    {errors.name && <p className="mt-1.5 text-[11px] text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="lead-contact" className="text-xs font-bold text-ink">5. Телефон или e-mail</label>
                    <input
                      id="lead-contact"
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                      placeholder="+7 (___) ___-__-__ или e-mail"
                      className={`mt-2 w-full rounded-md border bg-white px-4 py-3 text-[13px] text-ink outline-none transition-colors placeholder:text-moss/70 focus:border-forest-700 ${
                        errors.contact ? "border-red-400" : "border-ink/15"
                      }`}
                    />
                    {errors.contact && <p className="mt-1.5 text-[11px] text-red-500">{errors.contact}</p>}
                  </div>
                </div>

                <div className="mt-5">
                  <span className="text-xs font-bold text-ink">6. Удобный мессенджер</span>
                  <div className="mt-2.5 flex flex-wrap gap-2.5">
                    {messengers.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMessenger(item.id)}
                        className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors ${
                          messenger === item.id
                            ? "border-forest-900 bg-white text-ink ring-1 ring-forest-900"
                            : "border-ink/15 bg-white text-ink hover:border-ink/30"
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-md bg-forest-900 py-3.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-800 disabled:opacity-60"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="m22 2-11 11M22 2 15 22l-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {submitting ? "Отправляем..." : "Отправить заявку эксперту"}
                </button>

                {failed && (
                  <p className="mt-3 text-center text-[11px] text-red-500">
                    Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам: +7 (911) 453-12-20.
                  </p>
                )}

                <label className="mt-3 flex items-start justify-center gap-2 text-[11px] text-moss">
                  <input type="checkbox" defaultChecked className="mt-0.5 shrink-0 accent-forest-800" />
                  <span>
                    Я согласен на{" "}
                    <Link href="/privacy" target="_blank" className="underline hover:text-ink">
                      обработку персональных данных
                    </Link>
                  </span>
                </label>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-moss" aria-hidden>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
