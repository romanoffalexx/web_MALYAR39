"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SETTINGS_GROUPS,
  DEFAULT_BY_KEY,
} from "@/lib/site-settings";

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({
    ...DEFAULT_BY_KEY,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setValues({ ...DEFAULT_BY_KEY, ...(data.settings || {}) });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const setField = (key: string, value: string) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: values }),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка сохранения");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-dark-green">
          Настройки сайта
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Контактные данные, мессенджеры и соцсети. Подставляются в шапку и
          подвал сайта; пустые поля заменяются значениями по умолчанию.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Настройки сохранены. Обновите публичный сайт, чтобы увидеть изменения.
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-md">
          Загрузка...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {SETTINGS_GROUPS.map((group) => (
            <div
              key={group.title}
              className="rounded-xl bg-white p-6 shadow-md"
            >
              <h2 className="mb-4 font-heading text-lg font-bold text-dark-green">
                {group.title}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {group.fields.map((field) => (
                  <div
                    key={field.key}
                    className={field.key === "address" ? "md:col-span-2" : ""}
                  >
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type={field.type === "url" ? "text" : field.type}
                      value={values[field.key] ?? ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      placeholder={DEFAULT_BY_KEY[field.key]}
                      className="input-field"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Ключ: <code>{field.key}</code>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить настройки"}
            </button>
            <button
              type="button"
              onClick={fetchSettings}
              className="btn-secondary"
            >
              Сбросить
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
