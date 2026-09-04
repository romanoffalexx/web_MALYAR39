"use client";

import Link from "next/link";
import { useState } from "react";
import BenefitsStrip from "@/components/BenefitsStrip";
import type { AudienceView, SolutionDetail } from "@/lib/queries";

interface SolutionsExplorerProps {
  audiences: AudienceView[];
  solutions: SolutionDetail[];
}

const audienceIcons: Record<string, React.ReactNode> = {
  building: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8h3M8 12h3M8 16h3" strokeLinecap="round" />
    </svg>
  ),
  factory: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 21V9l6 3V9l6 3V9l6 3v9H3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 17h2M12 17h2M17 17h2M6 9V4h3v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  helmet: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 15a8 8 0 0 1 16 0" strokeLinecap="round" />
      <path d="M2.5 15h19v2.5h-19zM10 7.5V5h4v2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  municipal: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 9.5 12 4l9 5.5M4.5 10v8M9.5 10v8M14.5 10v8M19.5 10v8M3 21h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const featureIcons = [
  <svg key="0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v4.5l2.5 1.5M8.5 4.5 7 3M15.5 4.5 17 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M15 9c-3.5 0-6 2.5-6 6 3.5 0 6-2.5 6-6ZM9 15l-1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="m14 6 4 4-9 9H5v-4l9-9ZM12.5 7.5l4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <circle cx="8" cy="8" r="2.6" />
    <circle cx="16" cy="8" r="2.6" />
    <circle cx="8" cy="16" r="2.6" />
    <circle cx="16" cy="16" r="2.6" />
  </svg>,
];

