"use client";

import { useState, useEffect } from "react";

interface Lead {
  id: number;
  name: string;
  contact: string;
  paintObject?: string;
  surfaceType?: string;
  comment?: string;
  messenger?: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  createdAt: string;
}

const STATUS_LABELS: Record<
  Lead["status"],
  { label: string; className: string }
> = {
  new: { label: "Новый", className: "bg-red-100 text-red-700" },
  in_progress: { label: "В работе", className: "bg-yellow-100 text-yellow-700" },
  resolved: { label: "Решён", className: "bg-green-100 text-green-700" },
  closed: { label: "Закрыт", className: "bg-gray-100 text-gray-700" },
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((data) => setLeads(data.leads || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredLeads =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  if (loading) return <div className="text-gray-500">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark-green mb-6">
        Лиды (консультации)
      </h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "all", name: "Все" },
          { id: "new", name: "Новые" },
          { id: "in_progress", name: "В работе" },
          { id: "resolved", name: "Решённые" },
          { id: "closed", name: "Закрытые" },
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

      {/* Leads table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Лидов нет
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">№</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Клиент</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Задача</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Мессенджер</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Статус</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium">#{lead.id}</td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.contact}</div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div>{lead.paintObject || "—"}</div>
                      <div className="text-xs text-gray-500">{lead.surfaceType || ""}</div>
                      {lead.comment && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                          💬 {lead.comment}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm capitalize">
                      {lead.messenger || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          STATUS_LABELS[lead.status]?.className ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUS_LABELS[lead.status]?.label ?? lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
