"use client";

import { useState, useEffect, useCallback } from "react";
import ImageField from "@/components/admin/ImageField";

interface ContentBlock {
  id: number;
  key: string;
  title: string;
  text: string | null;
  image: string | null;
  order: number | null;
  published: boolean | null;
}

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState("0");
  const [published, setPublished] = useState(true);

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setItems(data.contentBlocks || []);
      }
    } catch (err) {
      console.error("Failed to fetch content blocks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const resetForm = () => {
    setKey("");
    setTitle("");
    setText("");
    setImage("");
    setOrder("0");
    setPublished(true);
    setEditingId(null);
    setError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (b: ContentBlock) => {
    resetForm();
    setKey(b.key || "");
    setTitle(b.title || "");
    setText(b.text || "");
    setImage(b.image || "");
    setOrder(b.order != null ? String(b.order) : "0");
    setPublished(b.published != null ? Boolean(b.published) : true);
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleDelete = async (b: ContentBlock) => {
    if (!confirm(`Удалить контент-блок «${b.title}» (${b.key})?`)) return;
    try {
      const res = await fetch(`/api/admin/content/${b.id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchBlocks();
    } catch (err) {
      console.error("Failed to delete content block:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      key,
      title,
      text: text || null,
      image: image || null,
      order: order ? parseInt(order) : 0,
      published,
    };

    try {
      const url = editingId
        ? `/api/admin/content/${editingId}`
        : "/api/admin/content";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchBlocks();
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

  const filtered = items.filter(
    (b) =>
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-dark-green">
          Контент-блоки
          <span className="ml-2 text-base font-normal text-gray-500">
            ({items.length})
          </span>
        </h1>
        <button onClick={openAddForm} className="btn-primary">
          + Добавить блок
        </button>
      </div>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Блоки сохраняются в базу по уникальному ключу. Подключение блоков к
        публичным страницам — отдельный этап.
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск блоков..."
        className="input-field mb-6 max-w-md"
      />

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? "Ничего не найдено" : "Контент-блоков пока нет"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Ключ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Заголовок</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Изображение</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Порядок</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Статус</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">#{b.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                        {b.key}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{b.title}</td>
                    <td className="px-4 py-3">
                      {b.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.image}
                          alt={b.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{b.order ?? 0}</td>
                    <td className="px-4 py-3">
                      {b.published ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Опубликован
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                          Черновик
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditForm(b)}
                        className="mr-3 text-sm text-brand-700 hover:underline"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(b)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">
                {editingId ? "Редактировать блок" : "Добавить блок"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Ключ (идентификатор) *
                  </label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="input-field"
                    placeholder="например: home_banner"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Заголовок *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Текст
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="input-field"
                  rows={5}
                />
              </div>

              <ImageField
                value={image}
                onChange={setImage}
                folder="content"
                label="Изображение"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Порядок
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Опубликован
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
