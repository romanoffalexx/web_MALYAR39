import Link from "next/link";
import { Logo } from "./Header";
import { type SiteSettings } from "@/lib/site-settings";

interface NavCategory {
  slug: string;
  name: string;
}

function buildColumns(categories: NavCategory[]) {
  return [
    {
      title: "Каталог",
      links: categories.map((c) => ({
        href: `/catalog/${c.slug}`,
        label: c.name,
      })),
    },
    {
      title: "Покупателям",
      links: [
        { href: "/solutions", label: "Типовые решения" },
        { href: "/cases", label: "Кейсы" },
        { href: "/reviews", label: "Видеообзоры" },
        { href: "/cart", label: "Как сделать заказ" },
      ],
    },
    {
      title: "Компания",
      links: [
        { href: "/about", label: "О компании и контакты" },
      ],
    },
  ];
}

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-cream-100/25 text-cream-100/80 transition-colors hover:bg-cream-100 hover:text-forest-900"
    >
      {children}
    </a>
  );
}

export default function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: NavCategory[];
}) {
  const columns = buildColumns(categories);
  return (
    <footer className="bg-forest-900 text-cream-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-[220px] text-xs leading-relaxed text-cream-100/60">
            Профессиональные материалы для покраски и отделки. Работаем с 2012 года.
          </p>
          <div className="mt-5 flex gap-2.5">
            <SocialIcon label="ВКонтакте" href={settings.vkUrl}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12.8 17.5c-5.6 0-8.9-3.9-9-10.3h2.8c.1 4.7 2.2 6.7 3.8 7.1V7.2h2.7v4.1c1.6-.2 3.3-2 3.9-4.1h2.6c-.4 2.6-2.3 4.4-3.6 5.2 1.3.6 3.4 2.3 4.2 5.1h-2.9c-.6-1.9-2.1-3.4-4.2-3.6v3.6h-.3Z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Telegram" href={settings.telegramUrl}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M21.5 4.5 2.9 11.7c-.9.4-.9 1 .1 1.3l4.6 1.4 1.8 5.4c.2.6.4.8 1 .8.5 0 .7-.2 1.1-.6l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.7-.8l3.2-15c.3-1.1-.4-1.6-1.2-1ZM8.9 14.1l9.5-6c.5-.3.9-.1.5.2l-8 7.3-.3 3.3-1.7-4.8Z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="RuTube" href={settings.rutubeUrl}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 6.5 6 3.5-6 3.5v-7Z" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream-100/50">
              {col.title}
            </h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-cream-100/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream-100/50">
            Контакты
          </h3>
          <ul className="space-y-3 text-[13px]">
            <li className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-cream-100/50" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
              </svg>
              <a href={settings.phoneTel} className="font-semibold hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-cream-100/50" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 text-cream-100/50" aria-hidden>
                <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
              <span className="text-cream-100/80">{settings.address}</span>
            </li>
          </ul>
          <div className="mt-5 flex gap-2.5">
            <SocialIcon label="Позвонить" href={settings.phoneTel}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Telegram" href={settings.telegramUrl}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M21.5 4.5 2.9 11.7c-.9.4-.9 1 .1 1.3l4.6 1.4 1.8 5.4c.2.6.4.8 1 .8.5 0 .7-.2 1.1-.6l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.7-.8l3.2-15c.3-1.1-.4-1.6-1.2-1Z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="WhatsApp" href={settings.whatsappUrl}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5 13.9c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.2 1.3Z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>

      <div className="border-t border-cream-100/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-[11px] text-cream-100/45 md:flex-row md:items-center md:justify-between">
          <span>{settings.copyright}</span>
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <Link href="/privacy" className="transition-colors hover:text-cream-100">
              Политика конфиденциальности
            </Link>
            <span className="hidden md:inline text-cream-100/25">|</span>
              Продолжая использование сайта, вы соглашаетесь на обработку персональных данных
          </div>
          <span>Разработка сайта — Artifica technology</span>
        </div>
      </div>
    </footer>
  );
}
