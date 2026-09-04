"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import BenefitsStrip from "@/components/BenefitsStrip";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import { buildCatalogQuery, type CatalogParams } from "@/lib/catalogParams";
import type { CatalogData } from "@/lib/queries";

interface Tab {
  slug: string;
  name: string;
  count?: number;
  href: string;
  active: boolean;
}

interface Crumb {
  label: string;
  href?: string;
}

interface CatalogViewProps {
  basePath: string;
  params: CatalogParams;
  data: CatalogData;
  heading: string;
  headingNote?: string | null;
  breadcrumb: Crumb[];
  tabs: Tab[];
  heroImage?: string | null;
}

/** Группы-«свойства» и база колеровки в макете свёрнуты, у класса стойкости есть подсказка. */
const COLLAPSED_KEYS = ["properties", "colorBase"];
const INFO_KEYS = ["wash"];

function pluralProducts(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
  return "товаров";
}

export default function CatalogView({
  basePath,
  params,
  data,
  heading,
  headingNote,
  breadcrumb,
  tabs,
  heroImage,
}: CatalogViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const bounds = data.priceBounds;
  const priceMin = bounds.max > bounds.min ? bounds.min : 0;
  const priceMax = bounds.max > bounds.min ? bounds.max : 1000;

  const [checked, setChecked] = useState<Record<string, string[]>>(params.filters);
  const [sort, setSort] = useState(params.sort);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [priceDraft, setPriceDraft] = useState({
    min: params.priceMin ?? priceMin,
    max: params.priceMax ?? priceMax,
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const facets = useMemo(
    () => data.facets.filter((f) => f.values.some((v) => v.count > 0)),
    [data.facets],
  );
  const volumeFacet = facets.find((f) => f.key === "volume");
  const mainFacets = facets.filter((f) => f.key !== "volume");

  const navigate = (patch: Partial<CatalogParams>) => {
    const next: CatalogParams = {
      filters: checked,
      priceMin: priceDraft.min > priceMin ? priceDraft.min : undefined,
      priceMax: priceDraft.max < priceMax ? priceDraft.max : undefined,
      sort,
      page: 1,
      ...patch,
    };
    startTransition(() => {
      router.push(basePath + buildCatalogQuery(next), { scroll: false });
    });
  };

  // Границы цены зависят от категории: при переходе сбрасываем черновик.
  useEffect(() => {
    setPriceDraft({ min: params.priceMin ?? priceMin, max: params.priceMax ?? priceMax });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMin, priceMax]);

  // Черновик цены отправляем в URL с задержкой, чтобы не дёргать сервер на каждый шаг слайдера.
  useEffect(() => {
    const currentMin = priceDraft.min > priceMin ? priceDraft.min : undefined;
    const currentMax = priceDraft.max < priceMax ? priceDraft.max : undefined;
    if (currentMin === params.priceMin && currentMax === params.priceMax) return;

    const timer = setTimeout(() => {
      startTransition(() => {
        router.push(
          basePath +
            buildCatalogQuery({
              ...params,
              filters: checked,
              sort,
              priceMin: currentMin,
              priceMax: currentMax,
              page: 1,
            }),
          { scroll: false },
        );
      });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceDraft]);

  const toggleValue = (key: string, label: string) => {
    const current = checked[key] ?? [];
    const nextValues = current.includes(label)
      ? current.filter((v) => v !== label)
      : [...current, label];
    const nextFilters = { ...checked };
    if (nextValues.length) nextFilters[key] = nextValues;
    else delete nextFilters[key];

    setChecked(nextFilters);
    navigate({ filters: nextFilters });
  };

  const resetFilters = () => {
    setChecked({});
    setPriceDraft({ min: priceMin, max: priceMax });
    navigate({ filters: {}, priceMin: undefined, priceMax: undefined });
  };

  const activeCount = Object.values(checked).reduce((sum, v) => sum + v.length, 0);
  const minPct = ((priceDraft.min - priceMin) / (priceMax - priceMin)) * 100;
  const maxPct = ((priceDraft.max - priceMin) / (priceMax - priceMin)) * 100;
  const pages = buildPageList(data.page, data.pages);

  const renderFacet = (facet: (typeof facets)[number]) => (
    <FilterSection
      key={facet.key}
      name={facet.name}
      info={INFO_KEYS.includes(facet.key)}
      open={open[facet.key] ?? !COLLAPSED_KEYS.includes(facet.key)}
      values={facet.values}
      checkedValues={checked[facet.key] ?? []}
      onToggleOpen={() =>
        setOpen((p) => ({
          ...p,
          [facet.key]: !(p[facet.key] ?? !COLLAPSED_KEYS.includes(facet.key)),
        }))
      }
      onToggleValue={(label) => toggleValue(facet.key, label)}
    />
  );

  return (
    <div className="bg-cream-50">
      {/* Шапка категории */}
      <section className="relative overflow-hidden">
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 hidden h-full w-[40%] object-cover mix-blend-multiply lg:block"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 30%)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 30%)",
            }}
          />
        )}
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-7">
          <nav
            className="flex flex-wrap items-center gap-1.5 text-xs text-moss"
            aria-label="Хлебные крошки"
          >
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {i > 0 && <Chevron className="text-moss/50" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink/70">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <h1 className="mt-5 font-heading text-4xl font-bold text-forest-900 md:text-[40px]">
            {heading}
          </h1>
          {headingNote && <p className="mt-2 text-[13px] text-moss">{headingNote}</p>}

          {tabs.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2.5">
              {tabs.map((tab) => (
                <Link
                  key={tab.slug}
                  href={tab.href}
                  className={`flex items-center gap-3 rounded-lg py-2.5 pl-4 pr-2.5 text-[13px] transition-colors ${
                    tab.active
                      ? "bg-forest-900 font-semibold text-cream-100"
                      : "border border-ink/10 bg-white font-medium text-ink hover:border-ink/25"
                  }`}
                >
                  {tab.name}
                  {tab.count !== undefined && (
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                        tab.active ? "bg-cream-100/15 text-cream-100" : "text-moss"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Фильтры + товары */}
      <div className="mx-auto flex max-w-7xl gap-8 px-4 pb-14">
        <aside className={`${showFilters ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-60`}>
          <div className="flex items-center justify-between border-b border-ink/8 pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink">
              Фильтры
            </span>
            <button
              type="button"
              onClick={resetFilters}
              disabled={activeCount === 0}
              className="text-xs text-moss underline underline-offset-2 transition-colors hover:text-ink disabled:cursor-default disabled:no-underline disabled:opacity-40"
            >
              Сбросить все
            </button>
          </div>

          {mainFacets.map(renderFacet)}

          <div className="border-b border-ink/8 py-4">
            <div className="text-[13px] font-semibold text-ink">Цена, ₽</div>
            <div className="range-double mt-4">
              <div className="range-track" />
              <div
                className="range-fill"
                style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
              />
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                step={10}
                value={priceDraft.min}
                aria-label="Минимальная цена"
                onChange={(e) =>
                  setPriceDraft((p) => ({ ...p, min: Math.min(+e.target.value, p.max) }))
                }
              />
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                step={10}
                value={priceDraft.max}
                aria-label="Максимальная цена"
                onChange={(e) =>
                  setPriceDraft((p) => ({ ...p, max: Math.max(+e.target.value, p.min) }))
                }
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <label className="flex flex-1 items-center gap-1.5 rounded-md border border-ink/10 bg-white px-2.5 py-1.5">
                <span className="text-[11px] text-moss">от</span>
                <input
                  type="number"
                  value={priceDraft.min}
                  min={priceMin}
                  max={priceMax}
                  onChange={(e) =>
                    setPriceDraft((p) => ({
                      ...p,
                      min: Math.min(Math.max(+e.target.value || priceMin, priceMin), p.max),
                    }))
                  }
                  className="w-full min-w-0 bg-transparent text-xs font-semibold text-ink outline-none"
                />
              </label>
              <label className="flex flex-1 items-center gap-1.5 rounded-md border border-ink/10 bg-white px-2.5 py-1.5">
                <span className="text-[11px] text-moss">до</span>
                <input
                  type="number"
                  value={priceDraft.max}
                  min={priceMin}
                  max={priceMax}
                  onChange={(e) =>
                    setPriceDraft((p) => ({
                      ...p,
                      max: Math.max(Math.min(+e.target.value || priceMax, priceMax), p.min),
                    }))
                  }
                  className="w-full min-w-0 bg-transparent text-xs font-semibold text-ink outline-none"
                />
              </label>
            </div>
          </div>

          {volumeFacet && renderFacet(volumeFacet)}
        </aside>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="btn-outline mb-4 flex w-full items-center justify-center gap-2 py-2.5 text-sm lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M3 5h18M6 12h12M10 19h4" strokeLinecap="round" />
            </svg>
            Фильтры
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[13px] font-semibold text-ink">
              Найдено {data.total} {pluralProducts(data.total)}
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-moss">Сортировать:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => {
                    const next = e.target.value as CatalogParams["sort"];
                    setSort(next);
                    navigate({ sort: next });
                  }}
                  aria-label="Сортировка товаров"
                  className="appearance-none rounded-md border border-ink/10 bg-white py-2 pl-3 pr-8 text-xs font-medium text-ink outline-none transition-colors focus:border-forest-700"
                >
                  <option value="popular">По популярности</option>
                  <option value="price-asc">Сначала дешевле</option>
                  <option value="price-desc">Сначала дороже</option>
                  <option value="rating">По рейтингу</option>
                  <option value="new">По новизне</option>
                </select>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-moss"
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-label="Показывать плиткой"
                  aria-pressed={view === "grid"}
                  className={`rounded-md px-2.5 py-2 transition-colors ${
                    view === "grid"
                      ? "bg-forest-900 text-cream-100"
                      : "border border-ink/10 bg-white text-moss hover:border-ink/25 hover:text-ink"
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label="Показывать списком"
                  aria-pressed={view === "list"}
                  className={`rounded-md px-2.5 py-2 transition-colors ${
                    view === "list"
                      ? "bg-forest-900 text-cream-100"
                      : "border border-ink/10 bg-white text-moss hover:border-ink/25 hover:text-ink"
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className={isPending ? "mt-5 transition-opacity opacity-50" : "mt-5 transition-opacity"}>
            {data.products.length === 0 ? (
              <div className="rounded-lg border border-ink/10 bg-white px-6 py-14 text-center">
                <p className="text-sm font-semibold text-ink">Под такие условия товары не нашлись</p>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-moss">
                  Сбросьте часть фильтров или расширьте диапазон цены — выдача станет шире.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn-outline mt-6 px-5 py-2.5 text-xs"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "grid gap-4"
                }
              >
                {data.products.map((product) => (
                  <CatalogProductCard
                    key={product.id}
                    id={product.id}
                    layout={view}
                    slug={product.slug}
                    name={product.name}
                    description={product.description ?? undefined}
                    image={product.image ?? undefined}
                    priceFrom={product.priceFrom}
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                    inStock={product.inStock}
                    variants={product.variants}
                  />
                ))}
              </div>
            )}
          </div>

          {data.pages > 1 && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
              aria-label="Пагинация"
            >
              {data.page > 1 && (
                <Link
                  href={basePath + buildCatalogQuery({ ...params, page: data.page - 1 })}
                  className="flex items-center gap-1.5 rounded-md border border-ink/10 bg-white px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-ink/25"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Назад
                </Link>
              )}
              {pages.map((page, i) =>
                page === null ? (
                  <span key={`gap-${i}`} className="px-1 text-xs text-moss">
                    …
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={basePath + buildCatalogQuery({ ...params, page })}
                    aria-current={page === data.page ? "page" : undefined}
                    className={`flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                      page === data.page
                        ? "bg-forest-900 text-cream-100"
                        : "border border-ink/10 bg-white text-ink hover:border-ink/25"
                    }`}
                  >
                    {page}
                  </Link>
                ),
              )}
              {data.page < data.pages && (
                <Link
                  href={basePath + buildCatalogQuery({ ...params, page: data.page + 1 })}
                  className="flex items-center gap-1.5 rounded-md border border-ink/10 bg-white px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-ink/25"
                >
                  Вперед
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14">
        <BenefitsStrip className="rounded-lg bg-cream-100" />
      </div>
    </div>
  );
}

/** Номера страниц с разрывами: 1 … 4 [5] 6 … 13. */
function buildPageList(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | null)[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);

  if (from > 2) pages.push(null);
  for (let p = from; p <= to; p += 1) pages.push(p);
  if (to < total - 1) pages.push(null);
  pages.push(total);

  return pages;
}

function FilterSection({
  name,
  info,
  open,
  values,
  checkedValues,
  onToggleOpen,
  onToggleValue,
}: {
  name: string;
  info: boolean;
  open: boolean;
  values: { label: string; count: number }[];
  checkedValues: string[];
  onToggleOpen: () => void;
  onToggleValue: (label: string) => void;
}) {
  return (
    <div className="border-b border-ink/8 py-4">
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          {name}
          {info && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-moss" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
            </svg>
          )}
        </span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-moss transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 space-y-2.5">
          {values.map((value) => (
            <label key={value.label} className="flex cursor-pointer items-center gap-2.5">
              <span className="relative flex h-4 w-4 shrink-0">
                <input
                  type="checkbox"
                  checked={checkedValues.includes(value.label)}
                  onChange={() => onToggleValue(value.label)}
                  className="peer h-4 w-4 appearance-none rounded-[4px] border border-ink/25 bg-white transition-colors checked:border-forest-800 checked:bg-forest-800"
                />
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  className="pointer-events-none absolute inset-0 m-auto text-cream-100 opacity-0 transition-opacity peer-checked:opacity-100"
                  aria-hidden
                >
                  <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="flex-1 text-[13px] leading-tight text-ink/80">{value.label}</span>
              <span className="text-xs text-moss">{value.count}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
