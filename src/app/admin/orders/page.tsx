"use client";

import { useState, useEffect } from "react";

interface OrderItem {
  id: number;
  productId: number | null;
  variantId: number | null;
  productName: string;
  variantName?: string | null;
  quantity: number;
  price: number;
  sum: number;
}

interface Order {
  id: number;
  name: string;
  organization?: string;
  phone: string;
  email?: string;
  comment?: string;
  totalAmount: number;
  status: "new" | "processing" | "completed" | "cancelled";
  createdAt: string;
  items: OrderItem[];
}

const STATUS_LABELS: Record<
  Order["status"],
  { label: string; className: string }
> = {
  new: { label: "Новая", className: "bg-red-100 text-red-700" },
  processing: { label: "В работе", className: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Завершена", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Отменена", className: "bg-gray-100 text-gray-700" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [details, setDetails] = useState<Order | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <div className="text-gray-500">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark-green mb-6">
        Заказы
      </h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "all", name: "Все" },
          { id: "new", name: "Новые" },
          { id: "processing", name: "В работе" },
          { id: "completed", name: "Завершённые" },
          { id: "cancelled", name: "Отменённые" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? "bg-brand-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Заявок нет
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">№</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Клиент</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Контакты</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Состав</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Сумма</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Статус</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Дата</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium">#{order.id}</td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-sm">{order.name}</div>
                      {order.organization && (
                        <div className="text-xs text-gray-500">{order.organization}</div>
                      )}
                      {order.comment && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                          💬 {order.comment}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div>{order.phone}</div>
                      {order.email && <div className="text-xs text-gray-500">{order.email}</div>}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {order.items?.length
                        ? `${order.items.length} ${pluralItems(order.items.length)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {order.totalAmount?.toLocaleString("ru-RU")} ₽
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          STATUS_LABELS[order.status]?.className ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUS_LABELS[order.status]?.label ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setDetails(order)}
                        className="text-brand-700 hover:text-brand-800 text-sm font-medium"
                      >
                        Детали
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модалка состава заявки */}
      {details && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDetails(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-white rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-heading font-bold text-dark-green">
                  Заявка #{details.id}
                </h2>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_LABELS[details.status]?.className ??
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {STATUS_LABELS[details.status]?.label ?? details.status}
                </span>
              </div>
              <button
                onClick={() => setDetails(null)}
                aria-label="Закрыть"
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4 text-sm">
              <div className="grid gap-1 sm:grid-cols-2">
                <div>
                  <span className="text-gray-500">Клиент: </span>
                  <span className="font-medium">{details.name}</span>
                </div>
                {details.organization && (
                  <div>
                    <span className="text-gray-500">Организация: </span>
                    <span className="font-medium">{details.organization}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Телефон: </span>
                  <span className="font-medium">{details.phone}</span>
                </div>
                {details.email && (
                  <div>
                    <span className="text-gray-500">E-mail: </span>
                    <span className="font-medium">{details.email}</span>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <span className="text-gray-500">Дата: </span>
                  <span className="font-medium">
                    {new Date(details.createdAt).toLocaleString("ru-RU")}
                  </span>
                </div>
                {details.comment && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Комментарий: </span>
                    <span>{details.comment}</span>
                  </div>
                )}
              </div>

              <div className="mt-5">
                <h3 className="mb-2 text-xs font-semibold uppercase text-gray-600">
                  Состав заказа
                </h3>
                {details.items?.length ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs text-gray-600">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">Товар</th>
                          <th className="px-3 py-2 text-left font-semibold">Фасовка</th>
                          <th className="px-3 py-2 text-right font-semibold">Кол-во</th>
                          <th className="px-3 py-2 text-right font-semibold">Цена</th>
                          <th className="px-3 py-2 text-right font-semibold">Сумма</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {details.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-3 py-2">
                              {item.productName}
                              {item.productId == null && (
                                <span className="ml-1 text-xs text-gray-400">(архив)</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-gray-500">
                              {item.variantName || "—"}
                            </td>
                            <td className="px-3 py-2 text-right">{item.quantity}</td>
                            <td className="px-3 py-2 text-right text-gray-500">
                              {item.price.toLocaleString("ru-RU")} ₽
                            </td>
                            <td className="px-3 py-2 text-right font-medium">
                              {item.sum.toLocaleString("ru-RU")} ₽
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">Состав не сохранён.</p>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-gray-200 pt-4">
                <span className="text-sm font-semibold text-gray-600">Итого</span>
                <span className="text-xl font-bold text-dark-green">
                  {details.totalAmount?.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setDetails(null)}
                className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function pluralItems(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "позиция";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "позиции";
  return "позиций";
}
