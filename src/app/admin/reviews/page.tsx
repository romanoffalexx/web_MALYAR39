"use client";

import { useState, useEffect, useCallback } from "react";
import ImageField from "@/components/admin/ImageField";

interface Review {
  id: number;
  slug: string;
  title: string;
  type: "video" | "photo";
  embedUrl: string | null;
  thumbnail: string | null;
  description: string | null;
  duration: string | null;
  views: number | null;
  date: string | null;
  category: string | null;
  published: boolean | null;
  featured: boolean | null;
  order: number | null;
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

export default function AdminReviewsPage() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"video" | "photo">("video");
  const [embedUrl, setEmbedUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [views, setViews] = useState("0");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState("0");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setItems(data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const resetForm = () => {
    setTitle(""); setSlug(""); setType("video"); setEmbedUrl(""); setThumbnail("");
    setDescription(""); setDuration(""); setViews("0"); setDate(""); setCategory("");
    setPublished(true); setFeatured(false); setOrder("0");
    setEditingId(null); setError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = async (r: Review) => {
    resetForm();
    try {
      const res = await fetch(`/api/admin/reviews/${r.id}`);
      if (!res.ok) return;
      const data = await res.json();
      const p = data.review;
      setTitle(p.title || ""); setSlug(p.slug || ""); setType(p.type || "video");
      setEmbedUrl(p.embedUrl || ""); setThumbnail(p.thumbnail || "");
      setDescription(p.description || ""); setDuration(p.duration || "");
      setViews(p.views != null ? String(p.views) : "0");
      setDate(p.date ? String(p.date).slice(0, 10) : "");
      setCategory(p.category || "");
      setPublished(p.published ?? true); setFeatured(p.featured ?? false);
      setOrder(p.order != null ? String(p.order) : "0");
      setEditingId(p.id);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to load review:", err);
    }
  };

  const handleDelete = async (r: Review) => {
    if (!confirm(`Удалить обзор «${r.title}»?`)) return;
    try {
      const res = await fetch(`/api/admin/reviews/${r.id}`, { method: "DELETE" });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title, slug, type,
      embedUrl: embedUrl || null,
      thumbnail: thumbnail || null,
      description: description || null,
      duration: duration || null,
      views: views ? parseInt(views) : 0,
      date: date || null,
      category: category || null,
      published, featured,
      order: order ? parseInt(order) : 0,
    };

    try {
      const url = editingId ? `/api/admin/reviews/${editingId}` : "/api/admin/reviews";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchReviews();
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

  const existingCategories = Array.from(new Set(items.map((r) => r.category).filter(Boolean))) as string[];

  const filtered = items.filter(
    (r) => !search || r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-dark-green">
          Обзоры
          <span className="ml-2 text-base font-normal text-gray-500">({items.length})</span>
        </h1>
        <button onClick={openAddForm} className="btn-primary">+ Добавить обзор</button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск обзоров..."
        className="input-field mb-6 max-w-md"
      />

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? "Ничего не найдено" : "Обзоров пока нет"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Превью</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Название</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Тип</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Дата</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Статус</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">#{r.id}</td>
                    <td className="px-4 py-3">
                      {r.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.thumbnail} alt={r.title} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {r.title}
                      {r.featured && <span className="ml-2 text-xs text-amber-600">★</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.type === "video" ? "Видео" : "Фото"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {r.date ? new Date(r.date).toLocaleDateString("ru-RU") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${r.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {r.published ? "Опубликован" : "Скрыт"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEditForm(r)} className="mr-3 text-sm text-brand-700 hover:underline">Редактировать</button>
                      <button onClick={() => handleDelete(r)} className="text-sm text-red-500 hover:underline">Удалить</button>
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
                {editingId ? "Редактировать обзор" : "Добавить обзор"}
              </h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Название *</label>
                  <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); if (!editingId) setSlug(nameToSlug(e.target.value)); }} className="input-field" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Slug (ЧПУ) *</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Тип</label>
                  <select value={type} onChange={(e) => setType(e.target.value as "video" | "photo")} className="input-field">
                    <option value="video">Видео</option>
                    <option value="photo">Фото</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Категория</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" list="review-categories" />
                  <datalist id="review-categories">
                    {existingCategories.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Ссылка на видео (embed)</label>
                <input type="text" value={embedUrl} onChange={(e) => setEmbedUrl(e.target.value)} className="input-field" placeholder="https://youtube.com/embed/..." />
              </div>

              <ImageField value={thumbnail} onChange={setThumbnail} folder="reviews" label="Превью (обложка)" />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Описание</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows={3} />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Длительность</label>
                  <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" placeholder="12:34" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Просмотры</label>
                  <input type="number" value={views} onChange={(e) => setViews(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Дата</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Порядок</label>
                  <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded" />
                  Опубликован
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded" />
                  Избранный
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary flex-1">Отмена</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
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
