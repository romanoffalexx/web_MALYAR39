"use client";

import { useState, useEffect, useCallback } from "react";
import ImageField from "@/components/admin/ImageField";

interface Variant {
  id?: number;
  volume: string;
  unit: string;
  price: string;
  oldPrice: string;
  sku: string;
  stock: string;
}

interface ApiVariant {
  id: number;
  packagingVolume: number;
  packagingUnit: string;
  price: number;
  oldPrice: number | null;
  sku: string | null;
  stock: number | null;
}

interface ImageItem {
  id?: number;
  url: string;
  alt: string;
  isMain: boolean;
}

interface Characteristic {
  id?: number;
  key: string;
  value: string;
}

interface Product {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  brandId: number | null;
  shortDescription: string | null;
  description: string | null;
  article: string | null;
  coverageRate: number | null;
  defaultLayers: number | null;
  rating: number | null;
  inStock: boolean;
  isPopular: boolean;
  categoryName: string | null;
  brandName: string | null;
  variants: ApiVariant[];
  images: ImageItem[];
  characteristics: Characteristic[];
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

const emptyVariant = (): Variant => ({
  volume: "",
  unit: "л",
  price: "",
  oldPrice: "",
  sku: "",
  stock: "0",
});

const emptyImage = (): ImageItem => ({
  url: "",
  alt: "",
  isMain: false,
});

const emptyCharacteristic = (): Characteristic => ({
  key: "",
  value: "",
});

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [article, setArticle] = useState("");
  const [coverageRate, setCoverageRate] = useState("");
  const [defaultLayers, setDefaultLayers] = useState("2");
  const [rating, setRating] = useState("");
  const [inStock, setInStock] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [applicationInstructions, setApplicationInstructions] = useState("");
  const [compatibility, setCompatibility] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [documentsJson, setDocumentsJson] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [showBrandInput, setShowBrandInput] = useState(false);