export default function SolutionsExplorer({ audiences, solutions }: SolutionsExplorerProps) {
  const initialSolution = solutions[0];
  const [audienceSlug, setAudienceSlug] = useState(initialSolution?.segment ?? audiences[0]?.slug);
  const [solutionSlug, setSolutionSlug] = useState(initialSolution?.slug ?? "");

  const audience = audiences.find((a) => a.slug === audienceSlug) ?? audiences[0];
  const audienceSolutions = solutions.filter((s) => s.segment === audienceSlug);
  const solution = solutions.find((s) => s.slug === solutionSlug) ?? audienceSolutions[0];

  const selectAudience = (slug: string) => {
    setAudienceSlug(slug);
    const first = solutions.find((s) => s.segment === slug);
    if (first) setSolutionSlug(first.slug);
  };

  if (!audience || !solution) {
    return (
      <div className="bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-bold text-forest-900">Решения не найдены</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-7">
        <nav className="flex items-center gap-1.5 text-xs text-moss" aria-label="Хлебные крошки">
          <Link href="/" className="transition-colors hover:text-ink">Главная</Link>
          <Chevron />
          <span className="text-ink/70">Типовые решения</span>
        </nav>

        <h1 className="mt-5 font-heading text-4xl font-bold text-forest-900">Типовые решения</h1>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-moss">
          Готовые системы покрытий для профессиональных задач. Подберите оптимальное решение для вашего объекта.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {audiences.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => selectAudience(item.slug)}
              className={`card relative flex h-full flex-col overflow-hidden p-5 text-left transition-shadow ${
                audienceSlug === item.slug ? "border-forest-800 ring-1 ring-forest-800" : "hover:border-ink/20"
              }`}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="pointer-events-none absolute right-0 top-0 h-full w-[58%] object-cover"
                  style={{
                    maskImage: "linear-gradient(to right, transparent, black 65%)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 65%)",
                  }}
                />
              )}
              <span className="relative text-forest-800">{audienceIcons[item.icon ?? ""]}</span>
              <h2 className="relative mt-4 max-w-[190px] text-[15px] font-bold leading-snug text-ink">{item.title}</h2>
              {item.description && (
                <p className="relative mt-2.5 max-w-[200px] text-[11px] leading-relaxed text-moss">{item.description}</p>
              )}
              <span className="relative mt-auto flex items-center gap-2 pt-5 text-xs font-semibold text-ink">
                Смотреть решения
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <div>
            <div className="card p-4">
              <h2 className="px-2 py-2 text-[13px] font-bold text-ink">Решения {audience.title.toLowerCase()}</h2>
              <div className="mt-1 space-y-1">
                {audienceSolutions.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setSolutionSlug(item.slug)}
                    className={`group flex w-full items-center justify-between gap-2 rounded-md px-4 py-3 text-left text-xs font-semibold transition-colors ${
                      solutionSlug === item.slug ? "bg-forest-900 text-cream-100" : "text-ink hover:bg-cream-100"
                    }`}
                  >
                    {item.title}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`shrink-0 transition-opacity ${
                        solutionSlug === item.slug ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                      }`}
                      aria-hidden
                    >
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <aside className="mt-5 rounded-lg bg-accent/10 p-5">
              <h3 className="text-[15px] font-bold leading-snug text-ink">Нужна консультация по решению?</h3>
              <p className="mt-2.5 text-[11px] leading-relaxed text-moss">
                Наш специалист подберёт оптимальную систему покрытий для вашего объекта
              </p>
              <Link
                href="/consultation"
                className="mt-4 inline-flex items-center gap-2.5 rounded-md bg-forest-800 px-5 py-3 text-[13px] font-semibold text-cream-100 transition-colors hover:bg-forest-900"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                  <path d="M21 12a8 8 0 0 1-8 8H4l2.4-2.9A8 8 0 1 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Получить консультацию
              </Link>
            </aside>
          </div>

          <div>
            <div className="card grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_430px]">
              <div className="p-6">
                <div className="text-[11px] text-moss">Решение</div>
                <h2 className="mt-2 font-heading text-2xl font-bold text-forest-900">{solution.title}</h2>
                {solution.description && (
                  <p className="mt-3 max-w-xl text-xs leading-relaxed text-moss">{solution.description}</p>
                )}
                {solution.features.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                    {solution.features.map((feature, index) => (
                      <div key={feature} className="flex gap-2.5">
                        <span className="shrink-0 text-forest-800">{featureIcons[index % featureIcons.length]}</span>
                        <span className="text-[11px] leading-snug text-moss">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {solution.image && (
                <img src={solution.image} alt={solution.title} className="h-52 w-full object-cover lg:h-full" />
              )}
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-4">
              {(solution.task || solution.taskPoints.length > 0) && (
                <div className="card p-5">
                  <h3 className="text-[13px] font-bold text-ink">Задача</h3>
                  {solution.task && (
                    <p className="mt-3 text-[11px] leading-relaxed text-moss">{solution.task}</p>
                  )}
                  {solution.taskPoints.length > 0 && (
                    <ul className="mt-4 space-y-2.5">
                      {solution.taskPoints.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-ink">
                          <CheckSolid />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {solution.materials.length > 0 && (
                <div className="card p-5">
                  <h3 className="text-[13px] font-bold text-ink">Рекомендуемые материалы</h3>
                  <div className="mt-4 space-y-4">
                    {solution.materials.map((material) => (
                      <div key={material.name ?? ""} className="flex gap-3">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-cream-100 p-1">
                          {material.image ? (
                            <img
                              src={material.image}
                              alt={material.name ?? ""}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] text-moss">Нет фото</span>
                          )}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-ink">{material.name}</div>
                          {material.description && (
                            <div className="mt-0.5 text-[11px] leading-snug text-moss">{material.description}</div>
                          )}
                          {material.price && (
                            <div className="mt-1 text-[11px] font-bold text-ink">{material.price}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/catalog"
                    className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink transition-colors hover:text-forest-700"
                  >
                    Смотреть все материалы
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              )}

              {solution.steps.length > 0 && (
                <div className="card p-5">
                  <h3 className="text-[13px] font-bold text-ink">Технология / этапы</h3>
                  <ol className="mt-4 space-y-4">
                    {solution.steps.map((step, index) => (
                      <li key={step.title} className="flex gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-900 text-[10px] font-bold text-cream-100">
                          {index + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-ink">{step.title}</div>
                          {step.description && (
                            <p className="mt-1 text-[11px] leading-relaxed text-moss">{step.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {solution.advantages.length > 0 && (
                <div className="card p-5">
                  <h3 className="text-[13px] font-bold text-ink">Преимущества решения</h3>
                  <ul className="mt-4 space-y-2.5">
                    {solution.advantages.map((advantage) => (
                      <li key={advantage} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-ink">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-px shrink-0 text-forest-800" aria-hidden>
                          <circle cx="12" cy="12" r="9" />
                          <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {advantage}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-md bg-accent/10 p-4">
                    <div className="flex gap-2.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-forest-800" aria-hidden>
                        <path d="M12 3 5 5.5v5.2c0 4.4 2.9 8.4 7 9.8 4.1-1.4 7-5.4 7-9.8V5.5L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m9 11.5 2.2 2.2L15.5 9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[11px] leading-snug text-ink">Подберём оптимальную систему под ваш объект и бюджет</span>
                    </div>
                    <Link
                      href="/consultation"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-forest-800 px-4 py-2.5 text-[11px] font-semibold text-cream-100 transition-colors hover:bg-forest-900"
                    >
                      Запросить консультацию
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14">
        <BenefitsStrip className="rounded-lg bg-cream-100" />
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

function CheckSolid() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="mt-px shrink-0 text-accent" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" stroke="#fdfbf6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
