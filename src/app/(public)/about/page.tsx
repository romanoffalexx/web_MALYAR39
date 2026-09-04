import Link from "next/link";
import BenefitsStrip from "@/components/BenefitsStrip";
import { getSiteSettings } from "@/lib/queries";

const values = [
  {
    title: "Качество",
    text: "Только проверенные материалы от ведущих производителей",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 3 5 5.5v5.2c0 4.4 2.9 8.4 7 9.8 4.1-1.4 7-5.4 7-9.8V5.5L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 11.5 2.2 2.2L15.5 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Опыт",
    text: "Более 12 лет на рынке лакокрасочных материалов",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="5" y="4" width="14" height="17" rx="1.5" />
        <path d="M9 4.5V3h6v1.5M9 10h6M9 13.5h6M9 17h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Надёжность",
    text: "Своевременная доставка и честные условия",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6.5" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: "Поддержка",
    text: "Профессиональная консультация на каждом этапе",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 13a8 8 0 0 1 16 0" strokeLinecap="round" />
        <rect x="3" y="13" width="4" height="6" rx="1.5" />
        <rect x="17" y="13" width="4" height="6" rx="1.5" />
        <path d="M19 19v1a2 2 0 0 1-2 2h-4" strokeLinecap="round" />
      </svg>
    ),
  },
];

const stats = [
  {
    value: "12+",
    label: "лет на рынке",
    note: "Работаем для вас с 2012 года",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <rect x="3" y="4" width="13" height="5" rx="1.5" />
        <path d="M16 5.5h4v3.5h-4M9.5 9v3M9.5 12v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "5 000+",
    label: "клиентов",
    note: "Строительные компании, дилеры и частные клиенты",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" strokeLinecap="round" />
        <circle cx="16.5" cy="9" r="2.6" />
        <path d="M15.5 14.2c2.3.2 4.2 1.8 4.8 4.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "2 000+",
    label: "товаров в ассортименте",
    note: "Краски, эмали, грунтовки, штукатурки и инструмент",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M6 7h12l-1 14H7L6 7Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 7 5 5h14l-1 2M9 11h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "По всей России",
    label: "Доставка",
    note: "Быстрая доставка в любой регион страны",
    small: true,
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.6" />
      </svg>
    ),
  },
];

