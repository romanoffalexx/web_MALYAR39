"use client";

import { useState, useEffect, useCallback } from "react";
import ImageField from "@/components/admin/ImageField";

interface ApiCase {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  description: string | null;
  task: string | null;
  result: string | null;
  results: string[] | null;
  area: string | null;
  duration: string | null;
  year: number | null;
  workType: string | null;
  tag: string | null;
  savings: string | null;
  savingsNote: string | null;
  serviceLife: string | null;
  serviceLifeNote: string | null;
  mainImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean | null;
  featured: boolean | null;
  order: number | null;
}

interface ImageForm {
  url: string;
  type: string;
  caption: string;
}
interface MaterialForm {
  name: string;
  volume: string;
  description: string;
  productId: string;
  image: string;
}
interface StepForm {
  title: string;
  description: string;
}

const IMAGE_TYPES = [
  { value: "before", label: "До" },
  { value: "after", label: "После" },
  { value: "process", label: "Процесс" },
  { value: "result", label: "Результат" },
];

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

const emptyImage = (): ImageForm => ({ url: "", type: "process", caption: "" });
const emptyMaterial = (): MaterialForm => ({ name: "", volume: "", description: "", productId: "", image: "" });
const emptyStep = (): StepForm => ({ title: "", description: "" });

