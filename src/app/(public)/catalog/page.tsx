import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { parseCatalogParams } from "@/lib/catalogParams";
import { getCatalogData, getTopCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Каталог товаров — Маляр",
  description:
    "Водные краски, эмали по металлу, декоративные штукатурки, грунтовки, лаки и малярный инструмент. Подбор по связующему, классу стойкости к мытью, степени блеска и фасовке.",
};

const PER_PAGE = 10;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseCatalogParams(await searchParams);

  const [data, topCategories] = await Promise.all([
    getCatalogData({
      filters: params.filters,
      priceMin: params.priceMin,
      priceMax: params.priceMax,
      sort: params.sort,
      page: params.page,
      perPage: PER_PAGE,
    }),
    getTopCategories(),
  ]);

  const tabs = topCategories.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: c.count,
    href: `/catalog/${c.slug}`,
    active: false,
  }));

  return (
    <CatalogView
      basePath="/catalog"
      params={params}
      data={data}
      heading="Каталог товаров"
      headingNote="Материалы для интерьерных, фасадных и промышленных работ"
      breadcrumb={[
        { label: "Главная", href: "/" },
        { label: "Каталог товаров" },
      ]}
      tabs={tabs}
      heroImage="/images/categories/water-splash.jpg"
    />
  );
}