const advantages = [
  "Широкий ассортимент для любых задач",
  "Конкурентные цены и специальные предложения",
  "Гарантия качества на всю продукцию",
  "Техническая поддержка и помощь в подборе материалов",
  "Удобные способы оплаты и оперативная доставка",
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-7">
        <nav className="flex items-center gap-1.5 text-xs text-moss" aria-label="Хлебные крошки">
          <Link href="/" className="transition-colors hover:text-ink">Главная</Link>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss/50" aria-hidden>
            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-ink/70">О компании</span>
        </nav>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div>
            <h1 className="font-heading text-4xl font-bold text-forest-900 md:text-5xl">О компании</h1>
            <p className="mt-6 text-[13px] leading-relaxed text-moss">
              Маляр — надёжный поставщик профессиональных материалов для окраски и отделки. Мы работаем с 2012 года
              и помогаем клиентам создавать качественные и долговечные покрытия для любых задач.
            </p>
          </div>
          <img
            src="/images/about/building.jpg"
            alt="Магазин и склад компании Маляр"
            className="w-full mix-blend-multiply"
            style={{
              maskImage: "radial-gradient(ellipse 68% 62% at 50% 50%, black 60%, transparent 84%)",
              WebkitMaskImage: "radial-gradient(ellipse 68% 62% at 50% 50%, black 60%, transparent 84%)",
            }}
          />
        </div>

        <div className="mt-10 grid gap-y-8 sm:grid-cols-2 sm:gap-y-0 lg:grid-cols-4 lg:divide-x lg:divide-ink/10">
          {values.map((value) => (
            <div key={value.title} className="flex gap-3.5 lg:px-6 lg:first:pl-0">
              <span className="shrink-0 text-forest-800">{value.icon}</span>
              <div>
                <h2 className="text-[13px] font-bold text-ink">{value.title}</h2>
                <p className="mt-2 max-w-[220px] text-[11px] leading-relaxed text-moss">{value.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card flex gap-4 p-6">
              <span className="shrink-0 text-forest-800">{stat.icon}</span>
              <div>
                <div className={stat.small ? "text-lg font-extrabold leading-tight text-ink" : "text-2xl font-extrabold text-ink"}>
                  {stat.value}
                </div>
                <div className="mt-1.5 text-xs text-ink">{stat.label}</div>
                <p className="mt-2 text-[11px] leading-relaxed text-moss">{stat.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <img
            src="/images/about/warehouse.jpg"
            alt="Склад компании Маляр с ассортиментом красок"
            className="h-64 w-full rounded-lg object-cover lg:h-full"
          />
          <div>
            <h2 className="font-heading text-xl font-bold text-forest-900">Наша миссия</h2>
            <p className="mt-3 text-xs leading-relaxed text-moss">
              Мы стремимся сделать профессиональные лакокрасочные материалы доступными, а процесс выбора и покупки —
              простым и удобным. Наша цель — долгосрочное партнёрство и уверенность клиентов в результате.
            </p>
            <h2 className="mt-7 font-heading text-xl font-bold text-forest-900">Почему выбирают нас</h2>
            <ul className="mt-4 space-y-3">
              {advantages.map((advantage) => (
                <li key={advantage} className="flex items-start gap-2.5 text-xs text-ink">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mt-px shrink-0 text-accent" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8.5 12 2.5 2.5 4.5-5" stroke="#fdfbf6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Контакты */}
      <section id="contacts" className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-forest-900">Контакты</h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
            <div className="card space-y-6 p-7">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-moss">Телефон</div>
                <a href={settings.phoneTel} className="mt-1.5 block text-xl font-bold text-ink hover:text-forest-800">
                  {settings.phone}
                </a>
                <div className="mt-1 text-xs text-moss">{settings.workHours}</div>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-moss">E-mail</div>
                <a href={`mailto:${settings.email}`} className="mt-1.5 block text-lg font-bold text-ink hover:text-forest-800">
                  {settings.email}
                </a>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-moss">Адрес</div>
                <p className="mt-1.5 text-sm font-semibold leading-snug text-ink">{settings.address}</p>
              </div>

              {(settings.whatsappUrl || settings.telegramUrl || settings.viberUrl) && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-moss">Мессенджеры</div>
                  <div className="mt-2.5 flex flex-wrap gap-2.5">
                    {settings.whatsappUrl && settings.whatsappUrl !== "#" && (
                      <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-cream-100">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5 13.9c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.2 1.3Z" /></svg>
                        WhatsApp
                      </a>
                    )}
                    {settings.telegramUrl && settings.telegramUrl !== "#" && (
                      <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-cream-100">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#2AABEE]" aria-hidden><path d="M21.5 4.5 2.9 11.7c-.9.4-.9 1 .1 1.3l4.6 1.4 1.8 5.4c.2.6.4.8 1 .8.5 0 .7-.2 1.1-.6l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.7-.8l3.2-15c.3-1.1-.4-1.6-1.2-1ZM8.9 14.1l9.5-6c.5-.3.9-.1.5.2l-8 7.3-.3 3.3-1.7-4.8Z" /></svg>
                        Telegram
                      </a>
                    )}
                    {settings.viberUrl && settings.viberUrl !== "#" && (
                      <a href={settings.viberUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-cream-100">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#7360F2]" aria-hidden><path d="M12 2c4.9 0 8.9 3.6 8.9 8.1 0 4.5-4 8.1-8.9 8.1-.8 0-1.6-.1-2.4-.3L6 21l.6-3.1c-2.1-1.5-3.5-3.8-3.5-6.4C3.1 5.6 7.1 2 12 2Zm-2.6 5.2c-.2 0-.5.1-.7.3-.8.7-1 1.7-.6 2.8.4 1.2 1.2 2.4 2.3 3.4 1.1 1 2.3 1.7 3.4 2 1.1.3 2.1 0 2.8-.8.2-.2.3-.5.3-.7 0-.3-.2-.6-.5-.7l-1.5-.8c-.3-.1-.6-.1-.8.1l-.6.6c-.1.1-.3.2-.4.1-.6-.3-1.2-.7-1.8-1.2-.5-.5-.9-1.1-1.2-1.7-.1-.2 0-.3.1-.4l.6-.6c.2-.2.2-.5.1-.8l-.8-1.5c-.1-.3-.4-.5-.7-.5Z" /></svg>
                        Viber
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-lg shadow-card">
              <iframe
                src="https://yandex.ru/map-widget/v1/?text=Калининград%2C+ул.+Дзержинского%2C+168&z=16&ll=20.4522,54.7104"
                title="Карта — Маляр, Калининград"
                className="h-full min-h-[340px] w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-14">
        <BenefitsStrip className="rounded-lg bg-cream-100" />
      </div>
    </div>
  );
}