  const fetchProducts = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReferences = async () => {
    try {
      const res = await fetch("/api/admin/references");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
        setBrandsList(data.brands);
      }
    } catch (err) {
      console.error("Failed to fetch references:", err);
    }
  };

  const createBrand = async () => {
    if (!newBrandName.trim()) return;
    setCreatingBrand(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBrandName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setBrandId(String(data.brand.id));
        setNewBrandName("");
        setShowBrandInput(false);
        fetchReferences();
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка создания бренда");
      }
    } catch {
      setError("Ошибка сети при создании бренда");
    } finally {
      setCreatingBrand(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchReferences();
  }, [fetchProducts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchProducts]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setCategoryId("");
    setBrandId("");
    setShortDescription("");
    setDescription("");
    setArticle("");
    setCoverageRate("");
    setDefaultLayers("2");
    setRating("");
    setInStock(true);
    setIsPopular(false);
    setVariants([]);
    setImages([]);
    setCharacteristics([]);
    setSeoTitle("");
    setSeoDescription("");
    setApplicationInstructions("");
    setCompatibility("");
    setVideoUrl("");
    setDocumentsJson("");
    setNewBrandName("");
    setShowBrandInput(false);
    setEditingId(null);
    setError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`);
      if (!res.ok) return;
      const data = await res.json();
      const p = data.product;

      setName(p.name || "");
      setSlug(p.slug || "");
      setCategoryId(String(p.categoryId || ""));
      setBrandId(p.brandId ? String(p.brandId) : "");
      setShortDescription(p.shortDescription || "");
      setDescription(p.description || "");
      setArticle(p.article || "");
      setCoverageRate(p.coverageRate != null ? String(p.coverageRate) : "");
      setDefaultLayers(p.defaultLayers != null ? String(p.defaultLayers) : "2");
      setRating(p.rating != null ? String(p.rating) : "");
      setInStock(p.inStock ?? true);
      setIsPopular(p.isPopular ?? false);
      setVariants(
        (p.variants || []).map((v: ApiVariant) => ({
          id: v.id,
          volume: String(v.packagingVolume),
          unit: v.packagingUnit,
          price: String(v.price),
          oldPrice: v.oldPrice != null ? String(v.oldPrice) : "",
          sku: v.sku || "",
          stock: v.stock != null ? String(v.stock) : "0",
        }))
      );
      setImages(
        (p.images || []).map((img: { id: number; url: string; alt: string | null; isMain: boolean }) => ({
          id: img.id,
          url: img.url,
          alt: img.alt || "",
          isMain: img.isMain,
        }))
      );
      setCharacteristics(
        (p.characteristics || []).map((c: { id: number; key: string; value: string }) => ({
          id: c.id,
          key: c.key,
          value: c.value,
        }))
      );
      setSeoTitle(p.seoTitle || "");
      setSeoDescription(p.seoDescription || "");
      setApplicationInstructions(p.applicationInstructions || "");
      setCompatibility(p.compatibility || "");
      setVideoUrl(p.videoUrl || "");
      setDocumentsJson(p.documents ? JSON.stringify(p.documents, null, 2) : "");
      setEditingId(p.id);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to load product:", err);
    }
  };

  const handleDelete = async (id: number, productName: string) => {
    if (!confirm(`Удалить товар «${productName}»?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts(search || undefined);
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    let parsedDocuments = null;
    if (documentsJson) {
      try {
        parsedDocuments = JSON.parse(documentsJson);
      } catch {
        setError("Некорректный JSON в поле «Документы»");
        setSaving(false);
        return;
      }
    }

    const payload = {
      name,
      slug,
      categoryId: parseInt(categoryId),
      brandId: brandId ? parseInt(brandId) : null,
      shortDescription: shortDescription || null,
      description: description || null,
      article: article || null,
      coverageRate: coverageRate || null,
      defaultLayers: defaultLayers ? parseInt(defaultLayers) : 2,
      rating: rating || null,
      inStock,
      isPopular,
      variants: variants
        .filter((v) => v.volume && v.price)
        .map((v) => ({
          volume: v.volume,
          unit: v.unit,
          price: v.price,
          oldPrice: v.oldPrice || null,
          sku: v.sku || null,
          stock: v.stock || "0",
        })),
      images: images
        .filter((img) => img.url)
        .map((img) => ({
          url: img.url,
          alt: img.alt || null,
          isMain: img.isMain,
        })),
      characteristics: characteristics
        .filter((c) => c.key && c.value)
        .map((c) => ({
          key: c.key,
          value: c.value,
        })),
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      applicationInstructions: applicationInstructions || null,
      compatibility: compatibility || null,
      videoUrl: videoUrl || null,
      documents: parsedDocuments,
    };

    try {
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchProducts(search || undefined);
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка сохранения");
      }
    } catch (err) {
      setError("Ошибка сети");
    } finally {
      setSaving(false);
    }
  };

  const nameToSlug = (value: string) => {
    return value
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
  };

  const filtered = products;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-dark-green">
          Товары
          {total > 0 && (
            <span className="ml-2 text-base font-normal text-gray-500">
              ({total})
            </span>
          )}
        </h1>
        <button onClick={openAddForm} className="btn-primary">
          + Добавить товар
        </button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск товаров..."
        className="input-field mb-6 max-w-md"
      />

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? "Ничего не найдено" : "Товаров пока нет"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Название</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Категория</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Бренд</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Варианты</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Статус</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500">#{product.id}</td>
                    <td className="px-4 py-4 text-sm font-medium">{product.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{product.categoryName || "—"}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{product.brandName || "—"}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {product.variants.length > 0
                        ? product.variants
                            .map(
                              (v) =>
                                `${v.packagingVolume} ${v.packagingUnit} — ${v.price.toLocaleString("ru-RU")} ₽`
                            )
                            .join(", ")
                        : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.inStock ? "В наличии" : "Нет"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditForm(product)}
                          className="text-brand-700 hover:text-brand-800 text-sm font-medium"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit product form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold">
                {editingId ? "Редактировать товар" : "Добавить товар"}
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
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    title="Отображаемое название товара на сайте."
                  >
                    Название <span className="text-red-500">*</span>
                  </label>
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
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    title="ЧПУ (Человеко-Понятный URL) — часть адреса страницы товара. Например, для товара «Грунтовка Глубокая» slug будет «gruntovka-glubokaya». Заполняется автоматически из названия, но можно изменить вручную. Только латинские буквы, цифры и дефис."
                  >
                    Slug (ЧПУ) <span className="text-red-500">*</span>
                  </label>
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
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    title="Категория каталога, в которой будет отображаться товар."
                  >
                    Категория <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    title="Бренд товара. Можно выбрать существующий или создать новый прямо здесь."
                  >
                    Бренд <span className="text-gray-400 font-normal">(необязательно)</span>
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Выберите бренд</option>
                    {brandsList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {showBrandInput ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newBrandName}
                        onChange={(e) => setNewBrandName(e.target.value)}
                        placeholder="Название нового бренда"
                        className="input-field flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            createBrand();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={createBrand}
                        disabled={creatingBrand || !newBrandName.trim()}
                        className="btn-primary text-sm px-3 py-1 disabled:opacity-50"
                      >
                        {creatingBrand ? "..." : "Создать"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBrandInput(false);
                          setNewBrandName("");
                        }}
                        className="text-gray-400 hover:text-gray-600 text-sm px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowBrandInput(true)}
                      className="text-sm text-brand-700 hover:underline mt-1"
                    >
                      + Создать новый бренд
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    title="Артикул — внутренний код товара (артикул производителя или склада). Необязательное поле."
                  >
                    Артикул <span className="text-gray-400 font-normal">(необязательно)</span>
                  </label>
                  <input
                    type="text"
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="rounded"
                    />
                    В наличии
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="rounded"
                    />
                    Популярный
                  </label>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  title="Краткое описание — отображается в карточке товара и списках каталога. Рекомендуемый объём: 1–2 предложения."
                >
                  Краткое описание <span className="text-gray-400 font-normal">(необязательно)</span>
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="input-field"
                  rows={2}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  title="Полное описание — подробная информация о товаре, отображается на странице товара. Можно использовать несколько абзацев."
                >
                  Полное описание <span className="text-gray-400 font-normal">(необязательно)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    title="Расход материала — сколько литров/кг уходит на 1 м² поверхности. Используется в калькуляторе на сайте для расчёта количества материала."
                  >
                    Расход (м²/л) <span className="text-gray-400 font-normal">(необязательно)</span>
                  </label>
                  <input
                    type="number"
                    value={coverageRate}
                    onChange={(e) => setCoverageRate(e.target.value)}
                    className="input-field"
                    step="0.1"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    title="Количество слоёв нанесения по умолчанию. Используется в калькуляторе. Обычно 2 слоя."
                  >
                    Слоёв по умолчанию <span className="text-gray-400 font-normal">(необязательно)</span>
                  </label>
                  <input
                    type="number"
                    value={defaultLayers}
                    onChange={(e) => setDefaultLayers(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    title="Рейтинг товара от 0 до 5. Отображается в каталоге и на странице товара."
                  >
                    Рейтинг <span className="text-gray-400 font-normal">(необязательно)</span>
                  </label>
                  <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="input-field"
                    step="0.1"
                    min={0}
                    max={5}
                  />
                </div>
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Варианты фасовки</h3>
                  <button
                    type="button"
                    onClick={() => setVariants([...variants, emptyVariant()])}
                    className="text-sm text-brand-700 hover:underline"
                  >
                    + Добавить вариант
                  </button>
                </div>
                {variants.length === 0 && (
                  <p className="text-sm text-gray-400">Нет вариантов</p>
                )}
                <div className="space-y-3">
                  {variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-6 gap-2 items-end">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Объём</label>
                        <input
                          type="number"
                          value={v.volume}
                          onChange={(e) => {
                            const next = [...variants];
                            next[idx] = { ...v, volume: e.target.value };
                            setVariants(next);
                          }}
                          className="input-field"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Единица</label>
                        <select
                          value={v.unit}
                          onChange={(e) => {
                            const next = [...variants];
                            next[idx] = { ...v, unit: e.target.value };
                            setVariants(next);
                          }}
                          className="input-field"
                        >
                          <option value="л">л</option>
                          <option value="кг">кг</option>
                          <option value="шт">шт</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Цена, ₽</label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => {
                            const next = [...variants];
                            next[idx] = { ...v, price: e.target.value };
                            setVariants(next);
                          }}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Артикул</label>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => {
                            const next = [...variants];
                            next[idx] = { ...v, sku: e.target.value };
                            setVariants(next);
                          }}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Остаток</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => {
                            const next = [...variants];
                            next[idx] = { ...v, stock: e.target.value };
                            setVariants(next);
                          }}
                          className="input-field"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 text-sm pb-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Изображения</h3>
                  <button
                    type="button"
                    onClick={() => setImages([...images, emptyImage()])}
                    className="text-sm text-brand-700 hover:underline"
                  >
                    + Добавить изображение
                  </button>
                </div>
                {images.length === 0 && (
                  <p className="text-sm text-gray-400">Нет изображений</p>
                )}
                <div className="space-y-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <label className="block text-xs text-gray-600 mb-1">URL</label>
                        <ImageField
                          compact
                          value={img.url}
                          folder="products"
                          onChange={(url) => {
                            const next = [...images];
                            next[idx] = { ...img, url };
                            setImages(next);
                          }}
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs text-gray-600 mb-1">Alt текст</label>
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => {
                            const next = [...images];
                            next[idx] = { ...img, alt: e.target.value };
                            setImages(next);
                          }}
                          className="input-field"
                        />
                      </div>
                      <label className="col-span-2 flex items-center gap-1 text-xs text-gray-600 pb-2">
                        <input
                          type="checkbox"
                          checked={img.isMain}
                          onChange={(e) => {
                            const next = images.map((im, i) => ({
                              ...im,
                              isMain: i === idx ? e.target.checked : false,
                            }));
                            setImages(next);
                          }}
                          className="rounded"
                        />
                        Главная
                      </label>
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="col-span-1 text-red-500 hover:text-red-700 text-sm pb-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Characteristics */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Характеристики</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setCharacteristics([...characteristics, emptyCharacteristic()])
                    }
                    className="text-sm text-brand-700 hover:underline"
                  >
                    + Добавить
                  </button>
                </div>
                {characteristics.length === 0 && (
                  <p className="text-sm text-gray-400">Нет характеристик</p>
                )}
                <div className="space-y-2">
                  {characteristics.map((c, idx) => (
                    <div key={idx} className="grid grid-cols-10 gap-2 items-end">
                      <div className="col-span-4">
                        <label className="block text-xs text-gray-600 mb-1">Ключ</label>
                        <input
                          type="text"
                          value={c.key}
                          onChange={(e) => {
                            const next = [...characteristics];
                            next[idx] = { ...c, key: e.target.value };
                            setCharacteristics(next);
                          }}
                          className="input-field"
                          placeholder="Например: Вес"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs text-gray-600 mb-1">Значение</label>
                        <input
                          type="text"
                          value={c.value}
                          onChange={(e) => {
                            const next = [...characteristics];
                            next[idx] = { ...c, value: e.target.value };
                            setCharacteristics(next);
                          }}
                          className="input-field"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCharacteristics(
                            characteristics.filter((_, i) => i !== idx)
                          )
                        }
                        className="col-span-1 text-red-500 hover:text-red-700 text-sm pb-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO и дополнительные поля */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-3">SEO и дополнительно</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        title="Заголовок страницы в поисковых системах (Google, Яндекс). Если не заполнен — берётся название товара. Рекомендуемая длина: 50–70 символов."
                      >
                        SEO Title <span className="text-gray-400 font-normal">(необязательно)</span>
                      </label>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="input-field"
                        placeholder="Заголовок для поисковиков"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        title="Ссылка на видео-обзор товара (YouTube, RuTube и т.п.). Используйте embed-ссылку, например: https://youtube.com/embed/XXXXX"
                      >
                        Видео (URL) <span className="text-gray-400 font-normal">(необязательно)</span>
                      </label>
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="input-field"
                        placeholder="https://youtube.com/embed/..."
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      title="Описание страницы для поисковых систем (meta description). Отображается в результатах поиска под заголовком. Рекомендуемая длина: 150–160 символов."
                    >
                      SEO Description <span className="text-gray-400 font-normal">(необязательно)</span>
                    </label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="input-field"
                      rows={2}
                      placeholder="Описание для поисковиков"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      title="Пошаговая инструкция по нанесению материала. Отображается на странице товара в отдельном блоке."
                    >
                      Инструкция по нанесению <span className="text-gray-400 font-normal">(необязательно)</span>
                    </label>
                    <textarea
                      value={applicationInstructions}
                      onChange={(e) => setApplicationInstructions(e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="Как правильно наносить материал..."
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      title="С какими поверхностями и материалами совместим данный товар. Отображается на странице товара."
                    >
                      Совместимость <span className="text-gray-400 font-normal">(необязательно)</span>
                    </label>
                    <textarea
                      value={compatibility}
                      onChange={(e) => setCompatibility(e.target.value)}
                      className="input-field"
                      rows={2}
                      placeholder="С какими поверхностями и материалами совместим..."
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      title="Список документов для скачивания на странице товара (сертификаты, ТУ, инструкции). Формат: JSON-массив объектов. Каждый объект содержит: name (название документа), url (ссылка на файл), size (размер, необязательно). Если не нужен — оставьте пустым."
                    >
                      Документы (JSON) <span className="text-gray-400 font-normal">(необязательно)</span>
                    </label>
                    <textarea
                      value={documentsJson}
                      onChange={(e) => setDocumentsJson(e.target.value)}
                      className="input-field font-mono text-xs"
                      rows={3}
                      placeholder='[{"name":"Сертификат","url":"https://...","size":"1.2 MB"}]'
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Формат: массив объектов с полями name, url, size (необязательно)
                    </p>
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
