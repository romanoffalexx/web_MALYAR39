"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin", label: "Дашборд", icon: "📊" },
  { href: "/admin/products", label: "Товары", icon: "📦" },
  { href: "/admin/categories", label: "Категории", icon: "🏷️" },
  { href: "/admin/orders", label: "Заявки", icon: "🛒" },
  { href: "/admin/leads", label: "Лиды", icon: "📋" },
  { href: "/admin/cases", label: "Кейсы", icon: "🏆" },
  { href: "/admin/reviews", label: "Обзоры", icon: "🎬" },
  { href: "/admin/solutions", label: "Решения", icon: "💡" },
  { href: "/admin/content", label: "Контент", icon: "📝" },
  { href: "/admin/settings", label: "Настройки", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === "/admin/login") {
      setAuthenticated(true);
      return;
    }

    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
          setUsername(data.username);
        } else {
          setAuthenticated(false);
          router.push("/admin/login");
        }
      })
      .catch(() => {
        setAuthenticated(false);
        router.push("/admin/login");
      });
  }, [router, pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-dark-green text-white transition-transform duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center font-bold text-xl">
              М
            </div>
            <div>
              <div className="font-heading font-bold text-lg">МАЛЯР</div>
              <div className="text-xs text-white/60">Админ-панель</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-brand-700 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/60">{username}</span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 text-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              На сайт
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 px-3 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-sm transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
