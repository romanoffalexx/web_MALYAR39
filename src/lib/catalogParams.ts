import type { CatalogSort } from "@/lib/queries";

export interface CatalogParams {
  filters: Record<string, string[]>;
  priceMin?: number;
  priceMax?: number;
  sort: CatalogSort;
  page: number;
}

const SORTS: CatalogSort[] = ["popular", "price-asc", "price-desc", "rating", "new"];

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Фильтры живут в одном параметре: `f=binder:Акриловые|Матовая;gloss:Матовая`. */
function parseFilters(raw?: string): Record<string, string[]> {
  const filters: Record<string, string[]> = {};
  if (!raw) return filters;

  for (const chunk of raw.split(";")) {
    const [key, values] = chunk.split(":");
    if (!key || !values) continue;
    const list = values.split("|").filter(Boolean);
    if (list.length) filters[key] = list;
  }
  return filters;
}

export function stringifyFilters(filters: Record<string, string[]>): string {
  return Object.entries(filters)
    .filter(([, values]) => values.length > 0)
    .map(([key, values]) => `${key}:${values.join("|")}`)
    .join(";");
}

export function parseCatalogParams(sp: SearchParams): CatalogParams {
  const sort = first(sp.sort) as CatalogSort | undefined;
  const page = Number(first(sp.page));
  const priceMin = Number(first(sp.pmin));
  const priceMax = Number(first(sp.pmax));

  return {
    filters: parseFilters(first(sp.f)),
    priceMin: Number.isFinite(priceMin) && priceMin > 0 ? priceMin : undefined,
    priceMax: Number.isFinite(priceMax) && priceMax > 0 ? priceMax : undefined,
    sort: sort && SORTS.includes(sort) ? sort : "popular",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

export function buildCatalogQuery(params: CatalogParams): string {
  const sp = new URLSearchParams();

  const filters = stringifyFilters(params.filters);
  if (filters) sp.set("f", filters);
  if (params.priceMin !== undefined) sp.set("pmin", String(params.priceMin));
  if (params.priceMax !== undefined) sp.set("pmax", String(params.priceMax));
  if (params.sort !== "popular") sp.set("sort", params.sort);
  if (params.page > 1) sp.set("page", String(params.page));

  const query = sp.toString();
  return query ? `?${query}` : "";
}
