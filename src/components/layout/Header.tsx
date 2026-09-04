"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type SiteSettings } from "@/lib/site-settings";
import { useCart } from "@/components/cart/CartProvider";

interface NavCategory {
  slug: string;
  name: string;
}

const navItems = [
  { href: "/solutions", label: "Типовые решения" },
  { href: "/cases", label: "Кейсы" },
  { href: "/reviews", label: "Видеообзоры" },
  { href: "/about", label: "О компании" },
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

export default function Header({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: NavCategory[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count: cartCount } = useCart();
  const router = useRouter();
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) {
        setCatalogOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/catalog?search=${encodeURIComponent(q)}`);
      setSearchQuery("");
    }
  };

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

          <form onSubmit={handleSearch} className="relative hidden min-w-0 flex-1 md:block md:max-w-md">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по каталогу"
              className="w-full rounded-md bg-forest-900/70 py-2.5 pl-10 pr-4 text-sm text-cream-100 outline-none transition-colors placeholder:text-cream-100/45 focus:bg-forest-900"
            />
          </form>

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

      {/* Ряд 2: навигация с dropdown каталога */}
      <nav className="hidden bg-forest-900 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-4">
          {/* Каталог с dropdown */}
          <div ref={catalogRef} className="relative">
            <button
              type="button"
              onClick={() => setCatalogOpen(!catalogOpen)}
              className="flex items-center gap-1.5 py-3 text-[13px] font-medium text-cream-100/85 transition-colors hover:text-white"
            >
              Каталог
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                className={`transition-transform ${catalogOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {catalogOpen && (
              <div className="absolute left-0 top-full z-50 min-w-[240px] rounded-b-lg bg-white py-2 shadow-xl">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalog/${cat.slug}`}
                    onClick={() => setCatalogOpen(false)}
                    className="block px-5 py-2.5 text-sm text-ink transition-colors hover:bg-cream-100 hover:text-forest-800"
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="mt-1 border-t border-ink/8 pt-1">
                  <Link
                    href="/catalog"
                    onClick={() => setCatalogOpen(false)}
                    className="block px-5 py-2.5 text-sm font-semibold text-forest-800 transition-colors hover:bg-cream-100"
                  >
                    Все товары
                  </Link>
                </div>
              </div>
            )}
          </div>

          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1.5 py-3 text-[13px] font-medium text-cream-100/85 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Мобильное меню */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-forest-900 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {/* Каталог аккордеон */}
            <button
              type="button"
              onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
              className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-white/10"
            >
              Каталог
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                className={`transition-transform ${mobileCatalogOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {mobileCatalogOpen && (
              <div className="ml-4 flex flex-col border-l border-white/10">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalog/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-cream-100/75 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/catalog"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/10"
                >
                  Все товары
                </Link>
              </div>
            )}

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
