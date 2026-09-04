"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  newOrders: number;
  totalLeads: number;
  newLeads: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    newOrders: 0,
    totalLeads: 0,
    newLeads: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          totalProducts: data.totalProducts ?? 0,
          totalOrders: data.totalOrders ?? 0,
          newOrders: data.newOrders ?? 0,
          totalLeads: data.totalLeads ?? 0,
          newLeads: data.newLeads ?? 0,
        });
        setRecentOrders(data.recentOrders || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark-green mb-6">
        Дашборд
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Товары</div>
          <div className="text-3xl font-bold text-dark-green">{stats.totalProducts}</div>
          <Link href="/admin/products" className="text-sm text-brand-700 hover:underline mt-2 inline-block">
            Управление →
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Заявки</div>
          <div className="text-3xl font-bold text-dark-green">{stats.totalOrders}</div>
          {stats.newOrders > 0 && (
            <div className="text-sm text-red-600 font-medium">
              +{stats.newOrders} новых
            </div>
          )}
          <Link href="/admin/orders" className="text-sm text-brand-700 hover:underline mt-2 inline-block">
            Просмотр →
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Лиды</div>
          <div className="text-3xl font-bold text-dark-green">{stats.totalLeads}</div>
          {stats.newLeads > 0 && (
            <div className="text-sm text-red-600 font-medium">
              +{stats.newLeads} новых
            </div>
          )}
          <Link href="/admin/leads" className="text-sm text-brand-700 hover:underline mt-2 inline-block">
            Просмотр →
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Кейсы</div>
          <div className="text-3xl font-bold text-dark-green">12</div>
          <Link href="/admin/cases" className="text-sm text-brand-700 hover:underline mt-2 inline-block">
            Управление →
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg">Последние заявки</h2>
          <Link href="/admin/orders" className="text-sm text-brand-700 hover:underline">
            Все заявки →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            Пока нет заявок
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Клиент</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Телефон</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Сумма</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                  <td className="px-6 py-4 text-sm">{order.name}</td>
                  <td className="px-6 py-4 text-sm">{order.phone}</td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {order.totalAmount?.toLocaleString("ru-RU")} ₽
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "new"
                          ? "bg-red-100 text-red-700"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status === "new"
                        ? "Новая"
                        : order.status === "processing"
                        ? "В работе"
                        : order.status === "completed"
                        ? "Завершена"
                        : "Отменена"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
