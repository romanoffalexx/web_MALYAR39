import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCase } from "@/lib/queries";
import BenefitsStrip from "@/components/BenefitsStrip";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCase(slug);
  if (!item) return { title: "Кейс не найден | Маляр" };
  return {
    title: item.seoTitle ?? `${item.title} — кейс | Маляр`,
    description: item.seoDescription ?? item.subtitle ?? undefined,
  };
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getCase(slug);
  if (!item) notFound();

  const subtitleInline = item.subtitle
    ? item.subtitle.charAt(0).toLowerCase() + item.subtitle.slice(1)
    : "";

  const titleSuffix = subtitleInline ? ` – ${subtitleInline}` : "";

  const meta = [
    { label: "Площадь", value: item.area, icon: <BuildingIcon /> },
    { label: "Срок реализации", value: item.duration, icon: <ClockIcon /> },
    { label: "Год реализации", value: item.year ? String(item.year) : null, icon: <CalendarIcon /> },
    { label: "Тип работ", value: item.workType, icon: <RollerIcon /> },
  ].filter((m) => m.value);

  return (
    <div className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-7">
        <nav className="flex items-center gap-1.5 text-xs text-moss" aria-label="Хлебные крошки">
          <Link href="/" className="transition-colors hover:text-ink">Главная</Link>
          <Chevron />
          <Link href="/cases" className="transition-colors hover:text-ink">Кейсы</Link>
          <Chevron />
          <span className="truncate text-ink/70">{item.title}{titleSuffix}</span>
        </nav>

        <h1 className="mt-5 font-heading text-3xl font-bold text-forest-900 md:text-4xl">
          {item.title}{titleSuffix}
        </h1>

        <span className="mt-4 inline-block rounded-md bg-cream-200 px-3 py-1.5 text-[11px] font-semibold text-ink">
          {item.categoryName}
        </span>

        {meta.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <span className="text-forest-800">{m.icon}</span>
                <div>
                  <div className="text-[11px] text-moss">{m.label}</div>
                  <div className="mt-0.5 text-[13px] font-bold text-ink">{m.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {item.task && (
          <section className="mt-9">
            <h2 className="font-heading text-lg font-bold text-forest-900">Задача</h2>
            <p className="mt-2.5 max-w-2xl text-[13px] leading-relaxed text-moss">{item.task}</p>
          </section>
        )}

        <div className="relative mt-6 overflow-hidden rounded-lg">
          <div className="grid grid-cols-2">
            <img
              src={item.image ?? "/images/cases/placeholder.jpg"}
              alt={`${item.title} до работ`}
              className="h-56 w-full object-cover grayscale md:h-80"
            />
            <img
              src={item.image ?? "/images/cases/placeholder.jpg"}
              alt={`${item.title} после работ`}
              className="h-56 w-full object-cover md:h-80"
            />
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m9 7-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="absolute bottom-4 left-4 rounded-md bg-forest-900/90 px-3 py-1.5 text-[11px] font-semibold text-cream-100">
            До
          </span>
          <span className="absolute bottom-4 right-4 rounded-md bg-cream-100/95 px-3 py-1.5 text-[11px] font-semibold text-ink">
            После
          </span>
        </div>

        {item.materials.length > 0 && (
          <section className="mt-10">
            <h2 className="font-heading text-lg font-bold text-forest-900">Использованные материалы</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {item.materials.map((material) => (
                <div key={material.name ?? ""} className="card p-4">
                  <div className="flex h-24 items-center justify-center bg-white">
                    <img
                      src={material.image ?? "/images/categories/tools.jpg"}
                      alt={material.name ?? ""}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <h3 className="mt-3 text-[13px] font-bold leading-snug text-ink">{material.name}</h3>
                  {material.description && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-moss">{material.description}</p>
                  )}
                  {material.volume && (
                    <div className="mt-2.5 text-[13px] font-bold text-ink">{material.volume}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          {item.steps.length > 0 && (
            <div className="card p-5">
              <h2 className="text-[13px] font-bold text-ink">Технология / этапы работ</h2>
              <div className="mt-4 space-y-4">
                {item.steps.map((step, index) => (
                  <div key={step.title} className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-900 text-[10px] font-bold text-cream-100">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-ink">{step.title}</h3>
                      {step.description && (
                        <p className="mt-1 text-[11px] leading-relaxed text-moss">{step.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.results.length > 0 && (
            <div className="card p-5">
              <h2 className="text-[13px] font-bold text-ink">Результат</h2>
              <ul className="mt-4 space-y-3">
                {item.results.map((result) => (
                  <li key={result} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-ink">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-px shrink-0 text-accent" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {(item.savings || item.serviceLife) && (
          <div className="mt-6 grid gap-6 rounded-lg bg-accent/10 p-6 md:grid-cols-2 md:gap-0">
            {item.savings && (
              <div className="flex items-start gap-4 md:pr-8">
                <span className="text-forest-800"><SavingsIcon /></span>
                <div>
                  <div className="text-[11px] text-moss">Экономия бюджета</div>
                  <div className="mt-1 text-xl font-bold text-ink">{item.savings}</div>
                  {item.savingsNote && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-moss">{item.savingsNote}</p>
                  )}
                </div>
              </div>
            )}
            {item.serviceLife && (
              <div className={`flex items-start gap-4 ${item.savings ? "md:border-l md:border-ink/10 md:pl-8" : ""}`}>
                <span className="text-forest-800"><ServiceLifeIcon /></span>
                <div>
                  <div className="text-[11px] text-moss">Срок службы покрытия</div>
                  <div className="mt-1 text-xl font-bold text-ink">{item.serviceLife}</div>
                  {item.serviceLifeNote && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-moss">{item.serviceLifeNote}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-5 rounded-lg bg-accent/10 p-6 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h2 className="text-[15px] font-bold text-ink">Нужна такая же надёжность для вашего объекта?</h2>
            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-moss">
              Наш специалист подберёт оптимальную систему материалов и подготовит расчёт под ваш проект.
            </p>
          </div>
          <Link
            href="/consultation"
            className="flex shrink-0 items-center justify-center gap-2.5 rounded-md bg-forest-800 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <path d="M21 12a8 8 0 0 1-8 8H4l2.4-2.9A8 8 0 1 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Запросить консультацию
          </Link>
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

function BuildingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8h3M8 12h3M8 16h3" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
      <path d="M8 14h3M8 17.5h6" strokeLinecap="round" />
    </svg>
  );
}

function RollerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <path d="M20 7h1.5v4H12v3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10.5" y="14" width="3" height="7" rx="1" />
    </svg>
  );
}

function SavingsIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="m3 10 9-6 9 6v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 12h5M9.5 15h5M12 12v6M14.5 12a2.5 2 0 0 0-5 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServiceLifeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M12 5V3M9 3h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
