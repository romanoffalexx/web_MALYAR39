"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import BenefitsStrip from "@/components/BenefitsStrip";
import { useCart } from "@/components/cart/CartProvider";

export default function CartPage() {
  const {
    items,
    total,
    hydrated,
    setQuantity,
    changeVariant,
    removeItem,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    organization: "",
    phone: "",
    email: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          organization: form.organization || undefined,
          phone: form.phone,
          email: form.email || undefined,
          comment: form.comment || undefined,
          totalAmount: total,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.name,
            variantName: `${item.volume} ${item.unit}`,
            quantity: item.quantity,
            price: item.price,
            sum: item.price * item.quantity,
          })),
        }),
      });
      if (!response.ok) throw new Error("order failed");
      setSubmitted(true);
      clearCart();
    } catch {
      setError("Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-7">
        <nav className="flex items-center gap-1.5 text-xs text-moss" aria-label="Хлебные крошки">
          <Link href="/" className="transition-colors hover:text-ink">Главная</Link>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss/50" aria-hidden>
            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-ink/70">Корзина</span>
        </nav>

        <div className="mt-5 flex items-center gap-4">
          <h1 className="font-heading text-4xl font-bold text-forest-900">Корзина</h1>
          {hydrated && items.length > 0 && (
            <span className="rounded-md bg-cream-200 px-3 py-1.5 text-xs font-semibold text-ink">
              {items.length} {items.length === 1 ? "товар" : items.length < 5 ? "товара" : "товаров"}
            </span>
          )}
        </div>

        {!hydrated ? (
          <div className="card mt-8 max-w-2xl p-10 text-center">
            <p className="text-sm text-moss">Загружаем корзину…</p>
          </div>
        ) : submitted ? (
          <div className="card mt-8 max-w-2xl p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="mt-5 font-heading text-2xl font-bold text-forest-900">
              Заявка отправлена
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-moss">
              Менеджер свяжется с вами в ближайшее время, чтобы подтвердить заказ
              и уточнить детали доставки.
            </p>
            <Link href="/catalog" className="btn-outline mt-7 inline-block px-6 py-3 text-sm">
              Продолжить покупки
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="card mt-8 max-w-2xl p-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-forest-900">Корзина пуста</h2>
            <p className="mt-3 text-sm text-moss">
              Добавьте товары из каталога — и они появятся здесь.
            </p>
            <Link href="/catalog" className="btn-solid mt-7 inline-block px-6 py-3 text-sm">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Список товаров */}
            <div>
              <div className="card">
                <div className="hidden grid-cols-[minmax(0,1fr)_90px_110px_120px_90px_32px] gap-4 border-b border-ink/8 px-6 py-4 text-xs text-moss md:grid">
                  <span>Товар</span>
                  <span>Цена</span>
                  <span>Объём / фасовка</span>
                  <span>Количество</span>
                  <span>Сумма</span>
                  <span />
                </div>

                <div className="divide-y divide-ink/8">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}:${item.variantId}`}
                      className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-[minmax(0,1fr)_90px_110px_120px_90px_32px] md:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          aria-label="В избранное"
                          className="mt-1 text-moss/50 transition-colors hover:text-accent"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                            <path d="M12 20.5s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3.5c0 5.3-7.5 10-7.5 10Z" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-white p-1.5">
                          <img
                            src={item.image ?? "/images/categories/water-splash.jpg"}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-bold text-ink">{item.name}</div>
                          {item.description && (
                            <div className="mt-1 text-[11px] leading-snug text-moss">{item.description}</div>
                          )}
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                            <span className="text-[11px] text-moss">В наличии</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[13px] font-bold text-ink">
                          {item.price.toLocaleString("ru-RU")} ₽
                        </div>
                        <div className="mt-0.5 text-[11px] text-moss">
                          за {item.volume} {item.unit}
                        </div>
                      </div>

                      <div>
                        {item.variants.length > 1 ? (
                          <div className="relative">
                            <select
                              value={item.variantId}
                              onChange={(e) =>
                                changeVariant(item.productId, item.variantId, +e.target.value)
                              }
                              aria-label="Объём / фасовка"
                              className="w-full appearance-none rounded-md border border-ink/10 bg-white py-2.5 pl-3 pr-8 text-xs font-semibold text-ink outline-none transition-colors focus:border-forest-700"
                            >
                              {item.variants.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.volume} {v.unit}
                                </option>
                              ))}
                            </select>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-moss" aria-hidden>
                              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        ) : (
                          <span className="text-[13px] text-moss">
                            {item.volume} {item.unit}
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center rounded-md border border-ink/10 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(item.productId, item.variantId, item.quantity - 1)
                            }
                            aria-label="Уменьшить количество"
                            className="px-3 py-2 text-moss transition-colors hover:text-ink"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(item.productId, item.variantId, item.quantity + 1)
                            }
                            aria-label="Увеличить количество"
                            className="px-3 py-2 text-moss transition-colors hover:text-ink"
                          >
                            +
                          </button>
                        </div>
                        <div className="mt-1 text-center text-[10px] text-moss">шт</div>
                      </div>

                      <div className="text-[13px] font-bold text-ink">
                        {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          aria-label={`Удалить ${item.name}`}
                          className="text-moss/60 transition-colors hover:text-[#d9553f]"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                            <path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13M10 11v5M14 11v5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-ink/8 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/catalog"
                    className="flex items-center gap-2.5 rounded-md border border-ink/15 bg-white px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/30"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Продолжить покупки
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="flex items-center gap-2.5 text-[13px] font-semibold text-moss transition-colors hover:text-[#d9553f]"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Очистить корзину
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-5 rounded-lg bg-accent/10 p-6">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="shrink-0 text-forest-800" aria-hidden>
                  <path d="M3 7h18v11H3zM3 10.5h18M7 14.5h4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m4 20 16-16" strokeLinecap="round" />
                </svg>
                <div>
                  <div className="text-[15px] font-bold text-ink">Онлайн-оплата недоступна</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-moss">
                    После оформления заявки с вами свяжется наш менеджер для подтверждения
                    заказа и уточнения деталей.
                  </p>
                </div>
                <span className="ml-auto hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink/8 text-2xl font-bold text-ink/25 sm:flex" aria-hidden>
                  !
                </span>
              </div>
            </div>

            {/* Итого и форма */}
            <aside>
              <div className="card p-6">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-heading text-2xl font-bold text-forest-900">Итого</h2>
                  <span className="text-2xl font-extrabold text-ink">
                    {total.toLocaleString("ru-RU")} ₽
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-[13px]">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-moss">Товары ({items.length})</span>
                    <span className="font-semibold text-ink">{total.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-moss">Доставка</span>
                    <span className="text-right text-xs text-moss">Рассчитывается менеджером</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-moss">Скидка</span>
                    <span className="text-moss">—</span>
                  </div>
                </div>

                <div className="mt-5 flex items-baseline justify-between border-t border-ink/8 pt-5">
                  <span className="text-[13px] font-bold text-ink">Итого к оплате</span>
                  <span className="text-2xl font-extrabold text-forest-800">
                    {total.toLocaleString("ru-RU")} ₽
                  </span>
                </div>

                <form onSubmit={submitOrder} className="mt-7 border-t border-ink/8 pt-6">
                  <h3 className="text-[15px] font-bold text-ink">Оформление заявки</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-moss">
                    Заполните данные, и наш менеджер свяжется с вами в ближайшее время
                  </p>

                  <label className="mt-4 block text-xs font-semibold text-ink">
                    Ваше имя <span className="text-[#d9553f]">*</span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Иван Иванов"
                      className="input-field mt-1.5"
                    />
                  </label>

                  <label className="mt-3 block text-xs font-semibold text-ink">
                    Организация
                    <input
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      placeholder="ООО «СтройПроект»"
                      className="input-field mt-1.5"
                    />
                  </label>

                  <label className="mt-3 block text-xs font-semibold text-ink">
                    Телефон <span className="text-[#d9553f]">*</span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      className="input-field mt-1.5"
                    />
                  </label>

                  <label className="mt-3 block text-xs font-semibold text-ink">
                    E-mail
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@mail.ru"
                      className="input-field mt-1.5"
                    />
                  </label>

                  <label className="mt-3 block text-xs font-semibold text-ink">
                    Комментарий к заказу
                    <textarea
                      rows={3}
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      placeholder="Укажите удобное время для звонка, адрес доставки и другие пожелания..."
                      className="input-field mt-1.5 resize-y"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-md bg-forest-800 py-3.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-900 disabled:opacity-60"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <path d="M21 3 10.5 13.5M21 3l-7 18-3.5-7.5L3 10z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {submitting ? "Отправляем..." : "Отправить заявку менеджеру"}
                  </button>

                  {error && <p className="mt-3 text-xs text-[#d9553f]">{error}</p>}

                  <p className="mt-4 flex items-start gap-2.5 text-[11px] leading-relaxed text-moss">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="mt-0.5 shrink-0" aria-hidden>
                      <rect x="5" y="10" width="14" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                  </p>
                </form>
              </div>
            </aside>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14">
        <BenefitsStrip className="rounded-lg bg-cream-100" />
      </div>
    </div>
  );
}
