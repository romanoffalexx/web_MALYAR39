"use client";

import { useState, useEffect, useCallback } from "react";
import ImageField from "@/components/admin/ImageField";

interface Category {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
  description: string | null;
  image: string | null;
  order: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

const nameToSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[а-яё]/gi, (ch) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
        ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
        н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
        ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
        ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      };
      return map[ch.toLowerCase()] || "";
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState("0");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setItems(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setParentId("");
    setDescription("");
    setImage("");
    setOrder("0");
    setSeoTitle("");
    setSeoDescription("");
    setEditingId(null);
    setError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (c: Category) => {
    resetForm();
    setName(c.name || "");
    setSlug(c.slug || "");
    setParentId(c.parentId ? String(c.parentId) : "");
    setDescription(c.description || "");
    setImage(c.image || "");
    setOrder(c.order != null ? String(c.order) : "0");
    setSeoTitle(c.seoTitle || "");
    setSeoDescription(c.seoDescription || "");
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (c: Category) => {
    if (
      !confirm(
        `Удалить категорию «${c.name}»? Все товары этой категории будут удалены безвозвратно.`
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/categories/${c.id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      slug,
      parentId: parentId || null,
      description: description || null,
      image: image || null,
      order: order ? parseInt(order) : 0,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    };

    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchCategories();
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

  const parentName = (id: number | null) =>
    id ? items.find((c) => c.id === id)?.name || `#${id}` : "—";

  const filtered = items.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-dark-green">
          Категории
          <span className="ml-2 text-base font-normal text-gray-500">
            ({items.length})
          </span>
        </h1>
        <button onClick={openAddForm} className="btn-primary">
          + Добавить категорию
        </button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск категорий..."
        className="input-field mb-6 max-w-md"
      />

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? "Ничего не найдено" : "Категорий пока нет"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Изображение</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Название</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Родитель</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Порядок</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">#{c.id}</td>
                    <td className="px-4 py-3">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.image}
                          alt={c.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{parentName(c.parentId)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.order ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditForm(c)}
                        className="mr-3 text-sm text-brand-700 hover:underline"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
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
                {editingId ? "Редактировать категорию" : "Добавить категорию"}
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">Название *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingId) setSlug(nameToSlug(e.target.value));
                    }}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Slug (ЧПУ) *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Родительская категория</label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">— без родителя —</option>
                    {items
                      .filter((c) => c.id !== editingId)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Порядок</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Описание</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  rows={3}
                />
              </div>

              <ImageField
                value={image}
                onChange={setImage}
                folder="categories"
                label="Изображение категории"
              />

              <div className="border-t border-gray-100 pt-4">
                <h3 className="mb-3 font-semibold text-gray-700">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">SEO-заголовок</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">SEO-описание</label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="input-field"
                      rows={2}
                    />
                  </div>
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
