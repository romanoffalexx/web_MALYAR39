"use client";

import { useState, useEffect, useCallback } from "react";
import ImageField from "@/components/admin/ImageField";

interface ApiSolution {
  id: number;
  slug: string;
  title: string;
  segment: string;
  description: string | null;
  features: string[] | null;
  task: string | null;
  taskPoints: string[] | null;
  advantages: string[] | null;
  image: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean | null;
  order: number | null;
}

interface MaterialForm {
  name: string;
  price: string;
  image: string;
  description: string;
  productId: string;
}
interface StepForm {
  title: string;
  description: string;
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

const emptyMaterial = (): MaterialForm => ({ name: "", price: "", image: "", description: "", productId: "" });
const emptyStep = (): StepForm => ({ title: "", description: "" });

function StringList({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button type="button" onClick={() => onChange([...value, ""])} className="text-sm text-brand-700 hover:underline">+ Добавить</button>
      </div>
      <div className="space-y-2">
        {value.length === 0 && <p className="text-sm text-gray-400">Пусто</p>}
        {value.map((v, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={v}
              placeholder={placeholder}
              onChange={(e) => { const next = [...value]; next[idx] = e.target.value; onChange(next); }}
              className="input-field"
            />
            <button type="button" onClick={() => onChange(value.filter((_, i) => i !== idx))} className="shrink-0 text-red-500 hover:text-red-700">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminSolutionsPage() {
  const [items, setItems] = useState<ApiSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [segment, setSegment] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [task, setTask] = useState("");
  const [taskPoints, setTaskPoints] = useState<string[]>([]);
  const [advantages, setAdvantages] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [order, setOrder] = useState("0");
  const [materials, setMaterials] = useState<MaterialForm[]>([]);
  const [steps, setSteps] = useState<StepForm[]>([]);

  const fetchSolutions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/solutions");
      if (res.ok) {
        const data = await res.json();
        setItems(data.solutions || []);
      }
    } catch (err) {
      console.error("Failed to fetch solutions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolutions();
  }, [fetchSolutions]);

  const resetForm = () => {
    setTitle(""); setSlug(""); setSegment(""); setDescription(""); setImage("");
    setFeatures([]); setTask(""); setTaskPoints([]); setAdvantages([]);
    setSeoTitle(""); setSeoDescription(""); setPublished(true); setOrder("0");
    setMaterials([]); setSteps([]);
    setEditingId(null); setError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = async (s: ApiSolution) => {
    resetForm();
    try {
      const res = await fetch(`/api/admin/solutions/${s.id}`);
      if (!res.ok) return;
      const data = await res.json();
      const p = data.solution;
      setTitle(p.title || ""); setSlug(p.slug || ""); setSegment(p.segment || "");
      setDescription(p.description || ""); setImage(p.image || "");
      setFeatures(Array.isArray(p.features) ? p.features : []);
      setTask(p.task || "");
      setTaskPoints(Array.isArray(p.taskPoints) ? p.taskPoints : []);
      setAdvantages(Array.isArray(p.advantages) ? p.advantages : []);
      setSeoTitle(p.seoTitle || ""); setSeoDescription(p.seoDescription || "");
      setPublished(p.published ?? true); setOrder(p.order != null ? String(p.order) : "0");
      setMaterials((p.materials || []).map((m: { name: string | null; price: string | null; image: string | null; description: string | null; productId: number | null }) => ({
        name: m.name || "", price: m.price || "", image: m.image || "",
        description: m.description || "", productId: m.productId ? String(m.productId) : "",
      })));
      setSteps((p.steps || []).map((st: { title: string; description: string | null }) => ({
        title: st.title || "", description: st.description || "",
      })));
      setEditingId(p.id);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to load solution:", err);
    }
  };

  const handleDelete = async (s: ApiSolution) => {
    if (!confirm(`Удалить решение «${s.title}»?`)) return;
    try {
      const res = await fetch(`/api/admin/solutions/${s.id}`, { method: "DELETE" });
      if (res.ok) fetchSolutions();
    } catch (err) {
      console.error("Failed to delete solution:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const clean = (arr: string[]) => arr.filter((x) => x.trim());

    const payload = {
      title, slug, segment,
      description: description || null,
      image: image || null,
      features: clean(features).length ? clean(features) : null,
      task: task || null,
      taskPoints: clean(taskPoints).length ? clean(taskPoints) : null,
      advantages: clean(advantages).length ? clean(advantages) : null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      published,
      order: order ? parseInt(order) : 0,
      materials: materials.filter((m) => m.name).map((m) => ({
        name: m.name, price: m.price || null, image: m.image || null,
        description: m.description || null, productId: m.productId || null,
      })),
      steps: steps.filter((s) => s.title).map((s) => ({ title: s.title, description: s.description || null })),
    };

    try {
      const url = editingId ? `/api/admin/solutions/${editingId}` : "/api/admin/solutions";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchSolutions();
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

  const existingSegments = Array.from(new Set(items.map((s) => s.segment))).filter(Boolean);

  const filtered = items.filter(
    (s) => !search || s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.segment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-dark-green">
          Типовые решения
          <span className="ml-2 text-base font-normal text-gray-500">({items.length})</span>
        </h1>
        <button onClick={openAddForm} className="btn-primary">+ Добавить решение</button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск решений..."
        className="input-field mb-6 max-w-md"
      />

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? "Ничего не найдено" : "Решений пока нет"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Фото</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Название</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Сегмент</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Статус</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">#{s.id}</td>
                    <td className="px-4 py-3">
                      {s.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image} alt={s.title} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{s.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{s.segment}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${s.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {s.published ? "Опубликовано" : "Скрыто"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEditForm(s)} className="mr-3 text-sm text-brand-700 hover:underline">Редактировать</button>
                      <button onClick={() => handleDelete(s)} className="text-sm text-red-500 hover:underline">Удалить</button>
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
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">
                {editingId ? "Редактировать решение" : "Добавить решение"}
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">Сегмент *</label>
                  <input type="text" value={segment} onChange={(e) => setSegment(e.target.value)} className="input-field" list="solution-segments" required />
                  <datalist id="solution-segments">
                    {existingSegments.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Порядок</label>
                  <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Описание</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows={3} />
              </div>

              <ImageField value={image} onChange={setImage} folder="solutions" label="Изображение" />

              <StringList label="Особенности (features)" value={features} onChange={setFeatures} placeholder="Особенность" />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Задача (текст)</label>
                <textarea value={task} onChange={(e) => setTask(e.target.value)} className="input-field" rows={2} />
              </div>

              <StringList label="Пункты задачи" value={taskPoints} onChange={setTaskPoints} placeholder="Пункт задачи" />
              <StringList label="Преимущества" value={advantages} onChange={setAdvantages} placeholder="Преимущество" />

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded" />
                Опубликован
              </label>

              {/* Materials */}
              <div className="border-t border-gray-100 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Материалы</h3>
                  <button type="button" onClick={() => setMaterials([...materials, emptyMaterial()])} className="text-sm text-brand-700 hover:underline">+ Добавить материал</button>
                </div>
                {materials.length === 0 && <p className="text-sm text-gray-400">Нет материалов</p>}
                <div className="space-y-3">
                  {materials.map((m, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 rounded-lg border border-gray-100 p-2">
                      <div className="col-span-4">
                        <label className="mb-1 block text-xs text-gray-600">Название</label>
                        <input type="text" value={m.name} onChange={(e) => { const next = [...materials]; next[idx] = { ...m, name: e.target.value }; setMaterials(next); }} className="input-field" />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-xs text-gray-600">Цена</label>
                        <input type="text" value={m.price} onChange={(e) => { const next = [...materials]; next[idx] = { ...m, price: e.target.value }; setMaterials(next); }} className="input-field" />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-xs text-gray-600">ID товара</label>
                        <input type="number" value={m.productId} onChange={(e) => { const next = [...materials]; next[idx] = { ...m, productId: e.target.value }; setMaterials(next); }} className="input-field" />
                      </div>
                      <div className="col-span-3">
                        <label className="mb-1 block text-xs text-gray-600">Фото URL</label>
                        <ImageField compact value={m.image} folder="solutions" onChange={(image) => { const next = [...materials]; next[idx] = { ...m, image }; setMaterials(next); }} />
                      </div>
                      <button type="button" onClick={() => setMaterials(materials.filter((_, i) => i !== idx))} className="col-span-1 self-end pb-2 text-red-500 hover:text-red-700">✕</button>
                      <div className="col-span-11">
                        <label className="mb-1 block text-xs text-gray-600">Описание</label>
                        <input type="text" value={m.description} onChange={(e) => { const next = [...materials]; next[idx] = { ...m, description: e.target.value }; setMaterials(next); }} className="input-field" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="border-t border-gray-100 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Этапы</h3>
                  <button type="button" onClick={() => setSteps([...steps, emptyStep()])} className="text-sm text-brand-700 hover:underline">+ Добавить этап</button>
                </div>
                {steps.length === 0 && <p className="text-sm text-gray-400">Нет этапов</p>}
                <div className="space-y-3">
                  {steps.map((s, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-1 text-center text-sm font-semibold text-gray-400">{idx + 1}</div>
                      <div className="col-span-4">
                        <label className="mb-1 block text-xs text-gray-600">Заголовок</label>
                        <input type="text" value={s.title} onChange={(e) => { const next = [...steps]; next[idx] = { ...s, title: e.target.value }; setSteps(next); }} className="input-field" />
                      </div>
                      <div className="col-span-6">
                        <label className="mb-1 block text-xs text-gray-600">Описание</label>
                        <input type="text" value={s.description} onChange={(e) => { const next = [...steps]; next[idx] = { ...s, description: e.target.value }; setSteps(next); }} className="input-field" />
                      </div>
                      <button type="button" onClick={() => setSteps(steps.filter((_, i) => i !== idx))} className="col-span-1 pb-2 text-red-500 hover:text-red-700">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="mb-3 font-semibold text-gray-700">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">SEO-заголовок</label>
                    <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">SEO-описание</label>
                    <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="input-field" rows={2} />
                  </div>
                </div>
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
