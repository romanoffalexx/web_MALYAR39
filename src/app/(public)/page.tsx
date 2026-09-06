import Link from "next/link";
import BenefitsStrip from "@/components/BenefitsStrip";
import ProductCard from "@/components/catalog/ProductCard";
import {
  getFeaturedCases,
  getFeaturedVideos,
  getHomeCategories,
  getPopularProducts,
} from "@/lib/queries";

export const revalidate = 300;

/** Тон плитки задаёт вёрстка, а не БД: чередуем по позиции категории. */
const CATEGORY_TONES = [
  { tone: "bg-forest-900 text-cream-100", button: "btn-outline-light" },
  { tone: "bg-forest-800 text-cream-100", button: "btn-outline-light" },
  { tone: "bg-cream-300 text-forest-900", button: "btn-outline-dark" },
  { tone: "bg-pine text-cream-100", button: "btn-outline-light" },
];

const heroFeatures = [
  {
    label: "Проверенное качество",
    icon: (
      <path d="M12 3 4.5 6v5.2c0 4.6 3.2 8 7.5 9.8 4.3-1.8 7.5-5.2 7.5-9.8V6L12 3Zm-2.6 9 2 2 3.6-3.8" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: "Быстрая доставка по всей России",
    icon: (
      <path d="M2 6h11v9H2zM13 9h4.5L21 12.5V15h-8M6.5 18a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm10 0a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: "Широкий ассортимент",
    icon: (
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" strokeLinejoin="round" />
    ),
  },
  {
    label: "Профессиональная поддержка",
    icon: (
      <path d="M4 13a8 8 0 0 1 16 0M4 13v4a2 2 0 0 0 2 2h2v-6H4Zm16 0v4a2 2 0 0 1-2 2h-2v-6h4Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

const consultPoints = [
  {
    text: "Подбор материала под задачу",
    icon: (
      <path d="M4 13a8 8 0 0 1 16 0M4 13v4a2 2 0 0 0 2 2h2v-6H4Zm16 0v4a2 2 0 0 1-2 2h-2v-6h4Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    text: "Расчёт расхода и количества",
    icon: (
      <path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h3" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    text: "Ответим на любые вопросы",
    icon: (
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function HomePage() {
  const [categories, popularProducts, cases, videos] = await Promise.all([
    getHomeCategories(4),
    getPopularProducts(5),
    getFeaturedCases(3),
    getFeaturedVideos(5),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-0">
          <div className="max-w-2xl py-4 lg:py-20">
            <p className="eyebrow">Профессиональные материалы</p>
            <h1 className="mt-5 font-heading text-4xl font-bold uppercase leading-[1.08] tracking-tight text-forest-900 md:text-5xl xl:text-[56px]">
              Для качественной покраски и отделки
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-moss">
              Широкий ассортимент красок, эмалей, грунтовок и штукатурок для любых поверхностей
            </p>
            <ul className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {heroFeatures.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="mt-0.5 shrink-0 text-forest-800" aria-hidden>
                    {f.icon}
                  </svg>
                  <span className="text-[11px] font-medium leading-snug text-ink/80">{f.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="rounded-md bg-forest-800 px-7 py-3.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-900"
              >
                Перейти в каталог
              </Link>
              <Link
                href="/consultation"
                className="rounded-md border border-forest-800 px-7 py-3.5 text-sm font-semibold text-forest-800 transition-colors hover:bg-forest-800 hover:text-cream-100"
              >
                Подобрать материал
              </Link>
            </div>
          </div>

          <div className="relative -mx-4 lg:mx-0 lg:self-stretch">
            <img
              src="/images/hero/paint-can.jpg"
              alt="Банка краски Маляр, валик и кисть"
              className="h-64 w-full object-cover lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-[115%] lg:max-w-none lg:object-cover lg:object-left"
            />
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="bg-cream-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="section-head">
            <h2 className="section-head-title">Категории продукции</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => {
              const { tone, button } = CATEGORY_TONES[i % CATEGORY_TONES.length];
              return (
                <Link
                  key={cat.slug}
                  href={`/catalog/${cat.slug}`}
                  className={`group flex min-h-[380px] flex-col overflow-hidden rounded-lg ${tone}`}
                >
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-xl font-bold uppercase leading-snug tracking-wide">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-3 max-w-[220px] text-xs leading-relaxed opacity-75">
                        {cat.description}
                      </p>
                    )}
                    <span className={`${button} mt-5 self-start px-4 py-2 text-xs`}>
                      Перейти в каталог
                      <ArrowRight />
                    </span>
                  </div>
                  {cat.image && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Полоса преимуществ */}
      <section className="border-y border-ink/8 bg-cream-50">
        <div className="mx-auto max-w-7xl px-4">
          <BenefitsStrip className="bg-cream-50" />
        </div>
      </section>

      {/* Популярные товары */}
      <section className="bg-cream-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="section-row">
            <h2 className="section-row-title">Популярные товары</h2>
            <Link href="/catalog" className="section-row-link">
              Смотреть все
              <ArrowRight />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                brand={product.description ?? product.brand ?? undefined}
                image={product.image ?? undefined}
                priceFrom={product.priceFrom}
                inStock={product.inStock}
                variants={product.variants}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Кейсы */}
      <section className="bg-cream-50 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="section-row">
            <h2 className="section-row-title">Кейсы и примеры использования</h2>
            <Link href="/cases" className="section-row-link">
              Смотреть все
              <ArrowRight />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {cases.map((c) => (
              <Link key={c.slug} href={`/cases/${c.slug}`} className="card group flex flex-col">
                {c.image && (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-y-0 left-1/2 w-px bg-white/80" aria-hidden />
                    <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-forest-900 shadow" aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 6 3 12l6 6V6Zm6 0v12l6-6-6-6Z" />
                      </svg>
                    </span>
                    {c.tag && (
                      <span className="absolute bottom-2 left-2 rounded bg-forest-950/70 px-2 py-0.5 text-[10px] font-medium text-cream-100">
                        {c.tag}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[13px] font-bold text-ink">{c.title}</h3>
                  {c.description && (
                    <p className="mt-2 text-xs leading-relaxed text-moss">{c.description}</p>
                  )}
                  {c.materials && (
                    <p className="mt-3 text-[11px] text-moss">
                      <span className="font-bold text-ink">Материалы:</span> {c.materials}
                    </p>
                  )}
                  {c.economy && (
                    <p className="mt-1 text-[11px] font-semibold text-accent">
                      Экономия: {c.economy}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Видеообзоры */}
      <section className="bg-cream-50 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="section-row">
            <h2 className="section-row-title">Видеообзоры материалов</h2>
            <Link href="/reviews" className="section-row-link">
              Смотреть все
              <ArrowRight />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {videos.map((v) => (
              <Link key={v.slug} href="/reviews" className="group">
                {v.image && (
                  <div className="relative h-24 overflow-hidden rounded-md">
                    <img
                      src={v.image}
                      alt={v.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-forest-950/25 transition-colors group-hover:bg-forest-950/10" aria-hidden />
                    <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-forest-900" aria-hidden>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 4.5v15l13-7.5-13-7.5Z" />
                      </svg>
                    </span>
                    {v.duration && (
                      <span className="absolute bottom-1.5 right-1.5 rounded bg-forest-950/75 px-1.5 py-0.5 text-[10px] font-semibold text-cream-100">
                        {v.duration}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-2.5 text-xs font-medium leading-snug text-ink transition-colors group-hover:text-forest-700">
                  {v.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Баннер консультации */}
      <section className="bg-cream-50 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative grid overflow-hidden rounded-xl bg-forest-900 text-cream-100 lg:grid-cols-[1.3fr_auto_1fr]">
            <div className="p-8 lg:p-12">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cream-100/40">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                  <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5ZM9 11h6M9 14h4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2 className="mt-6 font-heading text-3xl font-bold lg:text-[34px]">
                Нужна помощь в подборе?
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-100/70">
                Оставьте заявку — наш специалист подберёт оптимальное решение под ваши задачи
              </p>
              <Link href="/consultation" className="btn-cream mt-8">
                Получить консультацию
                <ArrowRight />
              </Link>
            </div>

            <img
              src="/images/people/consultant.png"
              alt="Специалист магазина Маляр"
              className="hidden h-full w-56 object-cover object-top lg:block"
            />

            <ul className="space-y-5 p-8 lg:p-12">
              {consultPoints.map((p) => (
                <li key={p.text} className="flex items-center gap-3.5">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="shrink-0 text-cream-100/70" aria-hidden>
                    {p.icon}
                  </svg>
                  <span className="text-sm font-medium">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
