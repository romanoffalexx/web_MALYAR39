import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogView from "@/components/catalog/CatalogView";
import { parseCatalogParams } from "@/lib/catalogParams";
import { getCatalogData, getCategory } from "@/lib/queries";

const PER_PAGE = 10;
const FALLBACK_HERO = "/images/categories/water-splash.jpg";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Категория не найдена — Маляр" };

  return {
    title: category.seoTitle ?? `${category.name} — купить в Калининграде | Маляр`,
    description: category.seoDescription ?? category.description ?? undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const urlParams = parseCatalogParams(await searchParams);
  const category = await getCategory(slug);
  if (!category) notFound();

  // Для подкатегории список вкладок и фильтры берём у родителя, а товары — у самой подкатегории.
  const rootSlug = category.parentSlug ?? category.slug;
  const data = await getCatalogData({
    categorySlug: rootSlug,
    subcategory: category.parentSlug ? category.slug : undefined,
    filters: urlParams.filters,
    priceMin: urlParams.priceMin,
    priceMax: urlParams.priceMax,
    sort: urlParams.sort,
    page: urlParams.page,
    perPage: PER_PAGE,
  });

  const basePath = `/catalog/${category.slug}`;
  const isChild = category.parentSlug !== null;
  const tabs = [
    {
      slug: "all",
      name: "Все товары",
      count: data.categoryTotal,
      href: isChild ? `/catalog/${rootSlug}` : basePath,
      active: !isChild,
    },
    ...data.subcategories.map((sub) => ({
      slug: sub.slug,
      name: sub.name,
      count: sub.count,
      href: `/catalog/${sub.slug}`,
      active: sub.slug === category.slug,
    })),
  ];

  const breadcrumb = [
    { label: "Главная", href: "/" },
    { label: "Каталог товаров", href: "/catalog" },
    ...(category.parentSlug && category.parentName
      ? [{ label: category.parentName, href: `/catalog/${rootSlug}` }]
      : []),
    { label: category.name },
  ];

  return (
    <CatalogView
      basePath={basePath}
      params={urlParams}
      data={data}
      heading={category.name}
      headingNote={category.description}
      breadcrumb={breadcrumb}
      tabs={tabs}
      heroImage={category.image ?? FALLBACK_HERO}
    />
  );
}
