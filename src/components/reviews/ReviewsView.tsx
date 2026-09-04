"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReviewItem } from "@/lib/queries";

interface Props {
  reviews: ReviewItem[];
  casesCount: number;
}

type SortMode = "new" | "old" | "popular";

export default function ReviewsView({ reviews, casesCount }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "video" | "photo">("all");
  const [sort, setSort] = useState<SortMode>("new");
  const [query, setQuery] = useState("");

  const tabs = [
    { id: "all" as const, name: "Все обзоры", count: reviews.length },
    { id: "video" as const, name: "Видеообзоры", count: reviews.filter((r) => r.type === "video").length },
    { id: "photo" as const, name: "Фотообзоры", count: reviews.filter((r) => r.type === "photo").length },
  ];

  const visibleReviews = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = reviews.filter((review) => {
      const byTab = activeTab === "all" || review.type === activeTab;
      const byQuery =
        normalized.length === 0 ||
        review.title.toLowerCase().includes(normalized) ||
        (review.description ?? "").toLowerCase().includes(normalized);
      return byTab && byQuery;
    });
    return filtered.sort((a, b) => {
      if (sort === "popular") return b.views - a.views;
      const diff = a.dateIso.localeCompare(b.dateIso);
      return sort === "new" ? -diff : diff;
    });
  }, [reviews, activeTab, sort, query]);

  return (
    <div className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-7">
        <nav className="flex items-center gap-1.5 text-xs text-moss" aria-label="Хлебные крошки">
          <Link href="/" className="transition-colors hover:text-ink">Главная</Link>
          <Chevron />
          <span className="text-ink/70">Обзоры</span>
        </nav>

        <h1 className="mt-5 font-heading text-4xl font-bold text-forest-900">Фото- и видеообзоры</h1>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-moss">
          Полезные обзоры материалов, советы по нанесению и реальные примеры использования красок и штукатурок Маляр.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-forest-900 text-cream-100"
                    : "border border-ink/10 bg-white text-ink hover:border-ink/25"
                }`}
              >
                {tab.name}
                <span
                  className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                    activeTab === tab.id ? "bg-cream-100/20 text-cream-100" : "bg-cream-200 text-moss"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
            <Link
              href="/cases"
              className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/25"
            >
              Кейсы
              <span className="rounded bg-cream-200 px-1.5 py-0.5 text-[11px] font-bold text-moss">
                {casesCount}
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 text-[13px] font-medium text-ink outline-none transition-colors focus:border-forest-700"
              aria-label="Сортировка обзоров"
            >
              <option value="new">Сортировка: новые</option>
              <option value="old">Сортировка: старые</option>
              <option value="popular">Сортировка: популярные</option>
            </select>
            <div className="relative">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск по обзорам"
                className="w-56 rounded-lg border border-ink/10 bg-white py-2.5 pl-4 pr-9 text-[13px] text-ink outline-none transition-colors placeholder:text-moss/70 focus:border-forest-700"
              />
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-moss" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {visibleReviews.length === 0 ? (
          <div className="card mt-8 p-10 text-center">
            <h2 className="text-[15px] font-bold text-ink">Ничего не нашли по запросу &laquo;{query}&raquo;</h2>
            <p className="mt-2 text-[13px] text-moss">Попробуйте изменить запрос или сбросить фильтры.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveTab("all");
              }}
              className="btn-outline mt-5"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {visibleReviews.map((review) => (
              <article key={review.slug} className="card flex flex-col overflow-hidden">
                <div className="relative">
                  <img
                    src={review.thumbnail ?? "/images/reviews/placeholder.jpg"}
                    alt={review.title}
                    className="aspect-[5/3] w-full object-cover"
                  />
                  {review.type === "video" && (
                    <>
                      <span className="absolute left-3 top-3 flex items-center gap-1 rounded-[4px] bg-ink/90 px-2 py-[5px] text-[9px] font-extrabold tracking-[0.08em] text-white">
                        RUTUBE
                        <svg width="7" height="8" viewBox="0 0 8 9" fill="currentColor" aria-hidden>
                          <path d="M0 0v9l8-4.5L0 0Z" />
                        </svg>
                      </span>
                      {review.duration && (
                        <span className="absolute bottom-2.5 right-2.5 rounded-[4px] bg-ink/90 px-1.5 py-[3px] text-[10px] font-bold text-white">
                          {review.duration}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="text-[13px] font-bold leading-snug text-ink">{review.title}</h2>
                  {review.description && (
                    <p className="mt-2 text-[11px] leading-relaxed text-moss">{review.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-moss">
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                        <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="2.6" />
                      </svg>
                      {review.views}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                        <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
                        <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
                      </svg>
                      {review.date}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-6 rounded-lg bg-accent/10 p-7 lg:flex-row lg:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink/25 text-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M8 5.5v13l11-6.5-11-6.5Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex-1">
            <h2 className="text-[15px] font-bold text-ink">Не нашли нужный обзор?</h2>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-moss">
              Наш эксперт поможет подобрать материал и ответит на все вопросы.
            </p>
          </div>
          <Link
            href="/consultation"
            className="flex shrink-0 items-center justify-center gap-2.5 rounded-md bg-forest-800 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <path d="M21 12a8 8 0 0 1-8 8H4l2.4-2.9A8 8 0 1 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Получить консультацию
          </Link>
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss/50" aria-hidden>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
