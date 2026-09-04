"use client";

import Link from "next/link";
import { useState, useMemo, type ReactNode } from "react";
import BenefitsStrip from "@/components/BenefitsStrip";
import { calculateMaterial } from "@/lib/calculator";
import { useCart } from "@/components/cart/CartProvider";
import type { ProductView } from "@/lib/queries";

interface Props {
  product: ProductView;
}

export default function ProductViewClient({ product }: Props) {
  const hasCoverage = product.coverageRate !== null && product.coverageRate > 0;
  const hasCompatibility = product.compatibility.length > 0;
  const hasDocuments = product.documents.length > 0;
  const hasVideo = !!product.videoUrl;
  const hasDescription = !!product.description;
  const hasApplication = !!product.applicationInstructions;

  const tabDefs = useMemo(() => {
    const t: { key: string; label: string }[] = [];
    if (product.characteristics.length > 0) t.push({ key: "Характеристики", label: "Характеристики" });
    if (hasDescription) t.push({ key: "Описание", label: "Описание" });
    if (hasApplication || hasCoverage) t.push({ key: "Расход и нанесение", label: "Расход и нанесение" });
    if (hasCompatibility) t.push({ key: "Совместимость", label: "Совместимость" });
    if (hasVideo) t.push({ key: "Видео", label: "Видео" });
    return t;
  }, [product.characteristics.length, hasDescription, hasApplication, hasCoverage, hasCompatibility, hasVideo]);

  const [imageIndex, setImageIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(tabDefs[0]?.key ?? "Характеристики");
  const [area, setArea] = useState(45);
  const [layers, setLayers] = useState(product.defaultLayers || 2);
  const [packIndex, setPackIndex] = useState(product.variants.length > 1 ? 1 : 0);

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const selectedVariant = product.variants[variantIndex];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      description: product.subtitle,
      image: product.images[0] ?? null,
      price: selectedVariant.price,
      volume: selectedVariant.volume,
      unit: selectedVariant.unit,
      quantity: qty,
      variants: product.variants.map((v) => ({
        id: v.id,
        volume: v.volume,
        unit: v.unit,
        price: v.price,
      })),
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const pack = product.variants[packIndex] ?? product.variants[0];
  const result = hasCoverage && pack
    ? calculateMaterial({
        area,
        layers,
        coverageRate: product.coverageRate!,
        packagingVolume: pack.volume,
        price: pack.price,
      })
    : null;

  const breadcrumb = [
    { label: "Главная", href: "/" },
    { label: "Каталог товаров", href: "/catalog" },
  ];
  if (product.parentCategorySlug && product.parentCategoryName) {
    breadcrumb.push({ label: product.parentCategoryName, href: `/catalog/${product.parentCategorySlug}` });
  }
  if (product.categorySlug && product.categoryName && product.categorySlug !== product.parentCategorySlug) {
    breadcrumb.push({ label: product.categoryName, href: `/catalog/${product.categorySlug}` });
  }

  return (
    <div className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-7">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-moss" aria-label="Хлебные крошки">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <Chevron />}
              <Link href={crumb.href} className="transition-colors hover:text-ink">{crumb.label}</Link>
            </span>
          ))}
          <Chevron />
          <span className="text-ink/70">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[88px_minmax(0,1fr)_minmax(0,1fr)_380px]">
          {/* Миниатюры */}
          {product.images.length > 1 && (
            <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  aria-label={`Фото ${i + 1}`}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                    imageIndex === i ? "border-forest-800" : "border-ink/10 hover:border-ink/25"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Галерея */}
          <div className="order-1 relative flex aspect-square items-center justify-center rounded-lg bg-cream-200 lg:order-2 lg:aspect-auto lg:min-h-[560px]">
            {product.hit && (
              <span className="absolute left-4 top-4 rounded-md bg-forest-800 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-cream-100">
                Хит продаж
              </span>
            )}
            <img
              src={product.images[imageIndex] ?? "/images/categories/water-splash.jpg"}
              alt={product.name}
              className="h-full max-h-[420px] w-full max-w-[420px] object-contain p-6 mix-blend-multiply"
            />
            <button
              type="button"
              aria-label="Увеличить фото"
              className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-card transition-colors hover:text-forest-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.8-3.8M8.5 11h5M11 8.5v5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Информация */}
          <div className="order-3">
            {product.brand && (
              <div className="text-2xl font-extrabold lowercase tracking-tight text-[#2456a6]">
                {product.brand}
              </div>
            )}
            <h1 className="mt-4 font-heading text-3xl font-bold text-forest-900">
              {product.name}
            </h1>
            {product.subtitle && <p className="mt-2 text-sm text-moss">{product.subtitle}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px]">
              {product.rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="#f2b33d" aria-hidden>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold text-ink">{product.rating}</span>
                </span>
              )}
              {product.rating > 0 && product.article && (
                <span className="h-4 w-px bg-ink/10" aria-hidden />
              )}
              {product.article && <span className="text-moss">Артикул: {product.article}</span>}
            </div>

            {product.priceFrom > 0 && (
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-ink">
                  от {product.priceFrom.toLocaleString("ru-RU")} ₽
                </span>
                {product.variants[0] && (
                  <span className="text-xs text-moss">
                    Цена за {product.variants[0].volume} {product.variants[0].unit}
                  </span>
                )}
              </div>
            )}

            <div className="mt-3 flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${product.inStock ? "bg-accent" : "bg-moss/40"}`} aria-hidden />
              <span className="text-[13px] text-moss">
                {product.inStock ? "В наличии" : "Нет в наличии"}
              </span>
            </div>

            {product.variants.length > 0 && (
              <>
                <div className="mt-6 text-[13px] font-semibold text-ink">Объем / фасовка</div>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantIndex(i)}
                      className={`flex h-[54px] flex-col items-center justify-center rounded-lg border py-1.5 transition-colors ${
                        variantIndex === i
                          ? "border-forest-900 bg-forest-900 text-cream-100"
                          : "border-ink/10 bg-white text-ink hover:border-ink/25"
                      }`}
                    >
                      <span className="text-sm font-bold">
                        {v.volume} {v.unit}
                      </span>
                      {variantIndex !== i && (
                        <span className="text-[11px] text-moss">
                          от {v.price.toLocaleString("ru-RU")} ₽
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-ink/10 bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Уменьшить количество"
                  className="px-4 py-2.5 text-moss transition-colors hover:text-ink"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold text-ink">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Увеличить количество"
                  className="px-4 py-2.5 text-moss transition-colors hover:text-ink"
                >
                  +
                </button>
              </div>
              <span className="text-[13px] text-moss">шт</span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock || !selectedVariant}
                className="flex flex-1 items-center justify-center gap-2.5 rounded-md bg-forest-800 py-3.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {added ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Добавлено
                  </>
                ) : (
                  <>
                    <CartIcon />
                    В корзину
                  </>
                )}
              </button>
              <Link
                href="/consultation"
                className="flex items-center justify-center gap-2.5 rounded-md border border-ink/15 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30"
              >
                Нужна консультация
              </Link>
            </div>
          </div>

          {/* Калькулятор */}
          {hasCoverage && result && pack && (
            <aside className="order-4">
              <div className="card p-6">
                <h2 className="text-[15px] font-bold text-ink">Калькулятор расхода</h2>

                <div className="mt-5">
                  <label htmlFor="calc-area" className="text-[13px] font-semibold text-ink">
                    1. Площадь поверхности
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="calc-area"
                      type="number"
                      min={0}
                      value={area}
                      onChange={(e) => setArea(Math.max(0, +e.target.value))}
                      className="w-full rounded-md border border-ink/10 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-ink outline-none transition-colors focus:border-forest-700"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-moss">м²</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-moss">Введите общую площадь окрашивания</p>
                </div>

                <div className="mt-5">
                  <div className="text-[13px] font-semibold text-ink">2. Количество слоёв</div>
                  <div className="mt-2 grid grid-cols-3 gap-2.5">
                    {[1, 2, 3].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setLayers(n)}
                        className={`rounded-md border py-2.5 text-[13px] font-semibold transition-colors ${
                          layers === n
                            ? "border-forest-900 bg-forest-900 text-cream-100"
                            : "border-ink/10 bg-white text-ink hover:border-ink/25"
                        }`}
                      >
                        {n} {n === 1 ? "слой" : n === 2 ? "слоя" : "слоёв"}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-moss">
                    Рекомендуется 1–2 слоя для оптимального результата
                  </p>
                </div>

                <div className="mt-5">
                  <div className="text-[13px] font-semibold text-ink">3. Выбранная фасовка</div>
                  <div className="mt-2 grid grid-cols-3 gap-2.5">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setPackIndex(i)}
                        className={`flex flex-col items-center justify-center rounded-md border py-2 transition-colors ${
                          packIndex === i
                            ? "border-forest-900 bg-forest-900 text-cream-100"
                            : "border-ink/10 bg-white text-ink hover:border-ink/25"
                        }`}
                      >
                        <span className="text-[13px] font-bold">
                          {v.volume} {v.unit}
                        </span>
                        <span className={`text-[10px] ${packIndex === i ? "text-cream-100/70" : "text-moss"}`}>
                          {v.price.toLocaleString("ru-RU")} ₽/шт
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-moss">Выберите удобный объём тары</p>
                </div>

                <div className="mt-6 rounded-lg bg-accent/10 p-5">
                  <div className="text-[13px] font-bold text-ink">Результат расчёта</div>
                  <p className="mt-1.5 text-xs text-moss">
                    Для площади {area} м² в {layers} {layers === 1 ? "слой" : layers === 2 ? "слоя" : "слоёв"} потребуется:
                  </p>
                  <div className="mt-4 grid grid-cols-2 divide-x divide-ink/8">
                    <div className="pr-4">
                      <div className="text-[11px] text-moss">Необходимый объём</div>
                      <div className="mt-1 text-2xl font-extrabold text-ink">
                        {result.requiredVolume.toLocaleString("ru-RU")}{" "}
                        <span className="text-sm font-semibold">л</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-moss">(с запасом 10%)</div>
                    </div>
                    <div className="pl-4">
                      <div className="text-[11px] text-moss">
                        Количество банок {pack.volume} {pack.unit}
                      </div>
                      <div className="mt-1 text-2xl font-extrabold text-ink">
                        {result.packages} <span className="text-sm font-semibold">шт</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-moss">
                        ({result.totalVolume.toLocaleString("ru-RU")} л с запасом)
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-ink/8 pt-4">
                    <div className="text-[11px] text-moss">Ориентировочная стоимость</div>
                    <div className="mt-1 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-2xl font-extrabold text-ink">
                          {result.cost.toLocaleString("ru-RU")} ₽
                        </div>
                        <div className="mt-0.5 text-[11px] text-moss">
                          {result.packages} банки по {pack.volume} {pack.unit}
                        </div>
                      </div>
                      <img
                        src={product.images[0] ?? "/images/categories/water-splash.jpg"}
                        alt=""
                        aria-hidden
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-[10px] leading-relaxed text-moss">
                    Расчёт приблизительный. Точный расход зависит от типа поверхности,
                    способа нанесения и условий.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setArea(45);
                    setLayers(product.defaultLayers || 2);
                    setPackIndex(product.variants.length > 1 ? 1 : 0);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-ink/15 bg-white py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/30"
                >
                  Сбросить расчёт
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M20 11a8 8 0 1 0-2.3 6.3M20 5v6h-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </aside>
          )}
        </div>

        {/* Табы */}
        {tabDefs.length > 0 && (
          <>
            <div className="mt-14 border-b border-ink/10">
              <div className="flex gap-7 overflow-x-auto">
                {tabDefs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`whitespace-nowrap pb-3 text-[13px] font-semibold transition-colors ${
                      activeTab === tab.key
                        ? "-mb-px border-b-2 border-forest-800 text-ink"
                        : "text-moss hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              {activeTab === "Характеристики" && (
                <CharacteristicsTab
                  characteristics={product.characteristics}
                  coverageRate={product.coverageRate}
                  defaultLayers={product.defaultLayers}
                  compatibility={product.compatibility}
                />
              )}

              {activeTab === "Описание" && product.description && (
                <div className="card max-w-3xl p-6 text-sm leading-relaxed text-ink/80">
                  {product.description.split("\n").map((p, i) => (
                    <p key={i} className={i > 0 ? "mt-3" : ""}>{p}</p>
                  ))}
                </div>
              )}

              {activeTab === "Расход и нанесение" && (
                <div className="card max-w-3xl p-6 text-sm leading-relaxed text-ink/80">
                  {hasCoverage && (
                    <p>
                      Расход: {product.coverageRate} м²/л в один слой по гладкой впитывающей поверхности.
                      На шероховатых поверхностях расход увеличивается на 10–15%.
                    </p>
                  )}
                  {product.applicationInstructions && (
                    <p className={hasCoverage ? "mt-3" : ""}>
                      {product.applicationInstructions}
                    </p>
                  )}
                </div>
              )}

              {activeTab === "Совместимость" && (
                <CompatibilityCard surfaces={product.compatibility} className="max-w-md" />
              )}

              {activeTab === "Видео" && hasVideo && (
                <div className="card max-w-2xl overflow-hidden">
                  <div className="relative aspect-video bg-ink">
                    <iframe
                      src={product.videoUrl!}
                      title={`Видео: ${product.name}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14">
        <BenefitsStrip className="rounded-lg bg-cream-100" />
      </div>
    </div>
  );
}

function CharacteristicsTab({
  characteristics,
  coverageRate,
  defaultLayers,
  compatibility,
}: {
  characteristics: { key: string; value: string }[];
  coverageRate: number | null;
  defaultLayers: number;
  compatibility: string[];
}) {
  const panels: ReactNode[] = [];

  panels.push(
    <div key="chars" className="card divide-y divide-ink/6">
      {characteristics.map((row) => (
        <div key={row.key} className="flex gap-4 px-5 py-3">
          <span className="w-1/2 shrink-0 text-xs text-moss">{row.key}</span>
          <span className="text-xs font-semibold text-ink">{row.value}</span>
        </div>
      ))}
    </div>,
  );

  if (coverageRate !== null && coverageRate > 0) {
    panels.push(
      <div key="coverage" className="card p-5">
        <div className="text-[13px] font-bold text-ink">Расход материала</div>
        <div className="mt-2 text-xl font-extrabold text-ink">{coverageRate} м² / 1 л</div>
        <div className="mt-1 text-[11px] text-moss">в один слой по гладкой поверхности</div>

        <div className="mt-4 border-t border-ink/8 pt-4">
          <div className="text-[13px] font-bold text-ink">Рекомендуемое количество слоёв</div>
          <div className="mt-2 text-xl font-extrabold text-ink">{defaultLayers} {defaultLayers === 1 ? "слой" : defaultLayers === 2 ? "слоя" : "слоёв"}</div>
          <div className="mt-1 text-[11px] text-moss">для получения оптимального результата</div>
        </div>

        <div className="mt-4 border-t border-ink/8 pt-4">
          <div className="text-[13px] font-bold text-ink">Инструмент</div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <ToolIcon label="Валик">
              <path d="M4 5h13v5H4zM17 7h3v4h-9v3M11 14v5" strokeLinecap="round" strokeLinejoin="round" />
            </ToolIcon>
            <ToolIcon label="Кисть">
              <path d="m14 4 6 6-7 7-6-6zM7 11l-3 6 6-3" strokeLinecap="round" strokeLinejoin="round" />
            </ToolIcon>
            <ToolIcon label="Распылитель">
              <path d="M9 8h6v4a3 3 0 0 1-3 3 3 3 0 0 1-3-3zM12 15v5M17 6h.01M19 8h.01M17 10h.01" strokeLinecap="round" strokeLinejoin="round" />
            </ToolIcon>
          </div>
        </div>
      </div>,
    );
  }

  if (compatibility.length > 0) {
    panels.push(<CompatibilityCard key="compat" surfaces={compatibility} />);
  }

  const gridClass = panels.length === 1 ? "lg:grid-cols-1" : panels.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return <div className={`grid gap-5 ${gridClass}`}>{panels}</div>;
}

function CompatibilityCard({ surfaces, className = "" }: { surfaces: string[]; className?: string }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="text-[13px] font-bold text-ink">Совместимость</div>
      <p className="mt-1.5 text-[11px] text-moss">
        Подходит для нанесения на следующие поверхности:
      </p>
      <ul className="mt-3 space-y-2.5">
        {surfaces.map((surface) => (
          <li key={surface} className="flex items-start gap-2.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-accent" aria-hidden>
              <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
              <path d="m8.5 12.2 2.4 2.4 4.6-4.8" strokeLinecap="round" strokeLinejoin="round" stroke="#fff" />
            </svg>
            <span className="text-xs font-semibold text-ink">{surface}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ToolIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink" aria-hidden>
        {children}
      </svg>
      <span className="text-[11px] text-moss">{label}</span>
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

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.47 1.3h8.9a1.5 1.5 0 0 0 1.46-1.16L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
    </svg>
  );
}
