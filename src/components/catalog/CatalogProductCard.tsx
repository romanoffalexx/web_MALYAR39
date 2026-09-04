"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

interface Variant {
  id: number;
  volume: number;
  unit: string;
  price: number;
}

interface CatalogProductCardProps {
  id: number;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  priceFrom: number;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  variants?: Variant[];
  defaultVariantIndex?: number;
  layout?: "grid" | "list";
}

export default function CatalogProductCard({
  id,
  slug,
  name,
  description,
  image,
  priceFrom,
  rating = 0,
  reviewsCount = 0,
  inStock,
  variants = [],
  defaultVariantIndex,
  layout = "grid",
}: CatalogProductCardProps) {
  const [fav, setFav] = useState(false);
  const [variantIndex, setVariantIndex] = useState(
    defaultVariantIndex ?? (variants.length > 1 ? 1 : 0),
  );
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const v = variants[variantIndex];
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
      quantity: 1,
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

  const favButton = (className: string) => (
    <button
      type="button"
      onClick={() => setFav(!fav)}
      aria-label={fav ? "Убрать из избранного" : "В избранное"}
      className={className}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={fav ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden
      >
        <path
          d="M12 20.5s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3.5c0 5.3-7.5 10-7.5 10Z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  const imageBlock = (className: string) => (
    <Link
      href={`/product/${slug}`}
      className={`flex items-center justify-center overflow-hidden rounded-md bg-white ${className}`}
    >
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-contain" />
      ) : (
        <CanPlaceholder />
      )}
    </Link>
  );

  const titleLink = (
    <Link
      href={`/product/${slug}`}
      className="text-[13px] font-semibold leading-snug text-ink transition-colors hover:text-forest-700"
    >
      {name}
    </Link>
  );

  const ratingRow = rating > 0 && (
    <div className="flex items-center gap-1">
      <svg width="13" height="13" viewBox="0 0 20 20" fill="#f2b33d" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-xs font-semibold text-ink">{rating.toFixed(1)}</span>
      <span className="text-[11px] text-moss">({reviewsCount})</span>
    </div>
  );

  const stockRow = (
    <div className="flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-accent" : "bg-moss/40"}`}
        aria-hidden
      />
      <span className="text-[11px] text-moss">
        {inStock ? "В наличии" : "Нет в наличии"}
      </span>
    </div>
  );

  const variantChips = variants.length > 0 && (
    <div className="flex gap-1.5">
      {variants.slice(0, 3).map((v, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setVariantIndex(i)}
          className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
            variantIndex === i
              ? "bg-forest-800 text-cream-100"
              : "border border-ink/10 text-moss hover:border-ink/25 hover:text-ink"
          }`}
        >
          {v.volume} {v.unit}
        </button>
      ))}
    </div>
  );

  const cartRow = (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!inStock || variants.length === 0}
        className="flex flex-1 items-center justify-center gap-2 rounded-md bg-forest-800 py-2.5 text-xs font-semibold text-cream-100 transition-colors hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {added ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.47 1.3h8.9a1.5 1.5 0 0 0 1.46-1.16L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9.5" cy="20" r="1.4" />
            <circle cx="17.5" cy="20" r="1.4" />
          </svg>
        )}
        {added ? "Добавлено" : "В корзину"}
      </button>
      {favButton(
        `flex w-9 shrink-0 items-center justify-center rounded-md border transition-colors ${
          fav
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-ink/10 text-moss hover:border-ink/25 hover:text-ink"
        }`,
      )}
    </div>
  );

  if (layout === "list") {
    return (
      <div className="card relative flex flex-col gap-4 p-4 sm:flex-row">
        {imageBlock("h-40 w-full shrink-0 p-3 sm:w-40")}
        <div className="min-w-0 flex-1">
          {titleLink}
          {description && (
            <p className="mt-1 text-[11px] leading-snug text-moss line-clamp-2">{description}</p>
          )}
          <div className="mt-2">{ratingRow}</div>
          <div className="mt-2">{stockRow}</div>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-44">
          <div className="text-[13px] font-bold text-ink">
            от {priceFrom.toLocaleString("ru-RU")} ₽
          </div>
          {variantChips}
          <div className="mt-auto">{cartRow}</div>
        </div>
        {favButton(
          `absolute right-3 top-3 transition-colors ${fav ? "text-accent" : "text-moss/50 hover:text-accent"}`,
        )}
      </div>
    );
  }

  return (
    <div className="card relative flex flex-col p-3.5">
      {favButton(
        `absolute right-3 top-3 z-10 transition-colors ${fav ? "text-accent" : "text-moss/50 hover:text-accent"}`,
      )}

      {imageBlock("mb-3 aspect-square w-full p-3")}

      {titleLink}
      {description && (
        <p className="mt-1 text-[11px] leading-snug text-moss line-clamp-2">{description}</p>
      )}

      <div className="mt-2">{ratingRow}</div>

      <div className="mt-2 text-[13px] font-bold text-ink">
        от {priceFrom.toLocaleString("ru-RU")} ₽
      </div>

      <div className="mt-2">{variantChips}</div>

      <div className="mt-2">{stockRow}</div>

      <div className="mt-3">{cartRow}</div>
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
