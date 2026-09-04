"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartVariantOption {
  id: number;
  volume: number;
  unit: string;
  price: number;
}

export interface CartItem {
  productId: number;
  variantId: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  volume: number;
  unit: string;
  quantity: number;
  variants: CartVariantOption[];
}

export type CartAddInput = Omit<CartItem, "quantity"> & { quantity?: number };

interface CartContextValue {
  items: CartItem[];
  /** Суммарное количество позиций (штук) во всех строках корзины. */
  count: number;
  /** Ориентировочная итоговая стоимость, ₽. */
  total: number;
  /** Завершена ли загрузка из localStorage (для избежания вспышки «пусто»). */
  hydrated: boolean;
  addItem: (item: CartAddInput) => void;
  setQuantity: (productId: number, variantId: number, quantity: number) => void;
  changeVariant: (productId: number, fromVariantId: number, toVariantId: number) => void;
  removeItem: (productId: number, variantId: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "malyar_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Загружаем корзину один раз на клиенте, чтобы не рассинхронизировать SSR/CSR.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      }
    } catch {
      // повреждённое хранилище — начинаем с пустой корзины
    } finally {
      setHydrated(true);
    }
  }, []);

  // Сохраняем только после гидратации, иначе первый рендер затрёт корзину пустым [].
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // игнорируем ошибки квоты
    }
  }, [items, hydrated]);

  const addItem = useCallback((input: CartAddInput) => {
    const { quantity = 1, ...rest } = input;
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.productId === rest.productId && i.variantId === rest.variantId,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...rest, quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { ...rest, quantity }];
    });
  }, []);

  const setQuantity = useCallback(
    (productId: number, variantId: number, quantity: number) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter(
              (i) => !(i.productId === productId && i.variantId === variantId),
            )
          : prev.map((i) =>
              i.productId === productId && i.variantId === variantId
                ? { ...i, quantity }
                : i,
            ),
      );
    },
    [],
  );

  const changeVariant = useCallback(
    (productId: number, fromVariantId: number, toVariantId: number) => {
      setItems((prev) => {
        const sourceIdx = prev.findIndex(
          (i) => i.productId === productId && i.variantId === fromVariantId,
        );
        if (sourceIdx < 0) return prev;
        const source = prev[sourceIdx];
        const target = source.variants.find((v) => v.id === toVariantId);
        if (!target || target.id === fromVariantId) return prev;

        const existingIdx = prev.findIndex(
          (i) => i.productId === productId && i.variantId === toVariantId,
        );
        // Целевая фасовка уже отдельной строкой — сливаем количество и убираем исходную.
        if (existingIdx >= 0) {
          return prev
            .map((i, idx) =>
              idx === existingIdx ? { ...i, quantity: i.quantity + source.quantity } : i,
            )
            .filter((_, idx) => idx !== sourceIdx);
        }
        // Иначе меняем фасовку на месте, сохраняя позицию строки в корзине.
        const next = [...prev];
        next[sourceIdx] = {
          ...source,
          variantId: target.id,
          price: target.price,
          volume: target.volume,
          unit: target.unit,
        };
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback((productId: number, variantId: number) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variantId === variantId)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      total,
      hydrated,
      addItem,
      setQuantity,
      changeVariant,
      removeItem,
      clearCart,
    }),
    [
      items,
      count,
      total,
      hydrated,
      addItem,
      setQuantity,
      changeVariant,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
