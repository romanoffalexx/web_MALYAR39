"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  brand?: string;
  description?: string | null;
  image?: string;
  priceFrom: number;
  oldPrice?: number;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  unit?: string;
  variants?: { id: number; volume: number; unit: string; price: number }[];
}

export default function ProductCard({
  id,
  slug,
  name,
  brand,
  description,
  image,
  priceFrom,
  inStock,
  unit = "шт",
  variants = [],
}: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const v = variants[0];
    if (!v) return;
    addItem({
      productId: id,
      variantId: v.id,
      name,
      description: description ?? null,
      image: image ?? null,
      price: v.price,
      volume: v.volume,
      unit: v.unit,
      quantity: qty,
      variants: variants.map((x) => ({
        id: x.id,
        volume: x.volume,
        unit: x.unit,
        price: x.price,
      })),
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card group relative flex flex-col p-4">
      <button
        type="button"
        onClick={() => setFav(!fav)}
        aria-label={fav ? "Убрать из избранного" : "В избранное"}
        className="absolute right-3 top-3 z-10 text-moss/60 transition-colors hover:text-accent"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" className={fav ? "text-accent" : ""} aria-hidden>
          <path d="M12 20.5s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3.5c0 5.3-7.5 10-7.5 10Z" strokeLinejoin="round" />
        </svg>
      </button>

      <Link
        href={`/product/${slug}`}
        className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-md bg-white p-3"
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CanPlaceholder />
        )}
      </Link>

      <Link
        href={`/product/${slug}`}
        className="text-[13px] font-bold uppercase leading-snug tracking-wide text-ink transition-colors hover:text-forest-700"
      >
        {name}
      </Link>
      {brand && <div className="mt-1 text-xs text-moss">{brand}</div>}

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-[15px] font-bold text-ink">
          {priceFrom.toLocaleString("ru-RU")} ₽
        </span>
        <span className="text-[11px] text-moss">/ {unit}</span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-accent" : "bg-moss/40"}`}
          aria-hidden
        />
        <span className="text-[11px] text-moss">{inStock ? "В наличии" : "Нет в наличии"}</span>
      </div>

      <div className="mt-4 flex items-stretch gap-2">
        <div className="flex flex-1 items-center justify-between rounded-md border border-ink/10">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-2.5 py-1.5 text-moss transition-colors hover:text-ink"
            aria-label="Уменьшить количество"
          >
            −
          </button>
          <span className="text-xs font-semibold text-ink">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-2.5 py-1.5 text-moss transition-colors hover:text-ink"
            aria-label="Увеличить количество"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || variants.length === 0}
          aria-label="Добавить в корзину"
          className="flex w-10 items-center justify-center rounded-md bg-forest-800 text-cream-100 transition-colors hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.47 1.3h8.9a1.5 1.5 0 0 0 1.46-1.16L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9.5" cy="20" r="1.4" />
              <circle cx="17.5" cy="20" r="1.4" />
            </svg>
          )}
        </button>
      </div>

      {variants.length > 1 && (
        <div className="mt-2.5 text-[11px] text-moss">
          Фасовка: {variants.map((v) => `${v.volume} ${v.unit}`).join(" · ")}
        </div>
      )}
    </div>
  );
}

function CanPlaceholder() {
  return (
    <svg width="72" height="88" viewBox="0 0 72 88" aria-hidden>
      <ellipse cx="36" cy="10" rx="26" ry="7" fill="#d9cdb2" />
      <path d="M10 10v62c0 4 11.6 7 26 7s26-3 26-7V10" fill="#e7decb" />
      <ellipse cx="36" cy="10" rx="20" ry="5" fill="#f8f4ec" />
      <rect x="16" y="30" width="40" height="26" rx="2" fill="#16402e" />
      <rect x="22" y="38" width="28" height="3" rx="1.5" fill="#f8f4ec" opacity="0.85" />
      <rect x="26" y="45" width="20" height="2.5" rx="1.25" fill="#f8f4ec" opacity="0.5" />
      <path d="M10 16c-4 0-6 3-6 6s2 5 6 5" fill="none" stroke="#c9bda1" strokeWidth="2.5" />
      <path d="M62 16c4 0 6 3 6 6s-2 5-6 5" fill="none" stroke="#c9bda1" strokeWidth="2.5" />
    </svg>
  );
}
