"use client";

import Link from "next/link";
import { useState } from "react";
import { type SiteSettings } from "@/lib/site-settings";
import { useCart } from "@/components/cart/CartProvider";

const navItems = [
  { href: "/catalog", label: "Каталог", chevron: true },
  { href: "/catalog", label: "Бренды" },
  { href: "/about", label: "О компании" },
  { href: "/about#delivery", label: "Доставка и оплата" },
  { href: "/about#warranty", label: "Гарантии" },
  { href: "/about#contacts", label: "Контакты" },
];

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-end gap-[3px] ${className}`} aria-hidden>
      <svg width="14" height="16" viewBox="0 0 14 16">
        <path d="M7 0 14 16H0Z" fill="#3E7CB1" />
      </svg>
      <svg width="14" height="20" viewBox="0 0 14 20">
        <path d="M7 0 14 20H0Z" fill="#F2B33D" />
      </svg>
      <svg width="14" height="16" viewBox="0 0 14 16">
        <path d="M7 0 14 16H0Z" fill="#D9553F" />
      </svg>
    </span>
  );
}

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        className={`font-heading text-[26px] font-bold leading-none tracking-wide ${
          light ? "text-cream-100" : "text-forest-900"
        }`}
      >
        М
        <LogoMark className="mx-[1px] align-baseline" />
        ЯР
      </span>
      <span
        className={`hidden sm:block text-[9px] font-medium uppercase leading-tight tracking-[0.3em] ${
          light ? "text-cream-100/60" : "text-moss"
        }`}
      >
        Краски
        <br />и штукатурки
      </span>
    </Link>
  );
}

export default function Header({ settings }: { settings: SiteSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count: cartCount } = useCart();
  const [favCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 text-cream-100 shadow-lg">
      {/* Ряд 1: логотип, каталог, поиск, телефон, избранное, корзина */}
      <div className="bg-forest-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:gap-6">
          <Logo />

          <Link
            href="/catalog"
            className="btn-cream hidden shrink-0 px-5 py-2.5 md:inline-flex"
          >
            Каталог товаров
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <path d="M0 0h4v4H0zM5 0h4v4H5zM10 0h4v4h-4zM0 5h4v4H0zM5 5h4v4H5zM10 5h4v4h-4zM0 10h4v4H0zM5 10h4v4H5zM10 10h4v4h-4z" />
            </svg>
          </Link>

          <label className="relative hidden min-w-0 flex-1 md:block md:max-w-md">
            <span className="sr-only">Поиск по каталогу</span>
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-100/50"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Поиск по каталогу"
              className="w-full rounded-md bg-forest-900/70 py-2.5 pl-10 pr-4 text-sm text-cream-100 outline-none transition-colors placeholder:text-cream-100/45 focus:bg-forest-900"
            />
          </label>

          <div className="ml-auto hidden text-right lg:block">
            <a
              href={settings.phoneTel}
              className="block text-sm font-bold leading-tight hover:text-white"
            >
              {settings.phone}
            </a>
            <span className="block text-[11px] leading-tight text-cream-100/55">
              {settings.workHours}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-5 lg:ml-6">
            <Link href="/catalog" className="group relative flex flex-col items-center gap-1">
              <span className="relative">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden
                >
                  <path d="M12 20.5s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3.5c0 5.3-7.5 10-7.5 10Z" />
                </svg>
                {favCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cream-100 text-[10px] font-bold text-forest-900">
                    {favCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] leading-none text-cream-100/75">Избранное</span>
            </Link>

            <Link href="/cart" className="group relative flex flex-col items-center gap-1">
              <span className="relative">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden
                >
                  <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.47 1.3h8.9a1.5 1.5 0 0 0 1.46-1.16L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9.5" cy="20" r="1.4" />
                  <circle cx="17.5" cy="20" r="1.4" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cream-100 text-[10px] font-bold text-forest-900">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] leading-none text-cream-100/75">Корзина</span>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-2 transition-colors hover:bg-white/10 lg:hidden"
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                {mobileOpen ? (
                  <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Ряд 2: навигация */}
      <nav className="hidden bg-forest-900 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1.5 py-3 text-[13px] font-medium text-cream-100/85 transition-colors hover:text-white"
            >
              {item.label}
              {item.chevron && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Мобильное меню */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-forest-900 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <a href={settings.phoneTel} className="px-3 py-2.5 text-sm font-bold">
              {settings.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
