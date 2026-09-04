"use client";

import Link from "next/link";
import { useState } from "react";
import type { CaseListItem } from "@/lib/queries";

interface Props {
  cases: CaseListItem[];
  categories: { slug: string; name: string; count: number }[];
}

export default function CasesView({ cases, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");

  const visibleCases =
    activeCategory === "all"
      ? cases
      : cases.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-7">
        <nav className="flex items-center gap-1.5 text-xs text-moss" aria-label="Хлебные крошки">
          <Link href="/" className="transition-colors hover:text-ink">Главная</Link>
          <Chevron />
          <span className="text-ink/70">Кейсы</span>
        </nav>

        <h1 className="mt-5 font-heading text-4xl font-bold text-forest-900">Наши кейсы</h1>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-moss">
          Реальные объекты и результаты работы с материалами Маляр
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                activeCategory === category.slug
                  ? "bg-forest-900 text-cream-100"
                  : "border border-ink/10 bg-white text-ink hover:border-ink/25"
              }`}
            >
              {category.name}
              <span
                className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                  activeCategory === category.slug ? "bg-cream-100/20 text-cream-100" : "bg-cream-200 text-moss"
                }`}
              >
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {visibleCases.length === 0 ? (
          <div className="card mt-8 p-10 text-center">
            <h2 className="text-[15px] font-bold text-ink">В этой категории пока нет кейсов</h2>
            <p className="mt-2 text-[13px] text-moss">Выберите другую категорию или сбросьте фильтр.</p>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="btn-outline mt-5"
            >
              Показать все кейсы
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleCases.map((item) => (
              <article key={item.slug} className="card flex flex-col overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image ?? "/images/cases/placeholder.jpg"}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                  />
                  <span className="absolute -bottom-3.5 left-4 rounded-md bg-cream-100 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-card">
                    {item.categoryName}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 pt-7">
                  <h2 className="font-heading text-lg font-bold text-forest-900">{item.title}</h2>
                  {item.subtitle && <p className="mt-1 text-xs text-moss">{item.subtitle}</p>}
                  <div className="mt-5 space-y-1.5 text-xs">
                    {item.area && (
                      <div className="flex gap-2">
                        <span className="text-moss">Площадь:</span>
                        <span className="font-semibold text-ink">{item.area}</span>
                      </div>
                    )}
                    {item.duration && (
                      <div className="flex gap-2">
                        <span className="text-moss">Срок:</span>
                        <span className="font-semibold text-ink">{item.duration}</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/cases/${item.slug}`}
                    className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink transition-colors hover:text-forest-700"
                  >
                    Смотреть кейс
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-6 rounded-lg bg-accent/10 p-7 lg:flex-row lg:items-center">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="shrink-0 text-forest-800" aria-hidden>
            <path d="M3 7h18v11H3zM3 10.5h18M7 14.5h4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m4 20 16-16" strokeLinecap="round" />
          </svg>
          <div className="flex-1">
            <h2 className="text-[15px] font-bold text-ink">Есть похожий проект?</h2>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-moss">
              Подберём оптимальное решение и рассчитаем материалы под ваш объект и бюджет.
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
