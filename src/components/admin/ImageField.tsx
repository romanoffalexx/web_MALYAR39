"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-client";

interface ImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  /** Компактный режим: только поле URL + кнопка, без подписи/превью/alt. Для строк в массивах. */
  compact?: boolean;
  label?: string;
  alt?: string;
  onAltChange?: (alt: string) => void;
  altLabel?: string;
  className?: string;
}

export default function ImageField({
  value,
  onChange,
  folder,
  compact = false,
  label = "Изображение",
  alt,
  onAltChange,
  altLabel = "Alt текст",
  className = "",
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      {!compact && (
        <label className="block text-xs text-gray-600 mb-1">{label}</label>
      )}
      <div className="flex gap-2 items-start">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field flex-1"
          placeholder="https://..."
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 whitespace-nowrap rounded-md border border-brand-600 px-3 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-50"
        >
          {uploading ? "Загрузка…" : "📁 Загрузить"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!compact && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt={alt || label}
          className="mt-2 h-20 w-auto rounded border border-gray-200 object-contain"
        />
      )}
      {!compact && onAltChange && (
        <div className="mt-2">
          <label className="block text-xs text-gray-600 mb-1">{altLabel}</label>
          <input
            type="text"
            value={alt || ""}
            onChange={(e) => onAltChange(e.target.value)}
            className="input-field"
          />
        </div>
      )}
    </div>
  );
}