export default function AdminCasesPage() {
  const [items, setItems] = useState<ApiCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [area, setArea] = useState("");
  const [duration, setDuration] = useState("");
  const [year, setYear] = useState("");
  const [workType, setWorkType] = useState("");
  const [tag, setTag] = useState("");
  const [savings, setSavings] = useState("");
  const [savingsNote, setSavingsNote] = useState("");
  const [serviceLife, setServiceLife] = useState("");
  const [serviceLifeNote, setServiceLifeNote] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState("0");
  const [images, setImages] = useState<ImageForm[]>([]);
  const [materials, setMaterials] = useState<MaterialForm[]>([]);
  const [steps, setSteps] = useState<StepForm[]>([]);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cases");
      if (res.ok) {
        const data = await res.json();
        setItems(data.cases || []);
      }
    } catch (err) {
      console.error("Failed to fetch cases:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const resetForm = () => {
    setTitle(""); setSlug(""); setCategory(""); setSubtitle("");
    setDescription(""); setTask(""); setResult(""); setResults([]);
    setArea(""); setDuration(""); setYear(""); setWorkType(""); setTag("");
    setSavings(""); setSavingsNote(""); setServiceLife(""); setServiceLifeNote("");
    setMainImage(""); setSeoTitle(""); setSeoDescription("");
    setPublished(true); setFeatured(false); setOrder("0");
    setImages([]); setMaterials([]); setSteps([]);
    setEditingId(null); setError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = async (c: ApiCase) => {
    resetForm();
    try {
      const res = await fetch(`/api/admin/cases/${c.id}`);
      if (!res.ok) return;
      const data = await res.json();
      const p = data.case;
      setTitle(p.title || ""); setSlug(p.slug || ""); setCategory(p.category || "");
      setSubtitle(p.subtitle || ""); setDescription(p.description || "");
      setTask(p.task || ""); setResult(p.result || "");
      setResults(Array.isArray(p.results) ? p.results : []);
      setArea(p.area || ""); setDuration(p.duration || "");
      setYear(p.year != null ? String(p.year) : "");
      setWorkType(p.workType || ""); setTag(p.tag || "");
      setSavings(p.savings || ""); setSavingsNote(p.savingsNote || "");
      setServiceLife(p.serviceLife || ""); setServiceLifeNote(p.serviceLifeNote || "");
      setMainImage(p.mainImage || ""); setSeoTitle(p.seoTitle || "");
      setSeoDescription(p.seoDescription || "");
      setPublished(p.published ?? true); setFeatured(p.featured ?? false);
      setOrder(p.order != null ? String(p.order) : "0");
      setImages((p.images || []).map((i: { url: string; type: string | null; caption: string | null }) => ({
        url: i.url, type: i.type || "process", caption: i.caption || "",
      })));
      setMaterials((p.materials || []).map((m: { name: string | null; volume: string | null; description: string | null; productId: number | null; image: string | null }) => ({
        name: m.name || "", volume: m.volume || "", description: m.description || "",
        productId: m.productId ? String(m.productId) : "", image: m.image || "",
      })));
      setSteps((p.steps || []).map((s: { title: string; description: string | null }) => ({
        title: s.title || "", description: s.description || "",
      })));
      setEditingId(p.id);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to load case:", err);
    }
  };

  const handleDelete = async (c: ApiCase) => {
    if (!confirm(`Удалить кейс «${c.title}»?`)) return;
    try {
      const res = await fetch(`/api/admin/cases/${c.id}`, { method: "DELETE" });
      if (res.ok) fetchCases();
    } catch (err) {
      console.error("Failed to delete case:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title, slug, category,
      subtitle: subtitle || null,
      description: description || null,
      task: task || null,
      result: result || null,
      results: results.filter((r) => r.trim()).length ? results.filter((r) => r.trim()) : null,
      area: area || null,
      duration: duration || null,
      year: year ? parseInt(year) : null,
      workType: workType || null,
      tag: tag || null,
      savings: savings || null,
      savingsNote: savingsNote || null,
      serviceLife: serviceLife || null,
      serviceLifeNote: serviceLifeNote || null,
      mainImage: mainImage || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      published, featured,
      order: order ? parseInt(order) : 0,
      images: images.filter((i) => i.url).map((i) => ({ url: i.url, type: i.type, caption: i.caption || null })),
      materials: materials.filter((m) => m.name).map((m) => ({
        name: m.name, volume: m.volume || null, description: m.description || null,
        productId: m.productId || null, image: m.image || null,
      })),
      steps: steps.filter((s) => s.title).map((s) => ({ title: s.title, description: s.description || null })),
    };

    try {
      const url = editingId ? `/api/admin/cases/${editingId}` : "/api/admin/cases";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchCases();
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

  const existingCategories = Array.from(new Set(items.map((c) => c.category))).filter(Boolean);

  const filtered = items.filter(
    (c) =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-dark-green">
          Кейсы
          <span className="ml-2 text-base font-normal text-gray-500">({items.length})</span>
        </h1>
        <button onClick={openAddForm} className="btn-primary">+ Добавить кейс</button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск кейсов..."
        className="input-field mb-6 max-w-md"
      />

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? "Ничего не найдено" : "Кейсов пока нет"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Фото</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Название</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Категория</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Год</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Статус</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">#{c.id}</td>
                    <td className="px-4 py-3">
                      {c.mainImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.mainImage} alt={c.title} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {c.title}
                      {c.featured && <span className="ml-2 text-xs text-amber-600">★</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.year || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${c.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.published ? "Опубликован" : "Скрыт"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEditForm(c)} className="mr-3 text-sm text-brand-700 hover:underline">Редактировать</button>
                      <button onClick={() => handleDelete(c)} className="text-sm text-red-500 hover:underline">Удалить</button>
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
                {editingId ? "Редактировать кейс" : "Добавить кейс"}
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">Категория *</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" list="case-categories" required />
                  <datalist id="case-categories">
                    {existingCategories.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Подзаголовок</label>
                  <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Описание</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Задача</label>
                  <textarea value={task} onChange={(e) => setTask(e.target.value)} className="input-field" rows={2} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Результат (текст)</label>
                  <textarea value={result} onChange={(e) => setResult(e.target.value)} className="input-field" rows={2} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Результаты (список)</label>
                  <button type="button" onClick={() => setResults([...results, ""])} className="text-sm text-brand-700 hover:underline">+ Добавить</button>
                </div>
                <div className="space-y-2">
                  {results.map((r, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={r} onChange={(e) => { const next = [...results]; next[idx] = e.target.value; setResults(next); }} className="input-field" placeholder="Пункт результата" />
                      <button type="button" onClick={() => setResults(results.filter((_, i) => i !== idx))} className="shrink-0 text-red-500 hover:text-red-700">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Площадь</label>
                  <input type="text" value={area} onChange={(e) => setArea(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Срок</label>
                  <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Год</label>
                  <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Тип работ</label>
                  <input type="text" value={workType} onChange={(e) => setWorkType(e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Экономия</label>
                  <input type="text" value={savings} onChange={(e) => setSavings(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Срок службы</label>
                  <input type="text" value={serviceLife} onChange={(e) => setServiceLife(e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Примечание к экономии</label>
                  <input type="text" value={savingsNote} onChange={(e) => setSavingsNote(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Примечание к сроку службы</label>
                  <input type="text" value={serviceLifeNote} onChange={(e) => setServiceLifeNote(e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Тег</label>
                  <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Порядок</label>
                  <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="input-field" />
                </div>
              </div>

              <ImageField value={mainImage} onChange={setMainImage} folder="cases" label="Главное изображение" />

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

              {/* Images */}
              <div className="border-t border-gray-100 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Фотографии</h3>
                  <button type="button" onClick={() => setImages([...images, emptyImage()])} className="text-sm text-brand-700 hover:underline">+ Добавить фото</button>
                </div>
                {images.length === 0 && <p className="text-sm text-gray-400">Нет фотографий</p>}
                <div className="space-y-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 rounded-lg border border-gray-100 p-2">
                      <div className="col-span-6">
                        <label className="mb-1 block text-xs text-gray-600">URL</label>
                        <ImageField compact value={img.url} folder="cases" onChange={(url) => { const next = [...images]; next[idx] = { ...img, url }; setImages(next); }} />
                      </div>
                      <div className="col-span-3">
                        <label className="mb-1 block text-xs text-gray-600">Тип</label>
                        <select value={img.type} onChange={(e) => { const next = [...images]; next[idx] = { ...img, type: e.target.value }; setImages(next); }} className="input-field">
                          {IMAGE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-xs text-gray-600">Подпись</label>
                        <input type="text" value={img.caption} onChange={(e) => { const next = [...images]; next[idx] = { ...img, caption: e.target.value }; setImages(next); }} className="input-field" />
                      </div>
                      <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="col-span-1 self-end pb-2 text-red-500 hover:text-red-700">✕</button>
                    </div>
                  ))}
                </div>
              </div>

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
                        <label className="mb-1 block text-xs text-gray-600">Объём</label>
                        <input type="text" value={m.volume} onChange={(e) => { const next = [...materials]; next[idx] = { ...m, volume: e.target.value }; setMaterials(next); }} className="input-field" />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-xs text-gray-600">ID товара</label>
                        <input type="number" value={m.productId} onChange={(e) => { const next = [...materials]; next[idx] = { ...m, productId: e.target.value }; setMaterials(next); }} className="input-field" />
                      </div>
                      <div className="col-span-3">
                        <label className="mb-1 block text-xs text-gray-600">Фото URL</label>
                        <ImageField compact value={m.image} folder="cases" onChange={(image) => { const next = [...materials]; next[idx] = { ...m, image }; setMaterials(next); }} />
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
                  <h3 className="font-semibold">Этапы работ</h3>
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
